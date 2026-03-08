import React, { useState } from 'react';
import { useAppStore, type EmergencyContact } from '@/lib/store';
import { FlagStripe } from '@/components/ui/GoiElements';

interface Props {
    onClose: () => void;
}

export default function EmergencyContactsManager({ onClose }: Props) {
    const { citizenProfile, addEmergencyContact, removeEmergencyContact } = useAppStore();

    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [newRel, setNewRel] = useState('');
    const [newPriority, setNewPriority] = useState<1 | 2>(1);

    const contacts = citizenProfile?.emergencyContacts || [];

    const handleSave = () => {
        if (!newName || !newPhone) return;
        addEmergencyContact({
            name: newName,
            phone: newPhone,
            relationship: newRel || 'Family',
            priority: newPriority,
        });
        setNewName('');
        setNewPhone('');
        setNewRel('');
        setNewPriority(1);
        setIsAdding(false);
    };

    return (
        <div className="fixed inset-0 z-[150] bg-slate-50 dark:bg-[#0a1628] flex flex-col max-w-[430px] mx-auto overflow-hidden animate-slideUp">
            <FlagStripe />
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-4 bg-white dark:bg-[#0f1f3a] border-b border-black/10 dark:border-white/10">
                <button onClick={onClose} className="p-1">
                    <span className="material-symbols-outlined text-slate-500 dark:text-gray-400">arrow_back</span>
                </button>
                <div className="flex-1">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">Emergency Contacts</h2>
                    <p className="text-[10px] text-slate-500 dark:text-gray-400 mt-0.5">SOS Alerts will be sent here</p>
                </div>
                {contacts.length < 5 && !isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-1 bg-[#FF9933]/20 text-[#FF9933] px-3 py-1.5 rounded-full text-xs font-bold"
                    >
                        <span className="material-symbols-outlined text-sm">add</span> Add
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                {/* Added Contacts */}
                <div className="space-y-3">
                    {contacts.map((contact) => (
                        <div key={contact.id} className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-3 flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="font-bold text-slate-900 dark:text-white text-sm">{contact.name}</p>
                                    {contact.priority === 1 && (
                                        <span className="text-[8px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded font-bold uppercase">Primary</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-slate-600 dark:text-gray-300 font-mono">{contact.phone}</span>
                                    <span className="text-[10px] text-gray-500">• {contact.relationship}</span>
                                </div>
                            </div>
                            <button onClick={() => removeEmergencyContact(contact.id)} className="p-2 bg-red-500/10 rounded-lg text-red-400 hover:bg-red-500/20">
                                <span className="material-symbols-outlined text-base">delete</span>
                            </button>
                        </div>
                    ))}
                    {contacts.length === 0 && !isAdding && (
                        <div className="text-center py-10 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 border-dashed rounded-xl">
                            <span className="material-symbols-outlined text-gray-500 text-4xl mb-2">group_add</span>
                            <p className="text-sm text-slate-500 dark:text-gray-400">No emergency contacts listed.</p>
                            <p className="text-xs text-gray-500 mt-1">Add trusted family/friends for SOS alerts.</p>
                        </div>
                    )}
                </div>

                {/* Add Form */}
                {isAdding && (
                    <div className="bg-white dark:bg-[#0f1f3a] border border-[#FF9933]/30 rounded-2xl p-4 shadow-xl">
                        <h3 className="text-sm font-bold text-[#FF9933] mb-3">Add New Contact</h3>
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#FF9933]"
                            />
                            <input
                                type="tel"
                                placeholder="Mobile Number (+91)"
                                value={newPhone}
                                onChange={e => setNewPhone(e.target.value)}
                                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:border-[#FF9933]"
                            />
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Relationship (e.g. Brother)"
                                    value={newRel}
                                    onChange={e => setNewRel(e.target.value)}
                                    className="flex-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#FF9933]"
                                />
                                <select
                                    value={newPriority}
                                    onChange={e => setNewPriority(Number(e.target.value) as 1 | 2)}
                                    className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#FF9933]"
                                >
                                    <option value={1} className="bg-white dark:bg-[#0f1f3a]">Pri 1</option>
                                    <option value={2} className="bg-white dark:bg-[#0f1f3a]">Pri 2</option>
                                </select>
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={() => setIsAdding(false)}
                                    className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-500 dark:text-gray-400 bg-black/5 dark:bg-white/5"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={!newName || !newPhone}
                                    className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-900 dark:text-white bg-gradient-to-r from-emerald-500 to-emerald-600 disabled:opacity-50"
                                >
                                    Save Contact
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      `}</style>
        </div>
    );
}
