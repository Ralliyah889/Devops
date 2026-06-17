from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

# ==================== USER SCHEMAS ====================
class UserBase(BaseModel):
    username: str
    email: EmailStr
    role: Optional[str] = "User"
    is_active: Optional[bool] = True

class UserCreate(UserBase):
    pass

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None

class User(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# ==================== REGION SCHEMAS ====================
class RegionBase(BaseModel):
    name: str
    coords: str
    shields: Optional[int] = Field(100, ge=0, le=100)
    temp: Optional[int] = -50  # support sub-zero temps
    energy: Optional[int] = 0
    population: Optional[float] = 0.0
    threat_level: Optional[str] = "STABLE"

class RegionCreate(RegionBase):
    pass

class RegionUpdate(BaseModel):
    name: Optional[str] = None
    coords: Optional[str] = None
    shields: Optional[int] = None
    temp: Optional[int] = None
    energy: Optional[int] = None
    population: Optional[float] = None
    threat_level: Optional[str] = None

class Region(RegionBase):
    id: int

    class Config:
        from_attributes = True

# ==================== ASSET SCHEMAS ====================
class AssetBase(BaseModel):
    id: str
    name: str
    type: str  # Energy, Defense, Climate, Compute
    region_id: str
    health: Optional[int] = Field(100, ge=0, le=100)
    status: Optional[str] = "ONLINE"
    uptime: Optional[str] = "100.00%"

class AssetCreate(AssetBase):
    pass

class AssetUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    region_id: Optional[str] = None
    health: Optional[int] = None
    status: Optional[str] = None
    uptime: Optional[str] = None

class Asset(AssetBase):
    class Config:
        from_attributes = True

# ==================== SIMULATION JOB SCHEMAS ====================
class SimulationJobBase(BaseModel):
    region: str
    simulation_type: str
    intensity: float = Field(..., ge=0.0, le=1.0)
    risk_score: float
    predicted_energy_demand: float
    predicted_traffic_load: float
    predicted_hospital_load: float

class SimulationJobCreate(SimulationJobBase):
    pass

class SimulationJob(SimulationJobBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True

# ==================== INTERACTIVE SIMULATE ENDPOINT ====================
class SimulationInput(BaseModel):
    region: str
    simulation_type: str  # e.g., SOLAR_FLARE, CYBER_ATTACK, GEOTHERMAL, PANDEMIC
    intensity: float = Field(..., ge=0.0, le=1.0)

class SimulationOutput(BaseModel):
    risk_score: float
    predicted_energy_demand: float
    predicted_traffic_load: float
    predicted_hospital_load: float
