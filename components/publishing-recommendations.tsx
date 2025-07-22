"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Calendar, Target, Lightbulb, CheckCircle, TrendingUp, Rocket, Wand2 } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

interface PublishingRecommendationsProps {
  data: {
    best_posting_times: { time: string; engagement: number }[]
    engagement_forecast: { date: string; value: number }[]
    trending_topics: { topic: string; engagement: number }[]
    ai_recommendations: {
      type: string
      title: string
      description: string
      priority: string
      icon: string
      color: string
      action: string
    }[]
    upcoming_posts: { time: string; content: string; status: string }[]
  }
}

// Map icon names from backend to Lucide React components
const iconMap: { [key: string]: React.ElementType } = {
  Clock: Clock,
  Target: Target,
  Calendar: Calendar,
  Lightbulb: Lightbulb,
  Wand2: Wand2,
  CheckCircle: CheckCircle,
  TrendingUp: TrendingUp,
  Rocket: Rocket,
}

export function PublishingRecommendations({ data }: PublishingRecommendationsProps) {
  const { best_posting_times, engagement_forecast, trending_topics, ai_recommendations, upcoming_posts } = data

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Rocket className="h-6 w-6 text-primary" />
        <h2 className="text-lg font-semibold">SocialGPT Co-pilot</h2>
        <span className="text-sm text-muted-foreground">Your AI-powered social media assistant</span>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Best Posting Times</CardTitle>
            <CardDescription>Optimal hours based on your audience activity from uploaded data</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                activity: {
                  label: "Activity",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="aspect-[4/3]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={best_posting_times}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="engagement" fill="var(--color-activity)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Engagement Forecast</CardTitle>
            <CardDescription>Predicted engagement for the next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                predicted: {
                  label: "Predicted Engagement",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="aspect-[4/3]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={engagement_forecast}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="var(--color-predicted)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trending Topics</CardTitle>
          <CardDescription>Current trending topics to boost your content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {trending_topics.map((topic, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{topic.topic}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Engagement: {topic.engagement}%</Badge>
                  <Button size="sm" variant="ghost">
                    Create Content
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Recommendations</CardTitle>
          <CardDescription>Personalized suggestions to improve your social media performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {ai_recommendations.map((rec, index) => {
              const IconComponent = iconMap[rec.icon] || Lightbulb
              return (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <IconComponent className={`h-5 w-5 ${rec.color}`} />
                      <Badge variant="outline">{rec.type}</Badge>
                    </div>
                    <Badge
                      variant={
                        rec.priority === "High" ? "destructive" : rec.priority === "Medium" ? "default" : "secondary"
                      }
                    >
                      {rec.priority}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-medium">{rec.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                  </div>
                  <Button size="sm" variant="outline" className="w-full bg-transparent">
                    {rec.action}
                  </Button>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content Calendar</CardTitle>
          <CardDescription>Upcoming scheduled and draft posts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcoming_posts.map((post, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{post.time}</span>
                  </div>
                  <span className="text-sm">{post.content}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={post.status === "Scheduled" ? "default" : "secondary"}>
                    {post.status === "Scheduled" && <CheckCircle className="h-3 w-3 mr-1" />}
                    {post.status}
                  </Badge>
                  <Button size="sm" variant="ghost">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
