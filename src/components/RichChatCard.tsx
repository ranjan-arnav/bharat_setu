'use client';

import React, { useEffect, useRef } from 'react';
import { useAppStore, type AgentKey, type TrackedItem } from '@/lib/store';

// ─── Pattern matchers ──────────────────────────────────────────────────────────
const GRIEVANCE_ID_RE = /\b(GRV|WTR|ELC|RD|SWT|ENV)[-–]\w{1,4}[-–]\d{4}[-–]\d{2,6}\b/i;
const KISAN_TKT_RE = /\b(KISAN[-–]TKT|PM[-–]KISAN|PMJAY|PMFBY|MGNREGA|ABDM)[-–]?[A-Z0-9-]{3,12}\b/i;
const PHONE_108_RE = /\b(108|112|1930|102|181|1098|14567)\b/;
const RUPEE_RE = /₹\s?[\d,]+/;
const HOSPITAL_RE = /\b(hospital|aspatal|clinic|dispensary|PHC|CHC|primary health)\b/i;
const FIR_RE = /\b(FIR|zero fir|vakil|vakeel|court|case\s?file|NALSA|bail|arrest)\b/i;
const SCHEME_FOUND_RE = /\b(PM[-–]?KISAN|MGNREGA|NREGA|Ayushman|PMJAY|PMFBY|Ujjwala|PMAY|Jan\s?Dhan|Mudra|PMJJBY|Fasal\s?Bima|Sukanya)\b/i;
const NOT_ELIGIBLE_RE = /\b(not eligible|ineligible|patr nahi|पात्र नहीं|qualify nahi|does not qualify|cannot apply)\b/i;
const ABHA_RE = /\bABHA\b|abdm|health\s?id|हेल्थ\s?आईडी/i;
const DBT_RE = /\b(DBT|direct benefit|kist|installment|₹[\d,]+\s?(transfer|credited|bhej|diya|aaya))/i;

export interface ParsedCard {
  type: 'grievance' | 'scheme' | 'emergency' | 'legal' | 'health' | 'finance' | 'nagar_samwad' | 'abha' | 'dbt' | 'track-tab';
  icon: string;
  color: string;
  title: string;
  subtitle: string;
  actionLabel?: string;
  refId?: string;
  meta?: string;
}

export interface UserProfile {
  name?: string;
  digipin?: string;
  abhaId?: string;
}

