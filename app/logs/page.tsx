'use client';
import { useState } from 'react';
import { useLocalStorage } from '@/lib/useLocalStorage';
import type { HerbEntry } from '@/components/HerbTracker';
import type { BirdHouseEntry } from '@/components/BirdHouseTracker';
import type { SlayerEntry } from '@/components/SlayerTracker';

// ── Helpers ──

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

function daysInMonth(year: number, month: number) {
	return new Date(year, month + 1, 0).getDate();
}

function activeDays(
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

function firstDayOffset(year: number, month: number) {
	const day = new Date(year, month, 1).getDay();
	return (day + 6) % 7; // Mon=0 … Sun=6
}

// ── Build last 12 months always ──
function buildLast12Months(): string[] {
	const now = new Date();
	const months: string[] = [];
	for (let i = 0; i < 12; i++) {
		const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
		const y = d.getFullYear();
		const m = String(d.getMonth() + 1).padStart(2, '0');
		months.push(`${y}-${m}`);
	}
	return months; // already newest → oldest
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

	const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

	const cells: (number | null)[] = [
		...Array(offset).fill(null),
		...Array.from({ length: total }, (_, i) => i + 1),
	];
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

			{/* Grid */}
			<div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
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

	const herbDays = activeDays(herbs, selectedYear, selectedMonth);
	const bhDays = activeDays(bh, selectedYear, selectedMonth);
	const slayerDays = activeDays(slayer, selectedYear, selectedMonth);

	// ── Always show the last 12 months ──
	const monthOptions = buildLast12Months();

	const handleMonthChange = (val: string) => {
		const [y, m] = val.split('-').map(Number);
		setSelectedYear(y);
		setSelectedMonth(m - 1);
	};

	const selectedValue = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;

	return (
		<div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px' }}>
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

				{/* Month selector — always 12 months */}
				<select
					className='osrs-input'
					value={selectedValue}
					onChange={(e) => handleMonthChange(e.target.value)}
					style={{ fontSize: '0.85rem', cursor: 'pointer', minWidth: 160 }}
				>
					{monthOptions.map((ym) => {
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

			{/* Grids */}
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
