'use client';
import * as Tabs from '@radix-ui/react-tabs';
import HerbTracker from '@/components/HerbTracker';
import BirdHouseTracker from '@/components/BirdHouseTracker';
import SlayerTracker from '@/components/SlayerTracker';
import { GlobalSummary } from './GlobalSummary';
import { TAB_ITEMS } from './tabs';

const TRACKER_MAP = {
	herbs: <HerbTracker />,
	birdhouse: <BirdHouseTracker />,
	slayer: <SlayerTracker />,
} as const;

export default function DashboardPage() {
	return (
		<div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px' }}>
			<header style={{ marginBottom: 28 }}>
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
			</header>

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

				{TAB_ITEMS.map(({ value }) => (
					<Tabs.Content
						key={value}
						value={value}
					>
						<div
							className='osrs-panel'
							style={{ padding: 20 }}
						>
							{TRACKER_MAP[value]}
						</div>
					</Tabs.Content>
				))}
			</Tabs.Root>
		</div>
	);
}
