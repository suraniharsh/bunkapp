"use client"

import { useState, useCallback } from "react"
import { Navbar } from "@/components/navbar"
import { InputCard } from "@/components/input-card"
import { ResultCard } from "@/components/result-card"
import { Coffee } from "lucide-react"

interface AttendanceData {
  totalLectures: number
  attendedLectures: number
  attendanceCriteria: number
}

export default function HomePage() {
  const [attendanceData, setAttendanceData] = useState<AttendanceData>({
    totalLectures: 0,
    attendedLectures: 0,
    attendanceCriteria: 75,
  })

  const handleInputChange = useCallback((data: AttendanceData) => {
    setAttendanceData(data)
  }, [])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8">
            <div className="order-2 lg:order-1">
              <InputCard onInputChange={handleInputChange} />
            </div>
            <div className="order-1 lg:order-2">
              <ResultCard attendanceData={attendanceData} />
            </div>
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
