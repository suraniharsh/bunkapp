import { describe, it, expect } from 'vitest'
import {
    calculateAttendance,
    calculateAttendancePercentage,
    calculateBunkableLectures,
    calculateRequiredLectures,
    type AttendanceData,
    type CalculationResult,
} from '../../lib/attendance-calculations'

describe('Attendance Calculations', () => {
    describe('calculateAttendancePercentage', () => {
        it('should calculate correct percentage for normal cases', () => {
            expect(calculateAttendancePercentage(80, 100)).toBe(80)
            expect(calculateAttendancePercentage(75, 100)).toBe(75)
            expect(calculateAttendancePercentage(50, 100)).toBe(50)
            expect(calculateAttendancePercentage(15, 20)).toBe(75)
            expect(calculateAttendancePercentage(7, 10)).toBe(70)
        })

        it('should handle edge cases', () => {
            expect(calculateAttendancePercentage(0, 0)).toBe(0)
            expect(calculateAttendancePercentage(5, 0)).toBe(0)
            expect(calculateAttendancePercentage(-5, 10)).toBe(0)
            expect(calculateAttendancePercentage(5, -10)).toBe(0)
            expect(calculateAttendancePercentage(15, 10)).toBe(0) // attended > total
        })

        it('should handle perfect attendance', () => {
            expect(calculateAttendancePercentage(100, 100)).toBe(100)
            expect(calculateAttendancePercentage(50, 50)).toBe(100)
            expect(calculateAttendancePercentage(1, 1)).toBe(100)
        })

        it('should handle zero attendance', () => {
            expect(calculateAttendancePercentage(0, 100)).toBe(0)
            expect(calculateAttendancePercentage(0, 50)).toBe(0)
            expect(calculateAttendancePercentage(0, 1)).toBe(0)
        })
    })

    describe('calculateBunkableLectures', () => {
        it('should calculate correct bunkable lectures for normal cases', () => {
            // 80 attended out of 100, need 75% - can bunk some
            expect(calculateBunkableLectures(80, 100, 75)).toBe(6)

            // 15 attended out of 20, need 75% - exactly at threshold
            expect(calculateBunkableLectures(15, 20, 75)).toBe(0)

            // 18 attended out of 20, need 75% - can bunk some
            expect(calculateBunkableLectures(18, 20, 75)).toBe(4)
        })

        it('should return 0 when below required percentage', () => {
            expect(calculateBunkableLectures(70, 100, 75)).toBe(0)
            expect(calculateBunkableLectures(10, 20, 75)).toBe(0)
            expect(calculateBunkableLectures(50, 100, 75)).toBe(0)
        })

        it('should handle edge cases', () => {
            expect(calculateBunkableLectures(0, 0, 75)).toBe(0)
            expect(calculateBunkableLectures(5, 0, 75)).toBe(0)
            expect(calculateBunkableLectures(-5, 10, 75)).toBe(0)
            expect(calculateBunkableLectures(5, -10, 75)).toBe(0)
            expect(calculateBunkableLectures(15, 10, 75)).toBe(0) // attended > total
            expect(calculateBunkableLectures(10, 10, -5)).toBe(0) // negative percentage
            expect(calculateBunkableLectures(10, 10, 100)).toBe(0) // 100% requirement
            expect(calculateBunkableLectures(10, 10, 105)).toBe(0) // > 100% requirement
        })

        it('should handle perfect attendance scenarios', () => {
            expect(calculateBunkableLectures(100, 100, 75)).toBe(33)
            expect(calculateBunkableLectures(50, 50, 80)).toBe(12)
            expect(calculateBunkableLectures(20, 20, 90)).toBe(2)
        })
    })

    describe('calculateRequiredLectures', () => {
        it('should calculate required lectures for normal cases', () => {
            // 70 attended out of 100, need 75% - need to attend more
            expect(calculateRequiredLectures(70, 100, 75)).toBe(20)

            // 10 attended out of 20, need 75% - need to attend more
            // Current: 50%, Need: 75%
            // Formula: (10 + x) / (20 + x) >= 0.75
            // 10 + x >= 0.75 * (20 + x)
            // 10 + x >= 15 + 0.75x
            // 0.25x >= 5
            // x >= 20
            expect(calculateRequiredLectures(10, 20, 75)).toBe(20)

            // 50 attended out of 100, need 75% - need to attend more
            expect(calculateRequiredLectures(50, 100, 75)).toBe(100)
        })

        it('should return 0 when already above required percentage', () => {
            expect(calculateRequiredLectures(80, 100, 75)).toBe(0)
            expect(calculateRequiredLectures(16, 20, 75)).toBe(0)
            expect(calculateRequiredLectures(100, 100, 75)).toBe(0)
        })

        it('should handle edge cases', () => {
            expect(calculateRequiredLectures(0, 0, 75)).toBe(0)
            expect(calculateRequiredLectures(5, 0, 75)).toBe(0)
            expect(calculateRequiredLectures(-5, 10, 75)).toBe(0)
            expect(calculateRequiredLectures(5, -10, 75)).toBe(0)
            expect(calculateRequiredLectures(15, 10, 75)).toBe(0) // attended > total
            expect(calculateRequiredLectures(10, 20, -5)).toBe(0) // negative percentage
            expect(calculateRequiredLectures(10, 20, 0)).toBe(0) // 0% requirement
            expect(calculateRequiredLectures(10, 20, 105)).toBe(0) // > 100% requirement
        })

        it('should handle cases where 100% attendance is required', () => {
            expect(calculateRequiredLectures(90, 100, 100)).toBe(0) // Can't achieve 100% if already missed some
            expect(calculateRequiredLectures(95, 100, 100)).toBe(0)
            expect(calculateRequiredLectures(100, 100, 100)).toBe(0)
        })
    })

    describe('calculateAttendance - Main Function', () => {
        it('should handle awaiting state for zero total lectures', () => {
            const data: AttendanceData = { totalLectures: 0, attendedLectures: 0, attendanceCriteria: 75 }
            const result = calculateAttendance(data)

            expect(result.status).toBe('awaiting')
            expect(result.currentAttendance).toBe(0)
            expect(result.canBunk).toBe(0)
            expect(result.mustAttend).toBe(0)
            expect(result.message).toBe('Enter your lecture details to see results')
        })

        it('should handle invalid input cases', () => {
            const invalidCases: AttendanceData[] = [
                { totalLectures: 10, attendedLectures: 15, attendanceCriteria: 75 }, // attended > total
                { totalLectures: -5, attendedLectures: 5, attendanceCriteria: 75 }, // negative total
                { totalLectures: 10, attendedLectures: -5, attendanceCriteria: 75 }, // negative attended
                { totalLectures: 10, attendedLectures: 5, attendanceCriteria: -10 }, // negative criteria
                { totalLectures: 10, attendedLectures: 5, attendanceCriteria: 110 }, // criteria > 100
            ]

            invalidCases.forEach(data => {
                const result = calculateAttendance(data)
                expect(result.status).toBe('awaiting')
                expect(result.message).toBe('Please check your input values')
            })
        })

        it('should handle perfect attendance status', () => {
            const data: AttendanceData = { totalLectures: 100, attendedLectures: 100, attendanceCriteria: 75 }
            const result = calculateAttendance(data)

            expect(result.status).toBe('perfect')
            expect(result.currentAttendance).toBe(100)
            expect(result.canBunk).toBe(25) // Can bunk 25 lectures with 75% requirement
            expect(result.mustAttend).toBe(0)
            expect(result.message).toBe('Perfect attendance! Impressive discipline.')
        })

        it('should handle perfect attendance with 100% criteria', () => {
            const data: AttendanceData = { totalLectures: 100, attendedLectures: 100, attendanceCriteria: 100 }
            const result = calculateAttendance(data)

            expect(result.status).toBe('perfect')
            expect(result.currentAttendance).toBe(100)
            expect(result.canBunk).toBe(0) // Can't bunk any with 100% requirement
            expect(result.mustAttend).toBe(0)
        })

        it('should handle safe status (above criteria + 10%)', () => {
            const data: AttendanceData = { totalLectures: 100, attendedLectures: 90, attendanceCriteria: 75 }
            const result = calculateAttendance(data)

            expect(result.status).toBe('safe')
            expect(result.currentAttendance).toBe(90)
            expect(result.canBunk).toBe(20) // Can bunk 20 lectures
            expect(result.mustAttend).toBe(0)
            expect(result.message).toBe('On track! You can bunk responsibly.')
        })

        it('should handle warning status (above criteria but < criteria + 10%)', () => {
            const data: AttendanceData = { totalLectures: 100, attendedLectures: 80, attendanceCriteria: 75 }
            const result = calculateAttendance(data)

            expect(result.status).toBe('warning')
            expect(result.currentAttendance).toBe(80)
            expect(result.canBunk).toBe(6) // Can bunk 6 lectures
            expect(result.mustAttend).toBe(0)
            expect(result.message).toBe('On track! You can bunk responsibly.')
        })

        it('should handle warning status at exact threshold', () => {
            const data: AttendanceData = { totalLectures: 100, attendedLectures: 75, attendanceCriteria: 75 }
            const result = calculateAttendance(data)

            expect(result.status).toBe('warning')
            expect(result.currentAttendance).toBe(75)
            expect(result.canBunk).toBe(0) // Can't bunk any at exact threshold
            expect(result.mustAttend).toBe(0)
            expect(result.message).toBe("You're at the threshold. Attend carefully.")
        })

        it('should handle critical status (below criteria)', () => {
            const data: AttendanceData = { totalLectures: 100, attendedLectures: 70, attendanceCriteria: 75 }
            const result = calculateAttendance(data)

            expect(result.status).toBe('critical')
            expect(result.currentAttendance).toBe(70)
            expect(result.canBunk).toBe(0)
            expect(result.mustAttend).toBe(20) // Must attend 20 more lectures
            expect(result.message).toBe('Careful—you\'re below the threshold. Attend more lectures.')
        })

        it('should handle edge case with very low attendance', () => {
            const data: AttendanceData = { totalLectures: 100, attendedLectures: 10, attendanceCriteria: 75 }
            const result = calculateAttendance(data)

            expect(result.status).toBe('critical')
            expect(result.currentAttendance).toBe(10)
            expect(result.canBunk).toBe(0)
            expect(result.mustAttend).toBe(260) // Need to attend many more lectures
        })

        it('should handle small lecture counts', () => {
            const data: AttendanceData = { totalLectures: 4, attendedLectures: 3, attendanceCriteria: 75 }
            const result = calculateAttendance(data)

            expect(result.status).toBe('warning') // 75% exactly, not safe (needs >= 85% for safe)
            expect(result.currentAttendance).toBe(75)
            expect(result.canBunk).toBe(0)
            expect(result.mustAttend).toBe(0)
        })

        it('should handle edge case with 1 lecture', () => {
            const data: AttendanceData = { totalLectures: 1, attendedLectures: 1, attendanceCriteria: 75 }
            const result = calculateAttendance(data)

            expect(result.status).toBe('perfect')
            expect(result.currentAttendance).toBe(100)
            expect(result.canBunk).toBe(0)
            expect(result.mustAttend).toBe(0)
        })

        it('should handle different criteria percentages', () => {
            // Test with 80% criteria
            const data80: AttendanceData = { totalLectures: 100, attendedLectures: 85, attendanceCriteria: 80 }
            const result80 = calculateAttendance(data80)
            expect(result80.status).toBe('warning')
            expect(result80.canBunk).toBe(6)

            // Test with 90% criteria
            const data90: AttendanceData = { totalLectures: 100, attendedLectures: 95, attendanceCriteria: 90 }
            const result90 = calculateAttendance(data90)
            expect(result90.status).toBe('warning')
            expect(result90.canBunk).toBe(5)

            // Test with 60% criteria
            const data60: AttendanceData = { totalLectures: 100, attendedLectures: 70, attendanceCriteria: 60 }
            const result60 = calculateAttendance(data60)
            expect(result60.status).toBe('safe')
            expect(result60.canBunk).toBe(16)
        })
    })
})