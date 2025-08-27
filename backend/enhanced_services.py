# Enhanced Service Catalog for Domora
# Based on 2025 European market research for competitive pricing and comprehensive services

from enum import Enum
import uuid

class ServiceType(str, Enum):
    HOUSE_CLEANING = "house_cleaning"
    CAR_WASHING = "car_washing"
    LANDSCAPING = "landscaping"

# HOUSE CLEANING PACKAGES (10 comprehensive packages)
HOUSE_CLEANING_PACKAGES = [
    {
        "id": str(uuid.uuid4()),
        "name": "Quick Tidy",
        "description": "Perfect for weekly maintenance: dusting, vacuuming common areas, basic bathroom wipe-down (up to 50m²)",
        "base_price": 35.0,
        "duration_minutes": 90,
        "service_type": ServiceType.HOUSE_CLEANING,
        "features": ["Basic dusting", "Vacuum/sweep floors", "Empty bins", "Basic bathroom tidy"],
        "best_for": "Small apartments, weekly maintenance",
        "max_size": "50m²"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Essential Clean",
        "description": "Standard cleaning for medium homes: thorough cleaning of all rooms, kitchen, and bathrooms (50-100m²)",
        "base_price": 55.0,
        "duration_minutes": 120,
        "service_type": ServiceType.HOUSE_CLEANING,
        "features": ["All rooms cleaned", "Kitchen deep clean", "Bathroom sanitization", "Floor mopping"],
        "best_for": "Medium apartments, bi-weekly cleaning",
        "max_size": "100m²"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Complete Clean",
        "description": "Comprehensive cleaning for larger homes: detailed cleaning of all areas including appliances (100-150m²)",
        "base_price": 75.0,
        "duration_minutes": 150,
        "service_type": ServiceType.HOUSE_CLEANING,
        "features": ["Complete home cleaning", "Appliance exterior", "Detailed bathroom", "Baseboards wiped"],
        "best_for": "Large apartments, monthly deep clean",
        "max_size": "150m²"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Premium Clean",
        "description": "Luxury cleaning service with extra attention to detail and premium products (any size)",
        "base_price": 95.0,
        "duration_minutes": 180,
        "service_type": ServiceType.HOUSE_CLEANING,
        "features": ["Premium eco-products", "Detailed cleaning", "Interior windows", "Light fixture cleaning"],
        "best_for": "Luxury homes, special occasions",
        "max_size": "Unlimited"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Deep Spring Clean",
        "description": "Intensive seasonal cleaning: includes areas not cleaned regularly like inside appliances, baseboards",
        "base_price": 120.0,
        "duration_minutes": 240,
        "service_type": ServiceType.HOUSE_CLEANING,
        "features": ["Inside appliances", "Baseboards & trim", "Light fixtures", "Cabinet fronts"],
        "best_for": "Seasonal deep cleaning, moving in/out",
        "max_size": "150m²"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Move In/Out Special",
        "description": "Complete cleaning for empty properties: includes inside appliances, cabinets, and detailed sanitization",
        "base_price": 140.0,
        "duration_minutes": 300,
        "service_type": ServiceType.HOUSE_CLEANING,
        "features": ["Inside all appliances", "Cabinet interiors", "Complete sanitization", "Move-in ready"],
        "best_for": "Moving in/out, property handover",
        "max_size": "200m²"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Post-Construction Clean",
        "description": "Specialized cleaning after renovations: dust removal, debris cleanup, detailed sanitization",
        "base_price": 160.0,
        "duration_minutes": 360,
        "service_type": ServiceType.HOUSE_CLEANING,
        "features": ["Construction dust removal", "Debris cleanup", "Window cleaning", "Deep sanitization"],
        "best_for": "After renovations or construction",
        "max_size": "200m²"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Eco-Friendly Premium",
        "description": "100% eco-friendly cleaning using certified organic products and sustainable methods",
        "base_price": 85.0,
        "duration_minutes": 160,
        "service_type": ServiceType.HOUSE_CLEANING,
        "features": ["Certified organic products", "Sustainable methods", "Allergy-friendly", "Complete clean"],
        "best_for": "Eco-conscious families, allergies",
        "max_size": "120m²"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Senior Care Clean",
        "description": "Gentle and thorough cleaning service designed for elderly clients with mobility considerations",
        "base_price": 65.0,
        "duration_minutes": 140,
        "service_type": ServiceType.HOUSE_CLEANING,
        "features": ["Gentle approach", "Safety-focused", "Medication area care", "Fall prevention awareness"],
        "best_for": "Senior citizens, accessibility needs",
        "max_size": "100m²"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Emergency Same-Day Clean",
        "description": "Urgent cleaning service available within 4 hours for unexpected guests or emergencies",
        "base_price": 110.0,
        "duration_minutes": 120,
        "service_type": ServiceType.HOUSE_CLEANING,
        "features": ["4-hour availability", "Priority service", "Essential areas focus", "Express cleaning"],
        "best_for": "Unexpected guests, emergencies",
        "max_size": "80m²"
    }
]

