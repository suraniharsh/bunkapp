"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { BookOpen, Users, Target } from "lucide-react"
import type { AttendanceData } from "@/lib/attendance-calculations"

interface InputCardProps {
  onInputChange?: (data: AttendanceData) => void
}

interface StoredInputData {
  totalLectures: string
  attendedLectures: string
  attendanceCriteria: number[]
}

export function InputCard({ onInputChange }: InputCardProps) {
  const [totalLectures, setTotalLectures] = useState<string>("")
  const [attendedLectures, setAttendedLectures] = useState<string>("")
  const [attendanceCriteria, setAttendanceCriteria] = useState<number[]>([75])
  const [isInitialized, setIsInitialized] = useState(false)

  const [errors, setErrors] = useState<{ total?: string; attended?: string }>({})

  const [storedData, setStoredData] = useLocalStorage<StoredInputData>("bunkapp-inputs", {
    totalLectures: "",
    attendedLectures: "",
    attendanceCriteria: [75],
  })

  // Use ref to store the latest onInputChange callback
  const onInputChangeRef = useRef(onInputChange)
  useEffect(() => {
    onInputChangeRef.current = onInputChange
  }, [onInputChange])

  useEffect(() => {
    if (!isInitialized && storedData) {
      setTotalLectures(storedData.totalLectures || "")
      setAttendedLectures(storedData.attendedLectures || "")
      setAttendanceCriteria(storedData.attendanceCriteria || [75])
      setIsInitialized(true)
    }
  }, [storedData, isInitialized])

  // Save to localStorage with a ref to prevent loops
  const saveTimeoutRef = useRef<NodeJS.Timeout>()
  useEffect(() => {
    if (isInitialized) {
      // Debounce localStorage writes to prevent excessive updates
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
      
      saveTimeoutRef.current = setTimeout(() => {
        const newData = {
          totalLectures,
          attendedLectures,
          attendanceCriteria,
        }
        
        // Only update if data actually changed
        if (JSON.stringify(storedData) !== JSON.stringify(newData)) {
          setStoredData(newData)
        }
      }, 300) // 300ms debounce
      
      return () => {
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current)
        }
      }
    }
  }, [totalLectures, attendedLectures, attendanceCriteria, isInitialized])

  useEffect(() => {
    if (isInitialized && onInputChangeRef.current) {
      const total = Number.parseInt(totalLectures) || 0;
      const attended = Number.parseInt(attendedLectures) || 0;
      const criteria = attendanceCriteria[0] || 75;

      let newErrors: { total?: string; attended?: string } = {};

      if (!totalLectures) newErrors.total = "Total lectures is required";
      else if (total <= 0) newErrors.total = "Enter a number greater than 0";

      if (!attendedLectures) newErrors.attended = "Attended lectures is required";
      else if (attended < 0) newErrors.attended = "Enter a valid number";
      else if (attended > total)
        newErrors.attended = "Attended cannot exceed total lectures";

      // only update errors if changed (prevents unnecessary re-renders)
      setErrors((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(newErrors)) {
          return newErrors;
        }
        return prev;
      });

      if (Object.keys(newErrors).length === 0) {
        onInputChangeRef.current({
          totalLectures: total,
          attendedLectures: attended,
          attendanceCriteria: criteria,
        })
      }
    }
  }, [totalLectures, attendedLectures, attendanceCriteria, isInitialized])

  const handleTotalLecturesChange = (value: string) => {
    // Only allow positive numbers
    if (value === "" || (/^\d+$/.test(value) && Number.parseInt(value) >= 0)) {
      setTotalLectures(value)
    }
  }

  const handleAttendedLecturesChange = (value: string) => {
    // Only allow positive numbers
    if (value === "" || (/^\d+$/.test(value) && Number.parseInt(value) >= 0)) {
      setAttendedLectures(value)
    }
  }

  const handleCriteriaChange = (value: number[]) => {
    setAttendanceCriteria(value)
  }

  // Validation helpers
  const totalLecturesNum = Number.parseInt(totalLectures) || 0
  const attendedLecturesNum = Number.parseInt(attendedLectures) || 0
  const isAttendedExceedsTotal = attendedLecturesNum > totalLecturesNum && totalLecturesNum > 0

  return (
    <Card className="p-6 rounded-xl bg-card border border-border shadow-sm">
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="total-lectures" className="text-sm font-medium text-foreground">
              Total Lectures
            </Label>
          </div>
          <Input
            id="total-lectures"
            type="text"
            inputMode="numeric"
            placeholder="50"
            value={totalLectures}
            onChange={(e) => handleTotalLecturesChange(e.target.value)}
            className="h-10 rounded-md border border-input bg-input hover:border-ring focus:border-ring transition-colors"
          />
          {errors.total && <p className="text-sm text-destructive">{errors.total}</p>}
          {totalLecturesNum === 0 && totalLectures !== "" && (
            <p className="text-sm text-destructive">Please enter a valid number</p>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="attended-lectures" className="text-sm font-medium text-foreground">
              Attended Lectures
            </Label>
          </div>
          <Input
            id="attended-lectures"
            type="text"
            inputMode="numeric"
            placeholder="40"
            value={attendedLectures}
            onChange={(e) => handleAttendedLecturesChange(e.target.value)}
            className={`h-10 rounded-md border bg-input hover:border-ring focus:border-ring transition-colors ${isAttendedExceedsTotal ? "border-destructive focus:border-destructive" : "border-input"
              }`}
          />
          {errors.attended && <p className="text-sm text-destructive">{errors.attended}</p>}
          {isAttendedExceedsTotal && (
            <p className="text-sm text-destructive">Attended lectures cannot exceed total lectures</p>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <Label className="text-sm font-medium text-foreground">Attendance Criteria</Label>
          </div>

          <div className="bg-muted rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Required percentage</span>
              <span className="text-lg font-semibold text-foreground">{attendanceCriteria[0]}%</span>
            </div>

            <div className="px-2">
              <Slider
                value={attendanceCriteria}
                onValueChange={handleCriteriaChange}
                max={100}
                min={10}
                step={1}
                className="w-full"
              />
            </div>

            <div className="flex justify-between text-xs text-muted-foreground px-2">
              <span>10%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {totalLecturesNum > 0 && attendedLecturesNum >= 0 && !isAttendedExceedsTotal && (
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">Current Status</p>
              <p className="text-sm text-muted-foreground">
                {attendedLecturesNum} of {totalLecturesNum} lectures attended, targeting {attendanceCriteria[0]}%
                attendance
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
