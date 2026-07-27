import { useEffect, useMemo, useState } from "react";

interface NagerHoliday {
	date: string;
	localName: string;
	name: string;
}

type HolidayMap = Record<string, string>;

const CACHE_KEY = "taskflow-holidays-CO";

export function useHolidays(year: number) {
	const cacheKey = `${CACHE_KEY}-${year}`;

	const cachedHolidays = useMemo<HolidayMap | null>(() => {
		const cached = localStorage.getItem(cacheKey);
		return cached ? JSON.parse(cached) : null;
	}, [cacheKey]);

	const [fetchedHolidays, setFetchedHolidays] = useState<HolidayMap | null>(null);

	useEffect(() => {
		if (cachedHolidays) return;

		let cancelled = false;

		const loadHolidays = async () => {
			try {
				const res = await fetch(
					`https://date.nager.at/api/v3/PublicHolidays/${year}/CO`,
				);

				if (!res.ok) {
					throw new Error("No se pudieron cargar los festivos");
				}

				const data: NagerHoliday[] = await res.json();

				const map: HolidayMap = {};

				for (const holiday of data) {
					map[holiday.date] = holiday.localName;
				}

				if (!cancelled) {
					setFetchedHolidays(map);
					localStorage.setItem(cacheKey, JSON.stringify(map));
				}
			} catch {
				if (!cancelled) setFetchedHolidays({});
			}
		};

		loadHolidays();

		return () => {
			cancelled = true;
		};
	}, [year, cacheKey, cachedHolidays]);

	return cachedHolidays ?? fetchedHolidays ?? {};
}