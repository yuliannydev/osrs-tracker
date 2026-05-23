'use client';
import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/lib/useLocalStorage';
import type { HerbEntry } from '@/components/HerbTracker';
import type { BirdHouseEntry } from '@/components/BirdHouseTracker';
import type { SlayerEntry } from '@/components/SlayerTracker';

// ── Helpers ──

// All months for the dropdown
const MONTH_NAMES = [
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
];

// Days in a given month/year
function daysInMonth(year: number, month: number) {
	return new Date(year, month + 1, 0).getDate();
}

// Build a Set of "YYYY-MM-DD" strings that have at least one entry
function activeDays(
	entries: { date: string }[],
	year: number,
	month: number,
): Set<number> {
	const active = new Set<number>();
	for (const e of entries) {
		const d = new Date(e.date);
		if (d.getFullYear() === year && d.getMonth() === month) {
			active.add(d.getDate()); // 1-based day number
		}
	}
	return active;
}

// Day-of-week for the 1st of the month (0=Sun…6=Sat), shifted to Mon-start (0=Mon…6=Sun)
function firstDayOffset(year: number, month: number) {
	const day = new Date(year, month, 1).getDay(); // 0=Sun
	return (day + 6) % 7; // Mon=0 … Sun=6
}

// ── Activity Grid ──
function ActivityGrid({
	label,
	icon,
	activeDaysSet,
	year,
	month,
}: {
	label: string;
	icon: string;
	activeDaysSet: Set<number>;
	year: number;
	month: number;
}) {
	const total = daysInMonth(year, month);
	const offset = firstDayOffset(year, month);
	const activeCt = activeDaysSet.size;

	// Day labels Mon–Sun
	const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

	// Build cells: offset empty cells + day cells
	const cells: (number | null)[] = [
		...Array(offset).fill(null),
		...Array.from({ length: total }, (_, i) => i + 1),
	];

	// Pad to complete last row
	while (cells.length % 7 !== 0) cells.push(null);

	return (
		<div
			className='osrs-panel'
			style={{ padding: '18px 20px' }}
		>
			{/* Header */}
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: 14,
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
					<span style={{ fontSize: '1.1rem' }}>{icon}</span>
					<span
						style={{
							color: 'var(--gold)',
							fontWeight: 'bold',
							fontSize: '0.9rem',
							letterSpacing: '0.04em',
						}}
					>
						{label}
					</span>
				</div>
				{/* Score badge — OSRS Collections Logged style */}
				<div
					style={{
						background: 'rgba(0,0,0,0.35)',
						border: '1px solid var(--border-bright)',
						borderRadius: 4,
						padding: '4px 12px',
						fontSize: '0.85rem',
						fontWeight: 'bold',
						color: activeCt > 0 ? 'var(--gold)' : 'var(--text-dim)',
						letterSpacing: '0.03em',
					}}
				>
					{activeCt}
					<span style={{ color: 'var(--text-dim)', fontWeight: 'normal' }}>
						/{total}
					</span>
				</div>
			</div>

			{/* Grid — columns = Mon…Sun, rows = weeks */}
			<div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
				{/* Day-of-week header row */}
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(7, 1fr)',
						gap: 4,
					}}
				>
					{dayLabels.map((d) => (
						<div
							key={d}
							style={{
								fontSize: '0.65rem',
								color: 'var(--text-dim)',
								textAlign: 'center',
								paddingBottom: 2,
							}}
						>
							{d}
						</div>
					))}
				</div>

				{/* Week rows */}
				{Array.from({ length: cells.length / 7 }, (_, week) => (
					<div
						key={week}
						style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(7, 1fr)',
							gap: 4,
						}}
					>
						{cells.slice(week * 7, week * 7 + 7).map((day, col) => {
							if (day === null) {
								return (
									<div
										key={col}
										style={{ aspectRatio: '1', borderRadius: 4 }}
									/>
								);
							}
							const active = activeDaysSet.has(day);
							return (
								<div
									key={col}
									title={`${MONTH_NAMES[month]} ${day}${active ? ' ✓' : ''}`}
									style={{
										aspectRatio: '1',
										borderRadius: 4,
										background: active
											? 'linear-gradient(135deg, #3aaa3a, #2a8a2a)'
											: 'rgba(255,255,255,0.04)',
										border: active
											? '1px solid rgba(80,200,80,0.4)'
											: '1px solid rgba(255,255,255,0.06)',
										boxShadow: active ? '0 0 6px rgba(58,170,58,0.4)' : 'none',
										transition: 'all 0.1s',
										cursor: 'default',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										fontSize: '0.6rem',
										color: active ? 'rgba(255,255,255,0.7)' : 'var(--text-dim)',
									}}
								>
									{day}
								</div>
							);
						})}
					</div>
				))}
			</div>

			{/* Legend */}
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 6,
					marginTop: 12,
					justifyContent: 'flex-end',
				}}
			>
				<span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>
					No activity
				</span>
				<div
					style={{
						width: 12,
						height: 12,
						borderRadius: 2,
						background: 'rgba(255,255,255,0.04)',
						border: '1px solid rgba(255,255,255,0.06)',
					}}
				/>
				<div
					style={{
						width: 12,
						height: 12,
						borderRadius: 2,
						background: 'linear-gradient(135deg,#3aaa3a,#2a8a2a)',
						border: '1px solid rgba(80,200,80,0.4)',
						boxShadow: '0 0 4px rgba(58,170,58,0.4)',
					}}
				/>
				<span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>
					Active day
				</span>
			</div>
		</div>
	);
}

