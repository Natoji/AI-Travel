from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field

from routers.auth import get_current_user
from services.goong_service import (
    GoongError,
    autocomplete,
    direction,
    distance_matrix,
    forward_geocode,
    place_detail,
    reverse_geocode,
)

router = APIRouter(prefix="/maps", tags=["maps"])


class DirectionRequest(BaseModel):
    origin: str = Field(..., description="lat,lng")
    destination: str = Field(..., description="lat,lng")
    vehicle: str = Field(default="car")


class DistanceMatrixRequest(BaseModel):
    origins: str = Field(..., description="lat,lng|lat,lng")
    destinations: str = Field(..., description="lat,lng|lat,lng")
    vehicle: str = Field(default="car")


@router.get("/autocomplete")
def autocomplete_endpoint(
    q: str = Query(..., min_length=1),
    limit: int = Query(default=6, ge=1, le=10),
    current_user=Depends(get_current_user),
):
    try:
        return autocomplete(query=q, limit=limit)
    except GoongError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Goong autocomplete loi: {e}")


@router.get("/geocode")
def geocode_endpoint(
    address: str = Query(..., min_length=2),
    current_user=Depends(get_current_user),
):
    try:
        return forward_geocode(address=address)
    except GoongError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Goong geocode loi: {e}")


@router.get("/reverse-geocode")
def reverse_geocode_endpoint(
    lat: float = Query(...),
    lng: float = Query(...),
    current_user=Depends(get_current_user),
):
    try:
        return reverse_geocode(lat=lat, lng=lng)
    except GoongError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Goong reverse geocode loi: {e}")


@router.get("/place-detail")
def place_detail_endpoint(
    place_id: str = Query(..., min_length=4),
    current_user=Depends(get_current_user),
):
    try:
        return place_detail(place_id=place_id)
    except GoongError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Goong place detail loi: {e}")


@router.post("/direction")
def direction_endpoint(
    req: DirectionRequest,
    current_user=Depends(get_current_user),
):
    try:
        return direction(origin=req.origin, destination=req.destination, vehicle=req.vehicle)
    except GoongError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Goong direction loi: {e}")


@router.post("/distance-matrix")
def distance_matrix_endpoint(
    req: DistanceMatrixRequest,
    current_user=Depends(get_current_user),
):
    try:
        return distance_matrix(
            origins=req.origins,
            destinations=req.destinations,
            vehicle=req.vehicle,
        )
    except GoongError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Goong distance matrix loi: {e}")