# HOUSE CLEANING ADD-ONS (Personalized and comprehensive)
HOUSE_CLEANING_ADDONS = [
    {
        "id": str(uuid.uuid4()),
        "name": "Interior Window Cleaning",
        "description": "Clean all interior windows and mirrors for crystal-clear shine",
        "price": 18.0,
        "service_type": ServiceType.HOUSE_CLEANING,
        "duration_minutes": 30
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Oven Deep Clean",
        "description": "Complete oven interior cleaning with specialized degreasing products",
        "price": 25.0,
        "service_type": ServiceType.HOUSE_CLEANING,
        "duration_minutes": 45
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Refrigerator Deep Clean",
        "description": "Complete fridge interior and exterior cleaning and sanitization",
        "price": 20.0,
        "service_type": ServiceType.HOUSE_CLEANING,
        "duration_minutes": 30
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Laundry Service",
        "description": "Wash, dry, and fold one load of laundry during cleaning visit",
        "price": 15.0,
        "service_type": ServiceType.HOUSE_CLEANING,
        "duration_minutes": 15
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Balcony/Terrace Clean",
        "description": "Outdoor space cleaning including furniture and railings",
        "price": 22.0,
        "service_type": ServiceType.HOUSE_CLEANING,
        "duration_minutes": 40
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Closet Organization",
        "description": "Organize and tidy walk-in closets or wardrobes",
        "price": 30.0,
        "service_type": ServiceType.HOUSE_CLEANING,
        "duration_minutes": 60
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Pantry Organization",
        "description": "Clean and organize kitchen pantry and food storage areas",
        "price": 25.0,
        "service_type": ServiceType.HOUSE_CLEANING,
        "duration_minutes": 45
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Garage Cleaning",
        "description": "Basic garage floor cleaning and organization",
        "price": 35.0,
        "service_type": ServiceType.HOUSE_CLEANING,
        "duration_minutes": 60
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Pet Area Sanitization",
        "description": "Specialized cleaning for pet areas with pet-safe products",
        "price": 20.0,
        "service_type": ServiceType.HOUSE_CLEANING,
        "duration_minutes": 30
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Basement/Attic Basic Clean",
        "description": "Basic cleaning and dust removal from storage areas",
        "price": 40.0,
        "service_type": ServiceType.HOUSE_CLEANING,
        "duration_minutes": 75
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Light Fixture Cleaning",
        "description": "Clean all light fixtures, ceiling fans, and lampshades",
        "price": 28.0,
        "service_type": ServiceType.HOUSE_CLEANING,
        "duration_minutes": 45
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Mattress Sanitization",
        "description": "Professional mattress cleaning and sanitization service",
        "price": 35.0,
        "service_type": ServiceType.HOUSE_CLEANING,
        "duration_minutes": 40
    }
]

