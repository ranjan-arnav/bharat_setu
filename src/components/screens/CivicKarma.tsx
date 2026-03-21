'use client';
import Image from 'next/image';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAppStore } from '@/lib/store';
import { motion } from 'framer-motion';

export default function CivicKarma() {
  const { t } = useTranslation();
  const { citizenProfile, trackedItems } = useAppStore();

  const district = citizenProfile?.district || 'Dumka';
  
  // Real State Data Calculation
  const karmaScore = trackedItems.reduce((acc, item) => acc + (item.status === 'Resolved' ? 50 : 10), 500);
  
  const karmaTiers = [
    { min: 2000, label: 'Setu Hero', next: 9999, nextName: 'Legend' },
    { min: 1000, label: 'Gold Citizen', next: 2000, nextName: 'Hero' },
    { min: 400, label: 'Silver Citizen', next: 1000, nextName: 'Gold' },
    { min: 0, label: 'Naya Nagarik', next: 400, nextName: 'Silver' }
  ];
  
  const tInfo = karmaTiers.find(x => karmaScore >= x.min) || karmaTiers[3];
  const pct = Math.min(100, Math.round((karmaScore / tInfo.next) * 100));
  const streakDays = Math.max(1, trackedItems.filter(i => i.status === 'Resolved').length * 2);

  // Animations
  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="flex flex-col min-h-full bg-slate-50 dark:bg-[#071020] text-slate-900 dark:text-slate-100 font-sans pb-24 h-full overflow-y-auto w-full absolute top-0 left-0">
      
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-slate-50/80 dark:bg-[#071020]/80 backdrop-blur-md border-b border-slate-200 dark:border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="flex items-center justify-center p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10">
            <span className="material-symbols-outlined font-normal">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold flex items-center gap-2 tracking-tight">
            <span className="material-symbols-outlined font-normal text-orange-500 fill-1">trophy</span>
            <span>{t('civicKarma', 'Civic Karma')}</span>
          </h1>
        </div>
        <div className="flex items-center gap-1 bg-orange-500/10 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-full border border-orange-500/20">
          <span className="material-symbols-outlined text-sm font-normal">location_on</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">{district} {t('dumkaDistrict', 'District').replace('Dumka', '').trim()}</span>
        </div>
      </header>

      <motion.main variants={container} initial="hidden" animate="show" className="p-4 space-y-6">
        
        {/* Hero Card */}
        <motion.section variants={item}>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white p-6 shadow-xl shadow-orange-500/20">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl mix-blend-overlay pointer-events-none"></div>
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-white/80 text-sm font-medium mb-1 drop-shadow-sm">{t('totalBalance', 'Total Balance')}</p>
                <h2 className="text-5xl font-black tracking-tight flex items-center gap-2 drop-shadow-md">
                  {karmaScore.toLocaleString('en-IN')} <span className="text-2xl font-bold opacity-90">{t('karma', 'Karma')}</span>
                </h2>
              </div>
              <div className="bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 flex items-center gap-1.5 shadow-inner">
                <span className="material-symbols-outlined text-amber-300 text-sm font-normal">local_fire_department</span>
                <span className="text-sm font-bold">{streakDays}<span className="font-medium opacity-80">-day</span></span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 p-1.5 rounded-full shadow-inner backdrop-blur-sm">
                    <span className="material-symbols-outlined text-white text-lg font-normal fill-1">workspace_premium</span>
                  </div>
                  <span className="font-bold uppercase tracking-widest text-xs opacity-95 text-white drop-shadow">{t(tInfo.label, tInfo.label)}</span>
                </div>
                <span className="text-xs font-medium tracking-tight text-white/80">{karmaScore} / {tInfo.next}</span>
              </div>
              
              <div className="w-full bg-black/20 h-3 rounded-full overflow-hidden shadow-inner backdrop-blur-sm">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="bg-white h-full rounded-full drop-shadow-md"
                />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Breakdown Carousel */}
        <motion.section variants={item}>
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 ml-1">{t('karmaBreakdown', 'KARMA BREAKDOWN')}</h3>
          <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 no-scrollbar snap-x">
            {[
              { icon: 'campaign', label: t('grievances', 'Grievances'), val: '+70' },
              { icon: 'diversity_3', label: t('helped', 'Helped'), val: '+150' },
              { icon: 'description', label: t('schemes', 'Schemes'), val: '+100' },
              { icon: 'verified', label: t('verified', 'Verified'), val: '+120' }
            ].map((stat, i) => (
              <div key={i} className="snap-start flex-shrink-0 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-white/5 p-4 rounded-xl flex flex-col items-center gap-2 min-w-[100px] shadow-sm">
                <span className="material-symbols-outlined font-normal text-orange-500">{stat.icon}</span>
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider w-full text-center truncate">{stat.label}</span>
                <span className="text-lg font-black text-slate-800 dark:text-white">{stat.val}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Banner Alert */}
        <motion.section variants={item}>
          <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-4 dark:from-emerald-900/40 dark:to-teal-900/40">
            <div className="bg-emerald-500 text-white rounded-full p-2.5 flex-shrink-0 shadow-lg shadow-emerald-500/20">
              <span className="material-symbols-outlined font-normal">celebration</span>
            </div>
            <p className="text-sm leading-snug text-emerald-800 dark:text-emerald-100 font-medium">
              <span className="font-bold">{district}</span> citizens resolved <span className="font-bold underline">234 issues</span> together! <br/>Top 3 in State! 🎉
            </p>
          </div>
        </motion.section>

        {/* Weekly Challenges */}
        <motion.section variants={item}>
          <div className="flex justify-between items-center mb-4 ml-1">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{t('weeklyChallenges', 'WEEKLY CHALLENGES')}</h3>
            <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 bg-orange-500/10 px-2 py-1 rounded-full">{t('endsIn2Days', 'Ends in 2 days')}</span>
          </div>

          <div className="space-y-3">
            {[
              { title: t('report3CivicIssues', 'Report 3 civic issues'), pts: '+50 pts', progress: 66, text: '2/3' },
              { title: t('help2NeighborsWith', 'Help 2 neighbors with PM-KISAN'), pts: '+100 pts', progress: 0, text: '0/2', dim: true },
              { title: t('verify5ResolvedGrievances', 'Verify 5 resolved grievances'), pts: '+40 pts', progress: 60, text: '3/5' }
            ].map((task, i) => (
              <div key={i} className={`bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-white/5 p-4 rounded-xl shadow-sm ${task.dim ? 'opacity-60' : ''}`}>
                <div className="flex justify-between mb-3 items-center">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{task.title}</p>
                  <span className="text-xs font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-md">{task.pts}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-slate-100 dark:bg-slate-900 h-2 rounded-full overflow-hidden shadow-inner">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${task.progress}%` }} transition={{ duration: 1, delay: 0.5 + i*0.1 }} className="bg-orange-500 h-full rounded-full" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 w-6 text-right">{task.text}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Leaderboard */}
        <motion.section variants={item} className="pb-8">
           <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4 ml-1">{district} {t('leaderboard', 'LEADERBOARD')}</h3>
           
           <div className="space-y-3">
              {[
                { name: t('priyaDevi', 'Priya Devi'), tier: t('setuHero', 'Setu Hero'), score: '2,450', rank: 1, active: false, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDua6IXr4aYELUrjcZcOpldfMu6vVeLPaugnz94bs6uVjahPA67xC7bs42rT05H-Q_1Su6nR6y_yN26af9Qca-GPiFsIfPKtmew36GOOrL1Lmip2mqnlLDDWD_1uWA5U7M9yasqDX9BNodrmKNkeHSwBgL7FtvSkHDJ2pAqrz-d7DcLAzlStBU91HXUmOJHq3cKBbsDKUQ6r4SsYvfLOQ2W3OMB4jnlJvOEOqz1MS17D4Pd1AKzcJZQIW8xadRiuPUKjmdH_LcEYio' },
                { name: t('rajeshKumar', 'Rajesh Kumar'), tier: t('topContributor', 'Top Contributor'), score: '2,120', rank: 2, active: false, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlXJWehiJ-RAEHpY683SyS8b-HuLV8RW2WNskndq8tbEYEZnLEs1vxJYBBi7AxbAnRtX-6cxd9-MMmBY3HPoTYiaNIF1AYOTL-rlE3yCu-Ri9Uftzmhj4Wzl0nkMyKkHyjz7xqL9fwY8txIliX4DAjKJ-zPk2muvu0e4_Xw7cpZzTbug98KhJxJYMXLoyklF1orugAYuwL4DMaAgZfo4W5FNIx1_KeLZU5xlB0LWZwMx1xHId05YJ48-36rqAIvl9tONR7RXl06P8', grayscale: true },
                { separator: true },
                { name: t('you', 'You'), tier: t(tInfo.label, tInfo.label), score: karmaScore.toLocaleString('en-IN'), rank: 47, active: true, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClR9xxAydStCGVgmHm9NMSxBVI46iYwbcLVAtv_VWQEbqB01QYoxl2h17JOraVINPpeaLHe7mthcIk1jyY96iaxWO-_lfh5JatsFMaGJ3_CkwIaYxKdd_6L-JfbfRFOwriTGMGORTyQEzuE5u_6qWY6ICtAeX4fK01vStteolGy9bFBDwCjTj9KUI2lVXTTb7taIhtCRpe7j7CQp0uvAk5Iwv6hoYjoV1VeOiCTSaZZy-BSQZj3EKovZoEZlkvQVFHoLKwIYY3Ze0' }
              ].map((user, i) => {
                if (user.separator) return (
                  <div key={i} className="flex justify-center py-2">
                    <span className="material-symbols-outlined font-normal text-slate-300 dark:text-slate-600 text-sm">more_vert</span>
                  </div>
                );
                return (
                  <div key={i} className={`flex items-center justify-between p-3.5 rounded-2xl border ${user.active ? 'bg-orange-500/10 border-orange-500/30 ring-2 ring-orange-500/20' : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-white/5 shadow-sm'}`}>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Image alt="Avatar" src={user.avatar || '/logo.png'} width={44} height={44} unoptimized className={`size-11 rounded-full border-2 ${user.active ? 'border-orange-500' : 'border-slate-200 dark:border-slate-700'} ${user.grayscale ? 'grayscale' : ''} object-cover`} />
                        <div className={`absolute -top-1.5 -left-1.5 text-[9px] font-black px-1.5 py-0.5 rounded-full ring-2 ring-white dark:ring-[#071020] ${user.rank === 1 ? 'bg-orange-500 text-white' : user.active ? 'bg-white text-orange-600 dark:bg-slate-800 dark:text-orange-400' : 'bg-slate-300 text-slate-700 dark:bg-slate-600 dark:text-slate-300'}`}>
                          #{user.rank}
                        </div>
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${user.active ? 'text-orange-600 dark:text-orange-400' : 'text-slate-800 dark:text-slate-100'}`}>{user.name}</p>
                        <p className={`text-[9px] font-bold uppercase tracking-wider ${user.active ? 'text-orange-500' : 'text-slate-400 dark:text-slate-500'}`}>{user.tier}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-black ${user.active ? 'text-orange-600 dark:text-orange-400' : 'text-slate-800 dark:text-slate-100'}`}>{user.score}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">{t('karma', 'Karma')}</p>
                    </div>
                  </div>
                );
              })}
           </div>
        </motion.section>

      </motion.main>
    </div>
  );
}
