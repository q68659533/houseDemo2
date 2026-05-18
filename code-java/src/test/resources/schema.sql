CREATE TABLE IF NOT EXISTS properties (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    square_footage DOUBLE,
    bedrooms INT,
    bathrooms INT,
    year_built INT,
    lot_size DOUBLE,
    distance_to_city_center DOUBLE,
    school_rating INT,
    actual_price DOUBLE,
    deleted INT DEFAULT 0
);
