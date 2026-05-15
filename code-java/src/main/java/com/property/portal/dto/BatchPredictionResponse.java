package com.property.portal.dto;

import java.util.List;

public record BatchPredictionResponse(List<Double> predictions) {
}
