package com.property.portal.controller;

import com.property.portal.dto.*;
import com.property.portal.service.MarketDataService;
import com.property.portal.service.MlClientService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(MarketController.class)
class MarketControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private MarketDataService marketDataService;

    @MockitoBean
    private MlClientService mlClientService;

    @Test
    void getMarketDataReturnsProperties() throws Exception {
        PropertyData p1 = new PropertyData(2000, 3, 2, 2010, 5000, 5.0, 8, 420000.0);
        MarketDataResponse response = new MarketDataResponse(List.of(p1), 1, Instant.now().toString());

        when(marketDataService.generateMarketData()).thenReturn(response);

        mockMvc.perform(get("/api/market/data"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.count").value(1))
                .andExpect(jsonPath("$.properties[0].squareFootage").value(2000));
    }

    @Test
    void getMarketStatsReturnsComputedStats() throws Exception {
        PropertyData p1 = new PropertyData(2000, 3, 2, 2010, 5000, 5.0, 8, 420000.0);
        MarketDataResponse data = new MarketDataResponse(List.of(p1), 1, Instant.now().toString());
        MarketStatsResponse stats = new MarketStatsResponse(420000.0, 420000.0, 1, 210.0);

        when(marketDataService.generateMarketData()).thenReturn(data);
        when(marketDataService.computeStats(any())).thenReturn(stats);

        mockMvc.perform(get("/api/market/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.averagePrice").value(420000.0))
                .andExpect(jsonPath("$.medianPrice").value(420000.0))
                .andExpect(jsonPath("$.count").value(1))
                .andExpect(jsonPath("$.pricePerSqft").value(210.0));
    }

    @Test
    void getModelInfoReturnsCachedInfo() throws Exception {
        ModelInfoResponse info = new ModelInfoResponse(
                List.of("squareFootage", "bedrooms"),
                List.of(16.83, 3726.33),
                439343.32,
                new ModelInfoResponse.Metrics(0.3163, 961416631.56, 21622.95));

        when(mlClientService.getModelInfo()).thenReturn(info);

        mockMvc.perform(get("/api/market/model-info"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.intercept").value(439343.32))
                .andExpect(jsonPath("$.metrics.r2").value(0.3163));
    }

    @Test
    void getWhatIfReturnsPriceCurve() throws Exception {
        WhatIfResponse response = new WhatIfResponse(
                "squareFootage",
                List.of(
                        new WhatIfResponse.WhatIfPoint(1000, 350000.0),
                        new WhatIfResponse.WhatIfPoint(2000, 420000.0)));

        when(marketDataService.runWhatIf("squareFootage", 1000, 2000, 20)).thenReturn(response);

        mockMvc.perform(get("/api/market/whatif")
                        .param("parameter", "squareFootage")
                        .param("startValue", "1000")
                        .param("endValue", "2000"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.parameter").value("squareFootage"))
                .andExpect(jsonPath("$.points").isArray());
    }

    @Test
    void getWhatIfClampsSteps() throws Exception {
        WhatIfResponse response = new WhatIfResponse("squareFootage", List.of());
        when(marketDataService.runWhatIf("squareFootage", 1000, 2000, 20)).thenReturn(response);

        mockMvc.perform(get("/api/market/whatif")
                        .param("parameter", "squareFootage")
                        .param("startValue", "1000")
                        .param("endValue", "2000")
                        .param("steps", "500"))
                .andExpect(status().isOk());
    }

    @Test
    void mlApiExceptionReturnsProblemDetail() throws Exception {
        when(mlClientService.getModelInfo())
                .thenThrow(new MlClientService.MlApiException("ML API unavailable", 503));

        mockMvc.perform(get("/api/market/model-info"))
                .andExpect(status().isServiceUnavailable())
                .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.title").value("ML API Error"));
    }
}
