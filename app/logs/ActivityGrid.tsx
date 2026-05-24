import { MONTH_NAMES, daysInMonth } from './date-utils';

// ── Types ──
type MonthData = {
	year: number;
	month: number;
	activeDaysSet: Set<number>;
};

type Props = {
	label: string;
	icon: string;
	months: MonthData[];
	streak: number;
};

// ── Build weeks as columns ──
// GitHub-style: each column = 1 week (Mon→Sun), left to right = oldest to newest
type DayCell = {
	date: Date;
	day: number;
	month: number;
	year: number;
	active: boolean;
} | null;

function buildWeekColumns(months: MonthData[]): {
	columns: DayCell[][];
	monthLabels: { label: string; colIndex: number }[];
} {
	// Flatten all days across all months in order
	const allDays: DayCell[] = [];
	for (const { year, month, activeDaysSet } of months) {
		const total = daysInMonth(year, month);
		for (let d = 1; d <= total; d++) {
			allDays.push({
				date: new Date(year, month, d),
				day: d,
				month,
				year,
				active: activeDaysSet.has(d),
			});
		}
	}

	// Pad start to Monday
	const firstDay = allDays[0]?.date;
	const startOffset = firstDay ? (firstDay.getDay() + 6) % 7 : 0; // Mon=0
	const padded: DayCell[] = [...Array(startOffset).fill(null), ...allDays];

	// Split into columns of 7 (each column = one week)
	const columns: DayCell[][] = [];
	for (let i = 0; i < padded.length; i += 7) {
		columns.push(padded.slice(i, i + 7));
	}

	// Month labels: find the first column where each month starts
	const monthLabels: { label: string; colIndex: number }[] = [];
	let lastMonth = -1;
	columns.forEach((col, ci) => {
		const firstReal = col.find(Boolean);
		if (firstReal && firstReal.month !== lastMonth) {
			monthLabels.push({
				label: MONTH_NAMES[firstReal.month].slice(0, 3),
				colIndex: ci,
			});
			lastMonth = firstReal.month;
		}
	});

	return { columns, monthLabels };
}

const ROW_LABELS = ['Mon', 'Wed', 'Fri'] as const;
const ROW_INDICES = [0, 2, 4] as const; // which rows get a label

export function ActivityGrid({ label, icon, months = [], streak }: Props) {
	const { columns, monthLabels } = buildWeekColumns(months);
	const CELL = 13; // px — cell size
	const GAP = 3; // px — gap between cells

	const totalActive = months.reduce((s, m) => s + m.activeDaysSet.size, 0);
	const totalDays = months.reduce(
		(s, m) => s + daysInMonth(m.year, m.month),
		0,
	);

	return (
		<div
			className='osrs-panel'
			style={{ padding: '16px 20px' }}
		>
			{/* Panel header */}
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: 12,
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
						color: streak > 0 ? 'var(--gold)' : 'var(--text-dim)',
					}}
				>
					🔥 {streak}
					<span
						style={{
							color: 'var(--text-muted)',
							fontWeight: 'normal',
							fontSize: '0.72rem',
							marginLeft: 4,
						}}
					>
						day streak
					</span>
				</div>
			</div>

			{/* Grid wrapper */}
			<div
				style={{
					overflowX: 'auto',
					overflowY: 'visible',
					paddingBottom: 4,
					width: '100%',
				}}
			>
				<div
					style={{ display: 'inline-flex', flexDirection: 'column', gap: 0 }}
				>
					{/* Month labels row */}
					<div style={{ display: 'flex', marginBottom: 4, marginLeft: 28 }}>
						{columns.map((_, ci) => {
							const lbl = monthLabels.find((m) => m.colIndex === ci);
							return (
								<div
									key={ci}
									style={{ width: CELL + GAP, flexShrink: 0 }}
								>
									{lbl && (
										<span
											style={{
												fontSize: '0.62rem',
												color: 'var(--text-muted)',
												whiteSpace: 'nowrap',
											}}
										>
											{lbl.label}
										</span>
									)}
								</div>
							);
						})}
					</div>

					{/* Day rows (7 rows = Mon–Sun) */}
					<div style={{ display: 'flex', gap: 0 }}>
						{/* Row labels (Mon / Wed / Fri) */}
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								marginRight: 4,
							}}
						>
							{Array.from({ length: 7 }, (_, row) => {
								const labelIdx = ROW_INDICES.indexOf(
									row as (typeof ROW_INDICES)[number],
								);
								return (
									<div
										key={row}
										style={{
											height: CELL + GAP,
											width: 24,
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'flex-end',
										}}
									>
										{labelIdx !== -1 && (
											<span
												style={{
													fontSize: '0.58rem',
													color: 'var(--text-muted)',
												}}
											>
												{ROW_LABELS[labelIdx]}
											</span>
										)}
									</div>
								);
							})}
						</div>

						{/* Columns of cells */}
						<div style={{ display: 'flex', gap: GAP }}>
							{columns.map((col, ci) => (
								<div
									key={ci}
									style={{ display: 'flex', flexDirection: 'column', gap: GAP }}
								>
									{Array.from({ length: 7 }, (_, row) => {
										const cell = col[row] ?? null;
										if (!cell) {
											return (
												<div
													key={row}
													style={{ width: CELL, height: CELL, borderRadius: 2 }}
												/>
											);
										}
										return (
											<div
												key={row}
												title={`${MONTH_NAMES[cell.month]} ${cell.day}, ${cell.year}${cell.active ? ' ✓' : ''}`}
												style={{
													width: CELL,
													height: CELL,
													borderRadius: 2,
													cursor: 'default',
													transition: 'all 0.1s',
													background: cell.active
														? 'linear-gradient(135deg, #3aaa3a, #2a8a2a)'
														: 'rgba(255,255,255,0.06)',
													border: cell.active
														? '1px solid rgba(80,200,80,0.4)'
														: '1px solid rgba(255,255,255,0.08)',
													boxShadow: cell.active
														? '0 0 4px rgba(58,170,58,0.35)'
														: 'none',
												}}
											/>
										);
									})}
								</div>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Legend */}
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 6,
					marginTop: 10,
					justifyContent: 'flex-end',
				}}
			>
				<span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
					No activity
				</span>
				<div
					style={{
						width: 11,
						height: 11,
						borderRadius: 2,
						background: 'rgba(255,255,255,0.06)',
						border: '1px solid rgba(255,255,255,0.08)',
					}}
				/>
				<div
					style={{
						width: 11,
						height: 11,
						borderRadius: 2,
						background: 'linear-gradient(135deg,#3aaa3a,#2a8a2a)',
						border: '1px solid rgba(80,200,80,0.4)',
						boxShadow: '0 0 4px rgba(58,170,58,0.35)',
					}}
				/>
				<span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
					Active day
				</span>
			</div>
		</div>
	);
}
