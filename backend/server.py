from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Request, Depends
from fastapi.responses import Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
import requests

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

JWT_ALGORITHM = "HS256"
JWT_SECRET = os.environ["JWT_SECRET"]
ADMIN_EMAIL = os.environ["ADMIN_EMAIL"].lower()
ADMIN_PASSWORD = os.environ["ADMIN_PASSWORD"]
APP_NAME = "filmsbypaddy"

STORAGE_BASE = (os.environ.get("INTEGRATION_PROXY_URL") or "").strip() or "https://integrations.emergentagent.com"
STORAGE_URL = STORAGE_BASE.rstrip("/") + "/objstore/api/v1/storage"
EMERGENT_KEY = os.environ.get("EMERGENT_LLM_KEY")
storage_key = None


def init_storage(force: bool = False):
    global storage_key
    if storage_key and not force:
        return storage_key
    resp = requests.post(f"{STORAGE_URL}/init", json={"emergent_key": EMERGENT_KEY}, timeout=30)
    resp.raise_for_status()
    storage_key = resp.json()["storage_key"]
    return storage_key


def put_object(path: str, data: bytes, content_type: str) -> dict:
    key = init_storage()
    resp = requests.put(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key, "Content-Type": content_type},
        data=data, timeout=120,
    )
    resp.raise_for_status()
    return resp.json()


