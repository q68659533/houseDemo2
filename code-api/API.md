# 房价预测 API 对接文档

## 概述

基于线性回归的房价预测服务，接收房屋特征返回预测价格。支持单条和批量预测。

- **基础 URL**: `http://<host>:8000`
- **Swagger UI**: `http://<host>:8000/docs`
- **Content-Type**: `application/json`

---

## 接口列表

### 1. 健康检查

确认服务是否正常运行。

| 项目 | 内容 |
|------|------|
| 方法 | `GET` |
| 路径 | `/health` |
| 鉴权 | 无 |

**响应示例** (HTTP 200):

```json
{
  "status": "healthy"
}
```

---

### 2. 模型信息

返回模型系数和性能指标。

| 项目 | 内容 |
|------|------|
| 方法 | `GET` |
| 路径 | `/model-info` |
| 鉴权 | 无 |

**响应示例** (HTTP 200):

```json
{
  "features": ["bathrooms", "bedrooms", "school_rating", "distance_to_city_center", "year_built", "square_footage", "lot_size"],
  "coefficients": [4313.79, 3726.33, 1852.55, -939.82, -40.63, 16.83, 0.40],
  "intercept": 439343.32,
  "metrics": {
    "r2": 0.3163,
    "mse": 961416631.56,
    "mae": 21622.95
  }
}
```

**字段说明**:

| 字段 | 类型 | 说明 |
|------|------|------|
| `features` | `string[]` | 特征名称，按系数绝对值降序排列 |
| `coefficients` | `number[]` | 各特征对应的线性回归系数，与 `features` 一一对应 |
| `intercept` | `number` | 回归截距项 |
| `metrics.r2` | `number` | 决定系数 |
| `metrics.mse` | `number` | 均方误差 |
| `metrics.mae` | `number` | 平均绝对误差 |

---

### 3. 房价预测

根据房屋特征预测价格。支持两种调用方式：单条预测或批量预测。

| 项目 | 内容 |
|------|------|
| 方法 | `POST` |
| 路径 | `/predict` |
| 鉴权 | 无 |

#### 3.1 单条预测

请求体直接传入房屋特征字段。

**请求字段**:

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `square_footage` | `number` | 是 | 房屋面积（平方英尺） |
| `bedrooms` | `integer` | 是 | 卧室数量 |
| `bathrooms` | `integer` | 是 | 浴室数量 |
| `year_built` | `integer` | 是 | 建造年份 |
| `lot_size` | `number` | 是 | 地块面积 |
| `distance_to_city_center` | `number` | 是 | 到市中心距离（英里） |
| `school_rating` | `integer` | 是 | 学校评分（1-10） |

**请求示例**:

```json
{
  "square_footage": 2000,
  "bedrooms": 3,
  "bathrooms": 2,
  "year_built": 2010,
  "lot_size": 5000,
  "distance_to_city_center": 5.0,
  "school_rating": 8
}
```

**响应示例** (HTTP 200):

```json
{
  "prediction": 423250.82
}
```

#### 3.2 批量预测

请求体传入 `houses` 数组，每个元素为一组房屋特征。

**请求字段**:

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `houses` | `object[]` | 是 | 房屋特征数组 |
| `houses[].square_footage` | `number` | 是 | 房屋面积 |
| `houses[].bedrooms` | `integer` | 是 | 卧室数量 |
| `houses[].bathrooms` | `integer` | 是 | 浴室数量 |
| `houses[].year_built` | `integer` | 是 | 建造年份 |
| `houses[].lot_size` | `number` | 是 | 地块面积 |
| `houses[].distance_to_city_center` | `number` | 是 | 到市中心距离 |
| `houses[].school_rating` | `integer` | 是 | 学校评分 |

**请求示例**:

```json
{
  "houses": [
    {
      "square_footage": 2000,
      "bedrooms": 3,
      "bathrooms": 2,
      "year_built": 2010,
      "lot_size": 5000,
      "distance_to_city_center": 5.0,
      "school_rating": 8
    },
    {
      "square_footage": 1500,
      "bedrooms": 2,
      "bathrooms": 1,
      "year_built": 2005,
      "lot_size": 3000,
      "distance_to_city_center": 10.0,
      "school_rating": 6
    }
  ]
}
```

**响应示例** (HTTP 200):

```json
{
  "predictions": [423250.82, 397798.24]
}
```

#### 错误响应

参数缺失或类型错误时返回 HTTP 422。

```json
{
  "detail": [
    {
      "type": "missing",
      "loc": ["square_footage"],
      "msg": "Field required"
    }
  ]
}
```

---

## 快速对接示例

### cURL

```bash
# 健康检查
curl http://localhost:8000/health

# 模型信息
curl http://localhost:8000/model-info

# 单条预测
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"square_footage":2000,"bedrooms":3,"bathrooms":2,"year_built":2010,"lot_size":5000,"distance_to_city_center":5.0,"school_rating":8}'

# 批量预测
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"houses":[{"square_footage":2000,"bedrooms":3,"bathrooms":2,"year_built":2010,"lot_size":5000,"distance_to_city_center":5.0,"school_rating":8},{"square_footage":1500,"bedrooms":2,"bathrooms":1,"year_built":2005,"lot_size":3000,"distance_to_city_center":10.0,"school_rating":6}]}'
```

### Python (requests)

```python
import requests

url = "http://localhost:8000"

# 单条预测
r = requests.post(f"{url}/predict", json={
    "square_footage": 2000,
    "bedrooms": 3,
    "bathrooms": 2,
    "year_built": 2010,
    "lot_size": 5000,
    "distance_to_city_center": 5.0,
    "school_rating": 8
})
print(r.json())  # {"prediction": 423250.82}

# 批量预测
r = requests.post(f"{url}/predict", json={
    "houses": [
        {"square_footage": 2000, "bedrooms": 3, "bathrooms": 2, "year_built": 2010, "lot_size": 5000, "distance_to_city_center": 5.0, "school_rating": 8},
        {"square_footage": 1500, "bedrooms": 2, "bathrooms": 1, "year_built": 2005, "lot_size": 3000, "distance_to_city_center": 10.0, "school_rating": 6}
    ]
})
print(r.json())  # {"predictions": [423250.82, 397798.24]}
```

### JavaScript (fetch)

```javascript
const url = "http://localhost:8000";

// 单条预测
fetch(`${url}/predict`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    square_footage: 2000,
    bedrooms: 3,
    bathrooms: 2,
    year_built: 2010,
    lot_size: 5000,
    distance_to_city_center: 5.0,
    school_rating: 8
  })
}).then(r => r.json()).then(console.log);

// 批量预测
fetch(`${url}/predict`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    houses: [
      { square_footage: 2000, bedrooms: 3, bathrooms: 2, year_built: 2010, lot_size: 5000, distance_to_city_center: 5.0, school_rating: 8 },
      { square_footage: 1500, bedrooms: 2, bathrooms: 1, year_built: 2005, lot_size: 3000, distance_to_city_center: 10.0, school_rating: 6 }
    ]
  })
}).then(r => r.json()).then(console.log);
```