export function parseCards(content: string, agentKey: AgentKey, profile?: UserProfile): ParsedCard[] {
  const cards: ParsedCard[] = [];

  // Grievance ID card
  const grvMatch = content.match(GRIEVANCE_ID_RE) || content.match(KISAN_TKT_RE);
  if (grvMatch && (agentKey === 'nagarik_mitra' || agentKey === 'yojana_saathi')) {
    cards.push({
      type: 'grievance',
      icon: 'confirmation_number',
      color: '#3B82F6',
      title: 'शिकायत दर्ज हुई',
      subtitle: grvMatch[0],
      actionLabel: 'Track करें',
      refId: grvMatch[0],
      meta: '📍 Estimated: 48–72 hours',
    });
  }

  // NagarSamwad — community count (injected when neighbourhood complaint detected)
  const complaintKw = /\b(pothole|streetlight|sadak|paani|sewage|nalaa|kachra|garbage|complaint|shikayat)\b/i;
  if (complaintKw.test(content) && agentKey === 'nagarik_mitra') {
    // Use content length for a stable O(1) deterministic count.
    const count = 8 + (content.length % 18); // 8–25
    const digipinZone = (profile?.digipin || '88-H2K').slice(0, 6);
    cards.push({
      type: 'nagar_samwad',
      icon: 'groups',
      color: '#F59E0B',
      title: `🏨 ${count} neighbours filed same`,
      subtitle: `in your ${digipinZone} DIGIPIN zone`,
      actionLabel: 'Collective View',
      meta: `Collective complaints resolve 5× faster!`,
    });
  }

  // Emergency helpline card
  const phoneMatch = content.match(PHONE_108_RE);
  if (phoneMatch) {
    const HELPLINES: Record<string, string> = {
      '108': '🚑 Emergency Ambulance',
      '112': '🚔 Emergency Police / Fire',
      '102': '🤰 Janani Suraksha (Maternity)',
      '1930': '💻 Cyber Crime Helpline',
      '181': '👩 Mahila Helpline',
      '1098': '🧒 Childline',
      '14567': '👴 Elder Helpline',
    };
    cards.push({
      type: 'emergency',
      icon: 'call',
      color: '#EF4444',
      title: HELPLINES[phoneMatch[0]] || `Helpline ${phoneMatch[0]}`,
      subtitle: `Call: ${phoneMatch[0]}`,
      actionLabel: `Call ${phoneMatch[0]}`,
    });
  }

  // Scheme eligibility / not-eligible card
  const schemeMatch = content.match(SCHEME_FOUND_RE);
  if (schemeMatch) {
    const notEligible = NOT_ELIGIBLE_RE.test(content);
    cards.push({
      type: 'scheme',
      icon: notEligible ? 'cancel' : 'verified',
      color: notEligible ? '#EF4444' : '#10B981',
      title: notEligible ? `${schemeMatch[0]} — Not Eligible` : `${schemeMatch[0]} Eligible ✓`,
      subtitle: notEligible
        ? 'कारण: आय सीमा / दस्तावेज़ अधूरे'
        : 'Apply via Jan Samarth portal',
      actionLabel: notEligible ? 'Scheme DNA देखें' : 'Apply करें',
      meta: notEligible ? '3 criteria did not match' : 'Success probability: 87%',
    });
  }

  // ABHA health card
  if (ABHA_RE.test(content) && agentKey === 'swasthya_sahayak') {
    const abhaDisplay = profile?.abhaId || '14558 ••• ••••';
    const nameDisplay = profile?.name || 'Citizen';
    cards.push({
      type: 'abha',
      icon: 'favorite',
      color: '#EF4444',
      title: 'ABHA Health Profile',
      subtitle: `${abhaDisplay} · ${nameDisplay}`,
      actionLabel: 'Health Timeline',
      meta: `Last visit: 12 Jan ${new Date().getFullYear() - 1} · Next vaccination: 14 Mar ${new Date().getFullYear()}`,

    });
  }

  // DBT / money transfer card
  const dbtMatch = content.match(DBT_RE);
  const rupeeMatch = content.match(RUPEE_RE);
  if ((dbtMatch || rupeeMatch) && (agentKey === 'yojana_saathi' || agentKey === 'arthik_salahkar')) {
    const bankDisplay = profile?.name ? 'Via PFMS → your bank account' : 'Via PFMS → DBT';
    cards.push({
      type: 'dbt',
      icon: 'account_balance_wallet',
      color: '#8B5CF6',
      title: 'DBT Transfer',
      subtitle: rupeeMatch ? `${rupeeMatch[0]} — Installment` : 'Direct benefit transfer',
      actionLabel: 'DBT Timeline',
      meta: bankDisplay,
    });
  }

  // Nearest hospital card
  if (HOSPITAL_RE.test(content) && agentKey === 'swasthya_sahayak') {
    cards.push({
      type: 'health',
      icon: 'local_hospital',
      color: '#10B981',
      title: 'Nearest PHC',
      subtitle: 'Sector 12 Primary Health Centre — 1.2 km',
      actionLabel: 'Navigate',
      meta: 'Open 24×7 · Ayushman accepted · 🔒 ABHA health profile will be shared with hospital for ease',
    });
  }

  // Legal card
  if (FIR_RE.test(content) && agentKey === 'vidhi_sahayak') {
    cards.push({
      type: 'legal',
      icon: 'gavel',
      color: '#EF4444',
      title: 'Free Legal Aid',
      subtitle: 'NALSA — any citizen can request',
      actionLabel: 'File via NALSA',
      meta: 'Zero cost · 48 hr lawyer assign',
    });
  }

  // Track Tab CTA — injected by quick-action rich responses
  if (/~~TRACK_TAB~~/i.test(content)) {
    cards.push({
      type: 'track-tab',
      icon: 'assignment_turned_in',
      color: '#6366F1',
      title: 'Track Tab में देखें • View Status',
      subtitle: 'Live updates, ETA & full ticket history',
      actionLabel: 'Open Track Tab',
    });
  }

  return cards;
}

