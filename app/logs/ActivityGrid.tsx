import { MONTH_NAMES, daysInMonth, firstDayOffset } from './date-utils';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

const CELL_ACTIVE = {
	background: 'linear-gradient(135deg, #3aaa3a, #2a8a2a)',
	border: '1px solid rgba(80,200,80,0.4)',
	boxShadow: '0 0 6px rgba(58,170,58,0.4)',
	color: 'rgba(255,255,255,0.7)',
} as const;

const CELL_INACTIVE = {
	background: 'rgba(255,255,255,0.04)',
	border: '1px solid rgba(255,255,255,0.06)',
	boxShadow: 'none',
	color: 'var(--text-dim)',
} as const;

type Props = {
	label: string;
	icon: string;
	activeDaysSet: Set<number>;
	year: number;
	month: number;
};

function buildCells(year: number, month: number): (number | null)[] {
	const total = daysInMonth(year, month);
	const offset = firstDayOffset(year, month);
	const cells: (number | null)[] = [
		...Array(offset).fill(null),
		...Array.from({ length: total }, (_, i) => i + 1),
	];
	while (cells.length % 7 !== 0) cells.push(null);
	return cells;
}

export function ActivityGrid({
	label,
	icon,
	activeDaysSet,
	year,
	month,
}: Props) {
	const total = daysInMonth(year, month);
	const activeCt = activeDaysSet.size;
	const cells = buildCells(year, month);

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

			{/* Calendar grid */}
			<div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
				{/* Day-of-week header */}
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(7, 1fr)',
						gap: 4,
					}}
				>
					{DAY_LABELS.map((d) => (
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
							const isActive = activeDaysSet.has(day);
							const cellStyle = isActive ? CELL_ACTIVE : CELL_INACTIVE;
							return (
								<div
									key={col}
									title={`${MONTH_NAMES[month]} ${day}${isActive ? ' ✓' : ''}`}
									style={{
										aspectRatio: '1',
										borderRadius: 4,
										transition: 'all 0.1s',
										cursor: 'default',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										fontSize: '0.6rem',
										...cellStyle,
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
					style={{ width: 12, height: 12, borderRadius: 2, ...CELL_INACTIVE }}
				/>
				<div
					style={{ width: 12, height: 12, borderRadius: 2, ...CELL_ACTIVE }}
				/>
				<span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>
					Active day
				</span>
			</div>
		</div>
	);
}
