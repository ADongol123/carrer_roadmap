"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Download,
  FileText,
} from "lucide-react";
import { UserNav } from "@/components/user-nav";
import { useEffect, useState } from "react";
import Loading from "@/components/loading-page"
import ErrorPage from "@/components/error"
export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState<any>(null);
  const[parsedData, setParsedData] = useState<any>(null)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(parsedData,"roadmap")
  useEffect(() => {
    const resumeId = localStorage.getItem("resume"); // assuming resume ID is stored here
    const fetchRoadmap = async () => {
      try {
        const token = localStorage.getItem("token"); // assuming token is stored here
        const response = await fetch(
          `http://127.0.0.1:8000/generate_roadmap/${resumeId}/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data,"data")
        setRoadmap(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (resumeId) {
      fetchRoadmap();
    }
  }, []);

  useEffect(() => {
    if (roadmap) {
      const parsedData = JSON.parse(roadmap.career_roadmap);
      setParsedData(parsedData);
    }
  },[roadmap])

  if (loading) return <Loading/>;
  if (error) return <ErrorPage error={error}/>;
  // Mock roadmap data - in a real app, this would come from an API
  const roadmapData = {
    title: "Software Developer Career Path",
    progress: 15,
    currentLevel: "Junior Developer",
    targetLevel: "Senior Developer",
    milestones: [
      {
        id: 1,
        title: "Master Core Programming Fundamentals",
        description:
          "Strengthen your understanding of data structures, algorithms, and design patterns",
        completed: true,
        skills: ["Data Structures", "Algorithms", "Design Patterns"],
        resources: [
          { title: "Data Structures & Algorithms Course", type: "Course" },
          { title: "Clean Code by Robert C. Martin", type: "Book" },
        ],
      },
      {
        id: 2,
        title: "Build Full-Stack Web Applications",
        description:
          "Develop expertise in both frontend and backend technologies",
        completed: false,
        inProgress: true,
        skills: ["React", "Node.js", "Database Design"],
        resources: [
          { title: "Full Stack Open", type: "Course" },
          { title: "React Documentation", type: "Documentation" },
        ],
      },
      {
        id: 3,
        title: "Learn Cloud Services & DevOps",
        description: "Gain experience with cloud platforms and CI/CD pipelines",
        completed: false,
        skills: ["AWS/Azure", "Docker", "CI/CD"],
        resources: [
          { title: "AWS Certified Developer", type: "Certification" },
          { title: "Docker & Kubernetes: The Complete Guide", type: "Course" },
        ],
      },
      {
        id: 4,
        title: "Develop System Design Skills",
        description:
          "Learn to design scalable and maintainable software systems",
        completed: false,
        skills: ["System Architecture", "Scalability", "Microservices"],
        resources: [
          { title: "System Design Interview", type: "Book" },
          { title: "Designing Data-Intensive Applications", type: "Book" },
        ],
      },
    ],
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <Link href="/dashboard">
              <span className="text-xl">CareerPath</span>
            </Link>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/roadmap">
              <Button variant="ghost" size="sm">
                My Roadmap
              </Button>
            </Link>
            <UserNav />
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/dashboard">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-3xl font-bold">Your Career Roadmap</h1>
            </div>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export Roadmap
            </Button>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{roadmapData.title}</CardTitle>
              <CardDescription>
                From {roadmapData.currentLevel} to {roadmapData.targetLevel}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Overall Progress
                    </span>
                    <span className="text-sm font-medium">
                      {roadmapData.progress}%
                    </span>
                  </div>
                  <Progress value={roadmapData.progress} />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Milestones</h2>

            {parsedData?.map((milestone : any, index:any) => (
              <Card
                key={milestone.id}
                className={
                  milestone.completed
                    ? "border-green-200 bg-green-50"
                    : milestone.inProgress
                    ? "border-blue-200 bg-blue-50"
                    : ""
                }
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        {milestone.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : milestone.inProgress ? (
                          <Clock className="h-5 w-5 text-blue-600" />
                        ) : (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-muted-foreground text-xs">
                            {index + 1}
                          </span>
                        )}
                        {milestone.title}
                      </CardTitle>
                      <CardDescription>{milestone.description}</CardDescription>
                    </div>
                    <div>
                      {milestone.completed ? (
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800"
                        >
                          Completed
                        </Badge>
                      ) : milestone.inProgress ? (
                        <Badge
                          variant="outline"
                          className="bg-blue-100 text-blue-800"
                        >
                          In Progress
                        </Badge>
                      ) : (
                        <Badge variant="outline">Upcoming</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="mb-2 text-sm font-semibold">Key Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {milestone.skills.map((skill:any) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="mb-2 text-sm font-semibold">
                        Recommended Resources
                      </h4>
                      <ul className="space-y-2">
                        {milestone.resources.map((resource : any, i:any) => (
                          <li key={i} className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span>{resource.title}</span>
                            <Badge variant="outline" className="ml-2">
                              {resource.type}
                            </Badge>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CareerPath. All rights reserved.
          </p>
          <nav className="flex gap-4 text-sm text-muted-foreground">
            <Link href="#" className="hover:underline">
              Terms
            </Link>
            <Link href="#" className="hover:underline">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
