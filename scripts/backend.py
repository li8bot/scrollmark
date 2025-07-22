from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import io
from datetime import datetime, timedelta
import random
from collections import Counter
import re
from tqdm import tqdm # Import tqdm

# Hugging Face Transformers imports
from transformers import pipeline, set_seed

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

# Initialize NLP models
# Sentiment Analysis Model
try:
  sentiment_analyzer = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")
except Exception as e:
  print(f"Could not load sentiment model: {e}. Falling back to mock sentiment.")
  sentiment_analyzer = None

# Text Generation Model for recommendations
try:
  generator = pipeline('text-generation', model='distilgpt2')
  set_seed(42) # for reproducibility
except Exception as e:
  print(f"Could not load text generation model: {e}. Falling back to mock recommendations.")
  generator = None

def parse_csv_data(csv_string):
  """Parses CSV string into a pandas DataFrame."""
  print("Parsing CSV data...")
  df = pd.read_csv(io.StringIO(csv_string))
  # Ensure timestamp is datetime object
  if 'timestamp' in df.columns:
      df['timestamp'] = pd.to_datetime(df['timestamp'], errors='coerce', utc=True).dt.tz_localize(None)
  print("CSV data parsed successfully.")
  return df

def generate_mock_trends(start_date, num_days, base_value, fluctuation):
  """Generates mock trend data for charts."""
  trends = []
  current_date = start_date
  for _ in range(num_days):
      value = base_value + random.uniform(-fluctuation, fluctuation)
      trends.append({'date': current_date.strftime('%Y-%m-%d'), 'value': int(max(0, round(value)))}) # Ensure int
      current_date += timedelta(days=1)
  return trends

def get_sentiment(text):
  """Analyzes sentiment of a given text using Hugging Face model."""
  if not sentiment_analyzer or not text or not isinstance(text, str) or text.strip() == "":
      return "neutral" # Default to neutral if model not loaded or text is empty/invalid
  try:
      result = sentiment_analyzer(text)
      label = result[0]['label']
      score = result[0]['score']
      
      # distilbert-base-uncased-finetuned-sst-2-english outputs 'POSITIVE' and 'NEGATIVE'
      if label == 'POSITIVE' and score > 0.7: # Use a threshold for strong sentiment
          return "positive"
      elif label == 'NEGATIVE' and score > 0.7: # Use a threshold for strong sentiment
          return "negative"
      else:
          return "neutral" # If score is not high enough for strong positive/negative, or if it's truly neutral
  except Exception as e:
      print(f"Error during sentiment analysis for text '{text[:50]}...': {e}")
      return "neutral"



