# @treehut Community Trend Identification Dashboard

This project provides a metrics-driven report to identify trends and topics of interest, and how they shift over time, for consumers of the popular skincare brand @treehut on Instagram. It features a Next.js frontend for interactive visualizations and a Python Flask backend for data processing and AI-powered analytics.

## Features

*   **Overall Sentiment Analysis**: A pie chart showing the distribution of positive, neutral, and negative sentiment across all comments.
*   **Top Trending Keywords**: A list of the most frequently mentioned keywords, along with their overall sentiment and percentage breakdown (positive, neutral, negative).
*   **Weekly Sentiment & Keyword Trends**: A line chart visualizing the weekly shifts in positive, neutral, and negative sentiment, accompanied by a breakdown of top keywords for each week.
*   **Product Feature Sentiment**: A stacked bar chart showing the sentiment distribution (positive, neutral, negative) for key product categories (e.g., Body Scrubs, Body Butters/Lotions, New Scents/Collections).
*   **Actionable Insights**: Each visualization is paired with clear, concise insights relevant to a social media manager.

## Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js** (LTS version recommended) & **npm** (or Yarn)
*   **Python 3.9+** & **Conda** (for Python environment management)
*   **Git**

## Setup Instructions

### 1. Clone the Repository

First, clone the project repository to your local machine:

\`\`\`bash
git clone <your-repository-url>
cd trend-identification-dashboard # Or whatever your project folder is named
\`\`\`

### 2. Backend Setup (Python Flask)

The backend is responsible for generating mock data (if needed), processing your CSV data, and running the AI models.

1.  **Navigate to the `scripts` directory**:
    \`\`\`bash
    cd scripts
    \`\`\`
2.  **Create and Activate a Conda Environment**:
    \`\`\`bash
    conda create -n treehut-trends python=3.9
    conda activate treehut-trends
    \`\`\`
3.  **Install the required Python packages**:
    \`\`\`bash
    conda install --file requirements.txt
    # If any packages fail to install with conda, you can try:
    # pip install -r requirements.txt
    \`\`\`
4.  **Generate Mock Data (Optional but Recommended for First Run)**:
    If you don't have a `data/treehut_comments_march_2025.csv` file, you can generate one:
    \`\`\`bash
    python generate_mock_data.py
    \`\`\`
    This will create a CSV file with ~18,000 simulated comments in the `data/` directory (relative to the project root). You might need to `cd ..` to the project root first if you ran this from `scripts/`.
5.  **Run the Flask Backend**:
    \`\`\`bash
    python backend.py
    \`\`\`
    The backend server should start and be accessible at `http://localhost:5000`. Keep this terminal window open.

### 3. Frontend Setup (Next.js)

The frontend is a Next.js application that consumes data from the Flask backend.

1.  **Navigate back to the project root directory**:
    \`\`\`bash
    cd .. # If you are in the 'scripts' directory
    \`\`\`
2.  **Install Node.js Dependencies**:
    \`\`\`bash
    npm install
    # OR
    yarn install
    \`\`\`
3.  **Run the Next.js Development Server**:
    \`\`\`bash
    npm run dev
    # OR
    yarn dev
    \`\`\`
    The frontend application should now be running at `http://localhost:3000`.

## Running the Application

1.  Ensure your **Python Flask backend** is running on `http://localhost:5000` (from step 2.5).
2.  Ensure your **Next.js frontend** is running on `http://localhost:3000` (from step 3.3).
3.  Open your web browser and navigate to `http://localhost:3000`.
4.  On the dashboard, you will see an "Upload Community Data" card.
5.  Click "Choose File" and select your CSV data file (e.g., `data/treehut_comments_march_2025.csv` if you generated mock data).
6.  Click "Analyze Data" to process the data and view the insights.

## CSV Data Format

The backend expects a CSV file with at least the following columns:

*   `timestamp`: Timestamp of the post or comment (e.g., `YYYY-MM-DD HH:MM:SS`).
*   `media_id`: Unique identifier for each post/media item.
*   `media_caption`: Caption of the media post (can be empty).
*   `comment_text`: Text content of comments (can be empty).

Example `data.csv`:

\`\`\`csv
timestamp,media_id,media_caption,comment_text
2025-03-01 10:00:00,post_0001,"Our new collection is here! ✨","Love this product! My skin feels amazing."
2025-03-01 10:15:00,post_0001,,How much does it cost?
2025-03-12 14:30:00,post_0005,"Introducing our new tropical glow!","Obsessed with the new scent, it's so refreshing!"
2025-03-22 09:00:00,post_0010,,My order was damaged during shipping.
\`\`\`

## Troubleshooting

*   **Backend not running**: Make sure you are in the `scripts` directory when running `python backend.py` and that the `conda` environment is activated. Check for any error messages in the terminal where you started the backend.
*   **CORS errors**: The Flask backend has CORS enabled, but if you encounter issues, ensure your browser is not blocking requests or that the backend is indeed running on `http://localhost:5000`.
*   **"Failed to analyze data" alert**: This usually means the frontend couldn't connect to the backend or the backend returned an error. Check the backend terminal for logs and errors.
*   **Missing Python packages**: If you see `ModuleNotFoundError`, ensure you have activated your `conda` environment and run `conda install --file requirements.txt` (or `pip install -r requirements.txt` as a fallback).
*   **AI model loading issues**: If the backend prints messages about not being able to load sentiment or text generation models, it will fall back to mock data. This might be due to network issues during download or insufficient memory.

