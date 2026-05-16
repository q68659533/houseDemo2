from pathlib import Path
import json

import joblib
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
from sklearn.model_selection import train_test_split

CSV_PATH = Path(__file__).parent.parent / "House Price Dataset.csv"
MODEL_PATH = Path(__file__).parent / "model.joblib"
METADATA_PATH = Path(__file__).parent / "model_metadata.json"

FEATURES = [
    "square_footage", "bedrooms", "bathrooms",
    "year_built", "lot_size", "distance_to_city_center", "school_rating"
]
TARGET = "price"


def main() -> None:
    df = pd.read_csv(CSV_PATH)
    X = df[FEATURES]
    y = df[TARGET]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = LinearRegression()
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    r2_val = float(r2_score(y_test, y_pred))
    mse_val = float(mean_squared_error(y_test, y_pred))
    mae_val = float(mean_absolute_error(y_test, y_pred))

    joblib.dump(model, MODEL_PATH)

    coef_pairs = list(zip(FEATURES, model.coef_))
    coef_pairs.sort(key=lambda x: abs(x[1]), reverse=True)
    sorted_features = [p[0] for p in coef_pairs]
    sorted_coefficients = [float(p[1]) for p in coef_pairs]

    metadata: dict[str, object] = {
        "features": sorted_features,
        "coefficients": sorted_coefficients,
        "intercept": float(model.intercept_),
        "metrics": {
            "r2": r2_val,
            "mse": mse_val,
            "mae": mae_val
        }
    }

    METADATA_PATH.write_text(json.dumps(metadata, indent=2))

    print(f"Model saved to {MODEL_PATH}")
    print(f"Metadata saved to {METADATA_PATH}")
    print(f"R2: {r2_val:.4f}, MSE: {mse_val:.2f}, MAE: {mae_val:.2f}")


if __name__ == "__main__":
    main()
