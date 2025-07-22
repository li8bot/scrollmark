"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Activity } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"

interface DiagnosticMetricsProps {
  data: {
    ugc_volume: number
    performance_trends: { date: string; posts: number; comments: number }[]
    current_metrics: {
      title: string
      current: string
      previous: string
      trend: "up" | "down"
      target: string
      progress: number
    }[]
    diagnostic_alerts: {
      type: string
      title: string
      description: string
      action: string
      icon: string
    }[]
    audience_insights: { metric: string; percentage: number; change: string }[]
  }
}

// Map icon names from backend to Lucide React components
const iconMap: { [key: string]: React.ElementType } = {
  CheckCircle: CheckCircle,
  Activity: Activity,
  AlertTriangle: AlertTriangle,
  TrendingUp: TrendingUp,
  TrendingDown: TrendingDown,
}

export function DiagnosticMetrics({ data }: DiagnosticMetricsProps) {
  const { ugc_volume, performance_trends, current_metrics, diagnostic_alerts, audience_insights } = data

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {current_metrics.map((metric) => {
          const TrendIcon = metric.trend === "up" ? TrendingUp : TrendingDown
          return (
            <Card key={metric.title}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{metric.current}</span>
                  <div className="flex items-center text-xs">
                    <TrendIcon
                      className={`mr-1 h-3 w-3 ${metric.trend === "up" ? "text-green-500" : "text-red-500"}`}
                    />
                    <span className={metric.trend === "up" ? "text-green-500" : "text-red-500"}>
                      vs {metric.previous}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Target: {metric.target}</span>
                    <span>{metric.progress}%</span>
                  </div>
                  <Progress value={metric.progress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance Trends (Posts & Comments)</CardTitle>
            <CardDescription>Key metrics over time from your data</CardDescription>
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
                <LineChart data={performance_trends}>
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
            <CardTitle>Content Performance</CardTitle>
            <CardDescription>Average engagement by content type (mock data)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                engagement: {
                  label: "Avg Engagement",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="aspect-[4/3]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { type: "Video", engagement: 8.2 },
                    { type: "Image", engagement: 6.5 },
                    { type: "Carousel", engagement: 7.1 },
                    { type: "Text", engagement: 4.8 },
                    { type: "Story", engagement: 5.9 },
                  ]}
                >
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

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Diagnostic Alerts</CardTitle>
            <CardDescription>Important insights and recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {diagnostic_alerts.map((alert, index) => {
                const IconComponent = iconMap[alert.icon] || AlertTriangle
                return (
                  <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                    <IconComponent
                      className={`h-5 w-5 mt-0.5 ${
                        alert.type === "warning"
                          ? "text-yellow-500"
                          : alert.type === "success"
                            ? "text-green-500"
                            : "text-blue-500"
                      }`}
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{alert.title}</h4>
                        <Badge
                          variant={
                            alert.type === "warning"
                              ? "destructive"
                              : alert.type === "success"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {alert.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                      <p className="text-xs font-medium text-blue-600">{alert.action}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Audience Demographics</CardTitle>
            <CardDescription>Current audience breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                "18-24": { label: "18-24", color: "hsl(var(--chart-1))" },
                "25-34": { label: "25-34", color: "hsl(var(--chart-2))" },
                "35-44": { label: "35-44", color: "hsl(var(--chart-3))" },
                "45+": { label: "45+", color: "hsl(var(--chart-4))" },
              }}
              className="aspect-square"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "18-24", value: audience_insights[0].percentage, fill: "var(--color-18-24)" },
                      { name: "25-34", value: audience_insights[1].percentage, fill: "var(--color-25-34)" },
                      { name: "35-44", value: audience_insights[2].percentage, fill: "var(--color-35-44)" },
                      { name: "45+", value: audience_insights[3].percentage, fill: "var(--color-45+)" },
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
            <div className="space-y-4">
              <div className="space-y-2">
                {audience_insights.map((insight, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span>{insight.metric}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{insight.percentage}%</span>
                      <span
                        className={`text-xs ${
                          insight.change.startsWith("+")
                            ? "text-green-500"
                            : insight.change.startsWith("-")
                              ? "text-red-500"
                              : "text-muted-foreground"
                        }`}
                      >
                        {insight.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
