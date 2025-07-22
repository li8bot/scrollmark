"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Smile, Frown, Meh, Hash, TrendingUp } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  PieChart,
  Pie,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"

interface SentimentAnalysisProps {
  data: {
    overall_sentiment: { positive: number; neutral: number; negative: number; overall: string }
    sentiment_trends: { period: string; positive: number; neutral: number; negative: number }[]
    advocacy_keywords: {
      keyword: string
      mentions: number
      sentiment: string
      growth: string
      positive_pct: number
      negative_pct: number
      neutral_pct: number
    }[]
    keyword_performance: { keyword: string; mentions: number }[]
    top_mentions: { text: string; sentiment: string; engagement: number; platform: string }[]
    feature_sentiment: { feature: string; positive: number; negative: number; neutral: number }[]
    customer_feedback_categories: { category: string; positive: number; negative: number; neutral: number }[]
    sentiment_signals: { signal: string; insight: string }[]
    product_features_sentiment: {
      feature: string
      positive: number
      negative: number
      neutral: number
      praised: string
      painPoint: string
    }[]
  }
}

export function SentimentAnalysis({ data }: SentimentAnalysisProps) {
  const {
    overall_sentiment,
    sentiment_trends,
    advocacy_keywords,
    keyword_performance,
    top_mentions,
    feature_sentiment,
    customer_feedback_categories,
    sentiment_signals,
    product_features_sentiment,
  } = data

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Sentiment</CardTitle>
            <Smile className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{overall_sentiment.overall}</div>
            <p className="text-xs text-muted-foreground">Based on 12.4K mentions (simulated)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Positive</CardTitle>
            <Smile className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overall_sentiment.positive}%</div>
            <Progress value={overall_sentiment.positive} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Neutral</CardTitle>
            <Meh className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overall_sentiment.neutral}%</div>
            <Progress value={overall_sentiment.neutral} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Negative</CardTitle>
            <Frown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overall_sentiment.negative}%</div>
            <Progress value={overall_sentiment.negative} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Distribution</CardTitle>
            <CardDescription>Current sentiment breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                positive: { label: "Positive", color: "hsl(var(--chart-1))" },
                neutral: { label: "Neutral", color: "hsl(var(--chart-2))" },
                negative: { label: "Negative", color: "hsl(var(--chart-3))" },
              }}
              className="aspect-square"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Positive", value: overall_sentiment.positive, fill: "var(--color-positive)" },
                      { name: "Neutral", value: overall_sentiment.neutral, fill: "var(--color-neutral)" },
                      { name: "Negative", value: overall_sentiment.negative, fill: "var(--color-negative)" },
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Sentiment Trends</CardTitle>
            <CardDescription>Sentiment evolution over the past 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                positive: { label: "Positive", color: "hsl(var(--chart-1))" },
                neutral: { label: "Neutral", color: "hsl(var(--chart-2))" },
                negative: { label: "Negative", color: "hsl(var(--chart-3))" },
              }}
              className="aspect-[2/1]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sentiment_trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="positive" stroke="var(--color-positive)" strokeWidth={2} />
                  <Line type="monotone" dataKey="neutral" stroke="var(--color-neutral)" strokeWidth={2} />
                  <Line type="monotone" dataKey="negative" stroke="var(--color-negative)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Advocacy Keywords</CardTitle>
            <CardDescription>Top positive keywords and hashtags driving advocacy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {advocacy_keywords.map((keyword, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="font-medium">{keyword.keyword}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          Positive: {keyword.positive_pct}% | Negative: {keyword.negative_pct}% | Neutral:{" "}
                          {keyword.neutral_pct}%
                        </Badge>
                        <span className="text-sm text-muted-foreground">{keyword.mentions} mentions</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-sm text-green-600">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {keyword.growth}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Keyword Performance</CardTitle>
            <CardDescription>Advocacy keyword mention volume</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                mentions: {
                  label: "Mentions",
                  color: "hsl(var(--chart-4))",
                },
              }}
              className="aspect-[4/3]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={keyword_performance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="keyword" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="mentions" fill="var(--color-mentions)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Mentions (from uploaded data)</CardTitle>
          <CardDescription>Recent posts and comments from your data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {top_mentions.length > 0 ? (
              top_mentions.map((mention, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-start justify-between">
                    <p className="text-sm flex-1 pr-4">"{mention.text}"</p>
                    <Badge
                      variant={
                        mention.sentiment === "positive"
                          ? "default"
                          : mention.sentiment === "negative"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {mention.sentiment} (simulated)
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{mention.platform}</span>
                    <span>{mention.engagement} engagements (simulated)</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No comments or media captions found in the uploaded data.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Product Feature Sentiment</CardTitle>
          <CardDescription>Sentiment analysis of specific product features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {feature_sentiment.map((feature, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-2">
                <p className="text-sm font-medium">{feature.feature}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Positive: {feature.positive}%</span>
                  <span>Negative: {feature.negative}%</span>
                  <span>Neutral: {feature.neutral}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customer Feedback Categories</CardTitle>
          <CardDescription>Categorization of customer feedback beyond sentiment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {customer_feedback_categories.map((category, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-2">
                <p className="text-sm font-medium">{category.category}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Positive: {category.positive}%</span>
                  <span>Negative: {category.negative}%</span>
                  <span>Neutral: {category.neutral}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sentiment Signals</CardTitle>
          <CardDescription>Actionable insights derived from sentiment analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sentiment_signals.map((signal, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-2">
                <p className="text-sm font-medium">{signal.signal}</p>
                <p className="text-xs text-muted-foreground">{signal.insight}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Product Features - Praised & Pain Points</CardTitle>
          <CardDescription>Specific features and associated feedback</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {product_features_sentiment.map((feature, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-2">
                <p className="text-sm font-medium">{feature.feature}</p>
                <p className="text-xs text-muted-foreground">Praised: {feature.praised}</p>
                <p className="text-xs text-muted-foreground">Pain Point: {feature.painPoint}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
