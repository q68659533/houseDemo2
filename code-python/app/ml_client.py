from typing import Any

import httpx

from app.models import ModelMetadata, PropertyFeatures


class MLClientError(Exception):
    """Raised when the upstream ML API is unreachable or returns an unexpected response."""


class MLClient:
    def __init__(self, base_url: str, timeout: float) -> None:
        self._base_url = base_url.rstrip("/")
        self._timeout = timeout

    async def predict(self, features: PropertyFeatures) -> float:
        try:
            async with httpx.AsyncClient(timeout=self._timeout) as client:
                response = await client.post(
                    f"{self._base_url}/predict",
                    json=features.model_dump(),
                )
        except httpx.HTTPError as exc:
            raise MLClientError(f"ML API request failed: {exc}") from exc

        if response.status_code >= 500:
            raise MLClientError(
                f"ML API returned {response.status_code}: {response.text}"
            )
        if response.status_code != 200:
            raise MLClientError(
                f"ML API returned unexpected status {response.status_code}: {response.text}"
            )

        payload: dict[str, Any] = response.json()
        prediction = payload.get("prediction")
        if prediction is None or not isinstance(prediction, (int, float)):
            raise MLClientError(f"ML API response missing valid 'prediction': {payload}")
        return float(prediction)

    async def model_info(self) -> ModelMetadata:
        try:
            async with httpx.AsyncClient(timeout=self._timeout) as client:
                response = await client.get(f"{self._base_url}/model-info")
        except httpx.HTTPError as exc:
            raise MLClientError(f"ML API model-info request failed: {exc}") from exc

        if response.status_code != 200:
            raise MLClientError(
                f"ML API model-info returned status {response.status_code}: {response.text}"
            )

        return ModelMetadata.model_validate(response.json())
