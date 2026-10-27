import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { FitnessProvider } from './context/FitnessContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar, NavTab } from './components/common/Navbar';
import { AuthModal } from './components/common/AuthModal';
import { AiCoachDrawer } from './components/ai-coach/AiCoachDrawer';
import { DashboardView } from './components/dashboard/DashboardView';
import { WorkoutsView } from './components/workouts/WorkoutsView';
import { NutritionView } from './components/nutrition/NutritionView';
import { BmiMetricsView } from './components/metrics/BmiMetricsView';
import { GymFinderView } from './components/gym/GymFinderView';
import { AnalyticsView } from './components/tracking/AnalyticsView';
import { ProfileView } from './components/profile/ProfileView';

const COLLAPSED_KEY = 'aurafit_sidebar_collapsed';

const MainLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isCoachOpen, setIsCoachOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(COLLAPSED_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const handleToggleCollapse = (collapsed: boolean | ((prev: boolean) => boolean)) => {
    setIsCollapsed((prev) => {
      const next = typeof collapsed === 'function' ? collapsed(prev) : collapsed;
      try {
        localStorage.setItem(COLLAPSED_KEY, String(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-charcoal-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      
      {/* Sidebar, Top Header & Mobile Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCoach={() => setIsCoachOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        isCollapsed={isCollapsed}
        setIsCollapsed={handleToggleCollapse}
      />

      {/* Main Content Area (dynamically adjusts to desktop sidebar width) */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isCollapsed ? 'md:pl-20' : 'md:pl-64'
        }`}
      >
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-20 md:pb-12">
          {activeTab === 'dashboard' && (
            <DashboardView
              setActiveTab={setActiveTab}
              onOpenCoach={() => setIsCoachOpen(true)}
            />
          )}
          {activeTab === 'workouts' && <WorkoutsView />}
          {activeTab === 'nutrition' && <NutritionView />}
          {activeTab === 'metrics' && <BmiMetricsView />}
          {activeTab === 'gyms' && <GymFinderView />}
          {activeTab === 'analytics' && <AnalyticsView />}
          {activeTab === 'profile' && <ProfileView />}
        </main>

        {/* Modern SaaS Footer */}
        <footer className="border-t border-slate-200/90 dark:border-slate-800/80 bg-white/80 dark:bg-charcoal-950/80 py-6 text-center text-xs text-slate-500 dark:text-slate-400 mb-14 md:mb-0">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>© 2026 AuraFit AI. Personal Fitness & Nutrition Intelligence.</p>
            <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
              <span>Powered by Gemini AI</span>
              <span>•</span>
              <span>Supabase Cloud Ready</span>
              <span>•</span>
              <span>OpenStreetMap</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Slide-over AI Coach Drawer */}
      <AiCoachDrawer
        isOpen={isCoachOpen}
        onClose={() => setIsCoachOpen(false)}
      />

      {/* Supabase Cloud / Demo Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FitnessProvider>
          <MainLayout />
        </FitnessProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
