import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type GoalType = 'focus' | 'sleep' | 'anxiety' | 'productivity' | 'presence';
export type RiskTime = 'morning' | 'work' | 'evening' | 'late-night';

interface UserPreferences {
    hasOnboarded: boolean;
    name: string;
    primaryGoal: GoalType | null;
    problemApps: string[];
    riskTimes: RiskTime[];
    dailyScreenFreeGoal: number; // in minutes
}

interface AppState extends UserPreferences {
    // Actions
    completeOnboarding: (prefs: Partial<UserPreferences>) => void;
    updatePreferences: (prefs: Partial<UserPreferences>) => void;
    resetProgress: () => void;
}

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            hasOnboarded: false,
            name: '',
            primaryGoal: null,
            problemApps: [],
            riskTimes: [],
            dailyScreenFreeGoal: 60,

            completeOnboarding: (prefs) => set((state) => ({
                ...state,
                ...prefs,
                hasOnboarded: true
            })),

            updatePreferences: (prefs) => set((state) => ({ ...state, ...prefs })),

            resetProgress: () => set({
                hasOnboarded: false,
                primaryGoal: null,
                problemApps: [],
                riskTimes: []
            }),
        }),
        {
            name: 'mindful-screen-storage',
        }
    )
);
