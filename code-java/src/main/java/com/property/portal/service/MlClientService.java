package com.property.portal.service;

import com.property.portal.dto.BatchPredictionRequest;
import com.property.portal.dto.BatchPredictionResponse;
import com.property.portal.dto.ModelInfoResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.time.Duration;

@Service
public class MlClientService {

    private final RestClient restClient;

    public MlClientService(@Value("${ml.api.url}") String mlApiUrl) {
        this.restClient = RestClient.builder()
                .baseUrl(mlApiUrl)
                .requestFactory(new org.springframework.http.client.SimpleClientHttpRequestFactory() {
                    {
                        setConnectTimeout(Duration.ofSeconds(5));
                        setReadTimeout(Duration.ofSeconds(10));
                    }
                })
                .build();
    }

    public BatchPredictionResponse batchPredict(BatchPredictionRequest request) {
        try {
            return restClient.post()
                    .uri("/predict")
                    .body(request)
                    .retrieve()
                    .body(BatchPredictionResponse.class);
        } catch (RestClientResponseException e) {
            throw new MlApiException("ML prediction failed: " + e.getStatusText(), e.getStatusCode().value());
        } catch (Exception e) {
            throw new MlApiException("ML API unavailable", 503);
        }
    }

    @Cacheable(value = "modelInfo", unless = "#result == null")
    public ModelInfoResponse getModelInfo() {
        try {
            return restClient.get()
                    .uri("/model-info")
                    .retrieve()
                    .body(ModelInfoResponse.class);
        } catch (RestClientResponseException e) {
            throw new MlApiException("Failed to fetch model info: " + e.getStatusText(), e.getStatusCode().value());
        } catch (Exception e) {
            throw new MlApiException("ML API unavailable", 503);
        }
    }

    public static class MlApiException extends RuntimeException {
        private final int statusCode;

        public MlApiException(String message, int statusCode) {
            super(message);
            this.statusCode = statusCode;
        }

        public int getStatusCode() {
            return statusCode;
        }
    }
}