# CAR WASHING PACKAGES (10 comprehensive packages)
CAR_WASHING_PACKAGES = [
    {
        "id": str(uuid.uuid4()),
        "name": "Express Wash",
        "description": "Quick exterior wash and dry for busy schedules (15 minutes)",
        "base_price": 15.0,
        "duration_minutes": 15,
        "service_type": ServiceType.CAR_WASHING,
        "features": ["Exterior rinse", "Basic soap wash", "Quick dry", "Tire rinse"],
        "best_for": "Quick touch-up, busy schedules"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Standard Wash",
        "description": "Complete exterior wash with hand drying and tire cleaning",
        "base_price": 25.0,
        "duration_minutes": 30,
        "service_type": ServiceType.CAR_WASHING,
        "features": ["Hand wash exterior", "Tire cleaning", "Hand dry", "Window cleaning"],
        "best_for": "Regular maintenance wash"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Interior Plus",
        "description": "Standard wash plus comprehensive interior cleaning and vacuuming",
        "base_price": 35.0,
        "duration_minutes": 45,
        "service_type": ServiceType.CAR_WASHING,
        "features": ["Complete exterior", "Interior vacuum", "Dashboard clean", "Door panels"],
        "best_for": "Families, regular interior maintenance"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Premium Detail",
        "description": "Professional detailing with wax protection and interior conditioning",
        "base_price": 65.0,
        "duration_minutes": 90,
        "service_type": ServiceType.CAR_WASHING,
        "features": ["Premium wash", "Wax protection", "Interior conditioning", "Tire shine"],
        "best_for": "Monthly maintenance, protection"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Luxury Full Service",
        "description": "Complete luxury treatment with ceramic coating prep and premium products",
        "base_price": 95.0,
        "duration_minutes": 120,
        "service_type": ServiceType.CAR_WASHING,
        "features": ["Clay bar treatment", "Premium products", "Ceramic prep", "Complete detail"],
        "best_for": "Luxury vehicles, special occasions"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Eco-Friendly Wash",
        "description": "Environmentally conscious wash using biodegradable products and water-saving techniques",
        "base_price": 32.0,
        "duration_minutes": 40,
        "service_type": ServiceType.CAR_WASHING,
        "features": ["Biodegradable products", "Water-saving", "Eco-friendly", "Complete wash"],
        "best_for": "Environmentally conscious owners"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Motorcycle/Scooter Wash",
        "description": "Specialized cleaning for motorcycles and scooters with appropriate techniques",
        "base_price": 20.0,
        "duration_minutes": 25,
        "service_type": ServiceType.CAR_WASHING,
        "features": ["Specialized technique", "Chrome polishing", "Chain clean", "Careful drying"],
        "best_for": "Motorcycles, scooters, bikes"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Fleet/Commercial Wash",
        "description": "Efficient cleaning service for commercial vehicles and fleets (per vehicle)",
        "base_price": 22.0,
        "duration_minutes": 20,
        "service_type": ServiceType.CAR_WASHING,
        "features": ["Efficient process", "Commercial grade", "Fleet pricing", "Quick turnaround"],
        "best_for": "Commercial vehicles, fleet operators"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Paint Protection Package",
        "description": "Advanced paint protection with sealant application and UV protection",
        "base_price": 120.0,
        "duration_minutes": 150,
        "service_type": ServiceType.CAR_WASHING,
        "features": ["Paint correction", "Sealant application", "UV protection", "Long-lasting"],
        "best_for": "New cars, paint protection"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Emergency/Same-Day Clean",
        "description": "Urgent car cleaning service available within 2 hours for special events",
        "base_price": 55.0,
        "duration_minutes": 35,
        "service_type": ServiceType.CAR_WASHING,
        "features": ["2-hour service", "Priority booking", "Express detail", "Event ready"],
        "best_for": "Special events, emergencies"
    }
]

