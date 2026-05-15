package com.property.portal.dto;

import java.util.List;

public record ModelInfoResponse(
        List<String> features,
        List<Double> coefficients,
        double intercept,
        Metrics metrics
) {
    public record Metrics(double r2, double mse, double mae) {
    }
}
