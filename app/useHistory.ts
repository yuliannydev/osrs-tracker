'use client';
import { useState, useCallback } from 'react';
import type { HiscoresResult } from './types';

type State = {
	result: HiscoresResult | null;
	loading: boolean;
	error: string | null;
};

const INITIAL_STATE: State = { result: null, loading: false, error: null };

export function useHiscores() {
	const [state, setState] = useState<State>(INITIAL_STATE);

	const lookup = useCallback(async (username: string) => {
		const name = username.trim();
		if (!name) return;

		setState({ result: null, loading: true, error: null });

		try {
			const res = await fetch(
				`/api/hiscores?username=${encodeURIComponent(name)}`,
			);
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || 'Error fetching data');
			setState({ result: data, loading: false, error: null });
		} catch (err: unknown) {
			setState({
				result: null,
				loading: false,
				error: err instanceof Error ? err.message : 'Something went wrong',
			});
		}
	}, []);

	return { ...state, lookup };
}