// ── Page ──
export default function LogsPage() {
	const now = new Date();
	const [selectedYear, setSelectedYear] = useState(now.getFullYear());
	const [selectedMonth, setSelectedMonth] = useState(now.getMonth());

	const [herbs] = useLocalStorage<HerbEntry[]>('osrs-herb-runs', []);
	const [bh] = useLocalStorage<BirdHouseEntry[]>('osrs-bird-houses', []);
	const [slayer] = useLocalStorage<SlayerEntry[]>('osrs-slayer', []);

	// Build active day sets for the selected month
	const herbDays = activeDays(herbs, selectedYear, selectedMonth);
	const bhDays = activeDays(bh, selectedYear, selectedMonth);
	const slayerDays = activeDays(slayer, selectedYear, selectedMonth);

	// Month options: current month + all previous months that have any data
	const allDates = [
		...herbs.map((e) => e.date.slice(0, 7)),
		...bh.map((e) => e.date.slice(0, 7)),
		...slayer.map((e) => e.date.slice(0, 7)),
	];
	const uniqueMonths = [
		...new Set([
			`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
			...allDates,
		]),
	]
		.sort()
		.reverse();

	const handleMonthChange = (val: string) => {
		const [y, m] = val.split('-').map(Number);
		setSelectedYear(y);
		setSelectedMonth(m - 1);
	};

	const selectedValue = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;

	return (
		<div
			className='page-container'
			style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px' }}
		>
			{/* Header */}
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'flex-start',
					marginBottom: 24,
					flexWrap: 'wrap',
					gap: 12,
				}}
			>
				<div>
					<h1
						style={{
							fontSize: '1.6rem',
							fontWeight: 'bold',
							color: 'var(--gold)',
							textShadow: '0 0 16px var(--gold-glow)',
							letterSpacing: '0.05em',
							marginBottom: 4,
						}}
					>
						📜 Logs
					</h1>
					<p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
						Daily activity tracker — each square is a day with at least one run
					</p>
				</div>

				{/* Month selector */}
				<select
					className='osrs-input'
					value={selectedValue}
					onChange={(e) => handleMonthChange(e.target.value)}
					style={{ fontSize: '0.85rem', cursor: 'pointer', minWidth: 160 }}
				>
					{uniqueMonths.map((ym) => {
						const [y, m] = ym.split('-').map(Number);
						return (
							<option
								key={ym}
								value={ym}
							>
								{MONTH_NAMES[m - 1]} {y}
							</option>
						);
					})}
				</select>
			</div>

			{/* Grids — one per tracker, in dashboard order */}
			<div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
				<ActivityGrid
					label='Farming Runs'
					icon='🌾'
					activeDaysSet={herbDays}
					year={selectedYear}
					month={selectedMonth}
				/>
				<ActivityGrid
					label='Bird Houses'
					icon='🏠'
					activeDaysSet={bhDays}
					year={selectedYear}
					month={selectedMonth}
				/>
				<ActivityGrid
					label='Slayer Task'
					icon='💀'
					activeDaysSet={slayerDays}
					year={selectedYear}
					month={selectedMonth}
				/>
			</div>
		</div>
	);
}