# CAR WASHING ADD-ONS (Personalized and comprehensive)
CAR_WASHING_ADDONS = [
    {
        "id": str(uuid.uuid4()),
        "name": "Engine Bay Cleaning",
        "description": "Professional engine compartment cleaning and degreasing",
        "price": 35.0,
        "service_type": ServiceType.CAR_WASHING,
        "duration_minutes": 30
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Headlight Restoration",
        "description": "Restore cloudy or yellowed headlights to like-new condition",
        "price": 45.0,
        "service_type": ServiceType.CAR_WASHING,
        "duration_minutes": 45
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Leather Conditioning",
        "description": "Deep conditioning treatment for leather seats and interior",
        "price": 30.0,
        "service_type": ServiceType.CAR_WASHING,
        "duration_minutes": 25
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Pet Hair Removal",
        "description": "Specialized removal of pet hair from fabric and carpets",
        "price": 25.0,
        "service_type": ServiceType.CAR_WASHING,
        "duration_minutes": 30
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Odor Elimination Treatment",
        "description": "Professional odor removal using ozone or enzyme treatment",
        "price": 40.0,
        "service_type": ServiceType.CAR_WASHING,
        "duration_minutes": 60
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Wheel & Rim Deep Clean",
        "description": "Detailed cleaning and polishing of wheels and rims",
        "price": 20.0,
        "service_type": ServiceType.CAR_WASHING,
        "duration_minutes": 20
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Trunk/Boot Organization",
        "description": "Clean and organize trunk space with storage solutions",
        "price": 15.0,
        "service_type": ServiceType.CAR_WASHING,
        "duration_minutes": 15
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Convertible Top Care",
        "description": "Specialized cleaning for soft or hard convertible tops",
        "price": 35.0,
        "service_type": ServiceType.CAR_WASHING,
        "duration_minutes": 30
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Chrome & Metal Polish",
        "description": "Polish all chrome and metal trim to mirror finish",
        "price": 22.0,
        "service_type": ServiceType.CAR_WASHING,
        "duration_minutes": 25
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Undercarriage Wash",
        "description": "High-pressure cleaning of vehicle undercarriage and chassis",
        "price": 18.0,
        "service_type": ServiceType.CAR_WASHING,
        "duration_minutes": 15
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Dashboard UV Protection",
        "description": "Apply UV protection to prevent dashboard cracking and fading",
        "price": 25.0,
        "service_type": ServiceType.CAR_WASHING,
        "duration_minutes": 20
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Ceramic Coating Application",
        "description": "Professional ceramic coating application for long-term protection",
        "price": 150.0,
        "service_type": ServiceType.CAR_WASHING,
        "duration_minutes": 120
    }
]

# LANDSCAPING PACKAGES (10 comprehensive packages)
LANDSCAPING_PACKAGES = [
    {
        "id": str(uuid.uuid4()),
        "name": "Basic Lawn Mow",
        "description": "Simple grass cutting service for small to medium lawns (up to 200m²)",
        "base_price": 25.0,
        "duration_minutes": 45,
        "service_type": ServiceType.LANDSCAPING,
        "features": ["Lawn mowing", "Edge trimming", "Grass cleanup", "Path sweeping"],
        "best_for": "Regular maintenance, small gardens",
        "max_size": "200m²"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Complete Lawn Care",
        "description": "Comprehensive lawn service including mowing, edging, and basic garden tidy",
        "base_price": 45.0,
        "duration_minutes": 90,
        "service_type": ServiceType.LANDSCAPING,
        "features": ["Complete mowing", "Professional edging", "Garden bed tidy", "Debris removal"],
        "best_for": "Medium gardens, bi-weekly service",
        "max_size": "400m²"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Garden Maintenance Plus",
        "description": "Full garden care including pruning, weeding, and seasonal plant care",
        "base_price": 65.0,
        "duration_minutes": 120,
        "service_type": ServiceType.LANDSCAPING,
        "features": ["Complete garden care", "Pruning & weeding", "Plant health check", "Seasonal advice"],
        "best_for": "Established gardens, monthly care",
        "max_size": "300m²"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Seasonal Garden Prep",
        "description": "Specialized seasonal preparation including cleanup, planting, and fertilization",
        "base_price": 85.0,
        "duration_minutes": 150,
        "service_type": ServiceType.LANDSCAPING,
        "features": ["Seasonal cleanup", "Fertilization", "New plantings", "Soil preparation"],
        "best_for": "Seasonal transitions, garden renewal",
        "max_size": "500m²"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Hedge & Shrub Specialist",
        "description": "Professional hedge trimming and shrub shaping for perfect garden aesthetics",
        "base_price": 55.0,
        "duration_minutes": 90,
        "service_type": ServiceType.LANDSCAPING,
        "features": ["Professional shaping", "Health pruning", "Growth management", "Aesthetic design"],
        "best_for": "Formal gardens, hedge maintenance"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Tree Care Service",
        "description": "Specialized tree pruning, health assessment, and safety maintenance",
        "base_price": 95.0,
        "duration_minutes": 180,
        "service_type": ServiceType.LANDSCAPING,
        "features": ["Professional pruning", "Health assessment", "Safety checks", "Disease prevention"],
        "best_for": "Mature trees, safety concerns"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Eco-Garden Package",
        "description": "Sustainable gardening using organic methods and native plant promotion",
        "base_price": 70.0,
        "duration_minutes": 120,
        "service_type": ServiceType.LANDSCAPING,
        "features": ["Organic methods", "Native plants", "Sustainable practices", "Eco-friendly care"],
        "best_for": "Eco-conscious gardeners, sustainability",
        "max_size": "350m²"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Autumn/Winter Prep",
        "description": "Specialized winter preparation including leaf removal and plant protection",
        "base_price": 75.0,
        "duration_minutes": 135,
        "service_type": ServiceType.LANDSCAPING,
        "features": ["Leaf removal", "Plant protection", "Winterization", "Tool maintenance"],
        "best_for": "Autumn cleanup, winter preparation",
        "max_size": "400m²"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Spring Garden Revival",
        "description": "Complete spring awakening service with cleanup, planting, and fertilization",
        "base_price": 90.0,
        "duration_minutes": 180,
        "service_type": ServiceType.LANDSCAPING,
        "features": ["Spring cleanup", "New plantings", "Soil rejuvenation", "Growth planning"],
        "best_for": "Spring renewal, garden restart",
        "max_size": "450m²"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Emergency Storm Cleanup",
        "description": "Rapid response for storm damage cleanup and garden restoration",
        "base_price": 120.0,
        "duration_minutes": 240,
        "service_type": ServiceType.LANDSCAPING,
        "features": ["Damage assessment", "Debris removal", "Safety clearing", "Restoration plan"],
        "best_for": "Storm damage, emergency cleanup"
    }
]