def extract_keywords(text_list, num_keywords=5):
  """Extracts top keywords from a list of texts."""
  print("Extracting keywords...")
  if not text_list:
      return []
  all_words = []
  for text in tqdm(text_list, desc="Processing texts for keywords"): # Added tqdm
      if isinstance(text, str):
          # Simple tokenization and lowercasing, remove non-alphabetic
          words = re.findall(r'\b[a-z]{3,}\b', text.lower())
          all_words.extend(words)
  
  # Filter out common stopwords (can be expanded)
  stopwords = set(['the', 'and', 'is', 'in', 'it', 'to', 'of', 'for', 'on', 'with', 'a', 'an', 'that', 'this', 'are', 'be', 'as', 'by', 'at', 'from', 'or', 'was', 'has', 'had', 'not', 'but', 'what', 'when', 'where', 'who', 'how', 'why', 'which', 'you', 'we', 'they', 'i', 'me', 'he', 'she', 'it', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their', 'can', 'will', 'would', 'should', 'could', 'do', 'did', 'done', 'get', 'got', 'go', 'goes', 'went', 'make', 'made', 'making', 'say', 'says', 'said', 'see', 'sees', 'saw', 'take', 'takes', 'took', 'come', 'comes', 'came', 'know', 'knows', 'knew', 'think', 'thinks', 'thought', 'look', 'looks', 'looked', 'want', 'wants', 'wanted', 'use', 'uses', 'used', 'find', 'finds', 'found', 'give', 'gives', 'gave', 'tell', 'tells', 'told', 'ask', 'asks', 'asked', 'work', 'works', 'worked', 'seem', 'seems', 'seemed', 'feel', 'feels', 'felt', 'try', 'tries', 'tried', 'leave', 'leaves', 'left', 'call', 'calls', 'called', 'good', 'great', 'new', 'just', 'like', 'very', 'much', 'also', 'about', 'into', 'through', 'down', 'up', 'out', 'back', 'over', 'under', 'then', 'than', 'there', 'here', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'only', 'own', 'same', 'so', 'too', 'very', 's', 't', 'don', 've', 'm', 'd', 'll', 're', 'y', 'ain', 'aren', 'couldn', 'didn', 'doesn', 'hadn', 'hasn', 'haven', 'isn', 'ma', 'mightn', 'mustn', 'needn', 'shan', 'shouldn', 'wasn', 'weren', 'won', 'wouldn'])
  filtered_words = [word for word in all_words if word not in stopwords]

  word_counts = Counter(filtered_words)
  print("Keywords extracted.")
  return [{"topic": word, "engagement": count} for word, count in word_counts.most_common(num_keywords)]

def generate_llm_recommendation(summary_data):
  """Generates AI-powered recommendations using a text generation model."""
  print("Generating LLM recommendations...")
  if not generator:
      print("LLM generator not loaded, returning mock recommendations.")
      return [
          {"type": "Optimal Timing", "title": "Post between 2-4 PM on weekdays", "description": "Schedule posts for peak audience activity to maximize visibility.", "priority": "High", "icon": "Clock", "color": "text-blue-500", "action": "Schedule post for 3:00 PM today"},
          {"type": "Content Type", "title": "Incorporate short-form video content", "description": "Short videos generate 2.3x more engagement than images. Use trending audio.", "priority": "Medium", "icon": "Target", "color": "text-green-500", "action": "Create a TikTok-style video about a recent product update"},
      ]
  
  prompt = f"""Based on the following social media analytics data, provide 3 actionable recommendations to improve engagement and reach:
  Total Posts: {summary_data.get('total_posts', 'N/A')}
  Total Comments: {summary_data.get('total_comments', 'N/A')}
  Top Performing Posts (by comments): {', '.join([p['media_caption'] or p['media_id'] for p in summary_data.get('top_performing_posts', [])[:2]])}
  Overall Sentiment: {summary_data.get('overall_sentiment', {}).get('overall', 'N/A')}
  
  Recommendations:
  """
  try:
      # Generate text, limiting length to avoid overly long responses
      generated_text = generator(prompt, max_new_tokens=150, num_return_sequences=1, truncation=True)[0]['generated_text']
      
      # Parse the generated text into structured recommendations
      recommendations = []
      # Simple parsing: split by line and try to extract title/description
      lines = generated_text.split('\n')
      for line in lines:
          line = line.strip()
          if line and not line.startswith("Recommendations:"):
              # Attempt to extract a title and description
              if ':' in line:
                  parts = line.split(':', 1)
                  title = parts[0].strip()
                  description = parts[1].strip()
              else:
                  title = line
                  description = "No specific description provided by AI."
              
              # Assign a random priority, icon, and color for demonstration
              priorities = ["High", "Medium", "Low"]
              icons = ["Clock", "Target", "Lightbulb", "Wand2", "Calendar"]
              colors = ["text-blue-500", "text-green-500", "text-orange-500", "text-teal-500", "text-purple-500"]
              
              recommendations.append({
                  "type": "AI Insight",
                  "title": title,
                  "description": description,
                  "priority": random.choice(priorities),
                  "icon": random.choice(icons),
                  "color": random.choice(colors),
                  "action": f"Implement '{title}'"
              })
              if len(recommendations) >= 3: # Limit to 3 recommendations
                  break
      print("LLM recommendations generated.")
      return recommendations if recommendations else generate_llm_recommendation({}) # Fallback if parsing fails
  except Exception as e:
      print(f"Error during LLM recommendation generation: {e}")
      return generate_llm_recommendation({}) # Fallback to mock if LLM fails

def analyze_buyer_intent(df):
  """
  Analyzes buyer intent from comments and captions based on keywords.
  Returns structured data for the buyer intent discovery section.
  """
  print("Analyzing buyer intent...")
  intent_keywords = {
      "high": ["buy", "price", "cost", "demo", "trial", "subscribe", "plan", "quote", "integrate", "how to get", "purchase", "pricing"],
      "medium": ["feature", "solution", "problem", "help", "support", "learn more", "interested", "compare"],
      "low": ["question", "feedback", "review", "thoughts", "what is"]
  }

  all_texts = []
  if 'comment_text' in df.columns:
      all_texts.extend(df['comment_text'].dropna().tolist())
  if 'media_caption' in df.columns:
      all_texts.extend(df['media_caption'].dropna().tolist())

  intent_signals_raw = []
  intent_categories_counts = Counter()
  
  # Use media_id as a proxy for user for high_intent_users_count
  user_intent_scores = {} # {media_id: score}
  user_last_activity = {} # {media_id: timestamp}

  for index, row in tqdm(df.iterrows(), total=df.shape[0], desc="Analyzing buyer intent signals"): # Added tqdm
      media_id = row.get('media_id', f"post_{index}")
      comment_text = str(row.get('comment_text', '')).lower()
      media_caption = str(row.get('media_caption', '')).lower()
      timestamp = row.get('timestamp')

      current_score = 0
      signals_found = []
      categories_found = set()

      # Check for high intent keywords
      for keyword in intent_keywords["high"]:
          if keyword in comment_text or keyword in media_caption:
              current_score += 10
              signals_found.append(f"Keyword: '{keyword}'")
              if keyword in ["price", "pricing", "cost", "quote"]: categories_found.add("Pricing Questions")
              elif keyword in ["demo", "trial", "subscribe", "buy", "purchase"]: categories_found.add("Demo/Purchase Intent")
              elif keyword in ["integrate"]: categories_found.add("Integration Inquiry")

      # Check for medium intent keywords
      for keyword in intent_keywords["medium"]:
          if keyword in comment_text or keyword in media_caption:
              current_score += 5
              signals_found.append(f"Keyword: '{keyword}'")
              if keyword in ["feature", "solution"]: categories_found.add("Feature Requests")
              elif keyword in ["help", "support"]: categories_found.add("Support Inquiry")

      # Check for low intent keywords
      for keyword in intent_keywords["low"]:
          if keyword in comment_text or keyword in media_caption:
              current_score += 1
              signals_found.append(f"Keyword: '{keyword}'")
              if keyword in ["question", "feedback", "review"]: categories_found.add("General Inquiry/Feedback")

      if current_score > 0:
          # Aggregate score per user (media_id)
          user_intent_scores[media_id] = max(user_intent_scores.get(media_id, 0), current_score)
          if pd.notna(timestamp):
              user_last_activity[media_id] = max(user_last_activity.get(media_id, timestamp), timestamp)

          # Add to raw signals for detailed list
          if signals_found:
              text_sample = comment_text if comment_text else media_caption
              intent_signals_raw.append({
                  "user": f"@{str(media_id)[:8]}...", # Use a truncated media_id as user handle
                  "intent": "High" if current_score >= 10 else ("Medium" if current_score >= 5 else "Low"),
                  "score": min(100, current_score * 5), # Scale score to 0-100
                  "signals": list(set(signals_found)), # Unique signals
                  "lastActivity": (datetime.now() - timestamp).days, # Days ago (both are now naive)
                  "predictedValue": f"${int(min(100, current_score * 5) * 15 + random.uniform(-50, 50)):,}" # Scale score to 0-100 and then calculate value
              })
          
          for cat in categories_found:
              intent_categories_counts[cat] += 1

  # Sort intent signals by score
  intent_signals_raw.sort(key=lambda x: x['score'], reverse=True)
  
  high_intent_users_count = sum(1 for score in user_intent_scores.values() if score >= 10) # Users with score >= 10
  active_prospects = len(user_intent_scores) # All users with any intent signal

  # Dynamic predicted revenue and conversion rate based on high intent users
  predicted_revenue = f"${int(high_intent_users_count * 250 + random.uniform(0, 5000)):,}" if high_intent_users_count > 0 else "$0"
  conversion_rate = f"{int(min(100, 25 + (high_intent_users_count / max(1, active_prospects)) * 15 + random.uniform(-2, 2)))}%" if high_intent_users_count > 0 else "0%"

  # Dynamic conversion predictions
  base_probability = 70 if high_intent_users_count > 0 else 10
  conversion_predictions = [
      {"timeframe": "Next 7 days", "probability": min(95, base_probability + random.randint(0, 5)), "users": int(high_intent_users_count * random.uniform(0.1, 0.3))},
      {"timeframe": "Next 14 days", "probability": min(90, base_probability - random.randint(0, 5)), "users": int(high_intent_users_count * random.uniform(0.3, 0.5))},
      {"timeframe": "Next 30 days", "probability": min(80, base_probability - random.randint(5, 10)), "users": int(high_intent_users_count * random.uniform(0.5, 0.7))},
      {"timeframe": "Next 60 days", "probability": min(70, base_probability - random.randint(10, 20)), "users": int(high_intent_users_count * random.uniform(0.7, 1.0))},
  ]

  # Dynamic intent categories
  intent_categories_data = []
  for category, count in intent_categories_counts.most_common():
      # Assign a mock value for each category
      value = f"${int(count * random.uniform(200, 600)):,}"
      intent_categories_data.append({"category": category, "count": int(count), "value": value})

  # Dynamic next best actions
  next_best_actions = []
  if "Demo/Purchase Intent" in intent_categories_counts:
      next_best_actions.append({"action": "Send personalized product demo", "users": int(intent_categories_counts["Demo/Purchase Intent"]), "priority": "High", "expectedLift": "+25-35% conversion"})
  if "Pricing Questions" in intent_categories_counts:
      next_best_actions.append({"action": "Drop limited-time coupon", "users": int(intent_categories_counts["Pricing Questions"]), "priority": "Medium", "expectedLift": "+15-20% conversion"})
  if "Feature Requests" in intent_categories_counts:
      next_best_actions.append({"action": "Schedule feature discussion call", "users": int(intent_categories_counts["Feature Requests"]), "priority": "Medium", "expectedLift": "+10-15% engagement"})
  if not next_best_actions and high_intent_users_count > 0: # Fallback if no specific categories
      next_best_actions.append({"action": "Schedule general follow-up call", "users": high_intent_users_count, "priority": "High", "expectedLift": "+20-30% close rate"})
  elif not next_best_actions: # Default if no intent detected
      next_best_actions.append({"action": "Engage with top posts", "users": 0, "priority": "Low", "expectedLift": "+5-10% engagement"})

  print("Buyer intent analysis complete.")
  return {
      "high_intent_users_count": int(high_intent_users_count),
      "predicted_revenue": predicted_revenue,
      "conversion_rate": conversion_rate,
      "active_prospects": int(active_prospects),
      "intent_signals": intent_signals_raw[:5], # Limit to top 5 for display
      "conversion_predictions": conversion_predictions,
      "intent_categories": intent_categories_data,
      "intent_signal_trends": generate_mock_trends(datetime.now() - timedelta(days=30), 5, int(high_intent_users_count / 2), int(high_intent_users_count / 10)),
      "next_best_actions": next_best_actions,
  }


@app.route('/analyze', methods=['POST'])
def analyze_data():
  """
  Receives CSV data, processes it, and returns structured analytics.
  """
  print(f"[{datetime.now()}] Received /analyze request.")
  if not request.is_json:
      print(f"[{datetime.now()}] Error: Request must be JSON.")
      return jsonify({"error": "Request must be JSON"}), 400

  csv_content = request.json.get('csv_data')
  if not csv_content:
      print(f"[{datetime.now()}] Error: No CSV data provided.")
      return jsonify({"error": "No CSV data provided"}), 400

  try:
      df = parse_csv_data(csv_content)
  except Exception as e:
      print(f"[{datetime.now()}] Error parsing CSV: {str(e)}")
      return jsonify({"error": f"Failed to parse CSV: {str(e)}"}), 400

  # --- Engagement Metrics ---
  print(f"[{datetime.now()}] Starting Engagement Metrics analysis.")
  total_comments = int(df['comment_text'].dropna().astype(str).str.strip().astype(bool).sum())
  total_posts = int(df['media_id'].nunique())

  engagement_over_time = []
  if 'timestamp' in df.columns:
      df_valid_ts = df.dropna(subset=['timestamp'])
      daily_activity = df_valid_ts.groupby(df_valid_ts['timestamp'].dt.date).agg(
          posts=('media_id', 'nunique'),
          comments=('comment_text', lambda x: x.dropna().astype(str).str.strip().astype(bool).sum())
      ).reset_index()
      daily_activity['date'] = daily_activity['timestamp'].astype(str)
      daily_activity['posts'] = daily_activity['posts'].astype(int)
      daily_activity['comments'] = daily_activity['comments'].astype(int)
      engagement_over_time = daily_activity[['date', 'posts', 'comments']].to_dict(orient='records')

  peak_engagement_hours = []
  if 'timestamp' in df.columns:
      hourly_activity = df_valid_ts.groupby(df_valid_ts['timestamp'].dt.hour).size().reset_index(name='activity')
      hourly_activity.columns = ['hour_int', 'activity']
      hourly_activity['hour'] = hourly_activity['hour_int'].apply(lambda x: f"{x:02d}:00") # Format as HH:00
      hourly_activity['activity'] = hourly_activity['activity'].astype(int)
      peak_engagement_hours = hourly_activity[['hour', 'activity']].to_dict(orient='records')

  top_performing_posts = []
  if 'media_id' in df.columns and 'comment_text' in df.columns:
      post_comments_count = df.groupby('media_id')['comment_text'].apply(lambda x: x.dropna().astype(str).str.strip().astype(bool).sum()).reset_index(name='comments')
      post_captions = df[['media_id', 'media_caption']].drop_duplicates(subset=['media_id'])
      merged_posts = pd.merge(post_comments_count, post_captions, on='media_id', how='left')
      merged_posts['comments'] = merged_posts['comments'].astype(int)
      top_performing_posts = merged_posts.sort_values(by='comments', ascending=False).head(5).to_dict(orient='records')
  print(f"[{datetime.now()}] Engagement Metrics analysis complete.")


  # --- Publishing Recommendations ---
  print(f"[{datetime.now()}] Starting Publishing Recommendations analysis.")
  best_posting_times_data = []
  if 'timestamp' in df.columns:
      hourly_posts = df_valid_ts.groupby(df_valid_ts['timestamp'].dt.hour).size().reset_index(name='count')
      hourly_posts.columns = ['hour_int', 'engagement']
      hourly_posts['time'] = hourly_posts['hour_int'].apply(lambda x: f"{x:02d}:00") # Format as HH:00
      hourly_posts['engagement'] = hourly_posts['engagement'].astype(int)
      best_posting_times_data = hourly_posts[['time', 'engagement']].to_dict(orient='records')
  print(f"[{datetime.now()}] Publishing Recommendations analysis complete.")

  # --- Diagnostic Metrics ---
  print(f"[{datetime.now()}] Starting Diagnostic Metrics analysis.")
  ugc_volume = total_comments
  performance_trends_data = engagement_over_time
  print(f"[{datetime.now()}] Diagnostic Metrics analysis complete.")

  # --- Sentiment Analysis (Actual NLP) ---
  print(f"[{datetime.now()}] Starting Sentiment Analysis.")
  all_texts_for_sentiment = df['comment_text'].dropna().tolist() + df['media_caption'].dropna().tolist()
  
  sentiments_results = [get_sentiment(text) for text in tqdm(all_texts_for_sentiment, desc="Analyzing sentiment")] # Added tqdm
  sentiment_counts = Counter(sentiments_results)
  
  total_sentiment_analyzed = sum(sentiment_counts.values())
  positive_pct = int((sentiment_counts['positive'] / total_sentiment_analyzed * 100) if total_sentiment_analyzed > 0 else 0)
  neutral_pct = int((sentiment_counts['neutral'] / total_sentiment_analyzed * 100) if total_sentiment_analyzed > 0 else 0)
  negative_pct = int((sentiment_counts['negative'] / total_sentiment_analyzed * 100) if total_sentiment_analyzed > 0 else 0)
  
  overall_sentiment_label = "Neutral"
  if positive_pct > negative_pct and positive_pct > neutral_pct:
      overall_sentiment_label = "Positive"
  elif negative_pct > positive_pct and negative_pct > neutral_pct:
      overall_sentiment_label = "Negative"

  # Top Mentions (with actual sentiment)
  top_mentions_data = []
  # Take a sample of comments/captions for top mentions
  sample_texts = random.sample(all_texts_for_sentiment, min(5, len(all_texts_for_sentiment)))
  for text in sample_texts:
      top_mentions_data.append({
          "text": text,
          "sentiment": get_sentiment(text),
          "engagement": random.randint(50, 500), # Still simulated engagement for simplicity
          "platform": random.choice(["Twitter", "Instagram", "Facebook", "LinkedIn"])
      })

  # Trending Topics (Actual Keyword Extraction)
  trending_topics_data = extract_keywords(all_texts_for_sentiment, num_keywords=5) # This calls extract_keywords which has tqdm
  # Add a simulated engagement percentage for display
  for topic in trending_topics_data:
      topic['engagement'] = int(topic['engagement'] / max(1, len(all_texts_for_sentiment)) * 100) # Normalize to a percentage

  # AI Recommendations (Actual LLM)
  llm_recommendations = generate_llm_recommendation({
      "total_posts": total_posts,
      "total_comments": total_comments,
      "top_performing_posts": top_performing_posts,
      "overall_sentiment": {"overall": overall_sentiment_label}
  })
  print(f"[{datetime.now()}] Sentiment Analysis complete.")

  # --- Virality Score (More data-driven simulation) ---
  print(f"[{datetime.now()}] Starting Virality Score calculation.")
  # Base virality on total comments and posts
  virality_score_value = int(min(100, (total_comments + total_posts * 5) / 100)) # Simple heuristic
  virality_score_value = max(60, virality_score_value) # Ensure a minimum score for display
  print(f"[{datetime.now()}] Virality Score calculation complete.")

  # --- Buyer Intent Discovery (Actual Analysis) ---
  print(f"[{datetime.now()}] Starting Buyer Intent Discovery analysis.")
  buyer_intent_data = analyze_buyer_intent(df) # This calls analyze_buyer_intent which has tqdm
  print(f"[{datetime.now()}] Buyer Intent Discovery analysis complete.")

  # --- Advocate Identification (Mostly mock) ---
  print(f"[{datetime.now()}] Starting Advocate Identification analysis (mostly mock).")
  # No specific loops here to wrap with tqdm, keep print statements.
  print(f"[{datetime.now()}] Advocate Identification analysis complete.")


  response_data = {
      "engagement_metrics": {
          "total_posts": total_posts,
          "total_comments": total_comments,
          "engagement_over_time": engagement_over_time,
          "peak_engagement_hours": peak_engagement_hours,
          "top_performing_posts": top_performing_posts,
          "metrics_summary": [
              {"title": "Total Engagement", "value": f"{total_comments + total_posts * 5}", "change": f"+{random.uniform(5, 20):.1f}%", "trend": "up", "icon": "Heart", "color": "text-red-500"},
              {"title": "Comments", "value": f"{total_comments}", "change": f"+{random.uniform(5, 20):.1f}%", "trend": "up", "icon": "MessageCircle", "color": "text-blue-500"},
              {"title": "Shares", "value": f"{random.randint(10, 50)}K", "change": f"-{random.uniform(1, 5):.1f}%", "trend": "down", "icon": "Share", "color": "text-green-500"},
              {"title": "Reach", "value": f"{random.randint(500, 1500)}K", "change": f"+{random.uniform(10, 25):.1f}%", "trend": "up", "icon": "Eye", "color": "text-purple-500"},
          ],
          "engagement_by_post_type": [ # Still mock as post type is not in CSV
              {"type": "Video", "engagement": 3200},
              {"type": "Image", "engagement": 2800},
              {"type": "Carousel", "engagement": 2400},
              {"type": "Text", "engagement": 1600},
          ]
      },
      "publishing_recommendations": {
          "best_posting_times": best_posting_times_data,
          "engagement_forecast": generate_mock_trends(datetime.now(), 7, 1500, 500),
          "trending_topics": trending_topics_data, # Actual NLP
          "ai_recommendations": llm_recommendations, # Actual LLM
          "upcoming_posts": [
              {"time": "Today, 14:30", "content": "Product feature highlight", "status": "Scheduled"},
              {"time": "Tomorrow, 10:00", "content": "Customer testimonial", "status": "Draft"},
              {"time": "Wed, 15:15", "content": "Industry news commentary", "status": "Scheduled"},
              {"time": "Thu, 13:45", "content": "Behind-the-scenes video", "status": "Draft"},
              {"time": "Fri, 16:00", "content": "Weekly roundup", "status": "Scheduled"},
          ]
      },
      "diagnostic_metrics": {
          "ugc_volume": ugc_volume,
          "performance_trends": performance_trends_data,
          "current_metrics": [
              {"title": "Follower Growth Rate", "current": "3.2%", "previous": "2.8%", "trend": "up", "target": "4.0%", "progress": 80},
              {"title": "Engagement Rate", "current": "5.7%", "previous": "6.1%", "trend": "down", "target": "6.5%", "progress": 88},
              {"title": "Reach Growth", "current": "12.4%", "previous": "10.2%", "trend": "up", "target": "15.0%", "progress": 83},
              {"title": "Click-through Rate", "current": "2.1%", "previous": "1.9%", "trend": "up", "target": "2.5%", "progress": 84},
              {"title": "UGC Volume (from data)", "current": str(ugc_volume), "previous": "0", "trend": "up", "target": "N/A", "progress": 100},
              {"title": "Social Response Rate", "current": "36%", "previous": "0%", "trend": "up", "target": "N/A", "progress": 100},
              {"title": "Overall Engagement Lift", "current": "61%", "previous": "0%", "trend": "up", "target": "N/A", "progress": 100},
              {"title": "Lead Capture Effectiveness", "current": "1,062+ opt-ins / 3.6K+ giveaway", "previous": "0", "trend": "up", "target": "N/A", "progress": 100},
              {"title": "Operational Time Savings", "current": "18 workdays / 20 hrs weekly", "previous": "0", "trend": "up", "target": "N/A", "progress": 100},
          ],
          "diagnostic_alerts": [
              {"type": "success", "title": "Scrollmark Active", "description": "Scrollmark is actively enhancing your content strategy.", "action": "Monitor performance", "icon": "CheckCircle"},
              {"type": "info", "title": "Content Optimization Opportunities", "description": "Scrollmark has identified areas for content improvement.", "action": "Review recommendations", "icon": "Activity"},
              {"type": "success", "title": "Lead Generation Boost", "description": "Scrollmark is driving significant lead capture.", "action": "Analyze lead quality", "icon": "CheckCircle"},
              {"type": "warning", "title": "Potential Time Savings", "description": "Scrollmark can further optimize operational efficiency.", "action": "Explore advanced features", "icon": "AlertTriangle"},
          ],
          "audience_insights": [
              {"metric": "Age 18-24", "percentage": 28, "change": "+2%"},
              {"metric": "Age 25-34", "percentage": 35, "change": "+1%"},
              {"metric": "Age 35-44", "percentage": 22, "change": "-1%"},
              {"metric": "Age 45+", "percentage": 15, "change": "0%"},
          ]
      },
      "sentiment_analysis": {
          "overall_sentiment": {"positive": positive_pct, "neutral": neutral_pct, "negative": negative_pct, "overall": overall_sentiment_label}, # Actual NLP
          "sentiment_trends": [ # Still mock, but can be enhanced with time-series sentiment
              {"period": "This Week", "positive": positive_pct, "neutral": neutral_pct, "negative": negative_pct},
              {"period": "Last Week", "positive": max(0, positive_pct - 5), "neutral": max(0, neutral_pct + 2), "negative": max(0, negative_pct + 3)},
              {"period": "2 Weeks Ago", "positive": max(0, positive_pct - 2), "neutral": max(0, neutral_pct + 1), "negative": max(0, negative_pct + 1)},
              {"period": "3 Weeks Ago", "positive": max(0, positive_pct - 7), "neutral": max(0, neutral_pct + 4), "negative": max(0, negative_pct + 3)},
          ],
          "advocacy_keywords": [ # Still mock, but can be enhanced with NLP
              {"keyword": "#innovation", "mentions": 1247, "sentiment": "positive", "growth": "+15%", "positive_pct": 90, "negative_pct": 2, "neutral_pct": 8},
              {"keyword": "#quality", "mentions": 892, "sentiment": "positive", "growth": "+8%", "positive_pct": 85, "negative_pct": 5, "neutral_pct": 10},
              {"keyword": "#customerservice", "mentions": 634, "sentiment": "positive", "growth": "+12%", "positive_pct": 92, "negative_pct": 3, "neutral_pct": 5},
              {"keyword": "#sustainability", "mentions": 521, "sentiment": "positive", "growth": "+22%", "positive_pct": 88, "negative_pct": 4, "neutral_pct": 8},
              {"keyword": "#leadership", "mentions": 387, "sentiment": "positive", "growth": "+5%", "positive_pct": 82, "negative_pct": 6, "neutral_pct": 12},
              {"keyword": "#community", "mentions": 298, "sentiment": "positive", "growth": "+18%", "positive_pct": 95, "negative_pct": 1, "neutral_pct": 4},
          ],
          "keyword_performance": trending_topics_data, # Actual NLP
          "top_mentions": top_mentions_data, # Actual NLP
          "feature_sentiment": [ # Still mock
              {"feature": "UI Design", "positive": 75, "negative": 15, "neutral": 10},
              {"feature": "Customer Support", "positive": 85, "negative": 5, "neutral": 10},
              {"feature": "Pricing", "positive": 40, "negative": 50, "neutral": 10},
              {"feature": "Performance", "positive": 70, "negative": 20, "neutral": 10},
          ],
          "customer_feedback_categories": [ # Still mock
              {"category": "Ease of Use", "positive": 80, "negative": 5, "neutral": 15},
              {"category": "Feature Request", "positive": 20, "negative": 60, "neutral": 20},
              {"category": "Bug Report", "positive": 5, "negative": 85, "neutral": 10},
              {"category": "General Praise", "positive": 90, "negative": 2, "neutral": 8},
          ],
          "sentiment_signals": [ # Still mock
              {"signal": "Increased positive mentions of UI after update", "insight": "New UI changes well received"},
              {"signal": "Spike in negative mentions of pricing", "insight": "Potential need to re-evaluate pricing strategy"},
              {"signal": "High positive sentiment around customer support", "insight": "Customer support is a key strength"},
          ],
          "product_features_sentiment": [ # Still mock
              {"feature": "Dashboard", "positive": 80, "negative": 10, "neutral": 10, "praised": "Intuitive design", "painPoint": "Loading times"},
              {"feature": "Reporting", "positive": 65, "negative": 25, "neutral": 10, "praised": "Comprehensive data", "painPoint": "Difficult to export"},
              {"feature": "Integrations", "positive": 75, "negative": 15, "neutral": 10, "praised": "Seamless connectivity", "painPoint": "Limited options"},
          ]
      },
      "virality_score": {
          "virality_score_value": virality_score_value, # More data-driven
          "virality_factors": [ # Still mock, but can be enhanced
              {"factor": "Content Quality", "score": 85, "description": "High-quality, engaging content"},
              {"factor": "Timing", "score": 72, "description": "Posted during peak hours"},
              {"factor": "Hashtag Strategy", "score": 68, "description": "Relevant and trending hashtags"},
              {"factor": "Audience Alignment", "score": 91, "description": "Perfect match with target audience"},
              {"factor": "Emotional Appeal", "score": 78, "description": "Strong emotional resonance"},
              {"factor": "Visual Impact", "score": 83, "description": "Eye-catching visual elements"},
          ],
          "past_viral_posts": [ # Still mock
              {"content": "Behind-the-scenes of our product development process", "score": 94, "reach": "2.3M", "engagement": "187K", "shares": "45K", "date": "2 days ago"},
              {"content": "Customer success story featuring local business", "score": 89, "reach": "1.8M", "engagement": "142K", "shares": "38K", "date": "1 week ago"},
              {"content": "Industry trend analysis and predictions", "score": 82, "reach": "1.2M", "engagement": "98K", "shares": "22K", "date": "2 weeks ago"},
          ],
          "virality_trends": generate_mock_trends(datetime.now() - timedelta(days=180), 6, virality_score_value, 10), # Data-driven mock
          "virality_tips": [ # Still mock
              "Use trending hashtags relevant to your industry",
              "Post during peak engagement hours (2-4 PM)",
              "Include compelling visuals or videos",
              "Ask questions to encourage comments",
              "Share authentic, behind-the-scenes content",
              "Collaborate with influencers or partners",
          ]
      },
      "buyer_intent_discovery": buyer_intent_data, # Actual Analysis
      "advocate_identification": { # Mostly mock, but can be enhanced with user tracking
          "community_health": [
              {"metric": "Active Advocates", "value": 247, "change": "+18%", "icon": "Users"},
              {"metric": "UGC Volume", "value": 373, "change": "+24%", "icon": "MessageSquare"},
              {"metric": "Advocacy Score", "value": 8.4, "change": "+12%", "icon": "Star"},
              {"metric": "Community Growth", "value": "15.2%", "change": "+3.1%", "icon": "TrendingUp"},
          ],
          "top_advocates": [
              {"user": "@emma_creative", "name": "Emma Johnson", "tier": "Champion", "score": 95, "ugcCount": 23, "engagement": 4200, "influence": 8500, "loyaltyPoints": 2400, "activities": ["Created 5 UGCs this week", "Referred 3 new customers", "Responded to 12 comments"]},
              {"user": "@david_tech", "name": "David Chen", "tier": "Advocate", "score": 88, "ugcCount": 18, "engagement": 3100, "influence": 6200, "loyaltyPoints": 1800, "activities": ["Shared product launch", "Engaged with 8 posts", "Created tutorial video"]},
              {"user": "@lisa_entrepreneur", "name": "Lisa Rodriguez", "tier": "Champion", "score": 92, "ugcCount": 31, "engagement": 5600, "influence": 12000, "loyaltyPoints": 3200, "activities": ["Top UGC creator", "Hosted live session", "Mentored new users"]},
              {"user": "@ryan_designer", "name": "Ryan Park", "tier": "Supporter", "score": 76, "ugcCount": 12, "engagement": 2400, "influence": 3800, "loyaltyPoints": 1200, "activities": ["Consistent engagement", "Quality feedback", "Community participation"]},
          ],
          "advocacy_tiers": [
              {"tier": "Champions", "count": 23, "percentage": 9.3, "color": "#FFD700"},
              {"tier": "Advocates", "count": 67, "percentage": 27.1, "color": "#C0C0C0"},
              {"tier": "Supporters", "count": 157, "percentage": 63.6, "color": "#CD7F32"},
          ],
          "ugc_performance": generate_mock_trends(datetime.now() - timedelta(days=150), 5, 150, 50),
          "advocate_performance_radar": [
              {"metric": "UGC Creation", "score": 92},
              {"metric": "Engagement", "score": 88},
              {"metric": "Influence", "score": 85},
              {"metric": "Loyalty", "score": 94},
              {"metric": "Advocacy", "score": 90},
              {"metric": "Community", "score": 87},
          ],
          "loyalty_program_performance": {
              "points_distribution": [
                  {"activity": "UGC Creation", "points": 500, "count": 89},
                  {"activity": "Comments", "points": 50, "count": 1247},
                  {"activity": "Shares", "points": 100, "count": 456},
                  {"activity": "Mentions", "points": 150, "count": 234},
                  {"activity": "Referrals", "points": 1000, "count": 67},
              ],
              "reward_redemptions": [
                  {"reward": "Exclusive Content", "redeemed": 45, "points": 500},
                  {"reward": "Product Discount", "redeemed": 32, "points": 1000},
                  {"reward": "Early Access", "redeemed": 28, "points": 750},
                  {"reward": "Branded Merchandise", "redeemed": 19, "points": 1500},
                  {"reward": "VIP Event Access", "redeemed": 12, "points": 2500},
              ],
              "program_impact": [
                  {"metric": "Engagement Lift", "value": "61%", "trend": "up"},
                  {"metric": "UGC Increase", "value": "127%", "trend": "up"},
                  {"metric": "Retention Rate", "value": "84%", "trend": "up"},
                  {"metric": "Referral Rate", "value": "23%", "trend": "up"},
                  {"metric": "Brand Sentiment", "value": "+18%", "trend": "up"},
              ]
          }
      }
  }

  print(f"[{datetime.now()}] Returning response data.")
  return jsonify(response_data)

if __name__ == '__main__':
  app.run(debug=False, port=5000) # Run on port 5000
