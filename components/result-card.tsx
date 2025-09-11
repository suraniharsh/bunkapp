"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, CheckCircle, AlertTriangle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface AttendanceData {
  totalLectures: number
  attendedLectures: number
  attendanceCriteria: number
}

interface ResultCardProps {
  attendanceData: AttendanceData
}

interface CalculationResult {
  currentAttendance: number
  canBunk: number
  mustAttend: number
  status: "safe" | "warning" | "critical" | "perfect" | "awaiting"
  message: string
}

function calculateAttendance(data: AttendanceData): CalculationResult {
  const { totalLectures, attendedLectures, attendanceCriteria } = data

  // Handle edge cases
  if (totalLectures === 0) {
    return {
      currentAttendance: 0,
      canBunk: 0,
      mustAttend: 0,
      status: "awaiting",
      message: "Enter your lecture details to see results",
    }
  }

  if (attendedLectures > totalLectures) {
    return {
      currentAttendance: 0,
      canBunk: 0,
      mustAttend: 0,
      status: "awaiting",
      message: "Please check your input values",
    }
  }

  const currentAttendance = (attendedLectures / totalLectures) * 100
  const requiredAttendance = attendanceCriteria / 100

  // Perfect attendance
  if (currentAttendance === 100) {
    return {
      currentAttendance,
      canBunk: attendanceCriteria === 100 ? 0 : Math.floor(totalLectures * (1 - requiredAttendance)),
      mustAttend: 0,
      status: "perfect",
      message: "Perfect attendance! Impressive discipline.",
    }
  }

  // Above criteria - can bunk some lectures
  if (currentAttendance >= attendanceCriteria) {
    // Calculate how many lectures can be bunked while maintaining criteria
    let canBunk = 0
    if (attendanceCriteria < 100) {
      // Formula: (attended - required_percentage * (total + bunked)) >= 0
      // Solving for bunked: bunked <= (attended - required_percentage * total) / required_percentage
      canBunk = Math.floor((attendedLectures - requiredAttendance * totalLectures) / requiredAttendance)
      canBunk = Math.max(0, canBunk)
    }

    return {
      currentAttendance,
      canBunk,
      mustAttend: 0,
      status: currentAttendance >= attendanceCriteria + 10 ? "safe" : "warning",
      message: canBunk > 0 ? "On track! You can bunk responsibly." : "You're at the threshold. Attend carefully.",
    }
  }

  // Below criteria - must attend more lectures
  const lecturesNeeded = Math.ceil((requiredAttendance * totalLectures - attendedLectures) / (1 - requiredAttendance))

  return {
    currentAttendance,
    canBunk: 0,
    mustAttend: Math.max(0, lecturesNeeded),
    status: "critical",
    message: "Careful—you're below the threshold. Attend more lectures.",
  }
}

export function ResultCard({ attendanceData }: ResultCardProps) {
  const result = calculateAttendance(attendanceData)

  const getStatusIcon = () => {
    switch (result.status) {
      case "perfect":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "safe":
        return <TrendingUp className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "critical":
        return <TrendingDown className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = () => {
    switch (result.status) {
      case "perfect":
      case "safe":
        return "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
      case "warning":
        return "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800"
      case "critical":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  return (
    <Card className="p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] relative">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Your Results</h2>
      </div>

      <div>
        <AnimatePresence mode="wait">
          {result.status === "awaiting" ? (
            <motion.div
              key="awaiting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center h-32 text-muted-foreground"
            >
              <div className="text-center">
                <motion.div
                  className="text-4xl mb-2"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  📊
                </motion.div>
                <p>{result.message}</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="hidden print:block text-center mb-4">
                <h1 className="text-2xl font-bold text-foreground">BunkApp</h1>
                <p className="text-sm text-muted-foreground">Smart Attendance Calculator</p>
              </div>

              {/* Current Attendance */}
              <div className="text-center">
                <motion.div
                  className="text-3xl font-bold text-foreground mb-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  {result.currentAttendance.toFixed(1)}%
                </motion.div>
                <p className="text-sm text-muted-foreground">Current Attendance</p>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 gap-4">
                {result.canBunk > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950/30 rounded-xl border border-green-200 dark:border-green-800 hover:shadow-md transition-shadow"
                  >
                    <div>
                      <p className="text-sm text-green-600 dark:text-green-400 font-medium">Lectures you can bunk</p>
                      <p className="text-2xl font-bold text-green-700 dark:text-green-300">{result.canBunk}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-500" />
                  </motion.div>
                )}

                {result.mustAttend > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-800 hover:shadow-md transition-shadow"
                  >
                    <div>
                      <p className="text-sm text-red-600 dark:text-red-400 font-medium">Lectures you must attend</p>
                      <p className="text-2xl font-bold text-red-700 dark:text-red-300">{result.mustAttend}</p>
                    </div>
                    <TrendingDown className="h-8 w-8 text-red-500" />
                  </motion.div>
                )}

                {result.canBunk === 0 && result.mustAttend === 0 && result.status !== "perfect" && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-xl border border-yellow-200 dark:border-yellow-800 hover:shadow-md transition-shadow"
                  >
                    <div>
                      <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">Status</p>
                      <p className="text-lg font-semibold text-yellow-700 dark:text-yellow-300">At Threshold</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-yellow-500" />
                  </motion.div>
                )}
              </div>

              {/* Status Badge and Message */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-2">
                  {getStatusIcon()}
                  <Badge variant="outline" className={getStatusColor()}>
                    {result.status === "perfect" && "Perfect Attendance"}
                    {result.status === "safe" && "Safe Zone"}
                    {result.status === "warning" && "Caution Zone"}
                    {result.status === "critical" && "Critical Zone"}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">{result.message}</p>
              </motion.div>

              <div className="hidden print:block text-center text-xs text-muted-foreground mt-4">
                Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </Card>
  )
}
