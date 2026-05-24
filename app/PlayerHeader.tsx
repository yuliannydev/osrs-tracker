import { formatXp } from '@/lib/osrs-data';
import type { HiscoresResult } from './types';

type Props = {
	result: HiscoresResult;
};

type StatCardProps = {
	value: string;
	label: string;
	valueColor?: string;
};

function StatCard({ value, label, valueColor }: StatCardProps) {
	return (
		<div
			className='stat-card'
			style={{ minWidth: 70 }}
		>
			<span
				className='value'
				style={{
					fontSize: '1.2rem',
					...(valueColor ? { color: valueColor } : {}),
				}}
			>
				{value}
			</span>
			<span className='label'>{label}</span>
		</div>
	);
}

export function PlayerHeader({ result }: Props) {
	const overall = result.skills['Overall'];

	const maxedCount = Object.values(result.skills).filter(
		(s, i) => i > 0 && s.level >= 99,
	).length;

	const rankLabel =
		overall && overall.rank > 0
			? `#${overall.rank.toLocaleString()}`
			: 'unranked';

	return (
		<div
			className='osrs-panel'
			style={{ padding: '16px 20px', marginBottom: 14 }}
		>
			<div
				className='player-header'
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					gap: 12,
				}}
			>
				<div>
					<div
						style={{
							fontSize: '1.2rem',
							fontWeight: 'bold',
							color: 'var(--gold)',
						}}
					>
						{result.username}
					</div>
					<div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
						Overall rank {rankLabel}
					</div>
				</div>

				<div
					className='hiscore-stats'
					style={{ display: 'flex', gap: 10 }}
				>
					<StatCard
						value={overall?.level?.toLocaleString() ?? '—'}
						label='Total Level'
					/>
					<StatCard
						value={formatXp(overall?.xp ?? 0)}
						label='Total XP'
					/>
					<StatCard
						value={String(maxedCount)}
						label='99s'
						valueColor='#5ac050'
					/>
				</div>
			</div>
		</div>
	);
}
