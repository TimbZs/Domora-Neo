from fastapi import FastAPI, HTTPException, Depends, Request, APIRouter, status, BackgroundTasks
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt
import os
from pathlib import Path
from dotenv import load_dotenv
import logging
import uuid
import googlemaps
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionResponse, CheckoutStatusResponse, CheckoutSessionRequest
from enum import Enum

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configuration
JWT_SECRET = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24 * 7  # 7 days

# MongoDB setup
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Security
security = HTTPBearer()

# Google Maps client
gmaps = googlemaps.Client(key=os.getenv("GOOGLE_MAPS_API_KEY"))

# FastAPI app
app = FastAPI(title="Domora API", version="1.0.0")
api_router = APIRouter(prefix="/api")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Enums
class UserRole(str, Enum):
    CUSTOMER = "customer"
    PROVIDER = "provider"
    ADMIN = "admin"

class ServiceType(str, Enum):
    HOUSE_CLEANING = "house_cleaning"
    CAR_WASHING = "car_washing"
    LANDSCAPING = "landscaping"

class BookingStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class PaymentStatus(str, Enum):
    PENDING = "pending"
    AUTHORIZED = "authorized"
    CAPTURED = "captured"
    FAILED = "failed"
    REFUNDED = "refunded"

# Pydantic Models
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: UserRole

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True
    phone: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: UserRole
    is_active: bool
    phone: Optional[str] = None
    created_at: datetime

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class AddressModel(BaseModel):
    street: str
    city: str
    postal_code: str
    country: str = "Slovenia"
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class ServicePackage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    base_price: float  # in EUR
    duration_minutes: int
    service_type: ServiceType
    features: Optional[List[str]] = []
    best_for: Optional[str] = None
    max_size: Optional[str] = None

