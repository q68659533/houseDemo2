import json
from pathlib import Path

import joblib
import pandas as pd
from typing import Union

from fastapi import Body, FastAPI
from pydantic import BaseModel

_METADATA_PATH = Path(__file__).parent / "model_metadata.json"
_MODEL_PATH = Path(__file__).parent / "model.joblib"

_FEATURE_ORDER = [
    "square_footage", "bedrooms", "bathrooms",
    "year_built", "lot_size", "distance_to_city_center", "school_rating"
]


class HouseFeatures(BaseModel):
    model_config = {"extra": "ignore"}
    square_footage: float
    bedrooms: int
    bathrooms: int
    year_built: int
    lot_size: float
    distance_to_city_center: float
    school_rating: int


class HouseBatch(BaseModel):
    houses: list[HouseFeatures]


def _load_metadata() -> dict:
    with open(_METADATA_PATH) as f:
        return json.load(f)


app = FastAPI(title="House Price Prediction API", version="0.1.0")
model_metadata: dict = _load_metadata()
model = joblib.load(_MODEL_PATH)


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.get("/model-info")
def model_info() -> dict:
    return model_metadata


@app.post("/predict")
def predict(body: Union[HouseBatch, HouseFeatures] = Body(...)):
    if isinstance(body, HouseBatch):
        features_list = [[getattr(h, f) for f in _FEATURE_ORDER] for h in body.houses]
        X = pd.DataFrame(features_list, columns=_FEATURE_ORDER)
        return {"predictions": model.predict(X).tolist()}
    else:
        X = pd.DataFrame([[getattr(body, f) for f in _FEATURE_ORDER]], columns=_FEATURE_ORDER)
        return {"prediction": float(model.predict(X)[0])}
