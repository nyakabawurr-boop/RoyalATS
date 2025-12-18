import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Target, TrendingUp, Briefcase, Crown } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section with Night Sky Banner */}
      <div className="night-sky relative py-20 px-4">
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Crown className="h-12 w-12" />
            Royal
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Optimize your resume, align with job descriptions, and track your applications
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/job-match">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                Get Started
              </Button>
            </Link>
            <Link href="/job-match">
              <Button size="lg" variant="outline" className="border-white text-black bg-white hover:bg-gray-100">
                Try Job Match Tool
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <Target className="h-8 w-8 text-gray-700 mb-2" />
              <CardTitle>Job Matching</CardTitle>
              <CardDescription>
                Get an ATS-style match score and see how well your resume aligns with job descriptions
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-gray-700 mb-2" />
              <CardTitle>AI Optimization</CardTitle>
              <CardDescription>
                Receive step-by-step guidance powered by AI to improve your resume's effectiveness
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <FileText className="h-8 w-8 text-gray-700 mb-2" />
              <CardTitle>Resume Builder</CardTitle>
              <CardDescription>
                Build, store, and manage multiple resume versions tailored for different roles
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Briefcase className="h-8 w-8 text-gray-700 mb-2" />
              <CardTitle>Application Tracker</CardTitle>
              <CardDescription>
                Track your LinkedIn and other job applications in one organized place
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to optimize your resume?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Start by uploading your resume and pasting a job description to see your match score
          </p>
          <Link href="/job-match">
            <Button size="lg">Start Matching Now</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

