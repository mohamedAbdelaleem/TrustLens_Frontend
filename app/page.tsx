import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { CheckCircle, Shield, Globe, Zap, FileText, Video, Mic } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="text-xl font-semibold text-foreground">TrustLens</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                How it Works
              </Link>
              <Link href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
            </nav>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <Link href="/chat">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
                  Try TrustLens
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-6 text-sm">
            Multi-Agent Fact Verification
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6 bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent">
            The AI Toolkit for Truth Verification
          </h1>
          <p className="text-xl text-muted-foreground text-pretty mb-8 max-w-2xl mx-auto leading-relaxed">
            Advanced multi-agent system that verifies facts across text, audio, and video content. Supporting multiple
            languages with comprehensive reporting.
          </p>
          
        </div>

      
      </section>

      {/* Features Grid */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Verification</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Multi-modal analysis powered by advanced AI agents working together to ensure accuracy.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-card border-border/40 hover:border-border transition-colors">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Text Analysis</h3>
              <p className="text-muted-foreground">
                Deep semantic analysis of written content with source verification and claim validation.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/40 hover:border-border transition-colors">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Mic className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Audio Verification</h3>
              <p className="text-muted-foreground">
                Speech-to-text conversion with speaker identification and audio authenticity detection.
              </p>
            </CardContent>
          </Card>

          

          <Card className="bg-card border-border/40 hover:border-border transition-colors">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Multilingual Support</h3>
              <p className="text-muted-foreground">
                Native support for multiple languages.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How TrustLens Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our multi-agent system processes your content through specialized AI agents for comprehensive verification.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-accent">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Upload Content</h3>
            <p className="text-muted-foreground">
              Submit text, audio, or video content through our intuitive chat interface.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-accent">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
            <p className="text-muted-foreground">
              Multiple specialized agents analyze different aspects of your content simultaneously.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-accent">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Get Results</h3>
            <p className="text-muted-foreground">
              Receive detailed verification reports with confidence scores and source citations.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-card border border-border/40 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Verify Truth?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of fact-checkers, journalists, and researchers using TrustLens to combat misinformation.
          </p>
          <Link href="/chat">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium px-8">
              Start Verifying Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-accent rounded-md flex items-center justify-center">
                <Shield className="w-4 h-4 text-accent-foreground" />
              </div>
              <span className="font-semibold">TrustLens</span>
            </div>
            <div className="text-sm text-muted-foreground">© 2025 TrustLens. Built for truth verification.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
