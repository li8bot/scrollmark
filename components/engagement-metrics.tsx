"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Heart, MessageCircle, Share, Eye, BarChartIcon as Bar } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, BarChart, AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

interface EngagementMetricsProps {
  data: {
    total_posts: number
    total_comments: number
    engagement_over_time: { date: string; posts: number; comments: number }[]
    peak_engagement_hours: { hour: string; activity: number }[]
    top_performing_posts: { media_id: string; media_caption: string; comments: number }[]
    metrics_summary: {
      title: string
      value: string
      change: string
      trend: "up" | "down"
      icon: string
      color: string
    }[]
    engagement_by_post_type: { type: string; engagement: number }[]
  }
}

// Map icon names from backend to Lucide React components
const iconMap: { [key: string]: React.ElementType } = {
  Heart: Heart,
  MessageCircle: MessageCircle,
  Share: Share,
  Eye: Eye,
  TrendingUp: TrendingUp,
  TrendingDown: TrendingDown,
}

export function EngagementMetrics({ data }: EngagementMetricsProps) {
  const {
    total_posts,
    total_comments,
    engagement_over_time,
    peak_engagement_hours,
    top_performing_posts,
    metrics_summary,
    engagement_by_post_type,
  } = data

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics_summary.map((metric) => {
          const IconComponent = iconMap[metric.icon] || Heart // Default to Heart if icon not found
          const TrendIcon = metric.trend === "up" ? TrendingUp : TrendingDown
          return (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <IconComponent className={`h-4 w-4 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendIcon className={`mr-1 h-3 w-3 ${metric.trend === "up" ? "text-green-500" : "text-red-500"}`} />
                  <span className={metric.trend === "up" ? "text-green-500" : "text-red-500"}>{metric.change}</span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Engagement Over Time</CardTitle>
            <CardDescription>Daily posts and comments from your data</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                posts: {
                  label: "Posts",
                  color: "hsl(var(--chart-1))",
                },
                comments: {
                  label: "Comments",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="aspect-[4/3]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={engagement_over_time}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="posts" stroke="var(--color-posts)" strokeWidth={2} />
                  <Line type="monotone" dataKey="comments" stroke="var(--color-comments)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Engagement by Post Type</CardTitle>
            <CardDescription>Performance comparison across different content types</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                engagement: {
                  label: "Engagement",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="aspect-[4/3]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={engagement_by_post_type}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="engagement" fill="var(--color-engagement)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Peak Engagement Hours</CardTitle>
          <CardDescription>Hourly engagement patterns from your data</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              activity: {
                label: "Activity",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="aspect-[3/1]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={peak_engagement_hours}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="activity"
                  stroke="var(--color-activity)"
                  fill="var(--color-activity)"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Performing Posts (by comments)</CardTitle>
          <CardDescription>Your highest commented posts from the uploaded data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {top_performing_posts.length > 0 ? (
              top_performing_posts.map((post: any, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{post.media_caption || `Post ID: ${post.media_id}`}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary">Comments</Badge>
                      <span className="text-sm text-muted-foreground">{post.comments} comments</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">#{index + 1}</div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No posts with comments found in the uploaded data.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
