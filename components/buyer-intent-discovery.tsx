"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Target, TrendingUp, User, Clock, DollarSign } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

interface BuyerIntentDiscoveryProps {
  data: {
    high_intent_users_count: number
    predicted_revenue: string
    conversion_rate: string
    active_prospects: number
    intent_signals: {
      user: string
      intent: string
      score: number
      signals: string[]
      lastActivity: string
      predictedValue: string
    }[]
    conversion_predictions: { timeframe: string; probability: number; users: number }[]
    intent_categories: { category: string; count: number; value: string }[]
    intent_signal_trends: { date: string; value: number }[]
    next_best_actions: {
      action: string
      users: number
      priority: string
      expectedLift: string
    }[]
  }
}

export function BuyerIntentDiscovery({ data }: BuyerIntentDiscoveryProps) {
  const {
    high_intent_users_count,
    predicted_revenue,
    conversion_rate,
    active_prospects,
    intent_signals,
    conversion_predictions,
    intent_categories,
    intent_signal_trends,
    next_best_actions,
  } = data

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Intent Users</CardTitle>
            <Target className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{high_intent_users_count}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+12%</span> from last week (simulated)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Predicted Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{predicted_revenue}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+18%</span> potential increase (simulated)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversion_rate}</div>
            <p className="text-xs text-muted-foreground">DM-to-Website Visit Rate (simulated)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Prospects</CardTitle>
            <User className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{active_prospects}</div>
            <p className="text-xs text-muted-foreground">Currently being nurtured (simulated)</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Intent Signal Distribution</CardTitle>
            <CardDescription>Types of buyer intent signals detected</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: {
                  label: "Count",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="aspect-[4/3]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={intent_categories}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-count)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversion Probability Timeline</CardTitle>
            <CardDescription>Likelihood of conversion over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                probability: {
                  label: "Probability %",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="aspect-[4/3]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={conversion_predictions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timeframe" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="probability" stroke="var(--color-probability)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>High-Intent User Dashboard</CardTitle>
          <CardDescription>Users showing strong buyer intent signals with recommended actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {intent_signals.map((user, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user.user.charAt(1).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-medium">{user.user}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={user.intent === "High" ? "destructive" : "default"}>{user.intent} Intent</Badge>
                        <span className="text-sm text-muted-foreground">Score: {user.score}/100</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">{user.predictedValue}</div>
                    <div className="text-xs text-muted-foreground">Predicted Value</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Intent Score</span>
                    <span>{user.score}%</span>
                  </div>
                  <Progress value={user.score} className="h-2" />
                </div>

                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Intent Signals:</h5>
                  <div className="flex flex-wrap gap-1">
                    {user.signals.map((signal, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {signal}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    Last activity: {user.lastActivity}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Send DM
                    </Button>
                    <Button size="sm">Schedule Call</Button>
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
            <CardTitle>Intent Signal Trends</CardTitle>
            <CardDescription>Daily buyer intent signals over the past 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                signals: {
                  label: "Intent Signals",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="aspect-[4/3]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={intent_signal_trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="value" stroke="var(--color-signals)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next Best Actions</CardTitle>
            <CardDescription>AI-recommended actions for high-intent users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {next_best_actions.map((action, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{action.action}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={action.priority === "High" ? "destructive" : "default"}>{action.priority}</Badge>
                      <span className="text-sm text-muted-foreground">{action.users} users</span>
                      <span className="text-sm text-green-600">{action.expectedLift}</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Execute
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
