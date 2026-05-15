package com.property.portal.dto;

import java.util.List;

public record MarketDataResponse(
        List<PropertyData> properties,
        int count,
        String generatedAt
) {
}
