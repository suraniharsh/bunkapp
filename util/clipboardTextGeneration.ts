import { AttendanceData, CalculationResult } from "@/lib/attendance-calculations"

export const generateShareText = (result: CalculationResult, attendanceData: AttendanceData) => {
    const lines = [
        "📊 Attendance Summary",
        `- Current Attendance: ${result.currentAttendance.toFixed(1)}%`,
        `- Attendance Criteria: ${attendanceData.attendanceCriteria}%`
    ]

    if (result.canBunk > 0) {
        lines.push(`- You can bunk ${result.canBunk} more lecture${result.canBunk > 1 ? 's' : ''}.`)
    }

    if (result.mustAttend > 0) {
        lines.push(`- You must attend ${result.mustAttend} more lecture${result.mustAttend > 1 ? 's' : ''} to reach ${attendanceData.attendanceCriteria}%.`)
    }

    if (result.status === "perfect") {
        lines.push("- Status: Perfect Attendance 🎉")
    } else if (result.canBunk === 0 && result.mustAttend === 0) {
        lines.push("- Status: At Threshold ⚖️")
    }

    lines.push("", "Generated with BunkApp - Smart Attendance Calculator")

    return lines.join("\n")
}