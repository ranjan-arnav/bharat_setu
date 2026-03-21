'use client';

import React, { useState } from 'react';
import { useAppStore, getUserLevelDescriptor } from '@/lib/store';
import EmergencyContactsManager from '@/components/EmergencyContactsManager';
import { fetchDigiLockerProfile } from '@/lib/services/identityService';
import { useTranslation } from '@/lib/i18n/useTranslation';

const OCCUPATIONS = [
  { value: 'farmer', label: 'occupationFarmer', fallback: 'Farmer' },
  { value: 'student', label: 'occupationStudent', fallback: 'Student' },
  { value: 'government', label: 'occupationGovernmentEmployee', fallback: 'Government Employee' },
  { value: 'private', label: 'occupationPrivateSector', fallback: 'Private Sector' },
  { value: 'business', label: 'occupationBusinessOwner', fallback: 'Business Owner' },
  { value: 'homemaker', label: 'occupationHomemaker', fallback: 'Homemaker' },
  { value: 'retired', label: 'occupationRetired', fallback: 'Retired' },
  { value: 'other', label: 'occupationOther', fallback: 'Other' },
];

export default function ProfileTab() {
  const { trackedItems, karmaScore, userProfile, setUserProfile, citizenProfile, setCitizenProfile, redeemedRewards, redeemReward } = useAppStore();
  const { t } = useTranslation();
  const level = getUserLevelDescriptor(karmaScore);
  
  const [profileForm, setProfileForm] = useState({ 
    name: userProfile.name || '',
    digipin: userProfile.digipin || '',
    state: userProfile.state || citizenProfile?.state || '',
    district: citizenProfile?.district || '',
    occupation: userProfile.occupation || citizenProfile?.occupation || '',
    income: userProfile.income || citizenProfile?.income || 0,
   });
   
  const [profileSaved, setProfileSaved] = useState(false);
  const [digilockerFetching, setDigilockerFetching] = useState(false);
  const [digilockerVerified, setDigilockerVerified] = useState(false);
  const myResolved = trackedItems.filter(i => i.status === 'Resolved').length;

  const handleDigiLockerFetch = async () => {
    setDigilockerFetching(true);
    try {
      const res = await fetchDigiLockerProfile('4321');
      if (res.success) {
        const d = res.data;
        setProfileForm({ name: d.name, digipin: '', state: d.state, district: d.district, occupation: d.occupation, income: d.income });
        setDigilockerVerified(true);
      }
    } catch { /* silently fail */ }
    setDigilockerFetching(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-[#0a1628] text-slate-900 dark:text-slate-100 overflow-y-auto pb-6">
      <div className="p-4 space-y-4">
        {/* Profile header card */}
        <div className="bg-[#f3eee5] dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-5 flex items-center gap-4 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF9933]/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
           <div className="relative z-10 w-16 h-16 rounded-full bg-[#FF9933]/20 flex items-center justify-center text-3xl font-black text-[#FF9933]">
              {profileForm.name ? profileForm.name.charAt(0).toUpperCase() : '?'}
            </div>
            <div className="flex-1 min-w-0 relative z-10 flex flex-col items-start">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider mb-1 shadow-sm ${level.bg} ${level.color}`}>
                <span className="material-symbols-outlined text-[11px]">{level.icon}</span>
                {level.title}
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                {profileForm.name || t('yourName', 'Your Name')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                {profileForm.digipin ? `DIGIPIN: ${profileForm.digipin}` : t('noDigipinSet', 'No DIGIPIN set')}
              </p>
            </div>
            <div className="text-right relative z-10 pl-2 border-l border-black/10 dark:border-white/10">
              <p className="text-3xl font-black text-[#FF9933]">{karmaScore.toLocaleString('en-IN')}</p>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{t('karma', 'Karma')}</p>
            </div>
        </div>

        {/* Redeem Karma Store */}
        <div className="bg-[#f3eee5] dark:bg-white/5 border border-[#FF9933]/20 rounded-2xl p-4 space-y-4 shadow-sm relative overflow-hidden">
           <h4 className="text-[13px] font-black text-[#FF9933] uppercase tracking-widest flex items-center gap-1.5">
             <span className="material-symbols-outlined">storefront</span>
             {t('redeemRewards', 'Redeem Rewards')}
           </h4>
           <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'badge-gold', titleKey: 'rewardGoldProfileGlow', titleFallback: 'Gold Profile Glow', cost: 1500, icon: 'workspace_premium' },
                { id: 'priority-q', titleKey: 'rewardPrioritySupport', titleFallback: 'Priority Support', cost: 300, icon: 'bolt' },
                { id: 'civic-hero', titleKey: 'rewardCivicHeroTitle', titleFallback: '"Civic Hero" Title', cost: 900, icon: 'local_police' },
                { id: 'theme-dark', titleKey: 'rewardExclusiveTheme', titleFallback: 'Exclusive Theme', cost: 2500, icon: 'palette' }
              ].map(item => {
                 const isRedeemed = redeemedRewards.includes(item.id);
                 const canAfford = karmaScore >= item.cost;
                 return (
                   <button 
                     key={item.id}
                     disabled={isRedeemed || !canAfford}
                     onClick={() => redeemReward(item.cost, item.id)}
                     className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${isRedeemed ? 'bg-green-500/10 border-green-500/30 opacity-70 cursor-default' : canAfford ? 'bg-white/50 dark:bg-black/20 border-black/10 dark:border-white/10 hover:border-[#FF9933] hover:shadow-md cursor-pointer active:scale-95' : 'bg-slate-200 dark:bg-black/20 border-transparent opacity-50 cursor-not-allowed'}`}
                   >
                     <span className={`material-symbols-outlined text-[20px] mb-1 ${isRedeemed ? 'text-green-500' : 'text-[#FF9933]'}`}>{isRedeemed ? 'check_circle' : item.icon}</span>
                     <span className="text-[10px] font-bold text-slate-700 dark:text-gray-200 leading-tight mb-1">{t(item.titleKey, item.titleFallback)}</span>
                     <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${isRedeemed ? 'bg-green-500/20 text-green-600 dark:text-green-400' : 'bg-black/5 dark:bg-white/5 text-slate-500 dark:text-gray-400'}`}>{isRedeemed ? t('purchased', 'Purchased') : `${item.cost} ${t('karma', 'Karma')}`}</span>
                   </button>
                 );
              })}
           </div>
        </div>

        {/* Edit form */}
        <div className="bg-[#e9ecef] dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-4 space-y-4 shadow-sm">
          <div className="flex flex-col gap-2 mb-2">
            <h4 className="text-[11px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest">{t('editProfile', 'Edit Profile')}</h4>
            {digilockerVerified ? (
              <div className="flex items-center gap-1.5 px-2 py-1 max-w-fit bg-green-500/10 border border-green-500/20 rounded-md">
                <span className="material-symbols-outlined text-[13px] text-green-600 dark:text-green-400">verified</span>
                <span className="text-[9px] font-bold text-green-600 dark:text-green-400 tracking-wider">{t('verifiedViaSimulatedDigilocker', 'Verified via simulated DigiLocker / UIDAI e-KYC')}</span>
              </div>
            ) : (
              <button
                onClick={handleDigiLockerFetch}
                disabled={digilockerFetching}
                className="flex items-center gap-1.5 px-3 py-1.5 max-w-fit bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors active:scale-95 disabled:opacity-50"
              >
                {digilockerFetching ? (
                  <>
                    <span className="w-3 h-3 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 tracking-wider">{t('fetchingFromDigilocker', 'Fetching from DigiLocker...')}</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[13px] text-blue-600 dark:text-blue-400">cloud_download</span>
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 tracking-wider">{t('fetchFromDigilockerAadhaarSimulated', 'Fetch from DigiLocker / Aadhaar (Simulated)')}</span>
                  </>
                )}
              </button>
            )}
            <p className="text-[10px] text-slate-400 font-medium">{t('demoBackendDisclosure', 'Demo build: identity verification and some service responses are simulated.')}</p>
          </div>

          {/* Name */}
          <div>
            <label className="block text-[13px] text-[#4b5563] font-semibold dark:text-slate-300 mb-1.5 mt-2">{t('fullName', 'Full Name')}</label>
            <input
              type="text"
              value={profileForm.name}
              onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
              placeholder={t('enterYourFullName', 'Enter your full name')}
              className="w-full bg-[#e3e6e8] dark:bg-black/20 border-transparent rounded-[10px] px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#FF9933] transition-colors"
            />
          </div>

          <div className="flex gap-3">
            {/* State */}
            <div className="flex-1">
              <label className="block text-[13px] text-[#4b5563] font-semibold dark:text-slate-300 mb-1.5">{t('state', 'State')}</label>
              <input
                type="text"
                value={profileForm.state}
                onChange={e => setProfileForm(p => ({ ...p, state: e.target.value }))}
                placeholder={t('statePlaceholder', 'Uttar Pradesh')}
                className="w-full bg-[#e3e6e8] dark:bg-black/20 border-transparent rounded-[10px] px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#FF9933] transition-colors"
              />
            </div>

            {/* District */}
            <div className="flex-1">
              <label className="block text-[13px] text-[#4b5563] font-semibold dark:text-slate-300 mb-1.5">{t('district', 'District')}</label>
              <input
                type="text"
                value={profileForm.district}
                onChange={e => setProfileForm(p => ({ ...p, district: e.target.value }))}
                placeholder={t('districtPlaceholder', 'Lucknow')}
                className="w-full bg-[#e3e6e8] dark:bg-black/20 border-transparent rounded-[10px] px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#FF9933] transition-colors"
              />
            </div>
          </div>

          {/* Occupation */}
          <div>
            <label className="block text-[13px] text-[#4b5563] font-semibold dark:text-slate-300 mb-1.5">{t('occupation', 'Occupation')}</label>
            <select
              value={profileForm.occupation}
              onChange={e => setProfileForm(p => ({ ...p, occupation: e.target.value }))}
              className="w-full bg-[#e3e6e8] dark:bg-black/20 border-transparent rounded-[10px] px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#FF9933] transition-colors"
            >
              <option value="">{t('selectOccupation', 'Select occupation')}</option>
              {OCCUPATIONS.map(o => (
                <option key={o.value} value={o.value}>{t(o.label, o.fallback)}</option>
              ))}
            </select>
          </div>

          {/* Annual Income */}
          <div>
            <label className="block text-[13px] text-[#4b5563] font-semibold dark:text-slate-300 mb-1.5">{t('annualIncome', 'Annual Income (₹)')}</label>
            <input
              type="number"
              value={profileForm.income || ''}
              onChange={e => setProfileForm(p => ({ ...p, income: parseInt(e.target.value) || 0 }))}
              placeholder={t('annualIncomeExample', 'e.g., 250000')}
              className="w-full bg-[#e3e6e8] dark:bg-black/20 border-transparent rounded-[10px] px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#FF9933] transition-colors"
            />
            <p className="text-[10px] text-slate-400 mt-2 font-medium">{t('usedForSchemeEligibilityMatching', 'Used for scheme eligibility matching')}</p>
          </div>

          {/* Save button */}
          <button
            onClick={() => {
              setUserProfile({ ...userProfile, ...profileForm });
              if (citizenProfile) {
                setCitizenProfile({ ...citizenProfile, ...profileForm });
              }
              setProfileSaved(true);
              setTimeout(() => setProfileSaved(false), 2000);
            }}
            className="w-full py-3.5 mt-2 rounded-xl bg-[#ff9933] text-white font-bold text-sm transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2"
          >
            {profileSaved ? t('savedSuccess', '✓ Saved!') : t('saveChanges', 'Save Changes')}
          </button>
        </div>

        {/* Stats summary */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: t('casesFiled', 'Cases Filed'), value: trackedItems.filter(i => i.type === 'grievance').length },
            { label: t('resolved', 'Resolved'), value: myResolved },
            { label: t('karma', 'Karma'), value: karmaScore },
          ].map((s, i) => (
            <div key={i} className="bg-[#e9ecef] dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-4 text-center shadow-sm flex flex-col items-center justify-center">
              <p className="text-xl font-black text-slate-900 dark:text-white">{s.value}</p>
              <p className="text-[9px] text-slate-500 dark:text-gray-400 uppercase tracking-widest mt-1 font-bold">{s.label}</p>
            </div>
          ))}
        </div>

        <p className="text-[10px] text-[#9ca3af] text-center font-medium my-4 flex items-center justify-center gap-1">
          <span className="material-symbols-outlined text-[12px] text-[#fbbf24]">lock</span>
          {t('privacyEncryptedLocalOnly', 'Your data is encrypted and stored locally. We never share your information.')}
        </p>

        {/* Emergency Contacts Block */}
        <div className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm pt-2">
           <EmergencyContactsManager onClose={() => {}} />
        </div>

      </div>
    </div>
  );
}
