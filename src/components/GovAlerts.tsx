'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function GovAlerts() {
  const { t } = useTranslation();
  const [broadcastText, setBroadcastText] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [broadcastWard, setBroadcastWard] = useState('all');
  const [broadcastCategory, setBroadcastCategory] = useState('all');
  const [activeProtocol, setActiveProtocol] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-full text-slate-900 dark:text-white overflow-y-auto pb-6 no-scrollbar">
      <div className="p-4 space-y-4">
        <h3 className="text-sm font-black uppercase tracking-wider">{t('alertsAndCommunications', 'Alerts & Communications')}</h3>

        {/* Live SOS Feed */}
        <div className="bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/5 rounded-2xl p-4 shadow-sm dark:shadow-none">
          <h4 className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px] text-red-400 animate-pulse">sos</span>
            {t('liveDistressFeed', 'Live Distress Feed')}
            <span className="ml-auto text-[9px] font-bold text-green-500 dark:text-green-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Monitoring
            </span>
          </h4>
          <div className="space-y-2">
            {[
              { citizen: 'Anonymous', location: 'Ward 14, Sector 3', time: '2 min ago', type: 'Hardware Trigger', severity: 'critical' as const, lat: '26.8467°N', lng: '80.9462°E' },
              { citizen: 'Ravi Kumar', location: 'Ward 7, Market Area', time: '18 min ago', type: 'Voice SOS', severity: 'high' as const, lat: '26.8512°N', lng: '80.9338°E' },
              { citizen: 'Meena Devi', location: 'Ward 22, Bus Stand', time: '1 hour ago', type: 'App Button', severity: 'resolved' as const, lat: '26.8389°N', lng: '80.9215°E' },
              { citizen: 'Ankit Sharma', location: 'Ward 3, Railway Crossing', time: '3 hours ago', type: 'Voice SOS', severity: 'resolved' as const, lat: '26.8601°N', lng: '80.9543°E' },
            ].map((sos, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                sos.severity === 'critical' ? 'bg-red-500/5 border-red-500/20' :
                sos.severity === 'high' ? 'bg-orange-500/5 border-orange-500/20' :
                'bg-green-500/5 border-green-500/20'
              }`}>
                <span className={`material-symbols-outlined text-lg ${
                  sos.severity === 'critical' ? 'text-red-500 animate-pulse' :
                  sos.severity === 'high' ? 'text-orange-400' : 'text-green-400'
                }`}>
                  {sos.severity === 'resolved' ? 'check_circle' : 'emergency'}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[11px] font-bold">{t(sos.citizen, sos.citizen)}</p>
                    <span className="text-[8px] font-bold text-slate-400 dark:text-gray-500 bg-black/5 dark:bg-white/5 px-1 py-0.5 rounded">{t(sos.type, sos.type)}</span>
                  </div>
                  <p className="text-[9px] text-slate-500 dark:text-gray-400">{t(sos.location, sos.location)}</p>
                  <p className="text-[8px] text-slate-400 dark:text-gray-500">{sos.lat}, {sos.lng}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[9px] text-slate-400 dark:text-gray-500 block">{t(sos.time, sos.time)}</span>
                  {sos.severity !== 'resolved' && (
                    <button className="mt-1 px-2 py-0.5 rounded bg-[#138808]/10 text-[8px] font-bold text-[#138808] hover:bg-[#138808]/20 transition-colors">
                      {t('respond', 'Respond')}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Protocols */}
        <div className="bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/5 rounded-2xl p-4 shadow-sm dark:shadow-none">
          <h4 className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px] text-red-500">emergency_home</span>
            {t('emergencyProtocols', 'Emergency Protocols')}
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'flood', label: t('floodAlert', 'Flood Alert'), icon: 'flood', color: '#06B6D4', desc: t('evacuateLowLyingWards', 'Evacuate low-lying wards') },
              { id: 'fire', label: t('fireResponse', 'Fire Response'), icon: 'local_fire_department', color: '#EF4444', desc: t('deployFireBrigade', 'Deploy fire brigade') },
              { id: 'epidemic', label: t('healthEmergency', 'Health Emergency'), icon: 'coronavirus', color: '#10B981', desc: t('medicalTeamsAlert', 'Medical teams alert') },
              { id: 'riot', label: t('lawAndOrder', 'Law & Order'), icon: 'shield', color: '#F59E0B', desc: t('policeDeployment', 'Police deployment') },
              { id: 'power', label: t('powerGridFailure', 'Power Grid Failure'), icon: 'power_off', color: '#8B5CF6', desc: t('emergencyGenerators', 'Emergency generators') },
              { id: 'quake', label: t('earthquakeAlert', 'Earthquake Alert'), icon: 'landslide', color: '#FF9933', desc: t('evacuationProtocol', 'Evacuation protocol') },
            ].map(p => (
              <button
                key={p.id}
                onClick={() => setActiveProtocol(activeProtocol === p.id ? null : p.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  activeProtocol === p.id
                    ? 'border-red-500/30 bg-red-500/5 ring-1 ring-red-500/20'
                    : 'border-black/5 dark:border-white/5 hover:bg-black/[0.02] dark:hover:bg-white/[0.02]'
                }`}
              >
                <span className="material-symbols-outlined text-xl mb-1" style={{ color: p.color }}>{p.icon}</span>
                <p className="text-[11px] font-bold">{p.label}</p>
                <p className="text-[8px] text-slate-400 dark:text-gray-500">{p.desc}</p>
                {activeProtocol === p.id && (
                  <div className="mt-2 pt-2 border-t border-red-500/20">
                    <button className="w-full py-1.5 rounded-lg bg-red-500 text-white text-[10px] font-bold hover:bg-red-600 transition-colors animate-pulse">
                      ⚠️ {t('activateProtocol', 'ACTIVATE PROTOCOL')}
                    </button>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Broadcast composer */}
        <div className="bg-[#138808]/5 border border-[#138808]/20 rounded-2xl p-4">
          <h4 className="text-[11px] font-black text-[#138808] uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base">campaign</span>
            {t('broadcastToCitizens', 'Broadcast to Citizens')}
          </h4>
          {broadcastSent ? (
            <div className="flex items-center gap-2 py-4">
              <span className="material-symbols-outlined text-green-500 dark:text-green-400 text-2xl">check_circle</span>
              <div>
                <p className="text-sm font-bold text-green-600 dark:text-green-400">{t('announcementSent', 'Announcement Sent!')}</p>
                <p className="text-[10px] text-slate-500 dark:text-gray-400">{t('broadcastedToCitizensInJurisdiction', 'Broadcasted to 1,247 citizens in your jurisdiction')}</p>
              </div>
            </div>
          ) : (
            <>
              <textarea
                value={broadcastText}
                onChange={e => setBroadcastText(e.target.value)}
                placeholder={t('typeYourPublicAnnouncement', 'Type your public announcement...')}
                className="w-full bg-slate-100 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#138808]/50 resize-none h-20 mb-2"
              />
              <div className="flex gap-2 mb-3">
                <select value={broadcastWard} onChange={e => setBroadcastWard(e.target.value)} className="flex-1 bg-slate-100 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg px-2 py-1.5 text-[10px] text-slate-600 dark:text-gray-300 focus:outline-none">
                  <option value="all">{t('allWards', 'All Wards')}</option>
                  <option value="1-10">{t('ward1to10', 'Ward 1-10')}</option>
                  <option value="11-20">{t('ward11to20', 'Ward 11-20')}</option>
                  <option value="21-30">{t('ward21to30', 'Ward 21-30')}</option>
                </select>
                <select value={broadcastCategory} onChange={e => setBroadcastCategory(e.target.value)} className="flex-1 bg-slate-100 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg px-2 py-1.5 text-[10px] text-slate-600 dark:text-gray-300 focus:outline-none">
                  <option value="all">{t('allCategories', 'All Categories')}</option>
                  <option value="infra">{t('infrastructure', 'Infrastructure')}</option>
                  <option value="health">{t('health', 'Health')}</option>
                  <option value="schemes">{t('schemes', 'Schemes')}</option>
                  <option value="emergency">{t('emergency', 'Emergency')}</option>
                </select>
              </div>
              <button
                onClick={() => setBroadcastSent(true)}
                disabled={!broadcastText.trim()}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#138808] text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#0d6b06] transition-all active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-[14px] align-middle mr-1">send</span>
                {t('sendPublicAnnouncement', 'Send Public Announcement')}
              </button>
            </>
          )}
        </div>

        {/* Policy directives */}
        <div className="bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/5 rounded-2xl p-4 shadow-sm dark:shadow-none">
          <h4 className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px] text-amber-400">gavel</span>
            {t('policyDirectives', 'Policy Directives')}
          </h4>
          <div className="space-y-2">
            {[
              { title: 'Free ration distribution extended till June 2026', source: 'PMO', time: '3 hours ago', priority: 'high' },
              { title: 'All BPL cards must be linked to Aadhaar by April 15', source: 'State Gov', time: '1 day ago', priority: 'medium' },
              { title: 'New ward boundary definitions effective immediately', source: 'District HQ', time: '2 days ago', priority: 'low' },
              { title: 'COVID-19 booster campaign — all PHCs activated', source: 'Health Dept', time: '3 days ago', priority: 'high' },
              { title: 'Mid-day meal quality audit mandated for all schools', source: 'Education Dept', time: '5 days ago', priority: 'medium' },
            ].map((p, i) => (
              <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors border border-transparent hover:border-black/5 dark:hover:border-white/5">
                <span className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${
                  p.priority === 'high' ? 'bg-red-400' : p.priority === 'medium' ? 'bg-amber-400' : 'bg-blue-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold leading-snug">{t(p.title, p.title)}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] text-slate-400 dark:text-gray-500">{t(p.source, p.source)}</span>
                    <span className="text-[8px] text-slate-300 dark:text-gray-600">·</span>
                    <span className="text-[9px] text-slate-400 dark:text-gray-500">{t(p.time, p.time)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notification history */}
        <div className="bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/5 rounded-2xl p-4 shadow-sm dark:shadow-none">
          <h4 className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px] text-[#3B82F6]">history</span>
            {t('notificationHistory', 'Notification History')}
          </h4>
          <div className="space-y-2">
            {[
              { text: 'Water supply disruption notice sent to Ward 19', time: '2 hours ago', icon: 'water_drop', color: '#06B6D4' },
              { text: 'PM-KISAN installment reminder broadcasted', time: '1 day ago', icon: 'agriculture', color: '#FF9933' },
              { text: 'Road closure alert — NH-44 repair work', time: '3 days ago', icon: 'do_not_disturb_on', color: '#EF4444' },
              { text: 'Vaccination camp announcement — Ward 12', time: '5 days ago', icon: 'vaccines', color: '#10B981' },
            ].map((n, i) => (
              <div key={i} className="flex items-center gap-2.5 p-2 rounded-lg">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: n.color + '15' }}>
                  <span className="material-symbols-outlined text-[14px]" style={{ color: n.color }}>{n.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold truncate">{t(n.text, n.text)}</p>
                  <p className="text-[9px] text-slate-400 dark:text-gray-500">{t(n.time, n.time)}</p>
                </div>
                <span className="material-symbols-outlined text-[14px] text-slate-300 dark:text-gray-600">chevron_right</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