class ServiceAddon(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    price: float  # in EUR
    service_type: ServiceType
    duration_minutes: Optional[int] = None

class ProviderProfile(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    business_name: str
    description: str
    service_types: List[ServiceType]
    service_areas: List[AddressModel]
    availability: Dict[str, Any]  # Store availability schedule
    rating: float = 0.0
    total_reviews: int = 0
    is_verified: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class PriceEstimate(BaseModel):
    base_price: float
    addons_price: float
    travel_fee: float
    total_price: float
    currency: str = "EUR"
    breakdown: Dict[str, float]

class BookingCreate(BaseModel):
    service_type: ServiceType
    package_id: str
    addon_ids: List[str] = []
    service_address: AddressModel
    scheduled_datetime: datetime
    notes: Optional[str] = None

class Booking(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_id: str
    provider_id: Optional[str] = None
    service_type: ServiceType
    package_id: str
    addon_ids: List[str] = []
    service_address: AddressModel
    scheduled_datetime: datetime
    status: BookingStatus = BookingStatus.PENDING
    price_estimate: PriceEstimate
    payment_status: PaymentStatus = PaymentStatus.PENDING
    stripe_session_id: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class PaymentTransaction(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    booking_id: str
    user_id: str
    session_id: str
    amount: float
    currency: str
    payment_status: PaymentStatus
    metadata: Dict[str, Any] = {}
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Utility Functions
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    user = await db.users.find_one({"id": user_id})
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    
    return User(**user)

async def geocode_address(address: AddressModel) -> AddressModel:
    """Geocode address using Google Maps API"""
    try:
        address_string = f"{address.street}, {address.city}, {address.postal_code}, {address.country}"
        geocode_result = gmaps.geocode(address_string)
        
        if geocode_result:
            location = geocode_result[0]['geometry']['location']
            address.latitude = location['lat']
            address.longitude = location['lng']
        
        return address
    except Exception as e:
        logging.error(f"Geocoding error: {e}")
        return address

def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance between two points in kilometers using Google Maps API"""
    try:
        result = gmaps.distance_matrix(
            origins=[(lat1, lon1)],
            destinations=[(lat2, lon2)],
            mode="driving",
            units="metric"
        )
        
        if result['status'] == 'OK' and result['rows'][0]['elements'][0]['status'] == 'OK':
            distance_meters = result['rows'][0]['elements'][0]['distance']['value']
            return distance_meters / 1000  # Convert to kilometers
        return 0.0
    except Exception as e:
        logging.error(f"Distance calculation error: {e}")
        return 0.0

def calculate_travel_fee(distance_km: float) -> float:
    """Calculate travel fee based on distance"""
    free_radius = float(os.getenv("FREE_TRAVEL_RADIUS_KM", 15))
    fee_per_km = float(os.getenv("TRAVEL_FEE_PER_KM", 0.50))
    
    if distance_km <= free_radius:
        return 0.0
    
    return (distance_km - free_radius) * fee_per_km

async def send_email(to_email: str, subject: str, body: str):
    """Send email using SMTP"""
    try:
        msg = MIMEMultipart()
        msg['From'] = os.getenv("SMTP_USER")
        msg['To'] = to_email
        msg['Subject'] = subject
        
        msg.attach(MIMEText(body, 'plain'))
        
        server = smtplib.SMTP(os.getenv("SMTP_HOST"), int(os.getenv("SMTP_PORT")))
        server.starttls()
        server.login(os.getenv("SMTP_USER"), os.getenv("SMTP_PASSWORD"))
        text = msg.as_string()
        server.sendmail(os.getenv("SMTP_USER"), to_email, text)
        server.quit()
        
        logging.info(f"Email sent to {to_email}")
    except Exception as e:
        logging.error(f"Email sending error: {e}")

# Authentication Endpoints
@api_router.post("/auth/register", response_model=Token)
async def register(user_data: UserCreate):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    user_dict = user_data.dict()
    user_dict["password"] = hash_password(user_data.password)
    user_dict["id"] = str(uuid.uuid4())
    user_dict["created_at"] = datetime.utcnow()
    user_dict["updated_at"] = datetime.utcnow()
    user_dict["is_active"] = True
    
    await db.users.insert_one(user_dict)
    
    # Create access token
    access_token = create_access_token(data={"sub": user_dict["id"]})
    
    # Return response
    user_response = UserResponse(**user_dict)
    return Token(access_token=access_token, user=user_response)

@api_router.post("/auth/login", response_model=Token)
async def login(credentials: UserLogin):
    # Find user
    user = await db.users.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not user["is_active"]:
        raise HTTPException(status_code=400, detail="Account is deactivated")
    
    # Create access token
    access_token = create_access_token(data={"sub": user["id"]})
    
    # Return response
    user_response = UserResponse(**user)
    return Token(access_token=access_token, user=user_response)

@api_router.get("/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    return UserResponse(**current_user.dict())

# Service Management Endpoints
@api_router.get("/services/packages", response_model=List[ServicePackage])
async def get_service_packages(service_type: Optional[ServiceType] = None):
    """Get available service packages"""
    filter_query = {}
    if service_type:
        filter_query["service_type"] = service_type
    
    packages = await db.service_packages.find(filter_query).to_list(100)
    return [ServicePackage(**pkg) for pkg in packages]

@api_router.get("/services/addons", response_model=List[ServiceAddon])
async def get_service_addons(service_type: Optional[ServiceType] = None):
    """Get available service add-ons"""
    filter_query = {}
    if service_type:
        filter_query["service_type"] = service_type
    
    addons = await db.service_addons.find(filter_query).to_list(100)
    return [ServiceAddon(**addon) for addon in addons]

@api_router.post("/services/price-estimate", response_model=PriceEstimate)
async def calculate_price_estimate(
    package_id: str,
    service_address: AddressModel,
    provider_id: Optional[str] = None,
    addon_ids: List[str] = []
):
    """Calculate price estimate for a service"""
    
    # Get package
    package = await db.service_packages.find_one({"id": package_id})
    if not package:
        raise HTTPException(status_code=404, detail="Package not found")
    
    base_price = package["base_price"]
    
    # Get addons
    addons_price = 0.0
    addon_breakdown = {}
    if addon_ids:
        addons = await db.service_addons.find({"id": {"$in": addon_ids}}).to_list(100)
        for addon in addons:
            addons_price += addon["price"]
            addon_breakdown[addon["name"]] = addon["price"]
    
    # Calculate travel fee (simplified - would need provider location)
    travel_fee = 0.0
    if provider_id:
        provider = await db.provider_profiles.find_one({"id": provider_id})
        if provider and provider["service_areas"]:
            # Use first service area as provider location
            provider_location = provider["service_areas"][0]
            if provider_location.get("latitude") and provider_location.get("longitude"):
                # Geocode service address if needed
                service_addr = await geocode_address(service_address)
                if service_addr.latitude and service_addr.longitude:
                    distance = calculate_distance(
                        provider_location["latitude"], provider_location["longitude"],
                        service_addr.latitude, service_addr.longitude
                    )
                    travel_fee = calculate_travel_fee(distance)
    
    total_price = base_price + addons_price + travel_fee
    
    breakdown = {
        package["name"]: base_price,
        **addon_breakdown,
        "Travel Fee": travel_fee
    }
    
    return PriceEstimate(
        base_price=base_price,
        addons_price=addons_price,
        travel_fee=travel_fee,
        total_price=total_price,
        breakdown=breakdown
    )

# Booking Endpoints
@api_router.post("/bookings", response_model=Booking)
async def create_booking(
    booking_data: BookingCreate,
    current_user: User = Depends(get_current_user)
):
    """Create a new booking"""
    
    if current_user.role != UserRole.CUSTOMER:
        raise HTTPException(status_code=403, detail="Only customers can create bookings")
    
    # Geocode address
    service_address = await geocode_address(booking_data.service_address)
    
    # Calculate price estimate
    price_estimate = await calculate_price_estimate(
        booking_data.package_id,
        service_address,
        booking_data.addon_ids
    )
    
    # Create booking
    booking_dict = booking_data.dict()
    booking_dict["id"] = str(uuid.uuid4())
    booking_dict["customer_id"] = current_user.id
    booking_dict["service_address"] = service_address.dict()
    booking_dict["price_estimate"] = price_estimate.dict()
    booking_dict["status"] = BookingStatus.PENDING
    booking_dict["payment_status"] = PaymentStatus.PENDING
    booking_dict["created_at"] = datetime.utcnow()
    booking_dict["updated_at"] = datetime.utcnow()
    
    await db.bookings.insert_one(booking_dict)
    
    return Booking(**booking_dict)

@api_router.get("/bookings", response_model=List[Booking])
async def get_bookings(current_user: User = Depends(get_current_user)):
    """Get user's bookings"""
    
    filter_query = {}
    if current_user.role == UserRole.CUSTOMER:
        filter_query["customer_id"] = current_user.id
    elif current_user.role == UserRole.PROVIDER:
        filter_query["provider_id"] = current_user.id
    
    bookings = await db.bookings.find(filter_query).to_list(100)
    return [Booking(**booking) for booking in bookings]

@api_router.get("/bookings/{booking_id}", response_model=Booking)
async def get_booking(booking_id: str, current_user: User = Depends(get_current_user)):
    """Get specific booking"""
    
    booking = await db.bookings.find_one({"id": booking_id})
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # Check access permissions
    if (current_user.role == UserRole.CUSTOMER and booking["customer_id"] != current_user.id) or \
       (current_user.role == UserRole.PROVIDER and booking.get("provider_id") != current_user.id):
        if current_user.role != UserRole.ADMIN:
            raise HTTPException(status_code=403, detail="Access denied")
    
    return Booking(**booking)

# Payment Endpoints
@api_router.post("/payments/create-checkout")
async def create_checkout_session(
    booking_id: str,
    request: Request,
    current_user: User = Depends(get_current_user)
):
    """Create Stripe checkout session for booking payment"""
    
    # Get booking
    booking = await db.bookings.find_one({"id": booking_id})
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    if booking["customer_id"] != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    if booking["payment_status"] != PaymentStatus.PENDING:
        raise HTTPException(status_code=400, detail="Booking already has payment processed")
    
    # Initialize Stripe
    stripe_api_key = os.getenv("STRIPE_SECRET_KEY")
    host_url = str(request.base_url)
    webhook_url = f"{host_url}api/webhooks/stripe"
    stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)
    
    # Create checkout session
    amount = booking["price_estimate"]["total_price"]
    success_url = f"{host_url}payment-success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{host_url}payment-cancel"
    
    checkout_request = CheckoutSessionRequest(
        amount=amount,
        currency="eur",
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={
            "booking_id": booking_id,
            "user_id": current_user.id,
            "service_type": booking["service_type"]
        }
    )
    
    session = await stripe_checkout.create_checkout_session(checkout_request)
    
    # Create payment transaction record
    transaction = PaymentTransaction(
        booking_id=booking_id,
        user_id=current_user.id,
        session_id=session.session_id,
        amount=amount,
        currency="eur",
        payment_status=PaymentStatus.PENDING,
        metadata=checkout_request.metadata
    )
    
    await db.payment_transactions.insert_one(transaction.dict())
    
    # Update booking with session ID
    await db.bookings.update_one(
        {"id": booking_id},
        {"$set": {"stripe_session_id": session.session_id, "updated_at": datetime.utcnow()}}
    )
    
    return {"checkout_url": session.url, "session_id": session.session_id}

@api_router.get("/payments/status/{session_id}")
async def get_payment_status(session_id: str, current_user: User = Depends(get_current_user)):
    """Get payment status for a session"""
    
    # Get transaction
    transaction = await db.payment_transactions.find_one({"session_id": session_id})
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    if transaction["user_id"] != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Check Stripe status
    stripe_api_key = os.getenv("STRIPE_SECRET_KEY")
    stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url="")
    
    checkout_status = await stripe_checkout.get_checkout_status(session_id)
    
    # Update transaction status if changed
    new_status = PaymentStatus.CAPTURED if checkout_status.payment_status == "paid" else PaymentStatus.PENDING
    
    if transaction["payment_status"] != new_status:
        await db.payment_transactions.update_one(
            {"session_id": session_id},
            {"$set": {"payment_status": new_status, "updated_at": datetime.utcnow()}}
        )
        
        # Update booking status
        if new_status == PaymentStatus.CAPTURED:
            await db.bookings.update_one(
                {"id": transaction["booking_id"]},
                {"$set": {
                    "payment_status": PaymentStatus.CAPTURED,
                    "status": BookingStatus.CONFIRMED,
                    "updated_at": datetime.utcnow()
                }}
            )
    
    return {
        "status": checkout_status.status,
        "payment_status": checkout_status.payment_status,
        "amount_total": checkout_status.amount_total,
        "currency": checkout_status.currency
    }

@api_router.post("/webhooks/stripe")
async def stripe_webhook(request: Request):
    """Handle Stripe webhooks"""
    
    body = await request.body()
    signature = request.headers.get("Stripe-Signature")
    
    stripe_api_key = os.getenv("STRIPE_SECRET_KEY")
    stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url="")
    
    try:
        webhook_response = await stripe_checkout.handle_webhook(body, signature)
        
        if webhook_response.event_type == "checkout.session.completed":
            session_id = webhook_response.session_id
            
            # Update transaction
            await db.payment_transactions.update_one(
                {"session_id": session_id},
                {"$set": {"payment_status": PaymentStatus.CAPTURED, "updated_at": datetime.utcnow()}}
            )
            
            # Update booking
            transaction = await db.payment_transactions.find_one({"session_id": session_id})
            if transaction:
                await db.bookings.update_one(
                    {"id": transaction["booking_id"]},
                    {"$set": {
                        "payment_status": PaymentStatus.CAPTURED,
                        "status": BookingStatus.CONFIRMED,
                        "updated_at": datetime.utcnow()
                    }}
                )
        
        return {"status": "success"}
    
    except Exception as e:
        logging.error(f"Webhook error: {e}")
        raise HTTPException(status_code=400, detail="Webhook processing failed")

# Provider Endpoints
@api_router.post("/providers/profile", response_model=ProviderProfile)
async def create_provider_profile(
    profile_data: dict,
    current_user: User = Depends(get_current_user)
):
    """Create provider profile"""
    
    if current_user.role != UserRole.PROVIDER:
        raise HTTPException(status_code=403, detail="Only providers can create profiles")
    
    # Check if profile exists
    existing_profile = await db.provider_profiles.find_one({"user_id": current_user.id})
    if existing_profile:
        raise HTTPException(status_code=400, detail="Profile already exists")
    
    # Create profile
    profile_dict = profile_data.copy()
    profile_dict["id"] = str(uuid.uuid4())
    profile_dict["user_id"] = current_user.id
    profile_dict["created_at"] = datetime.utcnow()
    profile_dict["rating"] = 0.0
    profile_dict["total_reviews"] = 0
    profile_dict["is_verified"] = False
    
    await db.provider_profiles.insert_one(profile_dict)
    
    return ProviderProfile(**profile_dict)

# Initialize default data
async def initialize_db():
    """Initialize database with enhanced service packages and addons"""
    
    # Import enhanced service data
    from enhanced_services import ENHANCED_SERVICE_DATA
    
    # Always refresh with latest enhanced data
    await db.service_packages.delete_many({})
    await db.service_addons.delete_many({})
    
    # Insert enhanced service data
    await db.service_packages.insert_many(ENHANCED_SERVICE_DATA["packages"])
    logging.info(f"Inserted {len(ENHANCED_SERVICE_DATA['packages'])} enhanced service packages")
    
    await db.service_addons.insert_many(ENHANCED_SERVICE_DATA["addons"])
    logging.info(f"Inserted {len(ENHANCED_SERVICE_DATA['addons'])} enhanced service addons")

@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    await initialize_db()

# Include router
app.include_router(api_router)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()