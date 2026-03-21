'use client';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function BureaucracyXRay() {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.15 } } };
  const item = { hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } };

  return (
    <div className="flex flex-col min-h-full bg-slate-50 dark:bg-[#071020] text-slate-900 dark:text-slate-100 font-sans pb-24 h-full overflow-y-auto w-full absolute top-0 left-0">
      
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-slate-50/80 dark:bg-[#071020]/80 backdrop-blur-md border-b border-slate-200 dark:border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="flex items-center justify-center p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined font-normal">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold flex items-center gap-2 tracking-tight">
            <span className="material-symbols-outlined font-normal text-blue-500">search</span>
            <span>{t('bureaucracyXRay', 'Bureaucracy X-Ray')}</span>
          </h1>
        </div>
        <button className="flex items-center gap-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-500/20">
          {t('allApps', 'All Apps')} <span className="material-symbols-outlined text-sm font-normal">expand_more</span>
        </button>
      </header>

      <main className="flex-1 p-4 pb-24 space-y-8 overflow-x-hidden">
        
        {/* Active Application Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 to-white dark:from-slate-800 dark:to-[#0b182b] border border-slate-200 dark:border-white/5 p-5 shadow-lg shadow-slate-200/50 dark:shadow-black/20 group">
          <div className="absolute top-4 right-4 opacity-10 dark:opacity-5 transform group-hover:scale-110 transition-transform duration-500">
            <span className="material-symbols-outlined text-7xl font-light">account_balance</span>
          </div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="pr-4">
                <span className="inline-block px-2.5 py-1 rounded-md bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-black uppercase tracking-widest mb-3 border border-orange-500/20">
                  {t('activeApplication', 'Active Application')}
                </span>
                <h2 className="text-xl font-black text-slate-800 dark:text-white leading-tight mb-2">{t('pmfbyCropInsuranceClaim', 'PMFBY Crop Insurance Claim')}</h2>
                <div className="flex items-center gap-2">
                  <span className="bg-slate-200/50 dark:bg-black/30 px-2 py-1 rounded font-mono text-xs text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/5">#PMFBY-2026-DUM-4521</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">₹25<span className="text-xl opacity-80">,000</span></span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 bg-black/5 dark:bg-black/20 inline-flex px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/5">
              <span className="material-symbols-outlined text-sm text-green-500 font-normal">verified_user</span>
              <span>{t('filedVia', 'Filed via')} <span className="text-orange-600 dark:text-orange-400">{t('yojanaSaathi', 'Yojana Saathi')}</span></span>
            </div>
          </div>
        </motion.div>

        {/* Tracking Timeline */}
        <div className="px-2">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-6 flex items-center gap-2">
            <span className="h-px bg-slate-200 dark:bg-white/5 flex-1"></span>
            {t('trackingTimeline', 'TRACKING TIMELINE')}
            <span className="h-px bg-slate-200 dark:bg-white/5 flex-1"></span>
          </h3>
          
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-0 relative">
            
            {/* Step 1: Submitted */}
            <motion.div variants={item} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="size-7 rounded-full bg-green-500 flex items-center justify-center z-10 shadow-lg shadow-green-500/20 border-2 border-white dark:border-[#071020]">
                  <span className="material-symbols-outlined text-sm font-bold text-white">check</span>
                </div>
                <div className="w-0.5 h-14 bg-green-500/40"></div>
              </div>
              <div className="pt-0.5 pb-2">
                <p className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-none mb-1.5">{t('applicationSubmitted', 'Application Submitted')}</p>
                <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5">
                  <span className="size-3.5 rounded-sm bg-green-500/10 flex items-center justify-center"><span className="material-symbols-outlined text-[10px] text-green-500">done_all</span></span>
                  28 Feb • Digital Receipt Generated
                </p>
              </div>
            </motion.div>

            {/* Step 2: Documents */}
            <motion.div variants={item} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="size-7 rounded-full bg-green-500 flex items-center justify-center z-10 shadow-lg shadow-green-500/20 border-2 border-white dark:border-[#071020]">
                  <span className="material-symbols-outlined text-sm font-bold text-white">check</span>
                </div>
                <div className="w-0.5 h-14 bg-green-500/40"></div>
              </div>
              <div className="pt-0.5 pb-2">
                <p className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-none mb-1.5">{t('documentsVerified', 'Documents Verified')}</p>
                <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5">
                  <span className="size-3.5 rounded-sm bg-green-500/10 flex items-center justify-center"><span className="material-symbols-outlined text-[10px] text-green-500">done_all</span></span>
                  Land records fetched via <span className="text-blue-500 font-bold bg-blue-500/10 px-1 py-0.5 rounded ml-1">DIGIPIN</span>
                </p>
              </div>
            </motion.div>
            
            {/* Step 3: Forwarded */}
            <motion.div variants={item} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="size-7 rounded-full bg-green-500 flex items-center justify-center z-10 shadow-lg shadow-green-500/20 border-2 border-white dark:border-[#071020]">
                  <span className="material-symbols-outlined text-sm font-bold text-white">check</span>
                </div>
                <div className="w-0.5 h-14 bg-gradient-to-b from-green-500/40 to-orange-500/40"></div>
              </div>
              <div className="pt-0.5 pb-2">
                <p className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-none mb-1.5">{t('forwardedToBlockOffice', 'Forwarded to Block Office')}</p>
                <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5">
                  <span className="size-3.5 rounded-sm bg-green-500/10 flex items-center justify-center"><span className="material-symbols-outlined text-[10px] text-green-500">done_all</span></span>
                  1 Mar • Received by BDO Desk
                </p>
              </div>
            </motion.div>

            {/* Step 4: Active Review */}
            <motion.div variants={item} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="size-7 relative flex items-center justify-center z-10 border-2 border-white dark:border-[#071020] rounded-full bg-orange-500">
                  <span className="absolute inset-0 rounded-full border-2 border-orange-500 animate-ping opacity-75"></span>
                  <span className="material-symbols-outlined text-[12px] font-bold text-white">pending</span>
                </div>
                <div className="w-0.5 h-20 bg-slate-200 dark:bg-white/5"></div>
              </div>
              <div className="pt-0.5 pb-2 w-full">
                <p className="font-black text-orange-600 dark:text-orange-400 text-sm leading-none mb-2">{t('underReviewByAgriculture', 'Under Review by Agriculture Dept')}</p>
                <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-white/5 rounded-xl p-3 shadow-sm mr-4">
                   <div className="flex items-center gap-3 mb-2">
                     <div className="bg-slate-100 dark:bg-slate-900 rounded p-1.5">
                        <span className="material-symbols-outlined text-slate-500 text-base font-light">engineering</span>
                     </div>
                     <div>
                       <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{t('shriRkSinghBdo', 'Shri R.K. Singh, BDO')}</p>
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{t('avgProcessing23Days', 'Avg processing: 2-3 days')}</p>
                     </div>
                   </div>
                </div>
              </div>
            </motion.div>

            {/* Step 5: Pending */}
            <motion.div variants={item} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="size-7 rounded-full bg-slate-100 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-white/10 flex items-center justify-center z-10"></div>
                <div className="w-0.5 h-12 bg-slate-200 dark:bg-white/5"></div>
              </div>
              <div className="pt-1 pb-2">
                <p className="font-bold text-slate-400 dark:text-slate-500 text-sm leading-none mb-1.5">{t('amountSanctioned', 'Amount Sanctioned')}</p>
                <p className="text-[11px] font-medium text-slate-400 dark:text-slate-600">{t('pendingReviewCompletion', 'Pending review completion')}</p>
              </div>
            </motion.div>

            {/* Step 6: Disbursement */}
            <motion.div variants={item} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="size-7 rounded-full bg-slate-100 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-white/10 flex items-center justify-center z-10"></div>
              </div>
              <div className="pt-1">
                <p className="font-bold text-slate-400 dark:text-slate-500 text-sm leading-none mb-1.5">{t('dbtToBankAc', 'DBT to Bank A/C')}</p>
                <p className="text-[11px] font-medium text-slate-400 dark:text-slate-600">{t('finalDisbursementStep', 'Final disbursement step')}</p>
              </div>
            </motion.div>

          </motion.div>
        </div>

        {/* Action Widgets */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }} className="space-y-4">
          
          <div className="bg-orange-500/5 border border-orange-500/20 rounded-2xl p-4 flex items-center justify-between shadow-sm">
             <div className="flex items-center gap-3">
                <div className="size-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400">
                  <span className="material-symbols-outlined font-light">event_upcoming</span>
                </div>
                <div>
                   <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 mb-0.5">{t('expectedCompletion', 'Expected Completion')}</p>
                   <p className="font-black text-slate-800 dark:text-slate-100">{t('45Mar2026', '4-5 Mar 2026')}</p>
                </div>
             </div>
             <span className="text-[9px] font-black tracking-widest text-orange-600 bg-orange-500/10 px-2.5 py-1.5 rounded-lg border border-orange-500/20">3 DAYS LEFT</span>
          </div>

          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 backdrop-blur-sm p-5 shadow-sm">
            <div className="flex gap-3 mb-4 items-start">
               <div className="mt-0.5">
                 <span className="material-symbols-outlined text-red-500 font-light text-xl">warning</span>
               </div>
               <div>
                  <p className="font-bold text-red-700 dark:text-red-400 leading-tight mb-1 cursor-pointer" onClick={() => setExpanded(!expanded)}>
                     {t('applicationStuckFor48', 'Application stuck for > 48 hours?')}
                     <span className="material-symbols-outlined text-sm align-middle ml-1">{expanded ? 'expand_less' : 'expand_more'}</span>
                  </p>
                  
                  {expanded && (
                    <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-xs text-red-800/70 dark:text-red-300/70 leading-relaxed mt-2">
                       {t('directEscalationVia', 'Direct escalation via')} <span className="font-bold text-red-700 dark:text-red-300 bg-red-500/10 px-1 rounded mx-0.5">{t('arthikSalahkar', 'Arthik Salahkar')}</span> {t('rtiOr', '(RTI) or')} <span className="font-bold text-red-700 dark:text-red-300 bg-red-500/10 px-1 rounded mx-0.5">{t('vidhiSahayak', 'Vidhi Sahayak')}</span> {t('cpgrams', '(CPGRAMS).')}
                    </motion.p>
                  )}
               </div>
            </div>
            <button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-red-500/20 transition-all active:scale-95 flex items-center justify-center gap-2">
               <span className="material-symbols-outlined text-sm">rocket_launch</span>
               {t('escalateNow', 'Escalate Now')}
            </button>
          </div>
          
        </motion.div>

      </main>
    </div>
  );
}
