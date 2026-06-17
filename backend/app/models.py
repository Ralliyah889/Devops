from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    role = Column(String, default="User")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Region(Base):
    __tablename__ = "regions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, unique=True, index=True, nullable=False)
    coords = Column(String, nullable=False)
    shields = Column(Integer, default=100)
    temp = Column(Integer, default=25)
    energy = Column(Integer, default=500)
    population = Column(Float, default=0.0)
    threat_level = Column(String, default="STABLE")

class Asset(Base):
    __tablename__ = "assets"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    type = Column(String, nullable=False)  # Energy, Defense, Climate, Compute
    region_id = Column(String, nullable=False)  # Maps to Region name/coords string representation
    health = Column(Integer, default=100)
    status = Column(String, default="ONLINE")
    uptime = Column(String, default="100.00%")

class SimulationJob(Base):
    __tablename__ = "simulation_jobs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    region = Column(String, nullable=False)
    simulation_type = Column(String, nullable=False)
    intensity = Column(Float, nullable=False)
    risk_score = Column(Float, nullable=False)
    predicted_energy_demand = Column(Float, nullable=False)
    predicted_traffic_load = Column(Float, nullable=False)
    predicted_hospital_load = Column(Float, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
