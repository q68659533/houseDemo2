-- ============================================================
-- Property Portal - Database Schema
-- Database: property_portal
-- ============================================================

CREATE DATABASE IF NOT EXISTS property_portal
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE property_portal;

-- ------------------------------------------------------------
-- Table: properties
-- ------------------------------------------------------------
DROP TABLE IF EXISTS properties;

CREATE TABLE properties (
    id                      BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    square_footage          DOUBLE COMMENT '建筑面积 (sq ft)',
    bedrooms                INT COMMENT '卧室数量',
    bathrooms               INT COMMENT '卫生间数量',
    year_built              INT COMMENT '建造年份',
    lot_size                DOUBLE COMMENT '地块面积 (sq ft)',
    distance_to_city_center DOUBLE COMMENT '距市中心距离 (miles)',
    school_rating           INT COMMENT '学区评分 (1-10)',
    actual_price            DOUBLE COMMENT '实际成交价格 (USD)',
    deleted                 INT DEFAULT 0 COMMENT '逻辑删除标志 (0=未删除, 1=已删除)',

    INDEX idx_bedrooms (bedrooms),
    INDEX idx_year_built (year_built),
    INDEX idx_square_footage (square_footage)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='房产数据表';
