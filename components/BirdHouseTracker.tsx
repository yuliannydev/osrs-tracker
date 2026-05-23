'use client';
import { useState } from 'react';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { BH_LOCATIONS, BH_TIERS, formatGp, formatXp } from '@/lib/osrs-data';

export type BirdHouseEntry = {
	id: string;
	date: string;
	locations: string[];
	tier: string;
	seeds: number;
	nests: number;
	profit: number;
	xp: number;
};

function Chips({
	options,
	selected,
	onToggle,
}: {
	options: string[];
	selected: string[];
	onToggle: (v: string) => void;
}) {
	return (
		<div className='chip-row'>
			{options.map((o) => (
				<button
					key={o}
					type='button'
					className={'chip' + (selected.includes(o) ? ' selected' : '')}
					onClick={() => onToggle(o)}
				>
					{o}
				</button>
			))}
		</div>
	);
}

function AddModal({
	onClose,
	onSave,
}: {
	onClose: () => void;
	onSave: (e: BirdHouseEntry) => void;
}) {
	const [locations, setLocations] = useState<string[]>(BH_LOCATIONS); // default all 4
	const [tier, setTier] = useState('Yew');
	const [seeds, setSeeds] = useState(10);
	const [nests, setNests] = useState(0);
	const [profit, setProfit] = useState(0);
	const [xp, setXp] = useState(0);

	const toggleLoc = (l: string) =>
		setLocations((prev) =>
			prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l],
		);

	const handleSave = () => {
		if (locations.length === 0) return;
		onSave({
			id: Date.now().toString(),
			date: new Date().toISOString(),
			locations,
			tier,
			seeds,
			nests,
			profit,
			xp,
		});
		onClose();
	};

	return (
		<div
			className='modal-overlay'
			onClick={onClose}
		>
			<div
				className='osrs-panel modal-box'
				onClick={(e) => e.stopPropagation()}
			>
				<div style={{ padding: 24 }}>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							marginBottom: 20,
						}}
					>
						<h2
							style={{
								color: 'var(--gold)',
								fontWeight: 'bold',
								fontSize: '1.1rem',
							}}
						>
							🏠 Log Bird Houses
						</h2>
						<button
							onClick={onClose}
							style={{
								background: 'none',
								border: 'none',
								color: 'var(--text-muted)',
								cursor: 'pointer',
								fontSize: '1.2rem',
							}}
						>
							✕
						</button>
					</div>

					<div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
						{/* Locations */}
						<div>
							<div
								className='section-header'
								style={{ marginBottom: 8 }}
							>
								Locations
							</div>
							<Chips
								options={BH_LOCATIONS}
								selected={locations}
								onToggle={toggleLoc}
							/>
						</div>

						{/* Tier */}
						<div>
							<div
								className='section-header'
								style={{ marginBottom: 8 }}
							>
								Birdhouse Tier
							</div>
							<Chips
								options={BH_TIERS}
								selected={[tier]}
								onToggle={(t) => setTier(t)}
							/>
						</div>

						{/* Numbers */}
						<div
							style={{
								display: 'grid',
								gridTemplateColumns: '1fr 1fr',
								gap: 10,
							}}
						>
							<div>
								<label
									style={{
										fontSize: '0.75rem',
										color: 'var(--text-muted)',
										display: 'block',
										marginBottom: 4,
									}}
								>
									Seeds used
								</label>
								<input
									className='osrs-input'
									style={{ width: '100%' }}
									type='number'
									min={0}
									value={seeds || ''}
									onChange={(e) => setSeeds(+e.target.value)}
									placeholder='10'
								/>
							</div>
							<div>
								<label
									style={{
										fontSize: '0.75rem',
										color: 'var(--text-muted)',
										display: 'block',
										marginBottom: 4,
									}}
								>
									Nests collected
								</label>
								<input
									className='osrs-input'
									style={{ width: '100%' }}
									type='number'
									min={0}
									value={nests || ''}
									onChange={(e) => setNests(+e.target.value)}
									placeholder='0'
								/>
							</div>
							<div>
								<label
									style={{
										fontSize: '0.75rem',
										color: 'var(--text-muted)',
										display: 'block',
										marginBottom: 4,
									}}
								>
									Profit (gp)
								</label>
								<input
									className='osrs-input'
									style={{ width: '100%' }}
									type='number'
									value={profit || ''}
									onChange={(e) => setProfit(+e.target.value)}
									placeholder='0'
								/>
							</div>
							<div>
								<label
									style={{
										fontSize: '0.75rem',
										color: 'var(--text-muted)',
										display: 'block',
										marginBottom: 4,
									}}
								>
									XP gained
								</label>
								<input
									className='osrs-input'
									style={{ width: '100%' }}
									type='number'
									min={0}
									value={xp || ''}
									onChange={(e) => setXp(+e.target.value)}
									placeholder='0'
								/>
							</div>
						</div>

						<div
							style={{
								display: 'flex',
								gap: 10,
								justifyContent: 'flex-end',
								paddingTop: 8,
							}}
						>
							<button
								className='osrs-btn-red'
								onClick={onClose}
								style={{ padding: '8px 20px' }}
							>
								Cancel
							</button>
							<button
								className='osrs-btn'
								onClick={handleSave}
								disabled={locations.length === 0}
								style={{
									padding: '8px 20px',
									opacity: locations.length === 0 ? 0.5 : 1,
								}}
							>
								+ Log Run
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function BirdHouseTracker() {
	const [entries, setEntries, loaded] = useLocalStorage<BirdHouseEntry[]>(
		'osrs-bird-houses',
		[],
	);
	const [showModal, setShowModal] = useState(false);

	const addEntry = (e: BirdHouseEntry) => setEntries((prev) => [e, ...prev]);
	const deleteEntry = (id: string) =>
		setEntries((prev) => prev.filter((e) => e.id !== id));

	const totalRuns = entries.length;
	const totalNests = entries.reduce((s, e) => s + e.nests, 0);
	const totalProfit = entries.reduce((s, e) => s + e.profit, 0);
	const totalXp = entries.reduce((s, e) => s + e.xp, 0);

	const streak = (() => {
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
	})();

	return (
		<div>
			{/* Stats */}
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
					gap: 10,
					marginBottom: 20,
				}}
			>
				<div className='stat-card'>
					<span className='value'>{totalRuns}</span>
					<span className='label'>Total Runs</span>
				</div>
				<div className='stat-card'>
					<span className='value'>{totalNests.toLocaleString()}</span>
					<span className='label'>Nests Found</span>
				</div>
				<div className='stat-card'>
					<span
						className='value'
						style={{ color: totalProfit >= 0 ? '#5ac050' : '#cc4444' }}
					>
						{formatGp(totalProfit)}
					</span>
					<span className='label'>Total Profit</span>
				</div>
				<div className='stat-card'>
					<span className='value'>{formatXp(totalXp)}</span>
					<span className='label'>Total XP</span>
				</div>
				<div className='stat-card'>
					<div className='streak-flame'>🔥 {streak}</div>
					<span className='label'>Day Streak</span>
				</div>
			</div>

			{/* List header */}
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: 14,
				}}
			>
				<div
					className='section-header'
					style={{ marginBottom: 0 }}
				>
					<span>🏠</span> Recent Runs
				</div>
				<button
					className='osrs-btn'
					onClick={() => setShowModal(true)}
					style={{ padding: '6px 18px', fontSize: '0.82rem' }}
				>
					+ Log Run
				</button>
			</div>

			{/* Entries */}
			{!loaded ? (
				<div
					style={{ textAlign: 'center', padding: 32, color: 'var(--text-dim)' }}
				>
					Loading...
				</div>
			) : entries.length === 0 ? (
				<div className='empty-state'>
					<span style={{ fontSize: '3rem' }}>🏠</span>
					<div>No bird house runs logged yet</div>
					<div style={{ fontSize: '0.8rem' }}>
						Track your daily bird house runs on Fossil Island
					</div>
					<button
						className='osrs-btn'
						onClick={() => setShowModal(true)}
						style={{ marginTop: 8 }}
					>
						+ Log First Run
					</button>
				</div>
			) : (
				<div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
					{entries.map((e) => (
						<div
							key={e.id}
							className='entry-row'
						>
							<span
								style={{
									fontSize: '0.72rem',
									color: 'var(--text-dim)',
									minWidth: 68,
								}}
							>
								{new Date(e.date).toLocaleDateString('en-GB', {
									day: '2-digit',
									month: 'short',
								})}
							</span>
							<span
								style={{
									background: 'rgba(60,40,10,0.4)',
									border: '1px solid rgba(160,120,40,0.3)',
									borderRadius: 20,
									padding: '2px 8px',
									fontSize: '0.75rem',
									color: '#c8a840',
								}}
							>
								🏠 {e.tier}
							</span>
							<span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
								{e.locations.length} locations
							</span>
							<span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
								{e.nests} nests
							</span>
							<span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
								{e.seeds} seeds
							</span>
							<span
								style={{
									fontSize: '0.82rem',
									fontWeight: 'bold',
									marginLeft: 'auto',
									color: e.profit >= 0 ? '#5ac050' : '#cc4444',
								}}
							>
								{e.profit >= 0 ? '+' : ''}
								{formatGp(e.profit)}
							</span>
							{e.xp > 0 && (
								<span
									style={{
										fontSize: '0.72rem',
										color: 'var(--text-dim)',
										minWidth: 60,
									}}
								>
									{formatXp(e.xp)} xp
								</span>
							)}
							<button
								onClick={() => deleteEntry(e.id)}
								style={{
									background: 'none',
									border: 'none',
									color: 'var(--text-dim)',
									cursor: 'pointer',
									fontSize: '0.85rem',
									padding: '2px 4px',
								}}
								title='Delete'
							>
								✕
							</button>
						</div>
					))}
				</div>
			)}

			{showModal && (
				<AddModal
					onClose={() => setShowModal(false)}
					onSave={addEntry}
				/>
			)}
		</div>
	);
}
