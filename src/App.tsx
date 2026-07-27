import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import TodayPage from "@/pages/Today";
import { BoardSkeleton } from "@/components/board/BoardSkeleton";
import { CalendarSkeleton } from "@/components/calendar/CalendarSkeleton";
import { StatsSkeleton } from "@/components/stats/StatsSkeleton";

const BoardPage = lazy(() => import("@/pages/Board"));
const CalendarPage = lazy(() => import("@/pages/Calendar"));
const StatsPage = lazy(() => import("@/pages/Stats"));
const SettingsPage = lazy(() => import("@/pages/Preferences"));

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<MainLayout />}>
					<Route index element={<TodayPage />} />
					<Route
						path="board"
						element={
							<Suspense fallback={<BoardSkeleton />}>
								<BoardPage />
							</Suspense>
						}
					/>
					<Route
						path="calendar"
						element={
							<Suspense fallback={<CalendarSkeleton />}>
								<CalendarPage />
							</Suspense>
						}
					/>
					<Route
						path="stats"
						element={
							<Suspense fallback={<StatsSkeleton />}>
								<StatsPage />
							</Suspense>
						}
					/>
					<Route
						path="settings"
						element={
							<Suspense
								fallback={
									<div className="max-w-112 space-y-md">
										<div className="h-24 animate-pulse rounded-xl bg-surface-container-high" />
										<div className="h-24 animate-pulse rounded-xl bg-surface-container-high" />
									</div>
								}
							>
								<SettingsPage />
							</Suspense>
						}
					/>
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
