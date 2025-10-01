export interface AttendanceData {
    totalLectures: number
    attendedLectures: number
    attendanceCriteria: number
}

export interface CalculationResult {
    currentAttendance: number
    canBunk: number
    mustAttend: number
    status: "safe" | "warning" | "critical" | "perfect" | "awaiting"
    message: string
}

/**
 * Calculates attendance statistics and recommendations
 * @param data - The attendance data containing total lectures, attended lectures, and attendance criteria
 * @returns CalculationResult with current status and recommendations
 */
export function calculateAttendance(data: AttendanceData): CalculationResult {
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

    if (attendedLectures < 0 || totalLectures < 0 || attendanceCriteria < 0 || attendanceCriteria > 100) {
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

/**
 * Calculates current attendance percentage
 * @param attendedLectures - Number of lectures attended
 * @param totalLectures - Total number of lectures conducted
 * @returns Attendance percentage (0-100)
 */
export function calculateAttendancePercentage(attendedLectures: number, totalLectures: number): number {
    if (totalLectures === 0) return 0
    if (attendedLectures < 0 || totalLectures < 0) return 0
    if (attendedLectures > totalLectures) return 0

    return (attendedLectures / totalLectures) * 100
}

/**
 * Calculates how many lectures can be bunked while maintaining the required attendance percentage
 * @param attendedLectures - Number of lectures attended
 * @param totalLectures - Total number of lectures conducted
 * @param requiredPercentage - Required attendance percentage (0-100)
 * @returns Number of lectures that can be bunked
 */
export function calculateBunkableLectures(
    attendedLectures: number,
    totalLectures: number,
    requiredPercentage: number
): number {
    if (totalLectures === 0 || requiredPercentage >= 100) return 0
    if (attendedLectures < 0 || totalLectures < 0 || requiredPercentage < 0) return 0
    if (attendedLectures > totalLectures) return 0

    const requiredAttendance = requiredPercentage / 100
    const currentAttendance = (attendedLectures / totalLectures) * 100

    // If already below required percentage, can't bunk any
    if (currentAttendance < requiredPercentage) return 0

    // Formula: bunked <= (attended - required_percentage * total) / required_percentage
    const canBunk = Math.floor((attendedLectures - requiredAttendance * totalLectures) / requiredAttendance)
    return Math.max(0, canBunk)
}

/**
 * Calculates how many lectures must be attended to reach the required attendance percentage
 * @param attendedLectures - Number of lectures attended
 * @param totalLectures - Total number of lectures conducted
 * @param requiredPercentage - Required attendance percentage (0-100)
 * @returns Number of lectures that must be attended
 */
export function calculateRequiredLectures(
    attendedLectures: number,
    totalLectures: number,
    requiredPercentage: number
): number {
    if (totalLectures === 0 || requiredPercentage <= 0) return 0
    if (attendedLectures < 0 || totalLectures < 0 || requiredPercentage > 100) return 0
    if (attendedLectures > totalLectures) return 0

    const currentAttendance = (attendedLectures / totalLectures) * 100

    // If already above required percentage, no lectures needed
    if (currentAttendance >= requiredPercentage) return 0

    // If 100% is required and we've already missed some lectures, it's impossible
    if (requiredPercentage === 100 && attendedLectures < totalLectures) return 0

    const requiredAttendance = requiredPercentage / 100
    // Formula: (attended + mustAttend) / (total + mustAttend) >= required
    // Solving: mustAttend >= (required * total - attended) / (1 - required)
    const lecturesNeeded = Math.ceil((requiredAttendance * totalLectures - attendedLectures) / (1 - requiredAttendance))

    return Math.max(0, lecturesNeeded)
}