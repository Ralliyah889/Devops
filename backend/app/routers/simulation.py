from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import random
from .. import crud, schemas, database

router = APIRouter(
    tags=["Simulations & Projection Engine"],
)

# POST /simulate
@router.post("/simulate", response_model=schemas.SimulationOutput, status_code=status.HTTP_201_CREATED)
def run_simulation(sim_input: schemas.SimulationInput, db: Session = Depends(database.get_db)):
    # 1. Calculation logic for projection outputs
    intensity = sim_input.intensity
    sim_type = sim_input.simulation_type.upper()
    
    # Add random fluctuation factor
    noise = random.uniform(-2.0, 2.0)
    
    if sim_type == "SOLAR_FLARE":
        risk_score = min(100.0, max(0.0, (intensity * 85.0) + noise))
        energy_demand = max(100.0, 1200.0 + (intensity * 800.0) + (noise * 10))
        traffic_load = max(0.0, 30.0 + (intensity * 15.0) + noise)
        hospital_load = max(0.0, 20.0 + (intensity * 40.0) + (noise * 2))
    elif sim_type == "CYBER_ATTACK":
        risk_score = min(100.0, max(0.0, (intensity * 95.0) + noise))
        energy_demand = max(100.0, 800.0 - (intensity * 300.0) + (noise * 5))
        traffic_load = max(0.0, 45.0 + (intensity * 50.0) + (noise * 4))
        hospital_load = max(0.0, 15.0 + (intensity * 45.0) + (noise * 3))
    elif sim_type == "GEOTHERMAL":
        risk_score = min(100.0, max(0.0, (intensity * 75.0) + noise))
        energy_demand = max(100.0, 600.0 + (intensity * 400.0) + (noise * 8))
        traffic_load = max(0.0, 40.0 + (intensity * 35.0) + noise)
        hospital_load = max(0.0, 10.0 + (intensity * 80.0) + (noise * 5))
    else:
        # Generic Scenario
        risk_score = min(100.0, max(0.0, (intensity * 50.0) + noise))
        energy_demand = max(100.0, 500.0 + (intensity * 300.0) + (noise * 5))
        traffic_load = max(0.0, 40.0 + (intensity * 20.0) + noise)
        hospital_load = max(0.0, 10.0 + (intensity * 25.0) + noise)

    # Round outputs for high-fidelity values
    risk_score = round(risk_score, 2)
    energy_demand = round(energy_demand, 2)
    traffic_load = round(traffic_load, 2)
    hospital_load = round(hospital_load, 2)

    # 2. Record this run in the Simulation Jobs table
    job_create = schemas.SimulationJobCreate(
        region=sim_input.region,
        simulation_type=sim_input.simulation_type,
        intensity=intensity,
        risk_score=risk_score,
        predicted_energy_demand=energy_demand,
        predicted_traffic_load=traffic_load,
        predicted_hospital_load=hospital_load
    )
    crud.create_simulation_job(db=db, job=job_create)

    # 3. Return the calculated values
    return schemas.SimulationOutput(
        risk_score=risk_score,
        predicted_energy_demand=energy_demand,
        predicted_traffic_load=traffic_load,
        predicted_hospital_load=hospital_load
    )

# CRUD GET /simulation/jobs
@router.get("/simulation/jobs", response_model=List[schemas.SimulationJob])
def read_simulation_jobs(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    return crud.get_simulation_jobs(db, skip=skip, limit=limit)

# CRUD GET /simulation/jobs/{job_id}
@router.get("/simulation/jobs/{job_id}", response_model=schemas.SimulationJob)
def read_simulation_job(job_id: int, db: Session = Depends(database.get_db)):
    db_job = crud.get_simulation_job(db, job_id=job_id)
    if db_job is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Simulation job not found"
        )
    return db_job

# CRUD DELETE /simulation/jobs/{job_id}
@router.delete("/simulation/jobs/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_simulation_job(job_id: int, db: Session = Depends(database.get_db)):
    db_job = crud.delete_simulation_job(db, job_id=job_id)
    if db_job is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Simulation job not found"
        )
    return None
