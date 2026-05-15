package com.property.portal.dto;

public record PropertyData(
        double squareFootage,
        int bedrooms,
        int bathrooms,
        int yearBuilt,
        double lotSize,
        double distanceToCityCenter,
        int schoolRating,
        Double predictedPrice
) {
}
