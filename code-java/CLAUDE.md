# Property Portal Java Backend

## Setup
- Java 21+, Maven 3.9+
- Build: `mvn clean test` from `code-java/` directory
- Run: `mvn spring-boot:run` (port 8080)

## Configuration
- `application.yml`: `ml.api.url` points to ML model service (default http://localhost:8000)
- `cors.allowed-origins`: comma-separated list for CORS (default http://localhost:3000)
- Caffeine cache TTL: 5 minutes for `modelInfo` cache

## Architecture
- `com.property.portal.controller.MarketController`: REST endpoints under `/api/market`
- `com.property.portal.service.MlClientService`: Calls upstream ML API (`/predict`, `/model-info`)
- `com.property.portal.service.MarketDataService`: Generates mock data, computes stats, runs what-if
- `com.property.portal.exception.GlobalExceptionHandler`: ProblemDetail responses for all errors

## API Endpoints
- `GET /api/market/data` - Generates 100 mock properties with ML predictions
- `GET /api/market/stats` - Computes average, median, count, price/sqft
- `GET /api/market/model-info` - Cached ML model metadata (5min)
- `GET /api/market/whatif?parameter=X&startValue=Y&endValue=Z&steps=N` - Price curve across parameter range

## Testing
- `@WebMvcTest` for controller tests with `@MockitoBean`
- `@SpringBootTest` for context loading
- Mock `MlClientService` to avoid hitting real ML API in tests
