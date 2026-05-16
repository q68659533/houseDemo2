# PRD: 多应用 Next.js 房产智能门户

## Introduction

构建一个统一的 Next.js 门户平台，托管两个独立应用——房产价值估算器（Python FastAPI 后端）与房产市场分析（Java Spring Boot 后端）。两个应用共享统一的导航、布局与深色科技风设计系统，并能与已部署的 ML 房价预测模型交互。

门户采用前后端分离架构：Next.js 前端直接调用独立运行的 Python/Java API 服务，ML 模型 API（默认 `http://localhost:8000`）通过环境变量配置。

## Goals

- 搭建统一 Next.js 门户，提供共享布局、导航与一致的设计系统
- 实现房产价值估算器：支持单条预测、结果可视化、历史记录、多房产对比
- 实现房产市场分析：支持交互式仪表盘、筛选器、假设分析、数据导出
- Python FastAPI 后端负责估算器业务逻辑与服务端验证
- Java Spring Boot 后端负责市场数据汇总、批量预测与缓存
- 所有 API 通信具备统一的错误处理与降级策略

## User Stories

### US-001: Next.js 项目初始化与共享布局
**Description:** As a developer, I need a Next.js project with a shared layout so both apps have consistent navigation and styling.

**Acceptance Criteria:**
- [ ] Initialize Next.js 15 project with App Router, TypeScript, Tailwind CSS
- [ ] Configure dark theme (`#030711` background, `#cbd5e1` text) matching UI prototype
- [ ] Create shared layout with sticky navbar (首页/估价器/市场分析导航) + glassmorphism effect
- [ ] Implement error boundaries (`error.tsx`) and loading states (`loading.tsx`) at layout level
- [ ] Configure environment variable for ML API base URL (`ML_API_URL`, default `http://localhost:8000`)
- [ ] Configure environment variables for Python backend (`PYTHON_API_URL`) and Java backend (`JAVA_API_URL`)
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-002: 首页 Landing Page
**Description:** As a user, I want a landing page that introduces both applications and shows the system architecture.

**Acceptance Criteria:**
- [ ] Hero section with title "房产智能门户平台" and gradient text effect
- [ ] Two application cards (房产价值估价器 / 房产市场分析) with feature lists and tech badges
- [ ] System architecture diagram showing Next.js → FastAPI/Spring Boot → ML Model flow
- [ ] Cards navigate to respective apps on click
- [ ] Floating orb background animation (CSS-only, matching UI prototype)
- [ ] Responsive layout (mobile: single column, desktop: side-by-side cards)
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-003: Python FastAPI 后端 - 房产估算 API
**Description:** As a developer, I need a Python backend that validates inputs and calls the ML model for price predictions.

**Acceptance Criteria:**
- [ ] FastAPI project with single `POST /api/estimate` endpoint
- [ ] Server-side validation for all 7 ML fields with Pydantic models:
  - `square_footage`: float, 100–100000
  - `bedrooms`: int, 1–10
  - `bathrooms`: int, 1–10
  - `year_built`: int, 1900–2025
  - `lot_size`: float, 0–100000
  - `distance_to_city_center`: float, 0–100
  - `school_rating`: float, 1.0–10.0
- [ ] Endpoint calls ML API `POST /predict` and returns prediction result
- [ ] Endpoint calls ML API `GET /model-info` to include model metadata (R², MSE, MAE, coefficients) in response
- [ ] Unified error handling: ML API unavailable → return 503 with user-friendly message; invalid input → 422 with field-level errors
- [ ] CORS configured for Next.js frontend origin
- [ ] All tests pass; typecheck passes (with mypy)

### US-004: 房产估价器表单页面
**Description:** As a user, I want to input property details through a validated form to get a price estimate.

**Acceptance Criteria:**
- [ ] Create `/estimator` route with form containing all 7 ML fields:
  - 建筑面积（平方英尺）- number input, min 100, max 100000
  - 卧室数 - select (1–10)
  - 浴室数 - select (1–10)
  - 建造年份 - number input, min 1900, max 2025
  - 地块面积（平方英尺）- number input, min 0
  - 距市中心距离（英里）- number input, min 0, max 100
  - 学区评分（1–10）- number input, step 0.1, min 1, max 10
- [ ] Client-side validation with React Hook Form + Zod (real-time error display)
- [ ] Form styled with dark theme inputs (matching UI prototype: dark bg, blue border focus glow)
- [ ] "预测价格" submit button with gradient primary style; "重置" button clears form
- [ ] On submit, call Python backend `POST /api/estimate`
- [ ] Loading state on submit button during API call
- [ ] Error toast notification for API errors
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-005: 预测结果展示与特征贡献图
**Description:** As a user, I want to see the predicted price and understand which features contributed most.

