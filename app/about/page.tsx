"use client"

import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Calculator, Users, Heart, Coffee, ArrowRight, CheckCircle, Sparkles } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4">

          {/* Developer Info Section */}
          <div className="mb-16">
            <Card className="p-8 md:p-12 bg-gradient-to-r from-muted/50 to-muted/30">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <div className="text-6xl mb-4">👋</div>
                  <h2 className="text-3xl font-bold mb-4">Who am I?</h2>
                  <p className="text-lg text-muted-foreground">
                    Hello there, I'm <span className="font-semibold text-foreground">Harsh Surani</span>, a student who has mastered the ancient art of 
                    calculating attendance percentages faster than solving calculus problems.
                  </p>
                </div>

                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-4">Why I built this app? 📱</h3>
                  <div className="text-muted-foreground space-y-4 text-lg leading-relaxed">
                    <p>
                      Picture this: It's 8 AM, your alarm is going off, and you're lying in bed contemplating life choices. 
                      The eternal student dilemma hits - "Can I skip today's lecture without failing?" 🤔
                    </p>
                    <p>
                      So there I was, frantically doing mental gymnastics with percentages at 7:59 AM, 
                      trying to figure out if attending that 8 AM lecture was worth dragging myself out of bed. 
                      The calculation was harder than the actual subject! 💀
                    </p>
                    <p>
                      That's when it hit me - why not build an app that does this math for lazy students like me? 
                      No more opening calculator at 3 AM to see if you can bunk tomorrow's class. No cap! 🧢
                    </p>
                    <p>
                      Built with love, caffeine, and the collective prayers of students worldwide who just want to 
                      sleep in without getting on the detention list. It's giving main character energy, fr. ✨
                    </p>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-4">Shoutouts 🙌</h3>
                  <p className="text-muted-foreground text-lg">
                    Big thanks to my fellow students who beta-tested this by sharing their attendance nightmares. 
                    Y'all are the real MVPs! This one's for everyone who's ever calculated attendance on their fingers 
                    during a boring lecture. 🫶
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-4">Send your suggestions 😊</h3>
                  <p className="text-muted-foreground text-lg mb-4">
                    Got ideas? Found a bug? Want to share your bunking success stories? Hit me up! 
                    I'm always down to make this app even more fire. 🔥
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a 
                      href="mailto:harshsurani00@gmail.com" 
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      📧 Drop me an email
                    </a>
                    <a 
                      href="https://suraniharsh.codes" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                    >
                      🌐 Check my portfolio
                    </a>
                  </div>
                </div>
              </div>
            </Card>
          </div>

        </div>
      </main>

      <footer className="text-center py-6 border-t">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Coffee className="h-4 w-4" />
          <span>Built by a student, for students 💙</span>
        </div>
      </footer>
    </div>
  )
}
