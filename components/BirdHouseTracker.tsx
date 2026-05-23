'use client';
import { useState } from 'react';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { HERB_PATCHES, HERBS, FLOWERS, COMPOST_TYPES } from '@/lib/osrs-data';

// ── Types ──
export type HerbEntry = {
	id: string;
	date: string;
	patches: string[];
	herb: string; // selected herb (empty string = none)
	flower: string; // selected flower (empty string = none)
	compost: string;
	yieldHerbs: number;
	yieldFlowers: number;
	totalYield: number; // auto-computed: yieldHerbs + yieldFlowers
	note: string;
};

// ── Mini tab nav for Herb / Flower section ──
function CropNav({
	active,
	onChange,
}: {
	active: 'herb' | 'flower';
	onChange: (v: 'herb' | 'flower') => void;
}) {
	const base: React.CSSProperties = {
		flex: 1,
		padding: '6px 0',
		border: '1px solid transparent',
		borderRadius: 3,
		cursor: 'pointer',
		fontFamily: 'inherit',
		fontWeight: 'bold',
		fontSize: '0.78rem',
		transition: 'all 0.15s',
		textAlign: 'center',
	};
	const inactive: React.CSSProperties = {
		...base,
		background: 'transparent',
		color: 'var(--text-muted)',
		borderColor: 'transparent',
	};
	const activeStyle: React.CSSProperties = {
		...base,
		background:
			'linear-gradient(180deg, var(--bg-panel-light) 0%, var(--bg-panel-mid) 100%)',
		borderColor: 'var(--border-bright)',
		color: 'var(--gold)',
	};

	return (
		<div
			style={{
				display: 'flex',
				gap: 2,
				background: 'rgba(0,0,0,0.4)',
				padding: 3,
				borderRadius: 4,
				border: '1px solid var(--border)',
				marginBottom: 10,
			}}
		>
			<button
				type='button'
				style={active === 'herb' ? activeStyle : inactive}
				onClick={() => onChange('herb')}
			>
				🌿 Herb Grown
			</button>
			<button
				type='button'
				style={active === 'flower' ? activeStyle : inactive}
				onClick={() => onChange('flower')}
			>
				🌸 Flower Grown
			</button>
		</div>
	);
}

// ── Chip selector ──
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

// ── Selection summary pill ──
function SelectionSummary({ herb, flower }: { herb: string; flower: string }) {
	if (!herb && !flower) return null;
	return (
		<div
			style={{
				background: 'rgba(0,0,0,0.25)',
				border: '1px solid var(--border)',
				borderRadius: 4,
				padding: '10px 14px',
				display: 'flex',
				flexWrap: 'wrap',
				gap: 8,
				alignItems: 'center',
			}}
		>
			<span
				style={{
					fontSize: '0.7rem',
					color: 'var(--text-dim)',
					textTransform: 'uppercase',
					letterSpacing: '0.05em',
					marginRight: 4,
				}}
			>
				This run:
			</span>
			{herb && (
				<span
					style={{
						background: 'rgba(32,96,32,0.35)',
						border: '1px solid rgba(80,160,80,0.35)',
						borderRadius: 20,
						padding: '3px 10px',
						fontSize: '0.78rem',
						color: '#90e090',
					}}
				>
					🌿 {herb}
				</span>
			)}
			{flower && (
				<span
					style={{
						background: 'rgba(140,40,120,0.25)',
						border: '1px solid rgba(200,100,180,0.35)',
						borderRadius: 20,
						padding: '3px 10px',
						fontSize: '0.78rem',
						color: '#e090d0',
					}}
				>
					🌸 {flower}
				</span>
			)}
			{!herb && (
				<span
					style={{
						fontSize: '0.75rem',
						color: 'var(--text-dim)',
						fontStyle: 'italic',
					}}
				>
					No herb selected
				</span>
			)}
			{!flower && (
				<span
					style={{
						fontSize: '0.75rem',
						color: 'var(--text-dim)',
						fontStyle: 'italic',
					}}
				>
					No flower selected
				</span>
			)}
		</div>
	);
}

