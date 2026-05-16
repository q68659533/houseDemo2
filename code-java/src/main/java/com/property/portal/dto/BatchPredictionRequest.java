package com.property.portal.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record BatchPredictionRequest(List<PropertyInput> houses) {
    public record PropertyInput(
            @JsonProperty("square_footage") double squareFootage,
            @JsonProperty("bedrooms") int bedrooms,
            @JsonProperty("bathrooms") int bathrooms,
            @JsonProperty("year_built") int yearBuilt,
            @JsonProperty("lot_size") double lotSize,
            @JsonProperty("distance_to_city_center") double distanceToCityCenter,
            @JsonProperty("school_rating") int schoolRating
    ) {
    }
}
