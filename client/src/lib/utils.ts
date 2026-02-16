/**
 * Get status color based on load percentage
 */
export function getStatusColor(loadPercentage: number): number {
    if (loadPercentage <= 50) return 0x10b981; // Emerald
    if (loadPercentage <= 70) return 0x3b82f6; // Blue
    if (loadPercentage <= 85) return 0xf59e0b; // Amber
    if (loadPercentage <= 95) return 0xf97316; // Orange
    if (loadPercentage <= 100) return 0xef4444; // Red
    return 0xdc2626; // Dark Red (Critical)
}

/**
 * Get status label
 */
export function getStatusLabel(loadPercentage: number): string {
    if (loadPercentage <= 50) return 'Excellent';
    if (loadPercentage <= 70) return 'Good';
    if (loadPercentage <= 85) return 'Moderate';
    if (loadPercentage <= 95) return 'High Load';
    if (loadPercentage <= 100) return 'Overcapacity';
    return 'Critical';
}

/**
 * Get facility icon based on type
 */
export function getFacilityIcon(type: string): string {
    switch (type) {
        case 'Hospital':
            return '🏥';
        case 'Clinic':
            return '⚕️';
        case 'Health Center':
            return '➕';
        case 'Specialist Center':
            return '🔬';
        default:
            return '🏥';
    }
}

/**
 * Calculate building height based on capacity
 */
export function getBuildingHeight(capacity: number): number {
    // Scale: 1 capacity = 0.01 units, min 0.5, max 10
    return Math.max(0.5, Math.min(10, capacity * 0.01));
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
    return num.toLocaleString();
}

/**
 * Format date
 */
export function formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

/**
 * Format time
 */
export function formatTime(date: string): string {
    return new Date(date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });
}
