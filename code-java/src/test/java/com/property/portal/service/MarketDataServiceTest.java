package com.property.portal.service;

import com.property.portal.dto.*;
import com.property.portal.entity.Property;
import com.property.portal.mapper.PropertyMapper;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class MarketDataServiceTest {

    private final MlClientService mlClientService = mock(MlClientService.class);
    private final PropertyMapper propertyMapper = mock(PropertyMapper.class);
    private final MarketDataService service = new MarketDataService(mlClientService, propertyMapper);

    @Test
    void generateMarketDataReturnsEmptyWhenDbIsEmpty() {
        when(propertyMapper.selectList(null)).thenReturn(List.of());

        MarketDataResponse response = service.generateMarketData();

        assertEquals(0, response.count());
        assertTrue(response.properties().isEmpty());
    }

    @Test
    void generateMarketDataQueriesDbAndPredicts() {
        Property p1 = new Property();
        p1.setSquareFootage(2000.0);
        p1.setBedrooms(3);
        p1.setBathrooms(2);
        p1.setYearBuilt(2010);
        p1.setLotSize(5000.0);
        p1.setDistanceToCityCenter(5.0);
        p1.setSchoolRating(8);

        when(propertyMapper.selectList(null)).thenReturn(List.of(p1));
        when(mlClientService.batchPredict(any())).thenReturn(
                new BatchPredictionResponse(List.of(420000.0)));

        MarketDataResponse response = service.generateMarketData();

        assertEquals(1, response.count());
        assertEquals(2000.0, response.properties().get(0).squareFootage());
        assertEquals(420000.0, response.properties().get(0).predictedPrice());
    }

    @Test
    void generateMarketStatsReturnsZeroWhenDbIsEmpty() {
        when(propertyMapper.selectList(null)).thenReturn(List.of());

        MarketStatsResponse stats = service.generateMarketStats();

        assertEquals(0, stats.count());
    }

    @Test
    void generateMarketStatsQueriesDbAndComputes() {
        Property p1 = new Property();
        p1.setSquareFootage(1000.0);
        p1.setBedrooms(2);
        p1.setBathrooms(1);
        p1.setYearBuilt(2000);
        p1.setLotSize(3000.0);
        p1.setDistanceToCityCenter(10.0);
        p1.setSchoolRating(5);

        Property p2 = new Property();
        p2.setSquareFootage(2000.0);
        p2.setBedrooms(3);
        p2.setBathrooms(2);
        p2.setYearBuilt(2010);
        p2.setLotSize(5000.0);
        p2.setDistanceToCityCenter(5.0);
        p2.setSchoolRating(8);

        when(propertyMapper.selectList(null)).thenReturn(List.of(p1, p2));
        when(mlClientService.batchPredict(any())).thenReturn(
                new BatchPredictionResponse(List.of(300000.0, 500000.0)));

        MarketStatsResponse stats = service.generateMarketStats();

        assertEquals(400000.0, stats.averagePrice(), 0.01);
        assertEquals(400000.0, stats.medianPrice(), 0.01);
        assertEquals(2, stats.count());
        assertEquals(800000.0 / 3000.0, stats.pricePerSqft(), 0.01);
    }

    @Test
    void computeStatsForEmptyListReturnsZeroes() {
        MarketStatsResponse stats = service.computeStats(List.of());
        assertEquals(0, stats.averagePrice());
        assertEquals(0, stats.medianPrice());
        assertEquals(0, stats.count());
        assertEquals(0, stats.pricePerSqft());
    }

    @Test
    void computeStatsForNullReturnsZeroes() {
        MarketStatsResponse stats = service.computeStats(null);
        assertEquals(0, stats.count());
    }

    @Test
    void computeStatsCalculatesCorrectly() {
        List<PropertyData> props = List.of(
                new PropertyData(1000, 2, 1, 2000, 3000, 10.0, 5, 300000.0),
                new PropertyData(2000, 3, 2, 2010, 5000, 5.0, 8, 500000.0),
                new PropertyData(1500, 2, 2, 2005, 4000, 7.0, 7, 400000.0));

        MarketStatsResponse stats = service.computeStats(props);

        assertEquals(400000.0, stats.averagePrice(), 0.01);
        assertEquals(400000.0, stats.medianPrice(), 0.01);
        assertEquals(3, stats.count());
        assertEquals(1200000.0 / 4500.0, stats.pricePerSqft(), 0.01);
    }

    @Test
    void runWhatIfCallsMlApi() {
        when(mlClientService.batchPredict(any())).thenReturn(
                new BatchPredictionResponse(List.of(350000.0, 420000.0)));

        WhatIfResponse result = service.runWhatIf("squareFootage", 1000, 2000, 2);

        assertEquals("squareFootage", result.parameter());
        assertEquals(2, result.points().size());
        assertEquals(1000, result.points().get(0).parameterValue());
        assertEquals(350000.0, result.points().get(0).predictedPrice());
        assertEquals(2000, result.points().get(1).parameterValue());
        assertEquals(420000.0, result.points().get(1).predictedPrice());
    }
}
