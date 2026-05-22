'use client';
import * as Tabs from '@radix-ui/react-tabs';
import HerbTracker from '@/components/HerbTracker';
import BirdHouseTracker from '@/components/BirdHouseTracker';
import SlayerTracker from '@/components/SlayerTracker';
import { useLocalStorage } from '@/lib/useLocalStorage';
import type { HerbEntry } from '@/components/HerbTracker';
import type { BirdHouseEntry } from '@/components/BirdHouseTracker';
import type { SlayerEntry } from '@/components/SlayerTracker';
import { formatGp, formatXp } from '@/lib/osrs-data';

// ── Summary bar across all trackers ──
function GlobalSummary() {
	const [herbs] = useLocalStorage<HerbEntry[]>('osrs-herb-runs', []);
	const [bh] = useLocalStorage<BirdHouseEntry[]>('osrs-bird-houses', []);
	const [slayer] = useLocalStorage<SlayerEntry[]>('osrs-slayer', []);

	// Farming runs track yield (not profit/xp)
	const totalHerbYield = herbs.reduce((s, e) => s + e.totalYield, 0);

	// Slayer kill/xp
	const totalXp = slayer.reduce((s, e) => s + e.totalXp, 0);

	const totalActivities = herbs.length + bh.length + slayer.length;

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
				<span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
					Activities:{' '}
					<strong style={{ color: 'var(--text-primary)' }}>
						{totalActivities}
					</strong>
				</span>
				<span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
					Farming yield:{' '}
					<strong style={{ color: 'var(--gold)' }}>{totalHerbYield}</strong>
				</span>
				<span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
					Farming Runs:{' '}
					<strong style={{ color: 'var(--text-primary)' }}>
						{herbs.length}
					</strong>
				</span>
				<span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
					Bird Houses:{' '}
					<strong style={{ color: 'var(--text-primary)' }}>{bh.length}</strong>
				</span>
				<span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
					Slayer Tasks:{' '}
					<strong style={{ color: 'var(--text-primary)' }}>
						{slayer.length}
					</strong>
				</span>
			</div>
		</div>
	);
}

// Tab items — first one renamed to Farming Run
const TAB_ITEMS = [
	{ value: 'herbs', icon: '🌾', label: 'Farming Runs' },
	{ value: 'birdhouse', icon: '🏠', label: 'Bird Houses' },
	{ value: 'slayer', icon: '💀', label: 'Slayer Task' },
];

export default function DashboardPage() {
	return (
		<div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px' }}>
			{/* Page header */}
			<div style={{ marginBottom: 28 }}>
				<h1
					style={{
						fontSize: '1.8rem',
						fontWeight: 'bold',
						color: 'var(--gold)',
						textShadow: '0 0 16px var(--gold-glow)',
						letterSpacing: '0.05em',
						marginBottom: 6,
					}}
				>
					📋 Activity Dashboard
				</h1>
				<p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
					Track your daily OSRS habits — streaks, yields, and activity history
					all in one place
				</p>
			</div>

			{/* Global summary */}
			<GlobalSummary />

			{/* Tabs */}
			<Tabs.Root defaultValue='herbs'>
				<Tabs.List
					className='osrs-tabs-list'
					style={{ marginBottom: 20 }}
				>
					{TAB_ITEMS.map(({ value, icon, label }) => (
						<Tabs.Trigger
							key={value}
							value={value}
							className='osrs-tab'
						>
							{icon} {label}
						</Tabs.Trigger>
					))}
				</Tabs.List>

				<Tabs.Content value='herbs'>
					<div
						className='osrs-panel'
						style={{ padding: 20 }}
					>
						<HerbTracker />
					</div>
				</Tabs.Content>

				<Tabs.Content value='birdhouse'>
					<div
						className='osrs-panel'
						style={{ padding: 20 }}
					>
						<BirdHouseTracker />
					</div>
				</Tabs.Content>

				<Tabs.Content value='slayer'>
					<div
						className='osrs-panel'
						style={{ padding: 20 }}
					>
						<SlayerTracker />
					</div>
				</Tabs.Content>
			</Tabs.Root>

			{/* Footer */}
			<div
				style={{
					marginTop: 32,
					textAlign: 'center',
					fontSize: '0.72rem',
					color: 'var(--text-dim)',
					borderTop: '1px solid var(--border)',
					paddingTop: 16,
				}}
			>
				Data stored locally in your browser · No account required ·{' '}
				<span style={{ color: 'var(--gold-dim)' }}>OSRS Tracker v1.0</span>
				<span style={{ color: 'var(--gold-dim)' }}>
					{' '}
					Built with ☕ and too many tabs open By{' '}
					<a
						href='https://github.com/yuliannydev/'
						target='_blank'
						rel='noopener noreferrer'
					>
						Yulianny B.
					</a>
				</span>
			</div>
		</div>
	);
}
