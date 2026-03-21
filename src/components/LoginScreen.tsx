'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useAppStore, type UserType } from '@/lib/store';
import { FlagStripe } from '@/components/ui/GoiElements';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function LoginScreen() {
  const { t } = useTranslation();
  const login = useAppStore(s => s.login);
  const [userType, setUserType] = useState<UserType>('citizen');
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!name.trim()) return;
    setLoading(true);
    // simulate network delay
    await new Promise(r => setTimeout(r, 800));
    login(name.trim(), userType);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-gradient-to-b from-[#0a1628] via-[#0f1f3a] to-[#0a1628] flex flex-col items-center justify-center max-w-[430px] mx-auto">
      <FlagStripe thick />

      {/* Ambient glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-[#FF9933]/10 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-32 right-8 w-40 h-40 rounded-full bg-[#138808]/10 blur-[60px] pointer-events-none" />

      <div className="relative z-10 w-full px-6 flex flex-col items-center">
        {/* Logo */}
        <div className="mb-6 flex flex-col items-center">
          <Image src="/logo.png" alt="Bharat Setu" width={64} height={64} className="w-16 h-16 mb-3 drop-shadow-lg" />
          <h1 className="text-2xl font-black text-white tracking-wider">भारत सेतु</h1>
          <p className="text-[11px] text-[#5b8def] tracking-widest uppercase font-medium mt-1">{t('indiasGovernanceBridge', 'India\'s Governance Bridge')}</p>
        </div>

        {/* User Type Toggle */}
        <div className="flex w-full bg-white/5 border border-white/10 rounded-2xl p-1 mb-6">
          {(['citizen', 'government'] as UserType[]).map(type => (
            <button
              key={type}
              onClick={() => setUserType(type)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                userType === type
                  ? type === 'government'
                    ? 'bg-[#138808] text-white shadow-lg shadow-green-800/30'
                    : 'bg-[#FF9933] text-white shadow-lg shadow-orange-600/30'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <span className="material-symbols-outlined text-[14px] align-middle mr-1">
                {type === 'citizen' ? 'person' : 'account_balance'}
              </span>
              {type === 'citizen' ? t('citizen', 'Citizen') : t('government', 'Government')}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="w-full space-y-3 mb-6">
          <div>
            <label className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1.5 ml-1">
              {userType === 'citizen' ? t('fullName', 'Full Name') : t('officerName', 'Officer Name')}
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={userType === 'citizen' ? t('enterYourFullName', 'Enter your full name') : t('officerDepartmentName', 'Officer / Department Name')}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF9933]/50 focus:ring-1 focus:ring-[#FF9933]/30 transition-all"
            />
          </div>
          <div>
            <label className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1.5 ml-1">
              {userType === 'citizen' ? t('aadhaarNumberLast4', 'Aadhaar Number (last 4)') : t('officialId', 'Official ID')}
            </label>
            <input
              type="text"
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              placeholder={userType === 'citizen' ? t('aadhaarPlaceholderLogin', 'XXXX-XXXX-1234') : t('govDeptIdPlaceholder', 'GOV-DEPT-ID')}
              maxLength={userType === 'citizen' ? 4 : 20}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF9933]/50 focus:ring-1 focus:ring-[#FF9933]/30 transition-all"
            />
          </div>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading || !name.trim()}
          className={`w-full py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-300 ${
            loading || !name.trim()
              ? 'bg-white/10 text-gray-500 cursor-not-allowed'
              : userType === 'government'
                ? 'bg-gradient-to-r from-[#138808] to-[#0d6b06] text-white shadow-lg shadow-green-700/30 hover:shadow-green-700/50 active:scale-[0.98]'
                : 'bg-gradient-to-r from-[#FF9933] to-[#e67e22] text-white shadow-lg shadow-orange-600/30 hover:shadow-orange-600/50 active:scale-[0.98]'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {t('authenticating', 'Authenticating...')}
            </span>
          ) : (
            <span className="flex items-center justify-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">login</span>
              {t('loginAs', 'Login as')} {userType === 'citizen' ? t('citizen', 'Citizen') : t('government', 'Government')}
            </span>
          )}
        </button>

        {/* Role hint */}
        <div className="mt-4 text-center">
          <p className="text-[9px] text-gray-500 leading-relaxed">
            {userType === 'citizen'
              ? t('citizenRoleHint', 'Your civic role (Citizen → Contributor → Community Head) is automatically assigned based on your Karma score.')
              : t('governmentRoleHint', 'Government accounts have access to case management, status updates, and broadcast announcements.')}
          </p>
        </div>

        {/* Footer brand */}
        <div className="mt-8 flex items-center gap-2 opacity-40">
          <div className="w-4 h-[2px] bg-[#FF9933]" />
          <div className="w-4 h-[2px] bg-white/50" />
          <div className="w-4 h-[2px] bg-[#138808]" />
        </div>
        <p className="text-[8px] text-gray-600 mt-2 tracking-widest uppercase">{t('poweredByDigitalIndia', 'Powered by Digital India')}</p>
      </div>
    </div>
  );
}
