import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "sk-test-key"
});

export async function generateCourseRecommendations(
  interests: string,
  level: string = "any",
  existingCourses: string[] = []
): Promise<{
  recommendations: Array<{
    title: string;
    code: string;
    description: string;
    credits: number;
    matchPercentage: number;
    reasoning: string;
  }>;
}> {
  try {
    const prompt = `Based on the following academic interests and preferences, recommend 3-5 relevant university courses:

Academic Interests: ${interests}
Preferred Level: ${level}
Already Enrolled: ${existingCourses.join(", ") || "None"}

Please provide course recommendations in JSON format with the following structure:
{
  "recommendations": [
    {
      "title": "Course Title",
      "code": "DEPT###",
      "description": "Brief course description",
      "credits": 3,
      "matchPercentage": 95,
      "reasoning": "Why this course matches the student's interests"
    }
  ]
}

Focus on courses that align with the student's interests and avoid duplicating their existing enrollments.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an academic advisor helping students choose appropriate courses. Provide practical, relevant course recommendations based on their interests and academic level."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000,
    });

    const result = JSON.parse(response.choices[0].message.content || '{"recommendations": []}');
    return result;
  } catch (error) {
    console.error("AI recommendation error:", error);
    // Fallback recommendations if API fails
    return {
      recommendations: [
        {
          title: "Introduction to Computer Science",
          code: "CS101",
          description: "Fundamental concepts of programming and computational thinking",
          credits: 3,
          matchPercentage: 85,
          reasoning: "Great foundation course for technical interests"
        },
        {
          title: "Data Structures and Algorithms",
          code: "CS201",
          description: "Essential data structures and algorithmic problem solving",
          credits: 4,
          matchPercentage: 90,
          reasoning: "Builds on programming fundamentals with practical applications"
        }
      ]
    };
  }
}

export async function generateSyllabus(
  courseTitle: string,
  courseDescription: string,
  duration: number,
  credits: number
): Promise<{
  syllabus: {
    courseInfo: {
      title: string;
      description: string;
      credits: number;
      duration: string;
    };
    learningObjectives: string[];
    weeklySchedule: Array<{
      week: number;
      topic: string;
      activities: string[];
      assignments?: string;
    }>;
    assessments: Array<{
      type: string;
      weight: number;
      description: string;
    }>;
    resources: string[];
    policies: string[];
  };
}> {
  try {
    const prompt = `Create a comprehensive university course syllabus for:

Course Title: ${courseTitle}
Course Description: ${courseDescription}
Duration: ${duration} weeks
Credits: ${credits}

Generate a detailed syllabus in JSON format with the following structure:
{
  "syllabus": {
    "courseInfo": {
      "title": "Course Title",
      "description": "Course description",
      "credits": 3,
      "duration": "16 weeks"
    },
    "learningObjectives": ["Objective 1", "Objective 2"],
    "weeklySchedule": [
      {
        "week": 1,
        "topic": "Week topic",
        "activities": ["Activity 1", "Activity 2"],
        "assignments": "Optional assignment description"
      }
    ],
    "assessments": [
      {
        "type": "Midterm Exam",
        "weight": 30,
        "description": "Assessment description"
      }
    ],
    "resources": ["Required textbook", "Online materials"],
    "policies": ["Attendance policy", "Late submission policy"]
  }
}

Make the syllabus comprehensive, academically rigorous, and appropriate for university level.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an experienced university professor creating detailed course syllabi. Ensure academic rigor and practical learning outcomes."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 2000,
    });

    const result = JSON.parse(response.choices[0].message.content || '{"syllabus": {}}');
    return result;
  } catch (error) {
    console.error("AI syllabus generation error:", error);
    // Fallback syllabus if API fails
    return {
      syllabus: {
        courseInfo: {
          title: courseTitle,
          description: courseDescription,
          credits: credits,
          duration: `${duration} weeks`
        },
        learningObjectives: [
          "Understand fundamental concepts",
          "Apply theoretical knowledge to practical problems",
          "Develop critical thinking skills",
          "Demonstrate proficiency in course materials"
        ],
        weeklySchedule: Array.from({ length: duration }, (_, i) => ({
          week: i + 1,
          topic: `Week ${i + 1}: Introduction to Course Topic ${i + 1}`,
          activities: ["Lecture", "Discussion", "Lab Work"],
          assignments: i % 4 === 3 ? "Assignment due" : undefined
        })),
        assessments: [
          {
            type: "Assignments",
            weight: 40,
            description: "Regular homework and projects"
          },
          {
            type: "Midterm Exam",
            weight: 25,
            description: "Comprehensive midterm examination"
          },
          {
            type: "Final Exam",
            weight: 35,
            description: "Cumulative final examination"
          }
        ],
        resources: [
          "Course textbook (TBD)",
          "Online learning platform",
          "Supplementary readings"
        ],
        policies: [
          "Regular attendance is expected",
          "Late submissions will be penalized",
          "Academic integrity must be maintained",
          "Office hours available by appointment"
        ]
      }
    };
  }
}
