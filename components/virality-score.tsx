"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Zap, TrendingUp, Users, Share, Clock, Sparkles } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"

interface ViralityScoreProps {
  data: {
    virality_score_value: number
    virality_factors: { factor: string; score: number; description: string }[]
    past_viral_posts: {
      content: string
      score: number
      reach: string
      engagement: string
      shares: string
      date: string
    }[]
    virality_trends: { date: string; value: number }[]
    virality_tips: string[]
  }
}

export function ViralityScore({ data }: ViralityScoreProps) {
  const { virality_score_value, virality_factors, past_viral_posts, virality_trends, virality_tips } = data

  const [newPostContent, setNewPostContent] = useState("")
  const [viralityScore, setViralityScore] = useState<number | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const analyzePost = async () => {
    if (!newPostContent.trim()) return

    setIsAnalyzing(true)
    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setViralityScore(Math.floor(Math.random() * 40) + 60) // Random score between 60-100
    setIsAnalyzing(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            New Post Virality Predictor
          </CardTitle>
          <CardDescription>Analyze your post content to predict its viral potential (simulated)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter your post content here..."
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            className="min-h-[100px]"
          />
          <Button onClick={analyzePost} disabled={!newPostContent.trim() || isAnalyzing} className="w-full">
            {isAnalyzing ? "Analyzing..." : "Analyze Virality Potential"}
          </Button>

          {viralityScore !== null && (
            <div className="p-4 border rounded-lg bg-gradient-to-r from-purple-50 to-pink-50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Virality Score</span>
                <Badge variant={viralityScore >= 80 ? "default" : viralityScore >= 60 ? "secondary" : "destructive"}>
                  {viralityScore >= 80 ? "High Potential" : viralityScore >= 60 ? "Medium Potential" : "Low Potential"}
                </Badge>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold text-purple-600">{viralityScore}/100</div>
                <Progress value={viralityScore} className="flex-1 h-3" />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {viralityScore >= 80
                  ? "Excellent! This post has high viral potential."
                  : viralityScore >= 60
                    ? "Good potential. Consider optimizing timing and hashtags."
                    : "Low potential. Review content strategy and timing."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Virality Factors Analysis</CardTitle>
            <CardDescription>Key factors contributing to viral potential</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                score: {
                  label: "Score",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="aspect-square"
            >
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  data={virality_factors.map((f) => ({
                    factor: f.factor.split(" ")[0], // Shorten for chart axis
                    score: f.score,
                  }))}
                >
                  <PolarGrid />
                  <PolarAngleAxis dataKey="factor" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="var(--color-score)"
                    fill="var(--color-score)"
                    fillOpacity={0.3}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </RadarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Virality Factor Breakdown</CardTitle>
            <CardDescription>Detailed analysis of each factor</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {virality_factors.map((factor, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{factor.factor}</span>
                    <span className="text-sm font-bold">{factor.score}/100</span>
                  </div>
                  <Progress value={factor.score} className="h-2" />
                  <p className="text-xs text-muted-foreground">{factor.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Viral Post History</CardTitle>
          <CardDescription>Your top-performing viral posts and their metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {past_viral_posts.map((post, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <p className="font-medium flex-1 pr-4">{post.content}</p>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span className="font-bold text-lg">{post.score}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3 text-blue-500" />
                    <span className="text-muted-foreground">Reach:</span>
                    <span className="font-medium">{post.reach}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-muted-foreground">Engagement:</span>
                    <span className="font-medium">{post.engagement}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Share className="h-3 w-3 text-purple-500" />
                    <span className="text-muted-foreground">Shares:</span>
                    <span className="font-medium">{post.shares}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-orange-500" />
                    <span className="text-muted-foreground">{post.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Virality Trends</CardTitle>
            <CardDescription>Your viral score trends over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                score: {
                  label: "Virality Score",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="aspect-[4/3]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={virality_trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="value" stroke="var(--color-score)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Virality Tips</CardTitle>
            <CardDescription>AI-powered recommendations to increase viral potential</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {virality_tips.map((tip, index) => (
                <div key={index} className="flex items-start gap-2 p-2 rounded-lg bg-muted/50">
                  <Sparkles className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{tip}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
