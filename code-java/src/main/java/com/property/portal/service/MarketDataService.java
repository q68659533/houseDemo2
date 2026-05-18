package com.property.portal.service;

import com.property.portal.dto.*;
import com.property.portal.entity.Property;
import com.property.portal.mapper.PropertyMapper;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
public class MarketDataService {

    private final MlClientService mlClientService;
    private final PropertyMapper propertyMapper;

    public MarketDataService(MlClientService mlClientService, PropertyMapper propertyMapper) {
        this.mlClientService = mlClientService;
        this.propertyMapper = propertyMapper;
    }

    public MarketDataResponse generateMarketData() {
        List<Property> dbProperties = propertyMapper.selectList(null);

        if (dbProperties == null || dbProperties.isEmpty()) {
            return new MarketDataResponse(new ArrayList<>(), 0, Instant.now().toString());
        }

        List<BatchPredictionRequest.PropertyInput> inputs = dbProperties.stream()
                .map(p -> new BatchPredictionRequest.PropertyInput(
                        p.getSquareFootage(), p.getBedrooms(), p.getBathrooms(),
                        p.getYearBuilt(), p.getLotSize(), p.getDistanceToCityCenter(), p.getSchoolRating()))
                .toList();

        BatchPredictionResponse predictionResponse = mlClientService.batchPredict(new BatchPredictionRequest(inputs));
        List<Double> predictions = predictionResponse.predictions();

        List<PropertyData> withPrices = new ArrayList<>();
        for (int i = 0; i < dbProperties.size(); i++) {
            Property p = dbProperties.get(i);
            withPrices.add(new PropertyData(
                    p.getSquareFootage(), p.getBedrooms(), p.getBathrooms(),
                    p.getYearBuilt(), p.getLotSize(), p.getDistanceToCityCenter(), p.getSchoolRating(),
                    predictions.get(i)));
        }

        return new MarketDataResponse(withPrices, withPrices.size(), Instant.now().toString());
    }

    public MarketStatsResponse generateMarketStats() {
        List<Property> dbProperties = propertyMapper.selectList(null);

        if (dbProperties == null || dbProperties.isEmpty()) {
            return new MarketStatsResponse(0, 0, 0, 0);
        }

        List<BatchPredictionRequest.PropertyInput> inputs = dbProperties.stream()
                .map(p -> new BatchPredictionRequest.PropertyInput(
                        p.getSquareFootage(), p.getBedrooms(), p.getBathrooms(),
                        p.getYearBuilt(), p.getLotSize(), p.getDistanceToCityCenter(), p.getSchoolRating()))
                .toList();

        BatchPredictionResponse predictionResponse = mlClientService.batchPredict(new BatchPredictionRequest(inputs));
        List<Double> predictions = predictionResponse.predictions();

        List<PropertyData> withPrices = new ArrayList<>();
        for (int i = 0; i < dbProperties.size(); i++) {
            Property p = dbProperties.get(i);
            withPrices.add(new PropertyData(
                    p.getSquareFootage(), p.getBedrooms(), p.getBathrooms(),
                    p.getYearBuilt(), p.getLotSize(), p.getDistanceToCityCenter(), p.getSchoolRating(),
                    predictions.get(i)));
        }

        return computeStats(withPrices);
    }

    public MarketStatsResponse computeStats(List<PropertyData> properties) {
        if (properties == null || properties.isEmpty()) {
            return new MarketStatsResponse(0, 0, 0, 0);
        }

        List<Double> prices = properties.stream()
                .map(PropertyData::predictedPrice)
                .filter(p -> p != null)
                .sorted()
                .toList();

        if (prices.isEmpty()) {
            return new MarketStatsResponse(0, 0, 0, 0);
        }

        double avgPrice = prices.stream().mapToDouble(Double::doubleValue).average().orElse(0);

        double medianPrice;
        int size = prices.size();
        if (size % 2 == 0) {
            medianPrice = (prices.get(size / 2 - 1) + prices.get(size / 2)) / 2.0;
        } else {
            medianPrice = prices.get(size / 2);
        }

        double totalSqft = properties.stream().mapToDouble(PropertyData::squareFootage).sum();
        double pricePerSqft = totalSqft > 0
                ? prices.stream().mapToDouble(Double::doubleValue).sum() / totalSqft
                : 0;

        return new MarketStatsResponse(avgPrice, medianPrice, prices.size(), pricePerSqft);
    }

    public WhatIfResponse runWhatIf(String parameter, double startValue, double endValue, int steps) {
        List<BatchPredictionRequest.PropertyInput> inputs = new ArrayList<>();
        List<Double> parameterValues = new ArrayList<>();

        double stepSize = (endValue - startValue) / Math.max(steps - 1, 1);
        for (int i = 0; i < steps; i++) {
            double value = startValue + stepSize * i;
            parameterValues.add(value);
            inputs.add(buildWhatIfInput(parameter, value));
        }

        BatchPredictionResponse response = mlClientService.batchPredict(new BatchPredictionRequest(inputs));
        List<Double> predictions = response.predictions();

        List<WhatIfResponse.WhatIfPoint> points = new ArrayList<>();
        for (int i = 0; i < predictions.size(); i++) {
            points.add(new WhatIfResponse.WhatIfPoint(parameterValues.get(i), predictions.get(i)));
        }

        return new WhatIfResponse(parameter, points);
    }

    private BatchPredictionRequest.PropertyInput buildWhatIfInput(String parameter, double value) {
        double squareFootage = 2000;
        int bedrooms = 3;
        int bathrooms = 2;
        int yearBuilt = 2010;
        double lotSize = 5000;
        double distance = 5.0;
        int schoolRating = 7;

        switch (parameter) {
            case "squareFootage" -> squareFootage = value;
            case "bedrooms" -> bedrooms = (int) value;
            case "bathrooms" -> bathrooms = (int) value;
            case "yearBuilt" -> yearBuilt = (int) value;
            case "lotSize" -> lotSize = value;
            case "distanceToCityCenter" -> distance = value;
            case "schoolRating" -> schoolRating = (int) value;
        }

        return new BatchPredictionRequest.PropertyInput(
                squareFootage, bedrooms, bathrooms, yearBuilt, lotSize, distance, schoolRating);
    }
}
