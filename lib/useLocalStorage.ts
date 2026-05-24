'use client';
import { useState, useEffect, useCallback } from 'react';

const EVENT = 'osrs-storage-update';

export function useLocalStorage<T>(key: string, initial: T) {
	const [value, setValue] = useState<T>(initial);
	const [loaded, setLoaded] = useState(false);

	// Load from localStorage on mount
	useEffect(() => {
		try {
			const stored = localStorage.getItem(key);
			if (stored) setValue(JSON.parse(stored));
		} catch {}
		setLoaded(true);
	}, [key]);

	// Re-sync when another instance writes to the same key
	useEffect(() => {
		const handler = (e: Event) => {
			const { detail } = e as CustomEvent<{ key: string; value: T }>;
			if (detail.key !== key) return;
			setValue(detail.value);
		};
		window.addEventListener(EVENT, handler);
		return () => window.removeEventListener(EVENT, handler);
	}, [key]);

	// Persist + broadcast deferred to avoid setState-during-render
	const set = useCallback(
		(val: T | ((prev: T) => T)) => {
			setValue((prev) => {
				const next =
					typeof val === 'function' ? (val as (p: T) => T)(prev) : val;
				try {
					localStorage.setItem(key, JSON.stringify(next));
					setTimeout(() => {
						window.dispatchEvent(
							new CustomEvent(EVENT, { detail: { key, value: next } }),
						);
					}, 0);
				} catch {}
				return next;
			});
		},
		[key],
	);

	return [value, set, loaded] as const;
}