**Acceptance Criteria:**
- [ ] Results panel appears below form after successful prediction (slide-in animation)
- [ ] Price display card with gradient border (blue → cyan) showing predicted price in ¥
- [ ] Property summary card showing all 7 input values
- [ ] Model confidence section showing R², MSE, MAE from model-info
- [ ] Feature contribution bar chart (Chart.js) showing each feature's weighted contribution to price
- [ ] Chart uses dark theme colors matching portal palette
- [ ] "保存到历史" button to store result in localStorage
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-006: 历史记录功能
**Description:** As a user, I want to save and view my past estimates so I can reference them later.

**Acceptance Criteria:**
- [ ] localStorage-based history: each saved entry contains all 7 features + predicted price + timestamp + unique ID
- [ ] History panel on right side of estimator page (or below on mobile)
- [ ] Each history item displays: price, square footage, bedrooms, bathrooms
- [ ] Delete individual history item; "清空全部" button to clear all
- [ ] Empty state message when no history exists
- [ ] History persists across page reloads
- [ ] Maximum 50 entries (oldest auto-removed when exceeded)
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-007: 房产对比功能
**Description:** As a user, I want to compare 2–3 saved properties side by side.

**Acceptance Criteria:**
- [ ] Each history item has a checkbox for comparison selection
- [ ] Comparison panel appears when 2–3 items are selected
- [ ] Comparison table showing all 7 features + price side by side
- [ ] Radar chart (Chart.js) comparing normalized feature values across selected properties
- [ ] When fewer than 2 selected, show "至少保存 2 条记录方可对比" message
- [ ] When more than 3 selected, disable additional checkboxes with tooltip
- [ ] Comparison updates reactively when selections change
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-008: Java Spring Boot 后端 - 市场数据与统计 API
**Description:** As a developer, I need a Java backend that generates market data and provides summary statistics.

**Acceptance Criteria:**
- [ ] Spring Boot 3.4.4 project with Java 21
- [ ] `GET /api/market/data` endpoint: generates mock property dataset (200 records with random features), calls ML API batch prediction (`POST /predict` with array), returns enriched dataset with prices
- [ ] `GET /api/market/stats` endpoint: computes KPIs from dataset (average price, median price, count, average price per sqft)
- [ ] `GET /api/market/model-info` endpoint: calls ML API `GET /model-info`, caches response for 5 minutes using Caffeine cache
- [ ] `GET /api/market/whatif` endpoint: accepts param, start, end, steps; runs batch predictions across range; returns array of {value, price}
- [ ] All endpoints include CORS for Next.js frontend
- [ ] Unified error handling with ProblemDetail for API errors
- [ ] Tests pass; application starts successfully

### US-009: 市场分析仪表盘 - KPI 与筛选器
**Description:** As a user, I want to see key market metrics and filter the dataset.

**Acceptance Criteria:**
- [ ] Create `/analysis` route
- [ ] Four KPI cards: 平均价格 / 中位价格 / 房产数量 / 平均单价 (per sqft)
- [ ] Each KPI card has colored top border (blue/green/amber/purple gradient)
- [ ] KPI values update when filters are applied
- [ ] Filter bar with: 卧室数 dropdown (all/1/2/3/4/5+), 建造年份 range (min/max inputs), 建筑面积 range (min/max inputs)
- [ ] "应用筛选" button triggers filtered data fetch; "重置" button clears filters
- [ ] Filter state managed in URL search params (shareable links)
- [ ] Loading skeleton for KPI cards during data fetch
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-010: 市场可视化图表
**Description:** As a user, I want to see market trends visualized through interactive charts.

**Acceptance Criteria:**
- [ ] 价格分布柱状图 (Chart.js): shows property count per price bucket (<10万, 10–15万, etc.)
- [ ] 各卧室数均价柱状图: average price grouped by bedroom count
- [ ] 价格 vs 面积散点图: scatter plot with area on X, price on Y
- [ ] All charts use dark theme (dark grid lines, slate text colors)
- [ ] Charts update when filters change
- [ ] Responsive: 2×2 grid on desktop, stacked on mobile
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-011: 假设分析工具
**Description:** As a user, I want to see how changing one parameter affects predicted price.

**Acceptance Criteria:**
- [ ] What-if panel with: parameter dropdown (square_footage, bedrooms, bathrooms, lot_size, distance_to_city_center, school_rating), start value, end value inputs
- [ ] "运行分析" button calls Java backend `GET /api/market/whatif`
- [ ] Line chart showing price curve across parameter range (fixed base values for other fields)
- [ ] Chart uses gradient fill under the line (blue, semi-transparent)
- [ ] Tooltip on hover showing exact value at each point
- [ ] Base values for unvaried fields: reasonable defaults (area=1500, bedrooms=3, bathrooms=2, year_built=2000, lot_size=5000, distance=5, school_rating=7)
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-012: 响应式数据表格
**Description:** As a user, I want to browse all market data in a sortable, searchable table.

