from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas, database

router = APIRouter(
    prefix="/regions",
    tags=["Regions"],
)

@router.post("/", response_model=schemas.Region, status_code=status.HTTP_201_CREATED)
def create_region(region: schemas.RegionCreate, db: Session = Depends(database.get_db)):
    db_region = crud.get_region_by_name(db, name=region.name)
    if db_region:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Region name already exists"
        )
    return crud.create_region(db=db, region=region)

@router.get("/", response_model=List[schemas.Region])
def read_regions(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    return crud.get_regions(db, skip=skip, limit=limit)

@router.get("/{region_id}", response_model=schemas.Region)
def read_region(region_id: int, db: Session = Depends(database.get_db)):
    db_region = crud.get_region(db, region_id=region_id)
    if db_region is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Region not found"
        )
    return db_region

@router.put("/{region_id}", response_model=schemas.Region)
def update_region(region_id: int, region: schemas.RegionUpdate, db: Session = Depends(database.get_db)):
    db_region = crud.update_region(db, region_id=region_id, region_update=region)
    if db_region is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Region not found"
        )
    return db_region

@router.delete("/{region_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_region(region_id: int, db: Session = Depends(database.get_db)):
    db_region = crud.delete_region(db, region_id=region_id)
    if db_region is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Region not found"
        )
    return None