def get_object(path: str):
    key = init_storage()
    resp = requests.get(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": key}, timeout=60)
    if resp.status_code == 404:
        init_storage(force=True)
        resp = requests.get(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": storage_key}, timeout=60)
    resp.raise_for_status()
    return resp.content, resp.headers.get("Content-Type", "application/octet-stream")


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
        "type": "access",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def get_admin(request: Request) -> dict:
    auth_header = request.headers.get("Authorization", "")
    token = auth_header[7:] if auth_header.startswith("Bearer ") else None
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = await db.users.find_one({"email": payload.get("email"), "role": "admin"}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(status_code=401, detail="Not authorized")
    return user


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

DEFAULT_SITE_CONTENT = {
    "instagramPosts": [
        {"url": "https://www.instagram.com/filmxaskn/p/DQ_iBWqgVc8/", "img": "/media/ig-post-1.jpg"},
        {"url": "https://www.instagram.com/filmsbypaddy/p/DUwxL1YEwB-/", "img": "/media/ig-post-2.webp"},
        {"url": "https://www.instagram.com/filmsbypaddy/p/DUzZPAYCCaO/", "img": "/media/ig-post-3.webp"},
        {"url": "https://www.instagram.com/filmsbypaddy/p/DWd3PRwEzcm/", "img": "/media/ig-post-4.webp"},
        {"url": "https://www.instagram.com/filmsbypaddy/p/DWvUFR8gJTN/", "img": "/media/ig-post-5.webp"},
        {"url": "https://www.instagram.com/filmsbypaddy/p/DYhNGNpk4g4/", "img": "/media/ig-post-6.jpg"},
        {"url": "https://www.instagram.com/filmsbypaddy/p/C3AnvjUxA7r/", "img": "/media/ig-post-7.jpg"},
        {"url": "https://www.instagram.com/filmsbypaddy/p/C2wVGplRuWm/", "img": "/media/ig-post-8.jpg"},
    ],
    "images": {
        "heroPoster": u("photo-1610487072862-4992dd8f68dc"),
        "showreelPoster": SHOWREEL,
        "texture": u("photo-1471877325906-aee7c2240b5f"),
        "aboutPortrait": u("photo-1497316730643-415fac54a2af"),
        "bts": BTS,
        "festivals": FESTIVALS,
    },
}


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


class LoginInput(BaseModel):
    email: str
    password: str


@app.on_event("startup")
async def startup():
    try:
        init_storage()
        logger.info("Object storage initialized")
    except Exception as e:
        logger.error(f"Storage init failed: {e}")

    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")

    existing = await db.users.find_one({"email": ADMIN_EMAIL})
    if existing is None:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": ADMIN_EMAIL,
            "password_hash": hash_password(ADMIN_PASSWORD),
            "name": "Paddy",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info("Seeded admin user")

    if await db.portfolio.count_documents({}) == 0:
        await db.portfolio.insert_many([dict(p) for p in SEED_PROJECTS])
        logger.info("Seeded %d portfolio projects", len(SEED_PROJECTS))

    if await db.site_content.count_documents({}) == 0:
        await db.site_content.insert_one({"id": "main", **DEFAULT_SITE_CONTENT})
        logger.info("Seeded site content")


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


@api_router.get("/site-content")
async def get_site_content():
    doc = await db.site_content.find_one({"id": "main"}, {"_id": 0})
    return doc or {"id": "main", **DEFAULT_SITE_CONTENT}


@api_router.post("/enquiries", response_model=EnquiryResponse)
async def create_enquiry(input: EnquiryCreate):
    if input.honeypot:
        return EnquiryResponse(id="blocked", status="received")
    enquiry = input.model_dump(exclude={"honeypot"})
    enquiry["id"] = str(uuid.uuid4())
    enquiry["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.enquiries.insert_one(enquiry)
    return EnquiryResponse(id=enquiry["id"], status="received")


# ---------- Auth ----------

@api_router.post("/auth/login")
async def login(input: LoginInput, request: Request):
    email = input.email.lower().strip()
    identifier = f"{request.client.host}:{email}"
    attempts = await db.login_attempts.find_one({"identifier": identifier})
    if attempts and attempts.get("count", 0) >= 5:
        locked_at = datetime.fromisoformat(attempts["locked_at"])
        if datetime.now(timezone.utc) - locked_at < timedelta(minutes=15):
            raise HTTPException(status_code=429, detail="Too many failed attempts. Try again in 15 minutes.")

    user = await db.users.find_one({"email": email, "role": "admin"})
    if not user or not verify_password(input.password, user["password_hash"]):
        await db.login_attempts.update_one(
            {"identifier": identifier},
            {"$inc": {"count": 1}, "$set": {"locked_at": datetime.now(timezone.utc).isoformat()}},
            upsert=True,
        )
        raise HTTPException(status_code=401, detail="Invalid email or password")

    await db.login_attempts.delete_one({"identifier": identifier})
    token = create_token(user["id"], email)
    return {"token": token, "user": {"email": email, "name": user.get("name", "Admin"), "role": "admin"}}


@api_router.get("/auth/me")
async def auth_me(admin: dict = Depends(get_admin)):
    return admin


# ---------- Admin: content ----------

@api_router.put("/admin/site-content")
async def update_site_content(body: dict, admin: dict = Depends(get_admin)):
    body.pop("_id", None)
    body["id"] = "main"
    await db.site_content.replace_one({"id": "main"}, body, upsert=True)
    return {"status": "saved"}


@api_router.post("/admin/portfolio")
async def create_project(body: dict, admin: dict = Depends(get_admin)):
    body.pop("_id", None)
    slug = (body.get("slug") or "").strip()
    if not slug or not body.get("title"):
        raise HTTPException(status_code=422, detail="Slug and title are required")
    if await db.portfolio.find_one({"slug": slug}):
        raise HTTPException(status_code=409, detail="A project with this slug already exists")
    await db.portfolio.insert_one(body)
    return {"status": "created", "slug": slug}


@api_router.put("/admin/portfolio/{slug}")
async def update_project(slug: str, body: dict, admin: dict = Depends(get_admin)):
    body.pop("_id", None)
    body["slug"] = slug
    result = await db.portfolio.replace_one({"slug": slug}, body)
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"status": "saved"}


@api_router.delete("/admin/portfolio/{slug}")
async def delete_project(slug: str, admin: dict = Depends(get_admin)):
    result = await db.portfolio.delete_one({"slug": slug})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"status": "deleted"}


@api_router.get("/admin/enquiries")
async def list_enquiries(admin: dict = Depends(get_admin)):
    items = await db.enquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(200)
    return {"enquiries": items}


# ---------- Admin: uploads ----------

@api_router.post("/admin/upload")
async def upload_image(file: UploadFile = File(...), admin: dict = Depends(get_admin)):
    if not (file.content_type or "").startswith("image/"):
        raise HTTPException(status_code=422, detail="Only image files are allowed")
    ext = file.filename.split(".")[-1].lower() if file.filename and "." in file.filename else "jpg"
    path = f"{APP_NAME}/uploads/admin/{uuid.uuid4()}.{ext}"
    data = await file.read()
    if len(data) > 25 * 1024 * 1024:
        raise HTTPException(status_code=422, detail="File too large (max 25MB)")
    result = put_object(path, data, file.content_type)
    return {"url": f"/api/files/{result['path']}", "path": result["path"]}


@api_router.get("/files/{path:path}")
async def serve_file(path: str):
    if not path.startswith(f"{APP_NAME}/"):
        raise HTTPException(status_code=403, detail="Forbidden")
    try:
        data, content_type = get_object(path)
    except Exception:
        raise HTTPException(status_code=404, detail="File not found")
    return Response(content=data, media_type=content_type)


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
