package com.property.portal.dto;

import java.util.List;

public record BatchPredictionRequest(List<PropertyInput> houses) {
    public record PropertyInput(
            double squareFootage,
            int bedrooms,
            int bathrooms,
            int yearBuilt,
            double lotSize,
            double distanceToCityCenter,
            int schoolRating
    ) {
    }
}
