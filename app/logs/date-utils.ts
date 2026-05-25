export const MONTH_NAMES = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
] as const;

/** Returns the number of days in a given month */
export function daysInMonth(year: number, month: number): number {
	return new Date(year, month + 1, 0).getDate();
}

/** Returns 1-based day numbers with at least one entry in the given month */
/**  Parses dates from the UTC ISO string directly to match how entries are saved */
export function activeDays(
	entries: { date: string }[],
	year: number,
	month: number,
): Set<number> {
	const active = new Set<number>();
	for (const e of entries) {
		const dateStr = e.date.slice(0, 10); // "YYYY-MM-DD" UTC
		const [y, m, d] = dateStr.split('-').map(Number);
		if (y === year && m - 1 === month) {
			active.add(d);
		}
	}
	return active;
}

/** Returns Mon-start day-of-week offset for the 1st of the month (Mon=0, Sun=6) */
export function firstDayOffset(year: number, month: number): number {
	const day = new Date(year, month, 1).getDay();
	return (day + 6) % 7;
}

/** Returns the last 12 months as "YYYY-MM" strings, newest first */
export function buildLast12Months(): string[] {
	const now = new Date();
	return Array.from({ length: 12 }, (_, i) => {
		const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
		return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
	});
}

/** Formats a "YYYY-MM" string back into year/month numbers */
export function parseYearMonth(ym: string): { year: number; month: number } {
	const [y, m] = ym.split('-').map(Number);
	return { year: y, month: m - 1 };
}

/** Formats year + month (0-based) into "YYYY-MM" */
export function toYearMonthString(year: number, month: number): string {
	return `${year}-${String(month + 1).padStart(2, '0')}`;
}
