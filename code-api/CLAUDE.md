# House Price Prediction API — Dev Guide

## Setup
- Python 3.12+ with uv: `uv venv code/.venv && uv pip install -r code/requirements.txt --python code/.venv/Scripts/python.exe`
- All source under `code/` directory

## Quality
- Typecheck: `code/.venv/Scripts/python.exe -m mypy code/app/`
- The project uses native Python 3.12+ type hints (no `typing` imports needed for built-in generics)

## Architecture
- FastAPI app instance lives in `code/app/main.py`
- `code/app/` is the main Python package
- Training script: `python -m app.train` from `code/` directory
- Model artifacts live in `code/app/`: model.joblib (joblib), model_metadata.json
- Metadata format: `{"features": [...], "coefficients": [...], "intercept": N, "metrics": {"r2": N, "mse": N, "mae": N}}`
- Coefficients in model_metadata.json are sorted by absolute value descending

## Docker
- Build from `code/` directory: `docker build -t house-price-api .`
- Run: `docker run -p 8000:8000 house-price-api`
- Model files (model.joblib, model_metadata.json) are baked into the image at build time
- App runs as non-root `appuser`, port 8000

## Gotchas
- Use ASCII (R2) not Unicode (R²) in print strings — Windows GBK encoding will crash
- `pyproject.toml` must have `[tool.mypy] ignore_missing_imports = true` for sklearn/pandas/joblib
