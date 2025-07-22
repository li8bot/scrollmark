"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, BarChart3, Calendar, TrendingUp, MessageSquare, Zap, Users, Target } from "lucide-react"
import { EngagementMetrics } from "@/components/engagement-metrics"
import { PublishingRecommendations } from "@/components/publishing-recommendations"
import { DiagnosticMetrics } from "@/components/diagnostic-metrics"
import { SentimentAnalysis } from "@/components/sentiment-analysis"
import { ViralityScore } from "@/components/virality-score"
import { BuyerIntentDiscovery } from "@/components/buyer-intent-discovery"
import { AdvocateIdentification } from "@/components/advocate-identification"
import { Progress } from "@/components/ui/progress"

export default function Dashboard() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [socialMediaData, setSocialMediaData] = useState<any>(null)
  const [progress, setProgress] = useState(0) // Add this line

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const handleAnalyze = async () => {
    if (!uploadedFile) return

    setIsAnalyzing(true)
    setProgress(0) // Reset progress at the start

    let currentProgress = 0
    const interval = setInterval(() => {
      currentProgress += 5 // Increment progress
      if (currentProgress <= 90) {
        // Stop at 90% to indicate it's still processing
        setProgress(currentProgress)
      } else {
        clearInterval(interval)
      }
    }, 100) // Update every 100ms

    try {
      const fileContent = await uploadedFile.text()
      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ csv_data: fileContent }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const processedData = await response.json()
      setSocialMediaData(processedData)
      setDataLoaded(true)
      setProgress(100) // Set to 100% on success
    } catch (error) {
      console.error("Error analyzing data:", error)
      alert(
        "Failed to analyze data. Please check the console for more details and ensure the Python backend is running on port 5000.",
      )
      setProgress(0) // Reset on error
    } finally {
      clearInterval(interval) // Clear interval regardless of success or failure
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Scrollmark Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Transform raw social media data into actionable insights that drive growth, understanding, and conversion
          </p>
        </div>

        {!dataLoaded || !socialMediaData ? (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Social Media Data
              </CardTitle>
              <CardDescription>
                Upload your social media data (text, likes, shares, user IDs, timestamps) to unlock deep insights beyond
                basic engagement tracking.
                <br />
                <span className="font-bold text-red-500">
                  Please ensure the Python backend is running on `http://localhost:5000` to process the data.
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="file">Data File</Label>
                <Input id="file" type="file" accept=".csv" onChange={handleFileUpload} />
              </div>
              {uploadedFile && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Selected: {uploadedFile.name}</span>
                </div>
              )}
              <Button onClick={handleAnalyze} disabled={!uploadedFile || isAnalyzing} className="w-full sm:w-auto">
                {isAnalyzing ? "Analyzing with SocialGPT..." : "Analyze Data"}
              </Button>
              {isAnalyzing && ( // Add this conditional block
                <div className="w-full">
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1 text-center">
                    {progress < 100 ? `Processing data... ${progress}%` : "Analysis complete!"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="engagement" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7">
              <TabsTrigger value="engagement" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Engagement</span>
              </TabsTrigger>
              <TabsTrigger value="buyer-intent" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                <span className="hidden sm:inline">Buyer Intent</span>
              </TabsTrigger>
              <TabsTrigger value="advocates" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Advocates</span>
              </TabsTrigger>
              <TabsTrigger value="publishing" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Publishing</span>
              </TabsTrigger>
              <TabsTrigger value="diagnostics" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Diagnostics</span>
              </TabsTrigger>
              <TabsTrigger value="sentiment" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Sentiment</span>
              </TabsTrigger>
              <TabsTrigger value="virality" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span className="hidden sm:inline">Virality</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="engagement">
              <EngagementMetrics data={socialMediaData.engagement_metrics} />
            </TabsContent>

            <TabsContent value="buyer-intent">
              <BuyerIntentDiscovery data={socialMediaData.buyer_intent_discovery} />
            </TabsContent>

            <TabsContent value="advocates">
              <AdvocateIdentification data={socialMediaData.advocate_identification} />
            </TabsContent>

            <TabsContent value="publishing">
              <PublishingRecommendations data={socialMediaData.publishing_recommendations} />
            </TabsContent>

            <TabsContent value="diagnostics">
              <DiagnosticMetrics data={socialMediaData.diagnostic_metrics} />
            </TabsContent>

            <TabsContent value="sentiment">
              <SentimentAnalysis data={socialMediaData.sentiment_analysis} />
            </TabsContent>

            <TabsContent value="virality">
              <ViralityScore data={socialMediaData.virality_score} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
