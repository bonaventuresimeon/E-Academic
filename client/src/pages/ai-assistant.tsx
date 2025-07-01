import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Brain, Sparkles, FileText, Download, Star } from "lucide-react";
import Header from "@/components/layout/header";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";

const recommendationSchema = z.object({
  interests: z.string().min(10, "Please provide more detailed interests"),
  level: z.string(),
});

const syllabusSchema = z.object({
  courseTitle: z.string().min(3, "Course title is required"),
  courseDescription: z.string().min(20, "Please provide a detailed description"),
  duration: z.string(),
  credits: z.string(),
});

type RecommendationData = z.infer<typeof recommendationSchema>;
type SyllabusData = z.infer<typeof syllabusSchema>;

export default function AIAssistant() {
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<any>(null);
  const [generatedSyllabus, setGeneratedSyllabus] = useState<any>(null);

  const recommendationForm = useForm<RecommendationData>({
    resolver: zodResolver(recommendationSchema),
    defaultValues: {
      interests: "",
      level: "any",
    },
  });

  const syllabusForm = useForm<SyllabusData>({
    resolver: zodResolver(syllabusSchema),
    defaultValues: {
      courseTitle: "",
      courseDescription: "",
      duration: "16",
      credits: "3",
    },
  });

  const recommendationMutation = useMutation({
    mutationFn: async (data: RecommendationData) => {
      const response = await apiRequest("POST", "/api/ai/recommend", data);
      return await response.json();
    },
    onSuccess: (data) => {
      setRecommendations(data);
      toast({
        title: "Success",
        description: "Course recommendations generated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to generate recommendations",
        variant: "destructive",
      });
    },
  });

  const syllabusMutation = useMutation({
    mutationFn: async (data: SyllabusData) => {
      const response = await apiRequest("POST", "/api/ai/syllabus", {
        courseTitle: data.courseTitle,
        courseDescription: data.courseDescription,
        duration: parseInt(data.duration),
        credits: parseInt(data.credits),
      });
      return await response.json();
    },
    onSuccess: (data) => {
      setGeneratedSyllabus(data);
      toast({
        title: "Success",
        description: "Syllabus generated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to generate syllabus",
        variant: "destructive",
      });
    },
  });

  const onRecommendation = (data: RecommendationData) => {
    recommendationMutation.mutate(data);
  };

  const onSyllabus = (data: SyllabusData) => {
    syllabusMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Assistant</h1>
              <p className="mt-1 text-sm text-gray-600">
                Get personalized course recommendations and AI-generated syllabi
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Course Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-blue-600" />
                  Course Recommendations
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Based on your academic profile and interests
                </p>
              </CardHeader>
              <CardContent>
                <Form {...recommendationForm}>
                  <form onSubmit={recommendationForm.handleSubmit(onRecommendation)} className="space-y-4">
                    <FormField
                      control={recommendationForm.control}
                      name="interests"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Academic Interests</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              rows={3}
                              placeholder="Describe your academic interests, career goals, or specific topics you'd like to explore..."
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={recommendationForm.control}
                      name="level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="beginner">Beginner</SelectItem>
                              <SelectItem value="intermediate">Intermediate</SelectItem>
                              <SelectItem value="advanced">Advanced</SelectItem>
                              <SelectItem value="any">Any Level</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={recommendationMutation.isPending}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      {recommendationMutation.isPending ? "Generating..." : "Get Recommendations"}
                    </Button>
                  </form>
                </Form>

                {/* Recommendations Display */}
                {recommendations && (
                  <div className="mt-6 space-y-4">
                    {recommendations.recommendations?.map((rec: any, index: number) => (
                      <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <Brain className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">{rec.title}</h4>
                            <p className="text-xs text-gray-600 mb-2">{rec.code} • {rec.credits} Credits</p>
                            <p className="text-sm text-gray-500 mb-2">{rec.description}</p>
                            <p className="text-xs text-gray-600 mb-2">{rec.reasoning}</p>
                            <div className="flex items-center text-xs text-blue-600">
                              <Star className="h-3 w-3 mr-1" />
                              <span>{rec.matchPercentage}% Match</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Syllabus Generator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-green-600" />
                  Syllabus Generator
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Generate comprehensive course syllabi with AI
                </p>
              </CardHeader>
              <CardContent>
                <Form {...syllabusForm}>
                  <form onSubmit={syllabusForm.handleSubmit(onSyllabus)} className="space-y-4">
                    <FormField
                      control={syllabusForm.control}
                      name="courseTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Course Title</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., Introduction to Data Science" />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={syllabusForm.control}
                      name="courseDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Course Description</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              rows={3}
                              placeholder="Provide a brief description of the course objectives and content..."
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={syllabusForm.control}
                        name="duration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Duration (weeks)</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="8">8 weeks</SelectItem>
                                <SelectItem value="12">12 weeks</SelectItem>
                                <SelectItem value="16">16 weeks</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={syllabusForm.control}
                        name="credits"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Credits</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="1">1</SelectItem>
                                <SelectItem value="2">2</SelectItem>
                                <SelectItem value="3">3</SelectItem>
                                <SelectItem value="4">4</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-green-600 hover:bg-green-700" 
                      disabled={syllabusMutation.isPending}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      {syllabusMutation.isPending ? "Generating..." : "Generate Syllabus"}
                    </Button>
                  </form>
                </Form>

                {/* Syllabus Display */}
                {generatedSyllabus && (
                  <div className="mt-6">
                    <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-gray-900">Generated Syllabus Preview</h4>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3 mr-1" />
                          Download PDF
                        </Button>
                      </div>
                      <div className="text-sm text-gray-500 space-y-2">
                        {generatedSyllabus.syllabus?.weeklySchedule?.slice(0, 4).map((week: any, index: number) => (
                          <p key={index}>
                            <strong>Week {week.week}:</strong> {week.topic}
                          </p>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-400">
                          <Brain className="inline h-3 w-3 mr-1" />
                          Generated by AI Assistant • Click to expand full syllabus
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* AI Usage Statistics */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>AI Usage Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">24</div>
                  <div className="text-sm text-gray-500">Recommendations Generated</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">8</div>
                  <div className="text-sm text-gray-500">Syllabi Created</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">92%</div>
                  <div className="text-sm text-gray-500">Accuracy Rating</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
