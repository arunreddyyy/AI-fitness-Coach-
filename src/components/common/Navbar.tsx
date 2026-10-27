import React from 'react';
import {
  Flame,
  Dumbbell,
  Utensils,
  Scale,
  MapPin,
  BarChart3,
  User,
  Bot,
  Cloud,
  CloudOff,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Menu,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { isGeminiConfigured } from '../../services/gemini';

export type NavTab = 'dashboard' | 'workouts' | 'nutrition' | 'metrics' | 'gyms' | 'analytics' | 'profile';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenCoach: () => void;
  onOpenAuth: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenCoach,
  onOpenAuth,
  isCollapsed,
  setIsCollapsed,
}) => {
  const { user, isCloudConnected } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const hasGemini = isGeminiConfigured();

  const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <Flame className="w-5 h-5 flex-shrink-0" /> },
    { id: 'workouts', label: 'Workouts', icon: <Dumbbell className="w-5 h-5 flex-shrink-0" /> },
    { id: 'nutrition', label: 'Nutrition', icon: <Utensils className="w-5 h-5 flex-shrink-0" /> },
    { id: 'metrics', label: 'BMI & Metrics', icon: <Scale className="w-5 h-5 flex-shrink-0" /> },
    { id: 'gyms', label: 'Find Gym', icon: <MapPin className="w-5 h-5 flex-shrink-0" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5 flex-shrink-0" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5 flex-shrink-0" /> },
  ];

  const currentTabLabel = navItems.find((n) => n.id === activeTab)?.label || 'Dashboard';

  return (
    <>
      {/* ======================================================== */}
      {/* 1. Desktop & Tablet Collapsible Sidebar */}
      {/* ======================================================== */}
      <aside
        className={`hidden md:flex flex-col fixed inset-y-0 left-0 z-40 bg-white/95 dark:bg-charcoal-900/95 backdrop-blur-xl border-r border-slate-200/90 dark:border-slate-800/90 transition-all duration-300 shadow-sm ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand & Collapse Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200/80 dark:border-slate-800/80">
          <div
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-3 cursor-pointer group ${
              isCollapsed ? 'justify-center w-full' : ''
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-green-600 dark:from-lime-400 dark:to-lime-500 p-0.5 shadow-sm dark:shadow-glow-lime-sm flex-shrink-0">
              <div className="w-full h-full bg-white dark:bg-charcoal-950 rounded-[10px] flex items-center justify-center">
                <Flame className="w-6 h-6 text-emerald-600 dark:text-lime-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden whitespace-nowrap">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    AuraFit
                  </span>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 dark:bg-lime-500/15 dark:text-lime-300 dark:border-lime-500/30">
                    AI
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 -mt-0.5">
                  SaaS Intelligence
                </p>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-charcoal-800 transition-colors"
              title="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm dark:bg-lime-400 dark:text-charcoal-950 dark:shadow-glow-lime-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-charcoal-800 hover:text-slate-900 dark:hover:text-white'
                } ${isCollapsed ? 'justify-center px-2' : ''}`}
              >
                <div className={`${isActive ? 'text-white dark:text-charcoal-950' : 'text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-lime-400'}`}>
                  {item.icon}
                </div>
                {!isCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Controls */}
        <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80 space-y-2">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-charcoal-800 hover:bg-slate-100 dark:hover:bg-charcoal-700 text-slate-700 dark:text-slate-200 transition-colors ${
              isCollapsed ? 'justify-center px-2' : ''
            }`}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 flex-shrink-0" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            )}
            {!isCollapsed && (
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            )}
          </button>

          {/* Cloud Sync Status */}
          <button
            onClick={onOpenAuth}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
              isCloudConnected && user
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                : isCloudConnected
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                : 'bg-slate-50 dark:bg-charcoal-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-700 dark:hover:text-slate-200'
            } ${isCollapsed ? 'justify-center px-2' : ''}`}
            title={isCloudConnected ? (user ? `Account: ${user.email}` : 'Cloud Connected') : 'Demo Mode (Click for Supabase setup)'}
          >
            {isCloudConnected ? (
              <Cloud className="w-4 h-4 text-emerald-600 dark:text-lime-400 flex-shrink-0" />
            ) : (
              <CloudOff className="w-4 h-4 text-slate-400 flex-shrink-0" />
            )}
            {!isCollapsed && (
              <span className="truncate">
                {user ? user.email?.split('@')[0] : isCloudConnected ? 'Cloud Sync' : 'Demo Mode'}
              </span>
            )}
          </button>

          {/* Expand toggle when collapsed */}
          {isCollapsed && (
            <button
              onClick={() => setIsCollapsed(false)}
              className="w-full flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-charcoal-800 transition-colors"
              title="Expand sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>

      {/* ======================================================== */}
      {/* 2. Top Header Bar (Desktop & Mobile) */}
      {/* ======================================================== */}
      <header
        className={`sticky top-0 z-30 w-full bg-white/85 dark:bg-charcoal-950/85 backdrop-blur-xl border-b border-slate-200/90 dark:border-slate-800/90 transition-all duration-300 ${
          isCollapsed ? 'md:pl-20' : 'md:pl-64'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Left: Mobile Brand & Desktop Breadcrumb */}
          <div className="flex items-center gap-3">
            {/* Mobile Brand */}
            <div
              onClick={() => setActiveTab('dashboard')}
              className="md:hidden flex items-center gap-2 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-green-600 dark:from-lime-400 dark:to-lime-500 p-0.5">
                <div className="w-full h-full bg-white dark:bg-charcoal-950 rounded-[10px] flex items-center justify-center">
                  <Flame className="w-5 h-5 text-emerald-600 dark:text-lime-400" />
                </div>
              </div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                AuraFit
              </span>
            </div>

            {/* Desktop Active Screen Title */}
            <div className="hidden md:flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                AuraFit AI /
              </span>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {currentTabLabel}
              </h2>
            </div>
          </div>

          {/* Right Actions: Visible Theme Toggle, AI Coach, Cloud Status */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Header Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'Light mode (white surfaces, green accents)' : 'Dark mode (charcoal surfaces, lime accents)'}`}
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200/80 dark:bg-charcoal-800 dark:hover:bg-charcoal-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-600" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              )}
            </button>

            {/* Ask AI Coach Quick Button */}
            <button
              onClick={onOpenCoach}
              className="relative inline-flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 dark:bg-charcoal-800 dark:text-lime-300 dark:border-lime-500/40 dark:hover:border-lime-400 shadow-sm transition-all active:scale-95 group"
            >
              <Bot className="w-4 h-4 text-emerald-600 dark:text-lime-400 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">AI Coach</span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 dark:bg-lime-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 dark:bg-lime-400"></span>
              </span>
            </button>

            {/* Cloud Status / Auth Modal Trigger */}
            <button
              onClick={onOpenAuth}
              title={isCloudConnected ? (user ? `Logged in: ${user.email}` : 'Connected to Supabase') : 'Local Demo Mode (Click for Cloud Setup)'}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                isCloudConnected && user
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                  : isCloudConnected
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                  : 'bg-slate-100 dark:bg-charcoal-850 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {isCloudConnected ? (
                <Cloud className="w-4 h-4 text-emerald-600 dark:text-lime-400" />
              ) : (
                <CloudOff className="w-4 h-4 text-slate-400" />
              )}
              <span className="hidden lg:inline">
                {user ? user.email?.split('@')[0] : isCloudConnected ? 'Cloud Sync' : 'Demo Mode'}
              </span>
            </button>
          </div>

        </div>
      </header>

      {/* ======================================================== */}
      {/* 3. Compact Bottom Mobile Navigation Bar */}
      {/* ======================================================== */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-charcoal-900/95 backdrop-blur-xl border-t border-slate-200/90 dark:border-slate-800 px-2 py-1.5 shadow-2xl safe-area-bottom">
        <div className="grid grid-cols-7 gap-0.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-all ${
                  isActive
                    ? 'text-emerald-700 dark:text-lime-300 bg-emerald-500/15 dark:bg-lime-500/15 font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <div className="scale-90">{item.icon}</div>
                <span className="text-[9px] mt-0.5 tracking-tight truncate max-w-full">
                  {item.id === 'metrics' ? 'BMI' : item.id === 'gyms' ? 'Gyms' : item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
