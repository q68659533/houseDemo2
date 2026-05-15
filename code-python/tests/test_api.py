from typing import Any
from unittest.mock import AsyncMock

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app, get_ml_client
from app.ml_client import MLClient, MLClientError
from app.models import ModelMetadata, ModelMetrics


SAMPLE_FEATURES = {
    "square_footage": 2000,
    "bedrooms": 3,
    "bathrooms": 2,
    "year_built": 2010,
    "lot_size": 5000,
    "distance_to_city_center": 5.0,
    "school_rating": 8,
}


SAMPLE_METADATA = ModelMetadata(
    features=[
        "bathrooms",
        "bedrooms",
        "school_rating",
        "distance_to_city_center",
        "year_built",
        "square_footage",
        "lot_size",
    ],
    coefficients=[
        4313.78,
        3726.33,
        1852.55,
        -939.82,
        -40.63,
        16.83,
        0.40,
    ],
    intercept=439343.32,
    metrics=ModelMetrics(r2=0.3163, mse=961416631.56, mae=21622.95),
)


class FakeMLClient:
    def __init__(
        self,
        predict_value: float = 423_250.82,
        predict_error: Exception | None = None,
        metadata_error: Exception | None = None,
    ) -> None:
        self.predict_value = predict_value
        self.predict_error = predict_error
        self.metadata_error = metadata_error
        self.predict_mock = AsyncMock()
        self.metadata_mock = AsyncMock()

    async def predict(self, features: Any) -> float:
        await self.predict_mock(features)
        if self.predict_error is not None:
            raise self.predict_error
        return self.predict_value

    async def model_info(self) -> ModelMetadata:
        await self.metadata_mock()
        if self.metadata_error is not None:
            raise self.metadata_error
        return SAMPLE_METADATA


@pytest.fixture
def fake_client() -> FakeMLClient:
    return FakeMLClient()


@pytest.fixture
def client(fake_client: FakeMLClient) -> AsyncClient:
    app.dependency_overrides[get_ml_client] = lambda: fake_client
    transport = ASGITransport(app=app)
    test_client = AsyncClient(transport=transport, base_url="http://testserver")

    yield test_client

    app.dependency_overrides.clear()


async def test_health_returns_ok(client: AsyncClient) -> None:
    async with client:
        response = await client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


async def test_estimate_returns_prediction_and_metadata(
    client: AsyncClient, fake_client: FakeMLClient
) -> None:
    async with client:
        response = await client.post("/api/estimate", json=SAMPLE_FEATURES)

    assert response.status_code == 200
    body = response.json()
    assert body["prediction"] == pytest.approx(423_250.82)
    assert body["features"]["square_footage"] == 2000
    assert body["model"]["intercept"] == pytest.approx(439343.32)
    assert body["model"]["metrics"]["r2"] == pytest.approx(0.3163)
    assert body["generated_at"]
    fake_client.predict_mock.assert_awaited_once()
    fake_client.metadata_mock.assert_awaited_once()


@pytest.mark.parametrize(
    "field,bad_value",
    [
        ("square_footage", 50),  # below ge=100
        ("square_footage", 60_000),  # above le=50000
        ("bedrooms", -1),
        ("bedrooms", 25),
        ("bathrooms", -1),
        ("bathrooms", 25),
        ("year_built", 1700),
        ("year_built", 2200),
        ("lot_size", -1),
        ("distance_to_city_center", -1),
        ("distance_to_city_center", 250),
        ("school_rating", 0),
        ("school_rating", 11),
    ],
)
async def test_estimate_returns_422_on_invalid_input(
    client: AsyncClient, field: str, bad_value: float
) -> None:
    payload: dict[str, Any] = {**SAMPLE_FEATURES, field: bad_value}
    async with client:
        response = await client.post("/api/estimate", json=payload)
    assert response.status_code == 422
    locations = [".".join(str(loc) for loc in err["loc"]) for err in response.json()["detail"]]
    assert any(field in loc for loc in locations)


async def test_estimate_rejects_extra_fields(client: AsyncClient) -> None:
    payload: dict[str, Any] = {**SAMPLE_FEATURES, "unexpected_field": 1}
    async with client:
        response = await client.post("/api/estimate", json=payload)
    assert response.status_code == 422


async def test_estimate_returns_503_when_ml_api_down() -> None:
    fake = FakeMLClient(predict_error=MLClientError("connection refused"))
    app.dependency_overrides[get_ml_client] = lambda: fake
    try:
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://testserver") as client:
            response = await client.post("/api/estimate", json=SAMPLE_FEATURES)
        assert response.status_code == 503
        body = response.json()
        assert "ML model service unavailable" in body["detail"]
    finally:
        app.dependency_overrides.clear()


async def test_model_info_endpoint(client: AsyncClient, fake_client: FakeMLClient) -> None:
    async with client:
        response = await client.get("/api/model-info")
    assert response.status_code == 200
    body = response.json()
    assert body["intercept"] == pytest.approx(439343.32)
    assert body["metrics"]["r2"] == pytest.approx(0.3163)
    fake_client.metadata_mock.assert_awaited_once()


async def test_cors_headers_allow_frontend_origin() -> None:
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
        response = await client.options(
            "/api/estimate",
            headers={
                "Origin": "http://localhost:3000",
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "content-type",
            },
        )
    assert response.status_code in (200, 204)
    assert response.headers.get("access-control-allow-origin") == "http://localhost:3000"
