'use client';
import { useLocalStorage } from '@/lib/useLocalStorage';
import type { HerbEntry } from '@/components/HerbTracker';
import type { BirdHouseEntry } from '@/components/BirdHouseTracker';
import type { SlayerEntry } from '@/components/SlayerTracker';

type StatItemProps = {
	label: string;
	value: number;
	valueColor?: string;
};

function StatItem({
	label,
	value,
	valueColor = 'var(--text-primary)',
}: StatItemProps) {
	return (
		<span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
			{label}: <strong style={{ color: valueColor }}>{value}</strong>
		</span>
	);
}

export function GlobalSummary() {
	const [herbs] = useLocalStorage<HerbEntry[]>('osrs-herb-runs', []);
	const [bh] = useLocalStorage<BirdHouseEntry[]>('osrs-bird-houses', []);
	const [slayer] = useLocalStorage<SlayerEntry[]>('osrs-slayer', []);

	const stats = {
		totalActivities: herbs.length + bh.length + slayer.length,
		farmingYield: herbs.reduce((s, e) => s + e.totalYield, 0),
		nestsFound: bh.reduce((s, e) => s + e.nests, 0),
		farmingRuns: herbs.length,
		birdHouses: bh.length,
		slayerTasks: slayer.length,
	};

	return (
		<div
			className='osrs-panel'
			style={{
				padding: '14px 20px',
				marginBottom: 24,
				display: 'flex',
				gap: 24,
				alignItems: 'center',
				flexWrap: 'wrap',
			}}
		>
			<span
				style={{
					color: 'var(--gold)',
					fontWeight: 'bold',
					fontSize: '0.85rem',
					letterSpacing: '0.04em',
				}}
			>
				📊 ALL TIME
			</span>
			<div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
				<StatItem
					label='Activities'
					value={stats.totalActivities}
				/>
				<StatItem
					label='Farming yield'
					value={stats.farmingYield}
					valueColor='var(--gold)'
				/>
				<StatItem
					label='Nests found'
					value={stats.nestsFound}
					valueColor='var(--gold)'
				/>
				<StatItem
					label='Farming Runs'
					value={stats.farmingRuns}
				/>
				<StatItem
					label='Bird Houses'
					value={stats.birdHouses}
				/>
				<StatItem
					label='Slayer Tasks'
					value={stats.slayerTasks}
				/>
			</div>
		</div>
	);
}
