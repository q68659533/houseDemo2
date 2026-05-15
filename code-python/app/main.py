from contextlib import asynccontextmanager
from datetime import datetime, timezone
from typing import AsyncIterator

from fastapi import Depends, FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import Settings, get_settings
from app.ml_client import MLClient, MLClientError
from app.models import EstimateResponse, ModelMetadata, PropertyFeatures


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    settings = get_settings()
    app.state.ml_client = MLClient(
        base_url=settings.ml_api_url,
        timeout=settings.ml_api_timeout,
    )
    yield


app = FastAPI(
    title="Property Estimator API",
    version="0.1.0",
    description="Validates property inputs and proxies predictions to the ML model API.",
    lifespan=lifespan,
)


def _configure_cors(app: FastAPI, settings: Settings) -> None:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_credentials=True,
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=["*"],
    )


_configure_cors(app, get_settings())


def get_ml_client(request: Request) -> MLClient:
    client = getattr(request.app.state, "ml_client", None)
    if client is None:
        settings = get_settings()
        client = MLClient(base_url=settings.ml_api_url, timeout=settings.ml_api_timeout)
        request.app.state.ml_client = client
    return client


@app.exception_handler(MLClientError)
async def ml_client_error_handler(request: Request, exc: MLClientError) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={
            "detail": "ML model service unavailable",
            "error": str(exc),
        },
    )


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "healthy"}


@app.get("/api/model-info", response_model=ModelMetadata)
async def model_info(
    ml_client: MLClient = Depends(get_ml_client),
) -> ModelMetadata:
    return await ml_client.model_info()


@app.post(
    "/api/estimate",
    response_model=EstimateResponse,
    responses={
        422: {"description": "Validation failure"},
        503: {"description": "ML model service unavailable"},
    },
)
async def estimate(
    features: PropertyFeatures,
    ml_client: MLClient = Depends(get_ml_client),
) -> EstimateResponse:
    prediction = await ml_client.predict(features)
    metadata = await ml_client.model_info()
    if prediction < 0:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="ML model returned a non-positive prediction",
        )
    return EstimateResponse(
        prediction=prediction,
        features=features,
        model=metadata,
        generated_at=datetime.now(timezone.utc),
    )