// ── Add Entry Modal ──
function AddModal({
	onClose,
	onSave,
}: {
	onClose: () => void;
	onSave: (e: HerbEntry) => void;
}) {
	const [patches, setPatches] = useState<string[]>([]);
	const [cropTab, setCropTab] = useState<'herb' | 'flower'>('herb');
	const [herb, setHerb] = useState('');
	const [flower, setFlower] = useState('');
	const [compost, setCompost] = useState('Ultracompost');
	const [yieldHerbs, setYieldHerbs] = useState(0);
	const [yieldFlowers, setYieldFlowers] = useState(0);
	const [note, setNote] = useState('');

	const togglePatch = (p: string) =>
		setPatches((prev) =>
			prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
		);

	// At least one crop and at least one patch required
	const canSave = patches.length > 0 && (herb !== '' || flower !== '');

	const handleSave = () => {
		if (!canSave) return;
		onSave({
			id: Date.now().toString(),
			date: new Date().toISOString(),
			patches,
			herb,
			flower,
			compost,
			yieldHerbs,
			yieldFlowers,
			totalYield: yieldHerbs + yieldFlowers,
			note,
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
					{/* Header */}
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
							🌾 Log Farming Run
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
						{/* Patches */}
						<div>
							<div
								className='section-header'
								style={{ marginBottom: 8 }}
							>
								Patches visited
							</div>
							<Chips
								options={HERB_PATCHES}
								selected={patches}
								onToggle={togglePatch}
							/>
						</div>

						{/* Crops: mini-tab nav switching between Herb / Flower */}
						<div>
							<div
								className='section-header'
								style={{ marginBottom: 8 }}
							>
								Crops grown
							</div>
							<CropNav
								active={cropTab}
								onChange={setCropTab}
							/>

							{cropTab === 'herb' && (
								<Chips
									options={HERBS}
									selected={herb ? [herb] : []}
									onToggle={(h) => setHerb(h === herb ? '' : h)}
								/>
							)}
							{cropTab === 'flower' && (
								<Chips
									options={FLOWERS}
									selected={flower ? [flower] : []}
									onToggle={(f) => setFlower(f === flower ? '' : f)}
								/>
							)}
						</div>

						{/* Compost */}
						<div>
							<div
								className='section-header'
								style={{ marginBottom: 8 }}
							>
								Compost used
							</div>
							<Chips
								options={COMPOST_TYPES}
								selected={[compost]}
								onToggle={setCompost}
							/>
						</div>

						{/* Yield fields (no profit, no xp) */}
						<div
							className='numbers-grid-3'
							style={{
								display: 'grid',
								gridTemplateColumns: 'repeat(3, minmax(80px, 1fr))',
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
										whiteSpace: 'nowrap',
									}}
								>
									Herbs yield
								</label>
								<input
									className='osrs-input'
									style={{ width: '100%' }}
									type='number'
									min={0}
									value={yieldHerbs || ''}
									onChange={(e) => setYieldHerbs(+e.target.value)}
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
										whiteSpace: 'nowrap',
									}}
								>
									Flowers yield
								</label>
								<input
									className='osrs-input'
									style={{ width: '100%' }}
									type='number'
									min={0}
									value={yieldFlowers || ''}
									onChange={(e) => setYieldFlowers(+e.target.value)}
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
										whiteSpace: 'nowrap',
									}}
								>
									Total yield
								</label>
								{/* Auto-computed, read-only */}
								<div
									style={{
										background: 'rgba(0,0,0,0.35)',
										border: '1px solid var(--border)',
										borderRadius: 2,
										padding: '6px 10px',
										fontSize: '0.9rem',
										fontWeight: 'bold',
										color:
											yieldHerbs + yieldFlowers > 0
												? 'var(--gold)'
												: 'var(--text-dim)',
										height: 34,
										display: 'flex',
										alignItems: 'center',
									}}
								>
									{yieldHerbs + yieldFlowers || '—'}
								</div>
							</div>
						</div>

						{/* Note */}
						<div>
							<label
								style={{
									fontSize: '0.75rem',
									color: 'var(--text-muted)',
									display: 'block',
									marginBottom: 4,
								}}
							>
								Note (optional)
							</label>
							<input
								className='osrs-input'
								style={{ width: '100%' }}
								value={note}
								onChange={(e) => setNote(e.target.value)}
								placeholder='Any notes...'
								maxLength={100}
							/>
						</div>

						{/* Selection summary — shows selected herb + flower */}
						<SelectionSummary
							herb={herb}
							flower={flower}
						/>

						{/* Actions */}
						<div
							style={{
								display: 'flex',
								gap: 10,
								justifyContent: 'flex-end',
								paddingTop: 4,
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
								disabled={!canSave}
								style={{ padding: '8px 20px', opacity: canSave ? 1 : 0.5 }}
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

// ── Main tracker component ──
export default function HerbTracker() {
	const [entries, setEntries, loaded] = useLocalStorage<HerbEntry[]>(
		'osrs-herb-runs',
		[],
	);
	const [showModal, setShowModal] = useState(false);

	const addEntry = (e: HerbEntry) => setEntries((prev) => [e, ...prev]);
	const deleteEntry = (id: string) =>
		setEntries((prev) => prev.filter((e) => e.id !== id));

	// Stats
	const totalRuns = entries.length;
	const totalYield = entries.reduce((s, e) => s + e.totalYield, 0);
	const totalHerbs = entries.reduce((s, e) => s + e.yieldHerbs, 0);
	const totalFlowers = entries.reduce((s, e) => s + e.yieldFlowers, 0);

	// Day streak (consecutive days with at least one run)
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
			{/* Stats row */}
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
					gap: 10,
					marginBottom: 20,
				}}
			>
				<div className='stat-card'>
					<span className='value'>{totalRuns}</span>
					<span className='label'>Total Runs</span>
				</div>
				<div className='stat-card'>
					<span
						className='value'
						style={{ color: 'var(--gold)' }}
					>
						{totalYield}
					</span>
					<span className='label'>Total Yield</span>
				</div>
				<div className='stat-card'>
					<span
						className='value'
						style={{ color: '#90e090' }}
					>
						{totalHerbs}
					</span>
					<span className='label'>Herbs</span>
				</div>
				<div className='stat-card'>
					<span
						className='value'
						style={{ color: '#e090d0' }}
					>
						{totalFlowers}
					</span>
					<span className='label'>Flowers</span>
				</div>
				<div className='stat-card'>
					<div className='streak-flame'>🔥 {streak}</div>
					<span className='label'>Day Streak</span>
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
					<span>🌾</span> Recent Runs
				</div>
				<button
					className='osrs-btn'
					onClick={() => setShowModal(true)}
					style={{ padding: '6px 18px', fontSize: '0.82rem' }}
				>
					+ Log Run
				</button>
			</div>

			{/* Entries list */}
			{!loaded ? (
				<div
					style={{ textAlign: 'center', padding: 32, color: 'var(--text-dim)' }}
				>
					Loading...
				</div>
			) : entries.length === 0 ? (
				<div className='empty-state'>
					<span style={{ fontSize: '3rem' }}>🌾</span>
					<div>No farming runs logged yet</div>
					<div style={{ fontSize: '0.8rem' }}>
						Click &quot;Log Run&quot; to record your first harvest
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

							{/* Herb badge (if any) */}
							{e.herb && (
								<span
									style={{
										background: 'rgba(32,96,32,0.3)',
										border: '1px solid rgba(80,160,80,0.3)',
										borderRadius: 20,
										padding: '2px 8px',
										fontSize: '0.75rem',
										color: '#90e090',
										whiteSpace: 'nowrap',
									}}
								>
									🌿 {e.herb}
								</span>
							)}

							{/* Flower badge (if any) */}
							{e.flower && (
								<span
									style={{
										background: 'rgba(140,40,120,0.2)',
										border: '1px solid rgba(200,100,180,0.3)',
										borderRadius: 20,
										padding: '2px 8px',
										fontSize: '0.75rem',
										color: '#e090d0',
										whiteSpace: 'nowrap',
									}}
								>
									🌸 {e.flower}
								</span>
							)}

							{/* Patches count */}
							<span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
								{e.patches.length} patches
							</span>

							{/* Compost */}
							<span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
								{e.compost}
							</span>

							{/* Total yield */}
							{e.totalYield > 0 && (
								<span
									style={{
										marginLeft: 'auto',
										fontSize: '0.82rem',
										fontWeight: 'bold',
										color: 'var(--gold)',
									}}
								>
									{e.totalYield} yield
								</span>
							)}

							{/* Yield breakdown (only if both are non-zero) */}
							{e.yieldHerbs > 0 && e.yieldFlowers > 0 && (
								<span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
									({e.yieldHerbs}h / {e.yieldFlowers}f)
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
									lineHeight: 1,
									marginLeft: e.totalYield === 0 ? 'auto' : undefined,
								}}
								title='Delete entry'
							>
								✕
							</button>
						</div>
					))}
				</div>
			)}

			{/* Modal */}
			{showModal && (
				<AddModal
					onClose={() => setShowModal(false)}
					onSave={addEntry}
				/>
			)}
		</div>
	);
}
