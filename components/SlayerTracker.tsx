'use client';
import { useState } from 'react';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { SLAYER_MASTERS, formatXp } from '@/lib/osrs-data';

export type SlayerEntry = {
	id: string;
	date: string;
	master: string;
	monster: string;
	amount: number;
	slayerPoints: number;
	xpPerKill: number;
	totalXp: number; // amount × xpPerKill, computed on save
};

const COMMON_MONSTERS = [
	'Aberrant Spectres',
	'Abyssal Demons',
	'Alchemical Hydra',
	'Aviansies',
	'Banshees',
	'Basilisks',
	'Black Demons',
	'Black Dragons',
	'Blue Dragons',
	'Cave Kraken',
	'Cerberus',
	'Dagannoth',
	'Dark Beasts',
	'Desert Lizards',
	'Dust Devils',
	'Fire Giants',
	'Gargoyles',
	'Ghouls',
	'Greater Demons',
	'Hellhounds',
	'Iron Dragons',
	'Jelly',
	'Kalphite',
	'Kurask',
	'Lesser Demons',
	'Lizardmen',
	'Moss Giants',
	'Mutated Zygomites',
	'Nechryael',
	'Pyrefiend',
	'Rats',
	'Rune Dragons',
	'Skeletal Wyverns',
	'Smoke Devils',
	'Steel Dragons',
	'Trolls',
	'Turoth',
	'TzHaar',
	'Vampyres',
	'Warped Creatures',
	'Waterfiend',
	'Wyrms',
	'Zombies',
];

// Points per task per master — source: https://oldschool.runescape.wiki/w/Slayer_Master
const MASTER_POINTS: Record<
	string,
	{ base: number; elite?: number; diaryNote?: string }
