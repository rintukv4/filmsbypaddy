from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class EnquiryCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    organization: str = Field(min_length=2, max_length=160)
    email: str = Field(min_length=5, max_length=180)
    phone: str = Field(min_length=5, max_length=40)
    event_artist: str = Field(min_length=2, max_length=180)
    event_date: Optional[str] = None
    event_location: str = Field(min_length=2, max_length=180)
    coverage: List[str] = Field(min_length=1, max_length=6)
    deliverables: str = Field(min_length=2, max_length=1000)
    budget: str = Field(min_length=1, max_length=100)
    website: Optional[str] = Field(default="", max_length=180)
    message: str = Field(min_length=2, max_length=2000)
    honeypot: Optional[str] = ""

class EnquiryResponse(BaseModel):
    id: str
    status: str

projects = [
    {"slug":"unmaad-iim-bangalore","title":"UNMAAD / IIM BANGALORE","artist":"Gajendra Verma","event":"Unmaad","venue":"IIM Bangalore","city":"Bengaluru","year":"2024","services":"Photography + Cinematography","description":"A live performance captured in the charged space between stage light and a crowd singing every word.","image":"https://images.unsplash.com/photo-1565035010268-a3816f98589a?auto=format&fit=crop&w=1600&q=85","featured":True},
    {"slug":"pravega-iisc","title":"PRAVEGA / IISc","artist":"Jonita Gandhi","event":"Pravega","venue":"IISc","city":"Bengaluru","year":"2024","services":"Concert Photography","description":"Performance frames, crowd energy and the quiet seconds that make a festival feel electric.","image":"https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1600&q=85","featured":True},
    {"slug":"rhapsody-iisc","title":"RHAPSODY / IISc","artist":"Shreya Ghoshal","event":"Rhapsody","venue":"IISc","city":"Bengaluru","year":"2024","services":"Photography + Cinematography + Aftermovie","description":"A full-spectrum live music story, from the first cue to the final encore.","image":"https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1600&q=85","featured":True},
    {"slug":"live-event-farhan-akhtar","title":"LIVE EVENT","artist":"Farhan Akhtar","event":"Live Event","venue":"Event venue","city":"India","year":"Editable","services":"Concert Coverage","description":"Editable project entry — add the real venue, city, year and media when ready.","image":"https://images.unsplash.com/photo-1563841930606-67e2bce48b78?auto=format&fit=crop&w=1600&q=85","featured":False},
    {"slug":"live-event-aastha-gill","title":"LIVE EVENT","artist":"Aastha Gill","event":"Live Event","venue":"Event venue","city":"India","year":"Editable","services":"Concert Coverage","description":"Editable project entry — add the real venue, city, year and media when ready.","image":"https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1600&q=85","featured":False},
    {"slug":"live-event-mohit-chauhan","title":"LIVE EVENT","artist":"Mohit Chauhan","event":"Live Event","venue":"Event venue","city":"India","year":"Editable","services":"Concert Coverage","description":"Editable project entry — add the real venue, city, year and media when ready.","image":"https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=85","featured":False},
]

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "FilmsByPaddy API"}

@api_router.get("/portfolio")
async def get_portfolio():
    return {"projects": projects}

@api_router.post("/enquiries", response_model=EnquiryResponse)
async def create_enquiry(input: EnquiryCreate):
    if input.honeypot:
        return EnquiryResponse(id="blocked", status="received")
    enquiry = input.model_dump(exclude={"honeypot"})
    enquiry["id"] = str(uuid.uuid4())
    enquiry["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.enquiries.insert_one(enquiry)
    return EnquiryResponse(id=enquiry["id"], status="received")

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()