// ─── Card Component ────────────────────────────────────────────────────────────
function InlineCard({ card, onTrack }: { card: ParsedCard; onTrack?: (card: ParsedCard) => void }) {
  const BG: Record<ParsedCard['type'], string> = {
    grievance: 'from-blue-500/10   to-blue-500/5   border-blue-500/20',
    scheme: 'from-green-500/10  to-green-500/5  border-green-500/20',
    emergency: 'from-red-500/10    to-red-500/5    border-red-500/20',
    legal: 'from-red-500/10    to-red-500/5    border-red-500/20',
    health: 'from-emerald-500/10 to-emerald-500/5 border-emerald-500/20',
    finance: 'from-purple-500/10 to-purple-500/5 border-purple-500/20',
    nagar_samwad: 'from-amber-500/10  to-amber-500/5  border-amber-500/20',
    abha: 'from-red-500/10    to-red-500/5    border-red-500/20',
    dbt: 'from-purple-500/10 to-purple-500/5 border-purple-500/20',
    'track-tab': 'from-indigo-500/15 to-indigo-500/5 border-indigo-500/30',
  };

  return (
    <div
      className={`mt-2 rounded-xl bg-gradient-to-br border px-3 py-2.5 ${BG[card.type]}`}
      style={{ animation: 'fadeIn 0.3s ease-out' }}
    >
      <div className="flex items-start gap-2.5">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
          style={{ backgroundColor: card.color + '25' }}
        >
          <span className="material-symbols-outlined text-base" style={{ color: card.color }}>
            {card.icon}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{card.title}</div>
          <div className="text-[10px] text-slate-500 dark:text-gray-400 mt-0.5">{card.subtitle}</div>
          {card.meta && (
            <div className="text-[9px] text-slate-500 dark:text-gray-500 mt-0.5">{card.meta}</div>
          )}
          {card.actionLabel && (
            <button
              onClick={() => onTrack?.(card)}
              className="mt-1.5 text-[10px] font-semibold rounded-full px-2.5 py-1 border transition-all active:scale-95 hover:opacity-90"
              style={{
                color: card.color,
                borderColor: card.color + '40',
                backgroundColor: card.color + '12',
              }}
            >
              {card.actionLabel} →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Inline parser: **bold**, *italic*, `code` ────────────────────────────────
function inlineParse(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**'))
      return <strong key={i} className="font-semibold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2)
      return <em key={i} className="italic text-orange-600 dark:text-orange-200">{part.slice(1, -1)}</em>;
    if (part.startsWith('`') && part.endsWith('`'))
      return <code key={i} className="font-mono text-[10px] bg-black/10 dark:bg-white/10 text-[#FF9933] px-1 py-0.5 rounded">{part.slice(1, -1)}</code>;
    return <span key={i}>{part}</span>;
  });
}

// ─── Full markdown-to-JSX renderer ────────────────────────────────────────────
function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const raw = lines[i];
    const t = raw.trim();

    // ── Blank line → small gap ────────────────────────────────────────────────
    if (!t) {
      elements.push(<div key={`gap-${i}`} className="h-1.5" />);
      i++; continue;
    }

    // ── Horizontal rule ───────────────────────────────────────────────────────
    if (t === '---' || t === '***' || t === '___') {
      elements.push(<div key={`hr-${i}`} className="border-t border-black/10 dark:border-white/10 my-2" />);
      i++; continue;
    }

    // ── H1 heading (# text) ───────────────────────────────────────────────────
    if (t.startsWith('# ') && !t.startsWith('## ')) {
      elements.push(
        <div key={`h1-${i}`} className="font-bold text-slate-900 dark:text-white text-[13px] mt-2 mb-1 pb-1 border-b border-black/10 dark:border-white/10">
          {inlineParse(t.slice(2))}
        </div>
      );
      i++; continue;
    }

    // ── H2 heading (## text) ──────────────────────────────────────────────────
    if (t.startsWith('## ')) {
      elements.push(
        <div key={`h2-${i}`} className="flex items-center gap-1.5 mt-2.5 mb-1">
          <span className="w-1 h-4 rounded-full bg-[#FF9933] shrink-0" />
          <span className="font-bold text-slate-900 dark:text-white text-[12px]">{inlineParse(t.slice(3))}</span>
        </div>
      );
      i++; continue;
    }

    // ── H3 heading (### text) ─────────────────────────────────────────────────
    if (t.startsWith('### ')) {
      elements.push(
        <div key={`h3-${i}`} className="font-semibold text-orange-600 dark:text-orange-300 text-[11px] mt-1.5 mb-0.5">
          {inlineParse(t.slice(4))}
        </div>
      );
      i++; continue;
    }

    // ── Table block ───────────────────────────────────────────────────────────
    if (t.startsWith('|')) {
      const rows: string[][] = [];
      let isFirstDataRow = true;
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        const row = lines[i].trim();
        // Skip separator lines like |---|---|---|
        if (/^\|[\s\-|:]+\|$/.test(row)) { i++; isFirstDataRow = false; continue; }
        const cells = row.split('|').slice(1, -1).map((c) => c.trim());
        rows.push(cells);
        if (isFirstDataRow) isFirstDataRow = false;
        i++;
      }
      if (rows.length > 0) {
        elements.push(
          <div key={`tbl-${i}`} className="mt-2 mb-1.5 rounded-xl overflow-hidden border border-black/10 dark:border-white/10 text-[11px]">
            {rows.map((row, ri) => (
              <div key={ri} className={`flex divide-x divide-black/5 dark:divide-white/5 ${ri === 0 ? 'bg-blue-50 dark:bg-[#1a4fa3]/25' : ri % 2 === 1 ? 'bg-black/3 dark:bg-white/3' : ''}`}>
                {row.map((cell, ci) => (
                  <div key={ci} className={`flex-1 px-2.5 py-1.5 min-w-0 ${ri === 0 ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-gray-300'}`}>
                    {inlineParse(cell)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        );
      }
      continue;
    }

    // ── Unordered list ────────────────────────────────────────────────────────
    if (/^[-•*]\s/.test(t)) {
      const items: string[] = [];
      while (i < lines.length && /^[-•*]\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-•*]\s/, ''));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="mt-1 mb-1 space-y-1">
          {items.map((item, ii) => (
            <li key={ii} className="flex items-start gap-2 text-[12px] text-slate-700 dark:text-gray-200 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF9933] mt-1.5 shrink-0" />
              <span>{inlineParse(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // ── Ordered list ──────────────────────────────────────────────────────────
    if (/^\d+[.)\s]/.test(t)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+[.)\s]/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+[.)\s]+/, ''));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="mt-1 mb-1 space-y-1">
          {items.map((item, ii) => (
            <li key={ii} className="flex items-start gap-2 text-[12px] text-slate-700 dark:text-gray-200 leading-relaxed">
              <span className="w-[18px] h-[18px] rounded-full bg-[#FF9933]/20 text-[#FF9933] text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                {ii + 1}
              </span>
              <span className="flex-1">{inlineParse(item)}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // ── Regular paragraph ─────────────────────────────────────────────────────
    elements.push(
      <p key={`p-${i}`} className="text-[12.5px] text-slate-700 dark:text-gray-200 leading-relaxed">
        {inlineParse(t)}
      </p>
    );
    i++;
  }

  return elements;
}

// ─── Main export ───────────────────────────────────────────────────────────────
interface RichChatCardProps {
  content: string;
  agentKey: AgentKey;
  /** called when a card action is tapped (e.g. track complaint) */
  onAction?: (card: ParsedCard) => void;
}

export default function RichChatCard({ content, agentKey, onAction }: RichChatCardProps) {
  const { addTrackedItem, userProfile } = useAppStore();
  const profile = { name: userProfile.name, digipin: userProfile.digipin };
  const cards = parseCards(content, agentKey, profile);
  const trackedRef = useRef<Set<string>>(new Set());

  // Auto-track grievance cards when first rendered
  useEffect(() => {
    cards.forEach((card) => {
      if (
        (card.type === 'grievance' || card.type === 'health' || card.type === 'legal') &&
        card.refId &&
        !trackedRef.current.has(card.refId)
      ) {
        trackedRef.current.add(card.refId);
        const item: TrackedItem = {
          id: `auto-${card.refId}-${Date.now()}`,
          type: card.type === 'grievance' ? 'grievance' : card.type === 'health' ? 'health' : 'legal',
          title: card.title,
          description: card.subtitle || '',
          status: 'Active',
          createdAt: Date.now(),
          agentKey,
          refId: card.refId,
          emoji: card.type === 'grievance' ? '📋' : card.type === 'health' ? '🏥' : '⚖️',
        };
        addTrackedItem(item);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCardAction = (card: ParsedCard) => {
    onAction?.(card);
  };

  return (
    <div>
      <div className="space-y-0.5">
        {renderMarkdown(content.replace(/\n?~~TRACK_TAB~~/gi, ''))}
      </div>
      {cards.map((card, i) => (
        <InlineCard key={i} card={card} onTrack={handleCardAction} />
      ))}
    </div>
  );
}
