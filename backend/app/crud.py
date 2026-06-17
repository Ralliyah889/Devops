from sqlalchemy.orm import Session
from . import models, schemas

# ==================== USER CRUD ====================
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(
        username=user.username,
        email=user.email,
        role=user.role,
        is_active=user.is_active
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: int, user_update: schemas.UserUpdate):
    db_user = get_user(db, user_id)
    if not db_user:
        return None
    for key, value in user_update.model_dump(exclude_unset=True).items():
        setattr(db_user, key, value)
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int):
    db_user = get_user(db, user_id)
    if not db_user:
        return None
    db.delete(db_user)
    db.commit()
    return db_user

# ==================== REGION CRUD ====================
def get_region(db: Session, region_id: int):
    return db.query(models.Region).filter(models.Region.id == region_id).first()

def get_region_by_name(db: Session, name: str):
    return db.query(models.Region).filter(models.Region.name == name).first()

def get_regions(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Region).offset(skip).limit(limit).all()

def create_region(db: Session, region: schemas.RegionCreate):
    db_region = models.Region(
        name=region.name,
        coords=region.coords,
        shields=region.shields,
        temp=region.temp,
        energy=region.energy,
        population=region.population,
        threat_level=region.threat_level
    )
    db.add(db_region)
    db.commit()
    db.refresh(db_region)
    return db_region

def update_region(db: Session, region_id: int, region_update: schemas.RegionUpdate):
    db_region = get_region(db, region_id)
    if not db_region:
        return None
    for key, value in region_update.model_dump(exclude_unset=True).items():
        setattr(db_region, key, value)
    db.commit()
    db.refresh(db_region)
    return db_region

def delete_region(db: Session, region_id: int):
    db_region = get_region(db, region_id)
    if not db_region:
        return None
    db.delete(db_region)
    db.commit()
    return db_region

# ==================== ASSET CRUD ====================
def get_asset(db: Session, asset_id: str):
    return db.query(models.Asset).filter(models.Asset.id == asset_id).first()

def get_assets(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Asset).offset(skip).limit(limit).all()

def create_asset(db: Session, asset: schemas.AssetCreate):
    db_asset = models.Asset(
        id=asset.id,
        name=asset.name,
        type=asset.type,
        region_id=asset.region_id,
        health=asset.health,
        status=asset.status,
        uptime=asset.uptime
    )
    db.add(db_asset)
    db.commit()
    db.refresh(db_asset)
    return db_asset

def update_asset(db: Session, asset_id: str, asset_update: schemas.AssetUpdate):
    db_asset = get_asset(db, asset_id)
    if not db_asset:
        return None
    for key, value in asset_update.model_dump(exclude_unset=True).items():
        setattr(db_asset, key, value)
    db.commit()
    db.refresh(db_asset)
    return db_asset

def delete_asset(db: Session, asset_id: str):
    db_asset = get_asset(db, asset_id)
    if not db_asset:
        return None
    db.delete(db_asset)
    db.commit()
    return db_asset

# ==================== SIMULATION JOBS CRUD ====================
def get_simulation_job(db: Session, job_id: int):
    return db.query(models.SimulationJob).filter(models.SimulationJob.id == job_id).first()

def get_simulation_jobs(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.SimulationJob).order_by(models.SimulationJob.timestamp.desc()).offset(skip).limit(limit).all()

def create_simulation_job(db: Session, job: schemas.SimulationJobCreate):
    db_job = models.SimulationJob(
        region=job.region,
        simulation_type=job.simulation_type,
        intensity=job.intensity,
        risk_score=job.risk_score,
        predicted_energy_demand=job.predicted_energy_demand,
        predicted_traffic_load=job.predicted_traffic_load,
        predicted_hospital_load=job.predicted_hospital_load
    )
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

def delete_simulation_job(db: Session, job_id: int):
    db_job = get_simulation_job(db, job_id)
    if not db_job:
        return None
    db.delete(db_job)
    db.commit()
    return db_job
