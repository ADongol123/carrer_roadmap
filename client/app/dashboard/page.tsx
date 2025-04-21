"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation"
import { Upload, FileText } from "lucide-react";
import { ResumeUploader } from "@/components/resume-uploader";
import { UserNav } from "@/components/user-nav";
import { uploadResume } from "@/services/api"; // Assuming this function uploads the resume

export default function DashboardPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter()
  const [hasUploadedResume, setHasUploadedResume] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  // Handle file upload
  const handleResumeUpload = async (file: any) => {
    setIsUploading(true);
    setUploadError(""); // Clear previous errors

    try {
      // Here you can call your API to upload the resume
      const resume = await uploadResume(file); // Assuming this function handles the actual API call
      setHasUploadedResume(true);
      if(resume?.resume_id){
        localStorage.setItem("resume",resume?.resume_id)
      }

    } catch (err: any) {
      setUploadError("Failed to upload resume. Please try again.");
    } finally {
      setIsUploading(false);
    }
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your career journey and view your personalized roadmap
            </p>
          </div>

          <Tabs defaultValue="upload" className="space-y-4">
            <TabsList>
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Resume Upload
              </TabsTrigger>
              <TabsTrigger value="roadmap" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                My Roadmap
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Your Resume</CardTitle>
                  <CardDescription>
                    Upload your resume to generate a personalized career roadmap
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        const selectedFile = e.target.files?.[0];
                        setSelectedFile(selectedFile || null);
                      }}
                      className="border rounded px-3 py-2"
                    />

                    <Button
                      onClick={() => {
                        if (selectedFile) {
                          handleResumeUpload(selectedFile);
                        } else {
                          setUploadError(
                            "Please select a file before submitting."
                          );
                        }
                      }}
                      disabled={isUploading}
                    >
                      {isUploading ? "Uploading..." : "Submit"}
                    </Button>

                    {uploadError && (
                      <p className="text-red-500">{uploadError}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {hasUploadedResume && (
                <Card>
                  <CardHeader>
                    <CardTitle>Resume Uploaded Successfully!</CardTitle>
                    <CardDescription>
                      Your personalized roadmap is being generated
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-4">
                      <p>
                        Our AI is analyzing your resume to create a tailored
                        career roadmap. This process may take a few moments.
                      </p>
                      <Link href="/dashboard/roadmap">
                        <Button>View Your Roadmap</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="roadmap">
              <Card>
                <CardHeader>
                  <CardTitle>Your Career Roadmap</CardTitle>
                  <CardDescription>
                    View your personalized career development plan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {hasUploadedResume ? (
                    <div className="flex flex-col gap-4">
                      <p>
                        Your roadmap is ready! Click the button below to view
                        your personalized career development plan.
                      </p>
                      <Link href="/dashboard/roadmap">
                        <Button>View Detailed Roadmap</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <p>
                        You haven&apos;t uploaded your resume yet. Please upload
                        your resume to generate a personalized roadmap.
                      </p>
                      <Button
                        onClick={() =>
                          document
                            .querySelector('[data-value="upload"]')
                            ?.click()
                        }
                      >
                        Go to Upload
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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
