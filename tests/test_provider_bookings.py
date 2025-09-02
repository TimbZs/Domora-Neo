import pytest
from datetime import datetime
import sys
import types

# Stub out optional external dependency to avoid ImportError during testing
emergent = types.ModuleType("emergentintegrations")
payments = types.ModuleType("emergentintegrations.payments")
stripe = types.ModuleType("emergentintegrations.payments.stripe")
checkout = types.ModuleType("emergentintegrations.payments.stripe.checkout")

class StripeCheckout:  # minimal placeholder
    pass


class CheckoutSessionResponse:
    pass


class CheckoutStatusResponse:
    pass


class CheckoutSessionRequest:
    pass


checkout.StripeCheckout = StripeCheckout
checkout.CheckoutSessionResponse = CheckoutSessionResponse
checkout.CheckoutStatusResponse = CheckoutStatusResponse
checkout.CheckoutSessionRequest = CheckoutSessionRequest
stripe.checkout = checkout
payments.stripe = stripe
emergent.payments = payments
sys.modules["emergentintegrations"] = emergent
sys.modules["emergentintegrations.payments"] = payments
sys.modules["emergentintegrations.payments.stripe"] = stripe
sys.modules["emergentintegrations.payments.stripe.checkout"] = checkout

# Stub motor client to avoid heavy MongoDB dependency in unit tests
motor_module = types.ModuleType("motor")
motor_asyncio = types.ModuleType("motor.motor_asyncio")


class AsyncIOMotorClient:  # minimal placeholder
    def __init__(self, *args, **kwargs):
        pass

    def __getitem__(self, name):
        return {}


motor_asyncio.AsyncIOMotorClient = AsyncIOMotorClient
motor_module.motor_asyncio = motor_asyncio
sys.modules["motor"] = motor_module
sys.modules["motor.motor_asyncio"] = motor_asyncio

from backend import server
from backend.server import User, UserRole, BookingStatus, PaymentStatus


class FakeCursor:
    def __init__(self, items):
        self.items = items

    async def to_list(self, limit):
        return self.items[:limit]


def matches(doc, query):
    for key, value in query.items():
        if key == "$or":
            if not any(matches(doc, q) for q in value):
                return False
        else:
            val = doc.get(key)
            if isinstance(value, dict):
                if "$exists" in value:
                    exists = key in doc
                    if value["$exists"] != exists:
                        return False
                elif "$in" in value:
                    if val not in value["$in"]:
                        return False
                else:
                    if val != value:
                        return False
            else:
                if val != value:
                    return False
    return True


class FakeCollection:
    def __init__(self, docs):
        self.docs = docs

    def find(self, query):
        return FakeCursor([doc for doc in self.docs if matches(doc, query)])

    async def find_one(self, query):
        for doc in self.docs:
            if matches(doc, query):
                return doc
        return None


class FakeDB:
    def __init__(self, bookings, profiles):
        self.bookings = FakeCollection(bookings)
        self.provider_profiles = FakeCollection(profiles)


@pytest.mark.asyncio
async def test_provider_sees_assigned_bookings(monkeypatch):
    now = datetime.utcnow()
    provider_user_id = "provider-user"
    provider_profile_id = "provider-profile"

    base_booking = {
        "customer_id": "cust1",
        "service_type": "house_cleaning",
        "package_id": "pkg1",
        "addon_ids": [],
        "service_address": {
            "street": "s",
            "city": "c",
            "postal_code": "p",
            "country": "Slovenia",
            "latitude": 0.0,
            "longitude": 0.0,
        },
        "scheduled_datetime": now,
        "status": BookingStatus.PENDING,
        "price_estimate": {
            "base_price": 100.0,
            "addons_price": 0.0,
            "travel_fee": 0.0,
            "total_price": 100.0,
            "currency": "EUR",
            "breakdown": {},
        },
        "payment_status": PaymentStatus.PENDING,
        "created_at": now,
        "updated_at": now,
    }

    booking_unassigned = {"id": "b1", **base_booking, "provider_id": None}
    booking_assigned = {"id": "b2", **base_booking, "provider_id": provider_profile_id}
    booking_other = {"id": "b3", **base_booking, "provider_id": "other-provider"}

    fake_db = FakeDB(
        [booking_unassigned, booking_assigned, booking_other],
        [{"id": provider_profile_id, "user_id": provider_user_id}],
    )
    monkeypatch.setattr(server, "db", fake_db)

    current_user = User(
        id=provider_user_id,
        email="p@test.com",
        full_name="Provider",
        role=UserRole.PROVIDER,
        created_at=now,
        updated_at=now,
        is_active=True,
    )

    bookings = await server.get_bookings(current_user=current_user)
    ids = {b.id for b in bookings}
    assert ids == {"b1", "b2"}
