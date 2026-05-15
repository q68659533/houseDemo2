package com.property.portal.dto;

public record MarketStatsResponse(
        double averagePrice,
        double medianPrice,
        int count,
        double pricePerSqft
) {
}
