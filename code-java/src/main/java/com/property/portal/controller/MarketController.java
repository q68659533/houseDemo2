package com.property.portal.controller;

import com.property.portal.dto.*;
import com.property.portal.service.MarketDataService;
import com.property.portal.service.MlClientService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/market")
@CrossOrigin(origins = "${cors.allowed-origins}")
public class MarketController {

    private final MarketDataService marketDataService;
    private final MlClientService mlClientService;

    public MarketController(MarketDataService marketDataService, MlClientService mlClientService) {
        this.marketDataService = marketDataService;
        this.mlClientService = mlClientService;
    }

    @GetMapping("/data")
    public ResponseEntity<MarketDataResponse> getMarketData() {
        MarketDataResponse data = marketDataService.generateMarketData();
        return ResponseEntity.ok(data);
    }

    @GetMapping("/stats")
    public ResponseEntity<MarketStatsResponse> getMarketStats(
            @RequestParam(required = false) List<PropertyData> properties) {
        if (properties == null) {
            MarketDataResponse data = marketDataService.generateMarketData();
            properties = data.properties();
        }
        MarketStatsResponse stats = marketDataService.computeStats(properties);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/model-info")
    public ResponseEntity<ModelInfoResponse> getModelInfo() {
        ModelInfoResponse info = mlClientService.getModelInfo();
        return ResponseEntity.ok(info);
    }

    @GetMapping("/whatif")
    public ResponseEntity<WhatIfResponse> getWhatIf(
            @RequestParam String parameter,
            @RequestParam double startValue,
            @RequestParam double endValue,
            @RequestParam(defaultValue = "20") int steps) {
        if (steps < 2 || steps > 100) {
            steps = 20;
        }
        WhatIfResponse response = marketDataService.runWhatIf(parameter, startValue, endValue, steps);
        return ResponseEntity.ok(response);
    }
}