# LANDSCAPING ADD-ONS (Personalized and comprehensive)
LANDSCAPING_ADDONS = [
    {
        "id": str(uuid.uuid4()),
        "name": "Lawn Fertilization",
        "description": "Professional fertilizer application for healthy grass growth",
        "price": 30.0,
        "service_type": ServiceType.LANDSCAPING,
        "duration_minutes": 30
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Weed Control Treatment",
        "description": "Targeted weed control using selective herbicides",
        "price": 25.0,
        "service_type": ServiceType.LANDSCAPING,
        "duration_minutes": 45
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Flower Bed Refresh",
        "description": "Seasonal flower planting and bed preparation",
        "price": 40.0,
        "service_type": ServiceType.LANDSCAPING,
        "duration_minutes": 60
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Mulch Application",
        "description": "Professional mulch spreading for moisture retention and weed control",
        "price": 35.0,
        "service_type": ServiceType.LANDSCAPING,
        "duration_minutes": 45
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Irrigation System Check",
        "description": "Inspection and basic maintenance of sprinkler systems",
        "price": 45.0,
        "service_type": ServiceType.LANDSCAPING,
        "duration_minutes": 60
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Pest Control Treatment",
        "description": "Eco-friendly pest control for garden insects and diseases",
        "price": 35.0,
        "service_type": ServiceType.LANDSCAPING,
        "duration_minutes": 40
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Soil Testing & Analysis",
        "description": "Professional soil analysis with improvement recommendations",
        "price": 50.0,
        "service_type": ServiceType.LANDSCAPING,
        "duration_minutes": 30
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Garden Design Consultation",
        "description": "Professional landscape design advice and planning session",
        "price": 75.0,
        "service_type": ServiceType.LANDSCAPING,
        "duration_minutes": 90
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Greenhouse Maintenance",
        "description": "Complete greenhouse cleaning and plant care",
        "price": 40.0,
        "service_type": ServiceType.LANDSCAPING,
        "duration_minutes": 60
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Pond/Water Feature Care",
        "description": "Cleaning and maintenance of garden ponds and water features",
        "price": 55.0,
        "service_type": ServiceType.LANDSCAPING,
        "duration_minutes": 75
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Compost Setup",
        "description": "Set up and maintain compost system for organic gardening",
        "price": 45.0,
        "service_type": ServiceType.LANDSCAPING,
        "duration_minutes": 60
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Outdoor Lighting Setup",
        "description": "Install and maintain garden lighting for safety and aesthetics",
        "price": 65.0,
        "service_type": ServiceType.LANDSCAPING,
        "duration_minutes": 90
    }
]

# Combined data for easy import
ENHANCED_SERVICE_DATA = {
    "packages": HOUSE_CLEANING_PACKAGES + CAR_WASHING_PACKAGES + LANDSCAPING_PACKAGES,
    "addons": HOUSE_CLEANING_ADDONS + CAR_WASHING_ADDONS + LANDSCAPING_ADDONS
}