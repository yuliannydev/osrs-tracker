'use client';
import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/lib/useLocalStorage';
import type { HerbEntry } from '@/components/HerbTracker';
import type { BirdHouseEntry } from '@/components/BirdHouseTracker';
import type { SlayerEntry } from '@/components/SlayerTracker';
import { ActivityGrid } from './ActivityGrid';
import {
	MONTH_NAMES,
	activeDays,
	buildLast12Months,
	parseYearMonth,
	toYearMonthString,
} from './date-utils';

const GRIDS = [
	{ key: 'herbs', label: 'Farming Runs', icon: '🌾' },
	{ key: 'birdhouse', label: 'Bird Houses', icon: '🏠' },
	{ key: 'slayer', label: 'Slayer Task', icon: '💀' },
] as const;

const MONTH_OPTIONS = buildLast12Months();

function getVisibleMonths(year: number, month: number, count: number) {
	return Array.from({ length: count }, (_, i) => {
		const offset = -(count - 1) + i;
		const d = new Date(year, month + offset, 1);
		return { year: d.getFullYear(), month: d.getMonth() };
	});
}

function calcStreak(entries: { date: string }[]): number {
	if (!entries.length) return 0;
	const days = [...new Set(entries.map((e) => e.date.slice(0, 10)))]
		.sort()
		.reverse();
	let count = 0;
	let cursor = new Date();
	cursor.setHours(0, 0, 0, 0);
	for (const day of days) {
		const d = new Date(day);
		d.setHours(0, 0, 0, 0);
		if (Math.abs(cursor.getTime() - d.getTime()) <= 86_400_000) {
			count++;
			cursor = d;
		} else break;
	}
	return count;
}

export default function LogsPage() {
	const now = new Date();
	const [selectedYear, setSelectedYear] = useState(now.getFullYear());
	const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
	const [monthCount, setMonthCount] = useState(12);

	useEffect(() => {
		const update = () => setMonthCount(window.innerWidth >= 640 ? 12 : 3);
		update();
		window.addEventListener('resize', update);
		return () => window.removeEventListener('resize', update);
	}, []);

	const [herbs] = useLocalStorage<HerbEntry[]>('osrs-herb-runs', []);
	const [bh] = useLocalStorage<BirdHouseEntry[]>('osrs-bird-houses', []);
	const [slayer] = useLocalStorage<SlayerEntry[]>('osrs-slayer', []);

	const entriesMap = { herbs, birdhouse: bh, slayer };
	const visibleMonths = getVisibleMonths(
		selectedYear,
		selectedMonth,
		monthCount,
	);

	const streakMap = {
		herbs: calcStreak(herbs),
		birdhouse: calcStreak(bh),
		slayer: calcStreak(slayer),
	};

	const handleMonthChange = (ym: string) => {
		const { year, month } = parseYearMonth(ym);
		setSelectedYear(year);
		setSelectedMonth(month);
	};

	const selectedValue = toYearMonthString(selectedYear, selectedMonth);

	return (
		<div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px' }}>
			<header
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

				<select
					className='osrs-input'
					value={selectedValue}
					onChange={(e) => handleMonthChange(e.target.value)}
					style={{ fontSize: '0.85rem', cursor: 'pointer', minWidth: 160 }}
				>
					{MONTH_OPTIONS.map((ym) => {
						const { month } = parseYearMonth(ym);
						const [year] = ym.split('-');
						return (
							<option
								key={ym}
								value={ym}
							>
								{MONTH_NAMES[month]} {year}
							</option>
						);
					})}
				</select>
			</header>

			<div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
				{GRIDS.map(({ key, label, icon }) => (
					<ActivityGrid
						key={key}
						label={label}
						icon={icon}
						streak={streakMap[key]}
						months={visibleMonths.map(({ year, month }) => ({
							year,
							month,
							activeDaysSet: activeDays(entriesMap[key], year, month),
						}))}
					/>
				))}
			</div>
		</div>
	);
}
