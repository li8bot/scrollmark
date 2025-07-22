"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, Star, TrendingUp, MessageSquare, Award, Crown, TrendingDown } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"

interface AdvocateIdentificationProps {
  data: {
    community_health: { metric: string; value: number | string; change: string; icon: string }[]
    top_advocates: {
      user: string
      name: string
      tier: string
      score: number
      ugcCount: number
      engagement: number
      influence: number
      loyaltyPoints: number
      activities: string[]
    }[]
    advocacy_tiers: { tier: string; count: number; percentage: number; color: string }[]
    ugc_performance: { date: string; value: number }[]
    advocate_performance_radar: { metric: string; score: number }[]
    loyalty_program_performance: {
      points_distribution: { activity: string; points: number; count: number }[]
      reward_redemptions: { reward: string; redeemed: number; points: number }[]
      program_impact: { metric: string; value: string; trend: string }[]
    }
  }
}

// Map icon names from backend to Lucide React components
const iconMap: { [key: string]: React.ElementType } = {
  Users: Users,
  MessageSquare: MessageSquare,
  Star: Star,
  TrendingUp: TrendingUp,
  Award: Award,
  Crown: Crown,
}

export function AdvocateIdentification({ data }: AdvocateIdentificationProps) {
  const {
    community_health,
    top_advocates,
    advocacy_tiers,
    ugc_performance,
    advocate_performance_radar,
    loyalty_program_performance,
  } = data

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {community_health.map((metric, index) => {
          const IconComponent = iconMap[metric.icon] || Users
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.metric}</CardTitle>
                <IconComponent className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">{metric.change}</span> from last month (simulated)
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Top Brand Advocates</CardTitle>
            <CardDescription>Your most valuable community members and their contributions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {top_advocates.map((advocate, index) => {
                const TierIcon = advocate.tier === "Champion" ? Crown : advocate.tier === "Advocate" ? Award : null
                return (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                            {advocate.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{advocate.name}</h4>
                          <p className="text-sm text-muted-foreground">{advocate.user}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant={
                                advocate.tier === "Champion"
                                  ? "default"
                                  : advocate.tier === "Advocate"
                                    ? "secondary"
                                    : "outline"
                              }
                              className={advocate.tier === "Champion" ? "bg-yellow-500 text-white" : ""}
                            >
                              {TierIcon && <TierIcon className="h-3 w-3 mr-1" />}
                              {advocate.tier}
                            </Badge>
                            <span className="text-sm text-muted-foreground">Score: {advocate.score}/100</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-purple-600">{advocate.loyaltyPoints}</div>
                        <div className="text-xs text-muted-foreground">Loyalty Points</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-bold text-blue-600">{advocate.ugcCount}</div>
                        <div className="text-muted-foreground">UGCs</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-green-600">{advocate.engagement.toLocaleString()}</div>
                        <div className="text-muted-foreground">Engagement</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-purple-600">{advocate.influence.toLocaleString()}</div>
                        <div className="text-muted-foreground">Influence</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">Recent Activities:</h5>
                      <div className="space-y-1">
                        {advocate.activities.map((activity, idx) => (
                          <div key={idx} className="text-xs text-muted-foreground flex items-center gap-1">
                            <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                            {activity}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Send Reward
                      </Button>
                      <Button size="sm" variant="outline">
                        Feature UGC
                      </Button>
                      <Button size="sm">Collaborate</Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Advocacy Tiers</CardTitle>
            <CardDescription>Distribution of community members by advocacy level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {advocacy_tiers.map((tier, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tier.color }}></div>
                      <span className="text-sm font-medium">{tier.tier}</span>
                    </div>
                    <span className="text-sm font-bold">{tier.count}</span>
                  </div>
                  <Progress value={tier.percentage} className="h-2" />
                  <div className="text-xs text-muted-foreground text-right">{tier.percentage}% of community</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>UGC & Engagement Growth</CardTitle>
            <CardDescription>User-generated content volume and engagement over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                ugc: {
                  label: "UGC Count",
                  color: "hsl(var(--chart-1))",
                },
                engagement: {
                  label: "Engagement",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="aspect-[4/3]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ugc_performance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="value" stroke="var(--color-ugc)" strokeWidth={2} />
                  {/* Assuming 'engagement' is also part of the value for this chart, or add another line if available */}
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Advocate Performance Radar</CardTitle>
            <CardDescription>Multi-dimensional view of top advocate capabilities</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                score: {
                  label: "Score",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="aspect-square"
            >
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={advocate_performance_radar}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
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
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Loyalty Program Performance</CardTitle>
          <CardDescription>Points distribution and reward effectiveness</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-4">
              <h4 className="font-medium">Points Distribution</h4>
              <div className="space-y-3">
                {loyalty_program_performance.points_distribution.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span>{item.activity}</span>
                    <div className="text-right">
                      <div className="font-medium">{item.points} pts</div>
                      <div className="text-muted-foreground">{item.count} actions</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Reward Redemptions</h4>
              <div className="space-y-3">
                {loyalty_program_performance.reward_redemptions.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span>{item.reward}</span>
                    <div className="text-right">
                      <div className="font-medium">{item.redeemed} redeemed</div>
                      <div className="text-muted-foreground">{item.points} pts</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Program Impact</h4>
              <div className="space-y-3">
                {loyalty_program_performance.program_impact.map((item, index) => {
                  const TrendIcon = item.trend === "up" ? TrendingUp : TrendingDown
                  return (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span>{item.metric}</span>
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-green-600">{item.value}</span>
                        <TrendIcon className="h-3 w-3 text-green-500" />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
