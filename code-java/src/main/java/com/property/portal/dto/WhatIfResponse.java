package com.property.portal.dto;

import java.util.List;

public record WhatIfResponse(
        String parameter,
        List<WhatIfPoint> points
) {
    public record WhatIfPoint(double parameterValue, double predictedPrice) {
    }
}