## Extension Proposal

If I had a month to expand this project, I would prioritize the following features, ranked by impact and feasibility:

1.  **Advanced Topic Modeling (High Impact, Medium Feasibility)**:
    *   **Why**: Current keyword extraction is frequency-based. Implementing Latent Dirichlet Allocation (LDA) or Non-negative Matrix Factorization (NMF) would allow for the discovery of abstract "topics" within the comments, providing a deeper understanding of community interests beyond just individual words. This would make insights more robust and less sensitive to noise.
    *   **Implementation**: Integrate libraries like `gensim` or `scikit-learn` in the Python backend. This would involve more complex data preprocessing (e.g., lemmatization, n-grams).

2.  **Direct Social Media API Integration (High Impact, Medium Feasibility)**:
    *   **Why**: Manual CSV upload is not scalable for a large brand. Direct integration with Instagram's Graph API (or other platforms) would enable real-time data fetching, continuous monitoring, and automated report generation. This moves from a static report to a dynamic, always-on analytics tool.
    *   **Implementation**: Requires setting up OAuth authentication, handling API rate limits, and managing data ingestion pipelines in the backend.

3.  **User-Level Trend Tracking & Advocate Identification (Medium Impact, Medium Feasibility)**:
    *   **Why**: Understanding *who* is driving trends and *who* are the most influential community members is crucial. By tracking individual `media_id`s (as proxies for users) or actual user IDs (if available via API), we could identify power users, brand advocates, and even potential detractors.
    *   **Implementation**: Extend the backend to maintain user profiles, track their comment history, sentiment, and keyword usage. Develop metrics for "advocacy score" or "influence score."

4.  **Comparative Analysis & Benchmarking (Medium Impact, Medium Feasibility)**:
    *   **Why**: Social media managers often need to compare their brand's performance against competitors or industry benchmarks. This feature would allow uploading data from competitors or industry reports to see how @treehut's trends and sentiment compare.
    *   **Implementation**: Extend the data model to support multiple brands/datasets, and add UI components for side-by-side comparisons in charts.

5.  **Alerts and Notifications (Medium Impact, Low Feasibility)**:
    *   **Why**: Proactive alerts for sudden shifts in sentiment (e.g., a spike in negative comments) or the emergence of new trending topics would allow social media managers to react quickly to crises or opportunities.
    *   **Implementation**: Requires setting up thresholds in the backend and integrating with a notification service (e.g., email, Slack).

## AI & Tool Usage Disclosure

This project extensively leverages AI and open-source tools:

*   **AI Models**:
    *   **Hugging Face Transformers**: Used for sentiment analysis (`distilbert-base-uncased-finetuned-sst-2-english` pipeline) to classify comment sentiment.
    *   **Hugging Face Transformers**: Used for text generation (`gpt2` pipeline) for simulated AI recommendations (though this feature is not heavily used in the final trend report, the capability is present in the backend).
*   **Frameworks & Libraries**:
    *   **Next.js**: Frontend framework for building the interactive dashboard.
    *   **React**: JavaScript library for building user interfaces.
    *   **Python Flask**: Backend web framework for data processing and API.
    *   **Pandas**: Python library for data manipulation and analysis.
    *   **tqdm**: Python library for displaying progress bars during data processing.
    *   **Recharts**: React charting library for data visualization.
    *   **shadcn/ui**: UI component library for building accessible and customizable React components.
    *   **Lucide React**: Icon library for React components.
*   **Development Tools**:
    *   **Vercel v0**: Used as the development environment and AI assistant to generate and refine code.
    *   **Conda**: Used for Python environment and package management.

## Report: Metrics, Assumptions, Models, Inferences, and Recommendations

### Executive Summary

This report presents a metrics-driven analysis of approximately 18,000 Instagram comments left on @treehut posts during March 2025. The primary objective was to identify evolving trends, topics of interest, and shifts in community sentiment to provide actionable insights for social media managers. Our approach involved a robust data pipeline that processes raw comment data, extracts key entities, performs sentiment analysis, and tracks temporal changes. The findings indicate a generally positive brand perception, with specific product categories driving significant engagement. Crucially, the analysis highlights the dynamic nature of online discussions, revealing how new product mentions can rapidly emerge as trends and how minor operational issues can influence sentiment.

### Metrics Defined

*   **Overall Sentiment Distribution**: Percentage breakdown of comments classified as positive, neutral, or negative across the entire dataset.
*   **Keyword Mentions**: Raw count of how many times a specific keyword appeared in comments or captions.
*   **Keyword Sentiment Breakdown**: For each top keyword, the percentage of associated mentions that were positive, neutral, or negative.
*   **Weekly Sentiment Percentage**: The percentage of positive, neutral, and negative comments within a given week.
*   **Weekly Top Keywords**: The most frequently mentioned keywords within a specific week.
*   **Product Category Sentiment**: The percentage of positive, neutral, and negative mentions specifically related to predefined product categories (e.g., Body Scrubs, Body Butters/Lotions).

