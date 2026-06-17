import json
import time
import os
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from prometheus_client import Counter, generate_latest, CONTENT_TYPE_LATEST
from .config import settings
from .database import engine, SessionLocal
from . import models, database
from .routers import users, regions, assets, simulation

# Initialize database tables
models.Base.metadata.create_all(bind=engine)

# Seed database with initial datasets if empty
def seed_data():
    db = SessionLocal()
    try:
        # 1. Seed Regions
        if db.query(models.Region).count() == 0:
            initial_regions = [
                models.Region(name="Neo-Tokyo Sector 4", coords="35.6762° N, 139.6503° E", shields=92, temp=24, energy=450, population=42.5, threat_level="STABLE"),
                models.Region(name="Olympus Mons Dome B", coords="18.6500° N, 226.2000° E", shields=88, temp=-12, energy=820, population=8.2, threat_level="WARNING"),
                models.Region(name="Atlantis Ocean Trench", coords="31.2000° N, 64.3500° W", shields=95, temp=4, energy=310, population=3.4, threat_level="STABLE"),
                models.Region(name="New Berlin Hub-1", coords="52.5200° N, 13.4050° E", shields=74, temp=35, energy=680, population=18.9, threat_level="CRITICAL"),
            ]
            db.bulk_save_objects(initial_regions)
            db.commit()

        # 2. Seed Assets
        if db.query(models.Asset).count() == 0:
            initial_assets = [
                models.Asset(id="qfr-01", name="Quantum Fusion Reactor QF-1", type="Energy", region_id="Neo-Tokyo Sector 4", health=98, status="ONLINE", uptime="99.99%"),
                models.Asset(id="odp-08", name="Orbital Defense Platform ODP-8", type="Defense", region_id="Orbital Ring Station 7", health=91, status="ONLINE", uptime="99.85%"),
                models.Asset(id="tcr-04", name="Tachyon Climate Regulator TCR-4", type="Climate", region_id="Olympus Mons Dome B", health=76, status="DEGRADING", uptime="98.24%"),
                models.Asset(id="hcc-12", name="Hyperloop Transit Controller HCC-12", type="Compute", region_id="New Berlin Hub-1", health=42, status="CRITICAL", uptime="95.12%"),
            ]
            db.bulk_save_objects(initial_assets)
            db.commit()

        # 3. Seed Users
        if db.query(models.User).count() == 0:
            initial_users = [
                models.User(username="admin_command", email="admin@omnicivilization.org", role="Administrator", is_active=True),
                models.User(username="operator_tokyo", email="tokyo_ops@omnicivilization.org", role="Operator", is_active=True),
            ]
            db.bulk_save_objects(initial_users)
            db.commit()
    except Exception as e:
        print(f"Error seeding database: {e}")
    finally:
        db.close()

# Run Seed Data function
seed_data()

# Initialize FastAPI App
app = FastAPI(
    title=settings.API_TITLE,
    description="Futuristic command-center backend API for OmniCivilization Analytics.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for strict production environments
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Structured JSON Logging Setup
log_dir = os.path.join(os.path.dirname(__file__), "logs")
os.makedirs(log_dir, exist_ok=True)
log_file_path = os.path.join(log_dir, "api.log")

# Prometheus Metrics Configuration
HTTP_REQUESTS = Counter(
    "http_requests_total",
    "Total HTTP Requests",
    ["method", "endpoint", "status_code"]
)

@app.middleware("http")
async def add_metrics_middleware(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time
    
    # Increment metrics
    HTTP_REQUESTS.labels(
        method=request.method,
        endpoint=request.url.path,
        status_code=response.status_code
    ).inc()
    
    # Write structured JSON log line
    log_data = {
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "level": "INFO" if response.status_code < 400 else "WARNING" if response.status_code < 500 else "ERROR",
        "method": request.method,
        "path": request.url.path,
        "status_code": response.status_code,
        "duration_sec": round(duration, 4),
        "client_ip": request.client.host if request.client else "unknown"
    }
    try:
        with open(log_file_path, "a") as f:
            f.write(json.dumps(log_data) + "\n")
    except Exception as e:
        print(f"Error writing log file: {e}")
        
    return response

# Metrics Endpoint
@app.get("/metrics", tags=["System Metrics"])
def metrics():
    return Response(content=generate_latest(), media_type=CONTENT_TYPE_LATEST)

# Root Endpoint
@app.get("/", tags=["Root Checkpoint"])
def read_root():
    return {
        "status": "ONLINE",
        "system_epoch": "EPOCH [2146.06.16]",
        "database_sync": "NOMINAL",
        "documentation_url": "/docs"
    }

# Register Routers
app.include_router(users.router)
app.include_router(regions.router)
app.include_router(assets.router)
app.include_router(simulation.router)
