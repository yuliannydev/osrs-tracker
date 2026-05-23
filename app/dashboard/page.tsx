'use client';
import * as Tabs from '@radix-ui/react-tabs';
import HerbTracker from '@/components/HerbTracker';
import BirdHouseTracker from '@/components/BirdHouseTracker';
import SlayerTracker from '@/components/SlayerTracker';
import { useLocalStorage } from '@/lib/useLocalStorage';
import type { HerbEntry } from '@/components/HerbTracker';
import type { BirdHouseEntry } from '@/components/BirdHouseTracker';
import type { SlayerEntry } from '@/components/SlayerTracker';

// ── Summary bar — only habit-level stats, no profit/xp (those live inside each tab) ──
function GlobalSummary() {
	const [herbs] = useLocalStorage<HerbEntry[]>('osrs-herb-runs', []);
	const [bh] = useLocalStorage<BirdHouseEntry[]>('osrs-bird-houses', []);
	const [slayer] = useLocalStorage<SlayerEntry[]>('osrs-slayer', []);

	const totalHerbYield = herbs.reduce((s, e) => s + e.totalYield, 0);
	const totalNests = bh.reduce((s, e) => s + e.nests, 0);
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
					Nests found:{' '}
					<strong style={{ color: 'var(--gold)' }}>{totalNests}</strong>
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

const TAB_ITEMS = [
	{ value: 'herbs', icon: '🌾', label: 'Farming Runs' },
	{ value: 'birdhouse', icon: '🏠', label: 'Bird Houses' },
	{ value: 'slayer', icon: '💀', label: 'Slayer' },
];

export default function DashboardPage() {
	return (
		<div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px' }}>
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

			<GlobalSummary />

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

			<div
				style={{
					marginTop: 32,
					borderTop: '1px solid var(--border)',
					paddingTop: 16,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 6,
				}}
			>
				<div
					style={{
						fontSize: '0.72rem',
						color: 'var(--text-dim)',
						textAlign: 'center',
					}}
				>
					Data stored locally in your browser · No account required ·{' '}
					<span style={{ color: 'var(--gold-dim)' }}>OSRS Tracker v1.0</span>
				</div>
				<div
					style={{
						fontSize: '0.75rem',
						color: 'var(--text-muted)',
						textAlign: 'center',
						display: 'flex',
						alignItems: 'center',
						gap: 6,
						flexWrap: 'wrap',
						justifyContent: 'center',
					}}
				>
					<span>⚔️ Forged in code by</span>
					<a
						href='https://github.com/yuliannydev/'
						target='_blank'
						rel='noopener noreferrer'
						style={{
							color: 'var(--gold)',
							textDecoration: 'none',
							fontWeight: 'bold',
							borderBottom: '1px solid var(--gold-dim)',
							paddingBottom: 1,
							transition: 'color 0.15s',
						}}
						onMouseEnter={(e) =>
							(e.currentTarget.style.color = 'var(--gold-bright)')
						}
						onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--gold)')}
					>
						Yulianny B.
					</a>
					<span style={{ color: 'var(--text-dim)' }}>
						· A fellow adventurer, not just a developer 🏹
					</span>
				</div>
			</div>
		</div>
	);
}
