'use client';

import { ScreenKey } from '@/lib/screens';
import { useAppStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface BottomNavProps {
  activeTab: string;
  onNavigate: (screen: ScreenKey) => void;
  onServicesOpen: () => void;
}

export default function BottomNav({ activeTab, onNavigate, onServicesOpen }: BottomNavProps) {
  const { trackBadge, clearTrackBadge } = useAppStore();
  const { t } = useTranslation();

  const tabs = [
    { key: 'home', icon: 'home', label: t('navHome'), screen: 'home' as ScreenKey },
    { key: 'services', icon: 'apps', label: t('navServices'), screen: null },
    { key: 'sos', icon: 'emergency', label: t('navSOS'), screen: 'sos' as ScreenKey, danger: true },
    { key: 'track', icon: 'assignment', label: t('navTrack'), screen: 'cases' as ScreenKey },
    { key: 'community', icon: 'groups', label: t('navCommunity'), screen: 'community' as ScreenKey },
  ];
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50">
      {/* Tricolor GoI stripe at top of nav */}
      <div className="w-full h-[2px] flex">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white/40" />
        <div className="flex-1 bg-[#138808]" />
      </div>
      {/* Frost glass background */}
      <div className="bg-slate-50/90 dark:bg-[#0a1628]/90 backdrop-blur-2xl border-t border-black/10 dark:border-white/10 px-2 pb-[env(safe-area-inset-bottom,8px)] pt-2">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            const isSOS = tab.danger;

            return (
              <button
                key={tab.key}
                onClick={() => {
                  if (tab.key === 'services') {
                    onServicesOpen();
                  } else if (tab.screen) {
                    if (tab.key === 'track') clearTrackBadge();
                    onNavigate(tab.screen);
                  }
                }}
                className={`
                  relative flex flex-col items-center justify-center gap-0.5 py-1.5 px-3 rounded-xl transition-all duration-300
                  ${isActive && !isSOS
                    ? 'text-[#FF9933] scale-105'
                    : isSOS
                      ? 'text-red-400'
                      : 'text-gray-500 hover:text-slate-600 dark:text-gray-300'
                  }
                `}
              >
                {/* Track badge */}
                {tab.key === 'track' && trackBadge > 0 && (
                  <span className="absolute -top-1 -right-0.5 min-w-[16px] h-4 bg-[#FF9933] text-slate-900 dark:text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 shadow-lg shadow-orange-500/30">
                    {trackBadge > 9 ? '9+' : trackBadge}
                  </span>
                )}

                {/* SOS pulse ring */}
                {isSOS && (
                  <span className="absolute -top-1 -right-1 w-3 h-3">
                    <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-50"></span>
                    <span className="absolute inset-0 rounded-full bg-red-500"></span>
                  </span>
                )}

                <span
                  className={`material-symbols-outlined text-[22px] transition-all ${isActive ? 'font-bold' : ''
                    }`}
                  style={isActive ? { fontVariationSettings: "'FILL' 1, 'wght' 700" } : {}}
                >
                  {tab.icon}
                </span>
                <span className={`text-[10px] font-medium ${isActive ? 'font-bold' : ''}`}>
                  {tab.label}
                </span>

                {/* Active indicator dot */}
                {isActive && !isSOS && (
                  <span className="absolute -bottom-0.5 w-5 h-0.5 rounded-full bg-[#FF9933]"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
