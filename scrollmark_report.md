
# Scrollmark Trend Identification Report for @treehut

## Executive Summary

This report presents a comprehensive analysis and visualization toolkit for identifying trends and actionable insights from ~18,000 Instagram comments on @treehut posts during March 2025. Our approach mimics the real-world workflows of social media managers, providing dashboards and models tailored for sentiment, engagement, virality, loyalty, buyer intent, and publishing optimization.

We built a modular frontend using TypeScript + React and a Flask Python backend to simulate data ingestion and analysis. All metrics shown in the dashboards are derived from pre-defined schema and mock input, intended to reflect real-time social media conditions.

---

## Visualizations & Insights

### 1. **Sentiment Analysis**
- Real-time pie and line charts show positive/neutral/negative trends.
- Highlights top-performing advocacy keywords and associated sentiment.
- Displays praised vs. problematic product features based on feedback.

### 2. **Buyer Intent Discovery**
- Identifies high-intent users with scores and predictive value.
- Charts show conversion trends and intent signal distribution.
- Recommends next best actions like DM/call scheduling for sales uplift.

### 3. **Virality Score Analysis**
- Post virality predictor using heuristic scoring logic.
- Radar charts and progress bars breakdown virality factors like shareability and timing.
- Visual timeline of virality trend and best-performing past posts.

### 4. **Engagement Metrics**
- Trends in post/comment counts, peak engagement hours.
- Heatmaps and bar graphs for top content types and comment-rich posts.

### 5. **Advocate Identification**
- Ranks users by engagement, influence, loyalty.
- Shows UGC (user-generated content) growth and loyalty program performance.
- Radar charts profile advocate performance across multiple metrics.

### 6. **Publishing Recommendations**
- Suggests optimal posting times and trending hashtags.
- Forecasts engagement for upcoming days using mock AI.
- Recommends post ideas and manages content calendar.

### 7. **Diagnostic Metrics**
- Alerts for underperforming content.
- Tracks deviation from KPIs and audience segment shifts.
- Age demographic pie chart and engagement breakdown by content type.

---

## Instructions for Running the App

1. **Backend Setup (Python)**
   ```bash
   cd backend
   python3 -m venv env
   source env/bin/activate
   pip install -r requirements.txt
   python backend.py
   ```

2. **Frontend Setup (React)**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Access**
   - Open your browser to: `http://localhost:3000`

---

## Extension Proposal

### Top 5 Features to Build Next

1. **Live Data Pipeline Integration** ⭐️⭐️⭐️⭐️⭐️
   - Connect to Instagram Graph API to fetch real-time comments and metrics.
   - Enables true operational usage.

2. **LLM-powered Summarization & Querying** ⭐️⭐️⭐️⭐️
   - Integrate HuggingFace Transformers to enable natural language querying.
   - Auto-generate reports and summaries using ChatGPT/RAG pipelines.

3. **Clustering & Topic Modeling** ⭐️⭐️⭐️⭐️
   - Use BERTopic or UMAP + HDBSCAN to extract themes without predefined keywords.

4. **Alerts & Anomaly Detection Engine** ⭐️⭐️⭐️
   - Add automated alerting for dips in sentiment, virality, or engagement.

5. **Advanced Forecasting Models** ⭐️⭐️⭐️
   - Incorporate Prophet or DeepAR for trend and virality forecasting over time.

---

## AI & Tool Usage Disclosure

- **ChatGPT 4o**: Prompting, visualization design, sentiment/virality model logic.
- **HuggingFace Transformers** (planned): Text classification & embeddings.
- **React + TypeScript + Tailwind + Recharts**: Dashboard frontend.
- **Python + Flask**: Mock backend for data processing APIs.
- **Simulated Data**: All values shown are mock values to demonstrate functionality.