> = {
	Turael: { base: 0 },
	Spria: { base: 0 },
	Mazchna: { base: 6 },
	Vannaka: { base: 8 },
	Chaeldar: { base: 10 },
	Konar: {
		base: 18,
		elite: 20,
		diaryNote: '20 pts with Elite Kourend & Kebos Diary',
	},
	Nieve: {
		base: 12,
		elite: 15,
		diaryNote: '15 pts with Elite Western Provinces Diary',
	},
	Duradel: { base: 15 },
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
	onSave: (e: SlayerEntry) => void;
}) {
	const [master, setMaster] = useState('Duradel');
	const [monster, setMonster] = useState('');
	const [customMonster, setCustomMonster] = useState('');
	const [amount, setAmount] = useState(0);
	const [xpPerKill, setXpPerKill] = useState(0);

	// Points auto-derived from master; overridable for diary users
	const [pointsOverride, setPointsOverride] = useState<number | null>(null);
	const masterData = MASTER_POINTS[master] ?? { base: 0 };
	const effectivePoints = pointsOverride ?? masterData.base;

	const effectiveMonster = customMonster.trim() || monster;

	// Reset diary override when switching master
	const handleMasterChange = (m: string) => {
		setMaster(m);
		setPointsOverride(null);
	};

	const handleSave = () => {
		if (!effectiveMonster || !master) return;
		onSave({
			id: Date.now().toString(),
			date: new Date().toISOString(),
			master,
			monster: effectiveMonster,
			amount,
			slayerPoints: effectivePoints,
			xpPerKill,
			totalXp: amount * xpPerKill,
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
							💀 Log Slayer Task
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
						{/* Slayer master */}
						<div>
							<div
								className='section-header'
								style={{ marginBottom: 8 }}
							>
								Slayer Master
							</div>
							<Chips
								options={SLAYER_MASTERS}
								selected={[master]}
								onToggle={handleMasterChange}
							/>
						</div>

						{/* Monster quick-select */}
						<div>
							<div
								className='section-header'
								style={{ marginBottom: 8 }}
							>
								Monster (quick select)
							</div>
							<div
								style={{ maxHeight: 120, overflowY: 'auto', paddingRight: 4 }}
							>
								<Chips
									options={COMMON_MONSTERS}
									selected={monster ? [monster] : []}
									onToggle={(m) => {
										setMonster(m === monster ? '' : m);
										setCustomMonster('');
									}}
								/>
							</div>
						</div>

						{/* Custom monster */}
						<div>
							<label
								style={{
									fontSize: '0.75rem',
									color: 'var(--text-muted)',
									display: 'block',
									marginBottom: 4,
								}}
							>
								Or type custom monster
							</label>
							<input
								className='osrs-input'
								style={{ width: '100%' }}
								value={customMonster}
								onChange={(e) => {
									setCustomMonster(e.target.value);
									setMonster('');
								}}
								placeholder='e.g. Spiritual Mages...'
							/>
						</div>

						{/* Kill count / XP per kill / Total XP (auto) */}
						<div
							style={{
								display: 'grid',
								gridTemplateColumns: '1fr 1fr 1fr',
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
									Kill count
								</label>
								<input
									className='osrs-input'
									style={{ width: '100%' }}
									type='number'
									min={0}
									value={amount || ''}
									onChange={(e) => setAmount(+e.target.value)}
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
									XP per kill
								</label>
								<input
									className='osrs-input'
									style={{ width: '100%' }}
									type='number'
									min={0}
									value={xpPerKill || ''}
									onChange={(e) => setXpPerKill(+e.target.value)}
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
									Total XP
								</label>
								{/* Read-only, auto-computed */}
								<div
									style={{
										background: 'rgba(0,0,0,0.35)',
										border: '1px solid var(--border)',
										borderRadius: 2,
										padding: '6px 10px',
										fontSize: '0.9rem',
										fontWeight: 'bold',
										height: 34,
										display: 'flex',
										alignItems: 'center',
										color:
											amount * xpPerKill > 0
												? 'var(--gold)'
												: 'var(--text-dim)',
									}}
								>
									{amount * xpPerKill > 0 ? formatXp(amount * xpPerKill) : '—'}
								</div>
							</div>
						</div>

						{/* Points per task — auto from master, overridable for diary users */}
						<div>
							<div
								className='section-header'
								style={{ marginBottom: 8 }}
							>
								Points per Task
							</div>
							<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
								<div
									style={{
										background: 'rgba(0,0,0,0.35)',
										border: '1px solid var(--border)',
										borderRadius: 2,
										padding: '6px 10px',
										fontSize: '0.9rem',
										fontWeight: 'bold',
										color:
											effectivePoints > 0 ? 'var(--gold)' : 'var(--text-dim)',
										minWidth: 60,
										display: 'flex',
										alignItems: 'center',
									}}
								>
									{effectivePoints} pts
								</div>
								{/* Diary override — only for Konar and Nieve/Steve */}
								{masterData.elite && (
									<div style={{ display: 'flex', gap: 6 }}>
										<button
											type='button'
											className={
												'chip' + (pointsOverride === null ? ' selected' : '')
											}
											onClick={() => setPointsOverride(null)}
										>
											{masterData.base} pts (base)
										</button>
										<button
											type='button'
											className={
												'chip' +
												(pointsOverride === masterData.elite ? ' selected' : '')
											}
											onClick={() =>
												setPointsOverride(masterData.elite ?? null)
											}
										>
											{masterData.elite} pts (diary ✓)
										</button>
									</div>
								)}
							</div>
							{masterData.diaryNote && (
								<div
									style={{
										fontSize: '0.7rem',
										color: 'var(--text-dim)',
										marginTop: 6,
										fontStyle: 'italic',
									}}
								>
									ℹ {masterData.diaryNote}
								</div>
							)}
						</div>

						{/* Actions */}
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
								disabled={!effectiveMonster}
								style={{
									padding: '8px 20px',
									opacity: !effectiveMonster ? 0.5 : 1,
								}}
							>
								+ Log Task
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function SlayerTracker() {
	const [entries, setEntries, loaded] = useLocalStorage<SlayerEntry[]>(
		'osrs-slayer',
		[],
	);
	const [showModal, setShowModal] = useState(false);

	const addEntry = (e: SlayerEntry) => setEntries((prev) => [e, ...prev]);
	const deleteEntry = (id: string) =>
		setEntries((prev) => prev.filter((e) => e.id !== id));

	const totalKills = entries.reduce((s, e) => s + e.amount, 0);
	const totalPoints = entries.reduce((s, e) => s + e.slayerPoints, 0);
	const totalXp = entries.reduce((s, e) => s + e.totalXp, 0);

	// Consecutive task streak
	const streak = entries.length;

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
					<span className='value'>{entries.length}</span>
					<span className='label'>Tasks Done</span>
				</div>
				<div className='stat-card'>
					<span className='value'>{totalKills.toLocaleString()}</span>
					<span className='label'>Total Kills</span>
				</div>
				<div className='stat-card'>
					<span className='value'>{totalPoints.toLocaleString()}</span>
					<span className='label'>Points Earned</span>
				</div>
				<div className='stat-card'>
					<span className='value'>{formatXp(totalXp)}</span>
					<span className='label'>Total XP</span>
				</div>
				<div className='stat-card'>
					<div className='streak-flame'>🔥 {streak}</div>
					<span
						className='label'
						style={{ marginTop: 4 }}
					>
						Task Streak
					</span>
				</div>
			</div>

			{/* Header */}
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
					<span>💀</span> Task History
				</div>
				<button
					className='osrs-btn'
					onClick={() => setShowModal(true)}
					style={{ padding: '6px 18px', fontSize: '0.82rem' }}
				>
					+ Log Task
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
					<span style={{ fontSize: '3rem' }}>💀</span>
					<div>No slayer tasks logged yet</div>
					<div style={{ fontSize: '0.8rem' }}>
						Start tracking your tasks, streaks, and XP
					</div>
					<button
						className='osrs-btn'
						onClick={() => setShowModal(true)}
						style={{ marginTop: 8 }}
					>
						+ Log First Task
					</button>
				</div>
			) : (
				<div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
					{entries.map((e) => (
						<div
							key={e.id}
							className='entry-row'
						>
							{/* Date */}
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
								})}{' '}
								{new Date(e.date).toLocaleTimeString('en-GB', {
									hour: '2-digit',
									minute: '2-digit',
								})}
							</span>

							{/* Monster */}
							<span
								style={{ fontSize: '0.82rem', fontWeight: 'bold', flex: 1 }}
							>
								💀 {e.monster}
							</span>

							{/* Master */}
							<span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
								{e.master}
							</span>

							{/* Kill count */}
							{e.amount > 0 && (
								<span
									style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}
								>
									{e.amount.toLocaleString()}x
								</span>
							)}

							{/* Slayer points */}
							{e.slayerPoints > 0 && (
								<span
									style={{
										fontSize: '0.72rem',
										color: 'var(--gold-dim)',
										fontWeight: 'bold',
									}}
								>
									+{e.slayerPoints}pts
								</span>
							)}

							{/* Total XP */}
							{e.totalXp > 0 && (
								<span
									style={{
										fontSize: '0.72rem',
										color: 'var(--gold-dim)',
										minWidth: 60,
									}}
								>
									{formatXp(e.totalXp)} xp
								</span>
							)}

							{/* Delete */}
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
