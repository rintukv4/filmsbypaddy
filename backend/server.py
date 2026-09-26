from fastapi import FastAPI, APIRouter, HTTPException
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


def u(photo_id: str) -> str:
    return f"https://images.unsplash.com/{photo_id}?auto=format&fit=crop&w=1800&q=80"


FESTIVALS = [u("photo-1470229722913-7c0e2dbbafd3"), u("photo-1506157786151-b8491531f063"),
             u("photo-1665035212282-3e117d618b36"), u("photo-1540039155733-5bb30b53aa14")]
BTS = [u("photo-1594394489098-74ac04c0fc2e"), u("photo-1625690303837-654c9666d2d0"),
       u("photo-1612544409025-e1f6a56c1152"), u("photo-1632187981988-40f3cbaeef5e"),
       u("photo-1590486803833-1c5dc8ddd4c8"), u("photo-1493863641943-9b68992a8d07")]
INSTA = [u("photo-1629327896333-7ecec1515ae5"), u("photo-1567663711269-0351025d18a8"),
         u("photo-1453090927415-5f45085b65c0"), u("photo-1470225620780-dba8ba36b745"),
         u("photo-1595971294624-80bcf0d7eb24"), u("photo-1507676184212-d03ab07a01bf"),
         u("photo-1615754890634-69ac8bca7189"), u("photo-1459749411175-04bf5292ceea")]
ART = [u("photo-1576967402682-19976eb930f2"), u("photo-1595422656857-ced3a4a0ce25"),
       u("photo-1464375117522-1311d6a5b81f"), u("photo-1519326773765-3ae3b02c44cc"),
       u("photo-1549761505-a31eb21119d6"), u("photo-1603562767384-c8fe55858c2f")]
SHOWREEL = u("photo-1514525253161-7a46d19cd819")

SEED_PROJECTS = [
    {"slug": "unmaad-iim-bangalore", "title": "UNMAAD / IIM BANGALORE", "artist": "Gajendra Verma",
     "event": "Unmaad", "venue": "IIM Bangalore", "city": "Bengaluru", "year": "2024",
     "services": "Photography + Cinematography",
     "description": "A live performance captured in the charged space between stage light and a crowd singing every word back.",
     "heroImage": u("photo-1459749411175-04bf5292ceea"), "artistImage": ART[0], "crowdImage": FESTIVALS[1],
     "lightImage": INSTA[7], "motionImage": SHOWREEL, "btsImages": [BTS[1], BTS[4]],
     "videoUrl": "", "featured": True, "sortOrder": 1},
    {"slug": "pravega-iisc", "title": "PRAVEGA / IISc", "artist": "Jonita Gandhi",
     "event": "Pravega", "venue": "IISc", "city": "Bengaluru", "year": "2024",
     "services": "Concert Photography",
     "description": "Performance frames, crowd energy and the quiet seconds that make a festival night feel electric.",
     "heroImage": u("photo-1524368535928-5b5e00ddc76b"), "artistImage": ART[1], "crowdImage": FESTIVALS[0],
     "lightImage": u("photo-1600779547877-be592ef5aad3"), "motionImage": INSTA[3], "btsImages": [BTS[0], BTS[5]],
     "videoUrl": "", "featured": True, "sortOrder": 2},
    {"slug": "rhapsody-iisc", "title": "RHAPSODY / IISc", "artist": "Shreya Ghoshal",
     "event": "Rhapsody", "venue": "IISc", "city": "Bengaluru", "year": "2024",
     "services": "Photography + Cinematography + Aftermovie",
     "description": "A full-spectrum live music story — from the first cue of the night to the final encore.",
     "heroImage": FESTIVALS[0], "artistImage": ART[2], "crowdImage": FESTIVALS[3],
     "lightImage": INSTA[2], "motionImage": u("photo-1600779547877-be592ef5aad3"), "btsImages": [BTS[2], BTS[3]],
     "videoUrl": "", "featured": True, "sortOrder": 3},
    {"slug": "live-event-farhan-akhtar", "title": "LIVE EVENT", "artist": "Farhan Akhtar",
     "event": "Live Event", "venue": "Event venue", "city": "India", "year": "Editable",
     "services": "Concert Coverage",
     "description": "Editable project entry — add the real venue, city, year and media when ready.",
     "heroImage": u("photo-1600779547877-be592ef5aad3"), "artistImage": ART[3], "crowdImage": FESTIVALS[2],
     "lightImage": ART[4], "motionImage": INSTA[0], "btsImages": [BTS[4], BTS[1]],
     "videoUrl": "", "featured": False, "sortOrder": 4},
    {"slug": "live-event-aastha-gill", "title": "LIVE EVENT", "artist": "Aastha Gill",
     "event": "Live Event", "venue": "Event venue", "city": "India", "year": "Editable",
     "services": "Concert Coverage",
     "description": "Editable project entry — add the real venue, city, year and media when ready.",
     "heroImage": FESTIVALS[2], "artistImage": ART[5], "crowdImage": FESTIVALS[1],
     "lightImage": INSTA[6], "motionImage": INSTA[5], "btsImages": [BTS[5], BTS[0]],
     "videoUrl": "", "featured": False, "sortOrder": 5},
    {"slug": "live-event-mohit-chauhan", "title": "LIVE EVENT", "artist": "Mohit Chauhan",
     "event": "Live Event", "venue": "Event venue", "city": "India", "year": "Editable",
     "services": "Concert Coverage",
     "description": "Editable project entry — add the real venue, city, year and media when ready.",
     "heroImage": FESTIVALS[3], "artistImage": ART[4], "crowdImage": u("photo-1524368535928-5b5e00ddc76b"),
     "lightImage": INSTA[1], "motionImage": INSTA[4], "btsImages": [BTS[3], BTS[2]],
     "videoUrl": "", "featured": False, "sortOrder": 6},
]


class EnquiryCreate(BaseModel):
    model_config = ConfigDict(extra="ignore")

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


@app.on_event("startup")
async def seed_portfolio():
    if await db.portfolio.count_documents({}) == 0:
        await db.portfolio.insert_many([dict(p) for p in SEED_PROJECTS])
        logger.info("Seeded %d portfolio projects", len(SEED_PROJECTS))


@api_router.get("/")
async def root():
    return {"message": "FilmsByPaddy API"}


@api_router.get("/portfolio")
async def get_portfolio():
    projects = await db.portfolio.find({}, {"_id": 0}).sort("sortOrder", 1).to_list(200)
    return {"projects": projects}


@api_router.get("/portfolio/{slug}")
async def get_project(slug: str):
    project = await db.portfolio.find_one({"slug": slug}, {"_id": 0})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@api_router.post("/enquiries", response_model=EnquiryResponse)
async def create_enquiry(input: EnquiryCreate):
    if input.honeypot:
        return EnquiryResponse(id="blocked", status="received")
    enquiry = input.model_dump(exclude={"honeypot"})
    enquiry["id"] = str(uuid.uuid4())
    enquiry["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.enquiries.insert_one(enquiry)
    return EnquiryResponse(id=enquiry["id"], status="received")


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
