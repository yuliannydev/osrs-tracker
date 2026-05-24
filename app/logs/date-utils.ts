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

export function daysInMonth(year: number, month: number): number {
	return new Date(year, month + 1, 0).getDate();
}

/** Returns 1-based day numbers that have at least one entry in the given month */
export function activeDays(
	entries: { date: string }[],
	year: number,
	month: number,
): Set<number> {
	const active = new Set<number>();
	for (const e of entries) {
		const d = new Date(e.date);
		if (d.getFullYear() === year && d.getMonth() === month) {
			active.add(d.getDate());
		}
	}
	return active;
}

/** Day-of-week offset for the 1st of the month, Mon-start (Mon=0 … Sun=6) */
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
