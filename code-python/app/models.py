from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class PropertyFeatures(BaseModel):
    model_config = ConfigDict(extra="forbid")

    square_footage: float = Field(
        ...,
        ge=100,
        le=50_000,
        description="Property living area in square feet (100 - 50000)",
    )
    bedrooms: int = Field(
        ...,
        ge=0,
        le=20,
        description="Number of bedrooms (0 - 20)",
    )
    bathrooms: int = Field(
        ...,
        ge=0,
        le=20,
        description="Number of bathrooms (0 - 20)",
    )
    year_built: int = Field(
        ...,
        ge=1800,
        le=2100,
        description="Year built (1800 - 2100)",
    )
    lot_size: float = Field(
        ...,
        ge=0,
        le=1_000_000,
        description="Lot size in square feet (0 - 1000000)",
    )
    distance_to_city_center: float = Field(
        ...,
        ge=0,
        le=200,
        description="Distance to city center in miles (0 - 200)",
    )
    school_rating: int = Field(
        ...,
        ge=1,
        le=10,
        description="School rating (1 - 10)",
    )


class ModelMetrics(BaseModel):
    r2: float
    mse: float
    mae: float


class ModelMetadata(BaseModel):
    features: list[str]
    coefficients: list[float]
    intercept: float
    metrics: ModelMetrics


class EstimateResponse(BaseModel):
    prediction: float = Field(..., description="Predicted price in USD")
    features: PropertyFeatures = Field(..., description="Echoed input features")
    model: ModelMetadata = Field(..., description="Model coefficients and metrics")
    generated_at: datetime = Field(..., description="ISO timestamp of prediction")