### Assumptions Made

1.  **Data Representativeness**: It is assumed that the provided ~18,000 comments from March 2025 are a representative sample of @treehut's overall Instagram community engagement during that period.
2.  **Sentiment Model Accuracy**: The `distilbert-base-uncased-finetuned-sst-2-english` sentiment analysis model is assumed to provide reasonably accurate sentiment classifications for social media comments in the skincare domain.
3.  **Keyword Extraction Efficacy**: Simple frequency-based keyword extraction (after stopword removal) is assumed to be sufficient for identifying trending topics. More advanced topic modeling techniques could yield deeper, more abstract themes but are outside the scope of this initial analysis.
4.  **Temporal Granularity**: Weekly aggregation of trends is assumed to be an appropriate granularity for identifying shifts relevant to a social media manager's planning cycle.
5.  **Mock Data Validity**: For the purpose of this demonstration, the simulated data accurately reflects the expected patterns of comments, including the introduction of new product discussions and minor issues over time.

### Derived Statistical Models and Inferences

1.  **Frequency Analysis for Keywords**:
    *   **Model**: Simple word frequency counting (using `collections.Counter`) after tokenization and stopword removal.
    *   **Inference**: High-frequency keywords indicate topics of high discussion volume. By comparing keyword frequencies across different time periods, we can infer emerging or declining trends. For example, a sudden spike in mentions of "new scent" suggests a successful product launch or campaign.

2.  **Sentiment Classification**:
    *   **Model**: Pre-trained transformer-based sentiment analysis model (`distilbert-base-uncased-finetuned-sst-2-english`). This model classifies text into "POSITIVE" or "NEGATIVE" categories, which are then mapped to our "positive," "neutral," and "negative" labels based on confidence scores.
    *   **Inference**: The overall sentiment distribution provides a high-level health check of brand perception. Tracking sentiment over time (e.g., weekly) allows for the identification of sentiment shifts, which can be correlated with specific events (e.g., product launches, customer service interactions, marketing campaigns). A dip in positive sentiment or a rise in negative sentiment around specific keywords can signal a problem.

3.  **Temporal Aggregation**:
    *   **Model**: Grouping comments by week (or day) based on their `timestamp` and then applying sentiment and keyword analysis to each temporal segment.
    *   **Inference**: This model allows for the visualization of trends over time. For instance, if "tropical glow" keywords and associated positive sentiment peak in mid-March, it suggests a successful mid-month campaign or product release. Conversely, a late-month increase in "shipping" mentions with neutral/negative sentiment points to a potential logistical issue.

4.  **Product-Specific Sentiment (Rule-Based Keyword Matching)**:
    *   **Model**: Comments are categorized into product groups based on the presence of predefined keywords. Sentiment analysis is then applied to these categorized comments.
    *   **Inference**: This helps a social media manager understand the community's perception of specific product lines or features. If "Pricing" has a high negative sentiment, it indicates a potential issue with pricing strategy.

### Recommendations Provided

Based on the insights derived from the analysis, here are actionable recommendations for @treehut's social media manager:

1.  **Amplify Positive Product Narratives**:
    *   **Insight**: If "Body Scrubs" and "New Scents" show consistently high positive sentiment and mention volume, these are strong brand assets.
    *   **Recommendation**: Create more content featuring these popular products and scents. Encourage user-generated content (UGC) specifically around these items. Run polls or Q&As about favorite scents to further boost engagement.

2.  **Monitor and Address Operational Feedback Promptly**:
    *   **Insight**: A detected increase in neutral/negative sentiment or mentions of keywords like "shipping," "order," or "damaged" indicates potential customer service or logistical issues.
    *   **Recommendation**: Implement a social listening alert system for these keywords. Collaborate with customer service and logistics teams to identify root causes and provide timely, public responses to affected customers on social media. Consider a dedicated "shipping update" post if issues are widespread.

3.  **Leverage Emerging Trends for Content Planning**:
    *   **Insight**: The temporal analysis clearly shows when new topics or product discussions gain traction.
    *   **Recommendation**: Use these insights to inform your content calendar. If a "limited edition" product is trending, plan follow-up content (e.g., "how-to" videos, ingredient deep-dives, customer testimonials) to capitalize on the momentum.

4.  **Engage with Neutral Sentiment**:
    *   **Insight**: A significant portion of comments might be neutral. While not negative, they represent missed opportunities for deeper engagement.
    *   **Recommendation**: For neutral comments, craft engaging questions to encourage more detailed feedback or sentiment. For example, if someone says "It's a body scrub," ask "What's your favorite thing about it?" or "What kind of scent do you prefer?"

5.  **Refine Keyword Strategy**:
    *   **Insight**: The top keywords reveal what the audience is naturally discussing.
    *   **Recommendation**: Incorporate these high-frequency, positive keywords into your official hashtags and content copy to align with audience language and improve organic reach. Conversely, understand negative keywords to avoid them or address them proactively.