**Acceptance Criteria:**
- [ ] Data table showing all 8 columns: 面积, 卧室, 浴室, 建造年份, 地块面积, 距市中心, 学区评分, 预测价格
- [ ] Click column header to sort ascending/descending (toggle indicator ↕)
- [ ] Search input filters rows by any column value (real-time or debounced)
- [ ] Table rows have hover highlight effect
- [ ] Responsive: horizontal scroll on mobile; columns adapt or hide on small screens
- [ ] Show first 50 rows with "加载更多" pagination or virtual scrolling
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-013: 数据导出功能
**Description:** As a user, I want to export market data for offline analysis.

**Acceptance Criteria:**
- [ ] "导出 CSV" button: downloads current filtered dataset as CSV with UTF-8 BOM (Chinese characters supported)
- [ ] "导出 PDF" button: opens print dialog with formatted HTML table (white background, styled headers)
- [ ] Export buttons styled as ghost buttons (matching UI prototype)
- [ ] CSV includes all visible columns; PDF includes first 100 rows
- [ ] File names include date: `房产数据_YYYY-MM-DD.csv`
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-014: API 客户端封装与全局错误处理
**Description:** As a developer, I need reusable API clients and consistent error handling across the frontend.

**Acceptance Criteria:**
- [ ] Custom React hooks: `useApi` for generic fetch with loading/error states; `useEstimate` for estimator API; `useMarketData` for market API
- [ ] Axios or fetch wrapper with: base URL from env vars, timeout (10s), automatic retry (1 retry on 5xx)
- [ ] Global error boundary catches React errors and shows friendly fallback UI
- [ ] API error toast notifications with consistent styling (success=green, error=red, info=blue)
- [ ] All API calls handle network errors gracefully (offline message, retry option)
- [ ] Typecheck passes

## Functional Requirements

- FR-1: Next.js App Router with file-based routing (`/` home, `/estimator` app1, `/analysis` app2)
- FR-2: Shared layout provides navigation, footer, and global styles to all pages
- FR-3: Python backend exposes `POST /api/estimate` with Pydantic validation and ML API proxy
- FR-4: Java backend exposes `GET /api/market/data`, `GET /api/market/stats`, `GET /api/market/model-info`, `GET /api/market/whatif`
- FR-5: Frontend calls Python backend for estimator; Java backend for market analysis (never directly calls ML API from browser)
- FR-6: History stored in browser localStorage with max 50 entries, auto-purge oldest
- FR-7: Filter state persisted in URL search params for shareable market analysis views
- FR-8: All chart visualizations use Chart.js with dark theme configuration
- FR-9: Data export supports CSV (all data) and PDF (first 100 rows, print dialog)
- FR-10: Environment variables for all external API endpoints; no hardcoded URLs in source code

## Non-Goals

- No user authentication or authorization
- No database persistence (history in localStorage, market data generated on-the-fly)
- No real-time updates or WebSocket connections
- No Docker deployment or CI/CD configuration
- No mobile native app (responsive web only)
- No admin panel or backend management UI
- ML model training or retraining (model is pre-built and served externally)

## Design Considerations

- **Color Palette**: Dark theme (`#030711` bg, `#cbd5e1` text), accent colors: blue `#3b82f6`, cyan `#06b6d4`, green `#10b981`, amber `#f59e0b`, purple `#8b5cf6`
- **Card Style**: Glassmorphism cards with subtle gradient borders, hover lift effect, top glow line
- **Typography**: Noto Sans SC for Chinese text; font weights 400–700
- **Background**: Floating orb animations (CSS-only), subtle grid pattern, scanline effect
- **Component Library**: shadcn/ui base components customized for dark theme; custom components for cards, KPI badges, charts
- **Responsive Breakpoints**: Mobile (<640px), Tablet (640–1024px), Desktop (>1024px)
- **Accessibility**: WCAG 2.1 AA compliance for color contrast; keyboard navigation for all interactive elements; ARIA labels on charts

## Technical Considerations

- **Next.js**: App Router with Server Components for initial data loading where possible; Client Components for interactivity (forms, charts, tables)
- **State Management**: React useState/useReducer for local state; URL params for filter state; localStorage for history; no global state library needed
- **Form Handling**: React Hook Form + Zod for validation
- **Charts**: Chart.js with react-chartjs-2 wrapper; dark theme defaults configured globally
- **Python Backend**: FastAPI with httpx for async ML API calls; uvicorn server
- **Java Backend**: Spring Boot with WebClient for async ML API calls; Caffeine for caching model-info
- **ML API Integration**: Both backends call `http://localhost:8000` (configurable); handle timeouts and retries

## Success Metrics

- User can complete a price estimate in under 30 seconds (form fill + submit)
- Market dashboard loads KPIs in under 2 seconds
- All API calls succeed with proper error handling (no unhandled exceptions in browser console)
- Application passes WCAG color contrast checks
- Frontend renders correctly on 320px–2560px viewport widths

## Open Questions

- Should the Java backend persist generated market data across restarts, or generate fresh data each time?
- Should the estimator history support export as well (not just market data)?
- What is the preferred Python backend port? (suggest 8001 to avoid conflict with ML API on 8000)
- What is the preferred Java backend port? (suggest 8080)
