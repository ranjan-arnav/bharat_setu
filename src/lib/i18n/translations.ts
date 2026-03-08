/**
 * UI Translations for all 22 scheduled languages of India.
 * Generated via Azure AI Translator (F0 free tier) + manual verification.
 * To regenerate: run `python scripts/generate-translations.py`
 */

export type LangCode =
  | 'hi' | 'en' | 'bn' | 'te' | 'mr' | 'ta' | 'gu' | 'kn'
  | 'ml' | 'pa' | 'or' | 'as' | 'ur' | 'ne' | 'mai' | 'kok'
  | 'mni' | 'doi' | 'sat' | 'brx' | 'ks' | 'sd';

export interface UIStrings {
  // ── Navigation ────────────────────────────────────────────────────────────
  navHome: string;
  navServices: string;
  navSOS: string;
  navTrack: string;
  navCommunity: string;

  // ── Drawer ────────────────────────────────────────────────────────────────
  allServices: string;
  aiAgents: string;
  smartTools: string;

  // ── Agent descriptions ────────────────────────────────────────────────────
  civicServices: string;
  healthAssistant: string;
  welfareSchemes: string;
  financeAdvisor: string;
  legalAid: string;

  // ── Smart tool descriptions ───────────────────────────────────────────────
  schemeDNAScanner: string;
  schemeScanDesc: string;
  bureaucracyXRay: string;
  trackApplications: string;
  civicKarma: string;
  yourImpactScore: string;

  // ── Common actions ────────────────────────────────────────────────────────
  back: string;
  close: string;
  newItem: string;
  cancel: string;
  submit: string;
  loading: string;

  // ── Track overlay ─────────────────────────────────────────────────────────
  myCasesTracking: string;
  activeCases: string;
  resolvedCases: string;
  totalCases: string;
  filterAll: string;
  filterCivic: string;
  filterSchemes: string;
  filterHealth: string;
  filterLegal: string;
  filterFinance: string;
  noCasesYet: string;
  fileGrievanceBtn: string;
  fileGrievancePrompt: string;

  // ── Grievance form ────────────────────────────────────────────────────────
  grievanceTitle: string;
  grievancePlaceholder: string;
  grievanceCategory: string;
  grievanceSubmit: string;
  grievanceAnalyzing: string;
  catWater: string;
  catRoad: string;
  catElectricity: string;
  catSanitation: string;
  catStreetlight: string;
  catOther: string;

  // ── Voice assistant ───────────────────────────────────────────────────────
  tapMicSpeak: string;
  listeningLabel: string;
  analysingLabel: string;
  trySaying: string;
  changeLang: string;
  liveTranscript: string;
  capturing: string;
  classifyingIntent: string;
  bestAgentForQuery: string;
  topicDetected: string;
  specialisesIn: string;
  autoConnecting: string;
  talkTo: string;
  whoCanHelp: string;
  chooseDifferent: string;
  reRecord: string;
  youSaid: string;

  // ── Chat input ────────────────────────────────────────────────────────────
  chatPlaceholder: string;

  // ── SOS overlay ───────────────────────────────────────────────────────────
  sosTitle: string;
  sosDesc: string;

  // ── Scam alert ────────────────────────────────────────────────────────────
  scamAlertTitle: string;
  talkAboutScams: string;

  // ── Impact / Community ────────────────────────────────────────────────────
  impactTitle: string;
  totalScore: string;
  schemesApplied: string;
  complaintsResolved: string;
  healthChecks: string;
  shareImpact: string;

  // ── DIGIPIN Locator ───────────────────────────────────────────────────────
  knowYourDigipin: string;
  indiaPostIsro: string;
  live: string;
  detectMyDigipin: string;
  lookupDigipin: string;
  yourDigipin: string;
  digipinLocation: string;
  sampleDigipins: string;
  copiedClipboard: string;
  detectingLocation: string;
  enterDigipin: string;
  viewOnMap: string;
  latitude: string;
  longitude: string;

  // ── NagarPulse ────────────────────────────────────────────────────────────
  yourNeighbourhood: string;
  zoneActivityMeter: string;
  activeComplaintsCount: string;
  poweredByDigipin: string;
  joinVoice: string;
  joinedLabel: string;
  voicesCount: string;
  viewMapLabel: string;
  fileReferenceLabel: string;

  // ── SchemeScanner ─────────────────────────────────────────────────────────
  scanningProfile: string;
  eligibleSchemes: string;
  requiredDocuments: string;
  applyNow: string;

  // ── AgentChat ─────────────────────────────────────────────────────────────
  clearChatHistory: string;
  clearBtn: string;
  tapToSwitch: string;
  stayWith: string;

  // ── GrievanceForm extras ──────────────────────────────────────────────────
  analyzingGrievance: string;
  isroDigipinLabel: string;
  safetyNote: string;

  // ── Onboarding extras ─────────────────────────────────────────────────────
  profileFetched: string;
  isroMapped: string;

  // ── Greetings ─────────────────────────────────────────────────────────────
  goodMorning: string;
  goodAfternoon: string;
  goodEvening: string;

  // ── Direction (for RTL languages like Urdu) ───────────────────────────────
  dir: 'ltr' | 'rtl';
}

// ─────────────────────────────────────────────────────────────────────────────
// TRANSLATIONS
// ─────────────────────────────────────────────────────────────────────────────

const hi: UIStrings = {
  navHome: 'होम', navServices: 'सेवाएं', navSOS: 'SOS', navTrack: 'ट्रैक', navCommunity: 'समुदाय',
  allServices: 'सभी सेवाएं', aiAgents: 'AI एजेंट (पंच परिषद)', smartTools: 'स्मार्ट टूल्स',
  civicServices: 'नागरिक सेवाएं', healthAssistant: 'स्वास्थ्य सहायक', welfareSchemes: 'कल्याण योजनाएं',
  financeAdvisor: 'वित्त सलाहकार', legalAid: 'कानूनी सहायता',
  schemeDNAScanner: 'योजना DNA स्कैनर', schemeScanDesc: 'योजनाएं स्कैन करें',
  bureaucracyXRay: 'नौकरशाही X-Ray', trackApplications: 'आवेदन ट्रैक करें',
  civicKarma: 'नागरिक कर्मा', yourImpactScore: 'आपका प्रभाव स्कोर',
  back: 'वापस', close: 'बंद करें', newItem: 'नया', cancel: 'रद्द', submit: 'जमा करें', loading: 'लोड हो रहा है…',
  myCasesTracking: 'मेरे मामले और ट्रैकिंग', activeCases: 'सक्रिय', resolvedCases: 'सुलझाए', totalCases: 'कुल',
  filterAll: 'सभी', filterCivic: 'नागरिक', filterSchemes: 'योजनाएं', filterHealth: 'स्वास्थ्य',
  filterLegal: 'कानूनी', filterFinance: 'वित्त',
  noCasesYet: 'अभी कोई मामला नहीं', fileGrievanceBtn: '+ शिकायत दर्ज करें',
  fileGrievancePrompt: 'शिकायत दर्ज करें या शुरू करने के लिए एजेंट से पूछें',
  grievanceTitle: 'शिकायत दर्ज करें', grievancePlaceholder: 'अपनी समस्या यहाँ लिखें…',
  grievanceCategory: 'श्रेणी चुनें', grievanceSubmit: 'शिकायत दर्ज करें', grievanceAnalyzing: 'AI विश्लेषण…',
  catWater: '💧 पानी आपूर्ति', catRoad: '🛣️ सड़क और बुनियादी ढांचा', catElectricity: '⚡ बिजली',
  catSanitation: '🧹 सफाई', catStreetlight: '🔦 स्ट्रीट लाइट', catOther: '📋 अन्य',
  tapMicSpeak: 'माइक दबाएं और बोलें', listeningLabel: 'सुन रहे हैं… बंद करें',
  analysingLabel: 'विश्लेषण हो रहा है…', trySaying: 'आप कह सकते हैं…', changeLang: 'बदलें',
  liveTranscript: 'लाइव ट्रांसक्रिप्ट', capturing: 'रिकॉर्ड हो रहा है…', classifyingIntent: 'विषय पहचाना जा रहा है…',
  bestAgentForQuery: 'आपके सवाल के लिए सर्वश्रेष्ठ', topicDetected: 'विषय पहचाना',
  specialisesIn: 'विशेषज्ञता', autoConnecting: 'जुड़ रहे हैं', talkTo: 'से बात करें',
  whoCanHelp: 'कौन मदद कर सकता है?', chooseDifferent: 'दूसरा चुनें', reRecord: 'फिर रिकॉर्ड करें',
  youSaid: 'आपने कहा',
  chatPlaceholder: 'हिंदी या English में टाइप करें…',
  sosTitle: 'आपातकाल SOS सक्रिय', sosDesc: 'DIGIPIN स्थान आपातकालीन सेवाओं से साझा किया गया।',
  scamAlertTitle: 'धोखाधड़ी चेतावनी सिस्टम', talkAboutScams: 'धोखाधड़ी के बारे में बात करें',
  impactTitle: 'नागरिक प्रभाव डैशबोर्ड',
  totalScore: 'कुल स्कोर', schemesApplied: 'योजनाओं में आवेदन', complaintsResolved: 'शिकायतें हल', healthChecks: 'स्वास्थ्य जाँच', shareImpact: 'शेयर करें',
  knowYourDigipin: 'अपना DIGIPIN जानें', indiaPostIsro: 'इंडिया पोस्ट · ISRO जियोकोडिंग तकनीक', live: 'लाइव',
  detectMyDigipin: '📍 मेरा DIGIPIN खोजें', lookupDigipin: '🔍 DIGIPIN खोजें',
  yourDigipin: 'आपका DIGIPIN', digipinLocation: 'DIGIPIN स्थान', sampleDigipins: 'नमूना DIGIPIN',
  copiedClipboard: 'कॉपी हो गया!', detectingLocation: 'आपका स्थान खोजा जा रहा है…',
  enterDigipin: 'DIGIPIN कोड दर्ज करें', viewOnMap: 'नक्शे पर देखें', latitude: 'अक्षांश', longitude: 'देशांतर',
  yourNeighbourhood: 'आपका मोहल्ला', zoneActivityMeter: 'जोन गतिविधि मीटर',
  activeComplaintsCount: 'सक्रिय शिकायतें', poweredByDigipin: 'DIGIPIN + नगरसंवाद द्वारा संचालित',
  joinVoice: 'आवाज़ उठाएं', joinedLabel: 'शामिल हो गए!', voicesCount: 'आवाज़ें',
  viewMapLabel: 'नक्शा देखें', fileReferenceLabel: 'फाइल संदर्भ',
  scanningProfile: 'आपकी प्रोफाइल स्कैन हो रही है', eligibleSchemes: 'पात्र योजनाएं मिलीं',
  requiredDocuments: 'आवश्यक दस्तावेज़', applyNow: 'अभी आवेदन करें',
  clearChatHistory: 'चैट इतिहास मिटाएं?', clearBtn: 'मिटाएं', tapToSwitch: 'बदलने के लिए टैप करें', stayWith: 'यहीं रहें',
  analyzingGrievance: 'आपकी शिकायत का विश्लेषण हो रहा है…',
  isroDigipinLabel: 'ISRO DIGIPIN स्थान', safetyNote: 'Azure Content Safety आपके डेटा की सुरक्षा करता है।',
  profileFetched: 'प्रोफाइल प्राप्त!', isroMapped: 'ISRO · मैप्ड',
  goodMorning: 'सुप्रभात', goodAfternoon: 'नमस्ते', goodEvening: 'शुभ संध्या',
  dir: 'ltr',
};

const en: UIStrings = {
  navHome: 'Home', navServices: 'Services', navSOS: 'SOS', navTrack: 'Track', navCommunity: 'Community',
  allServices: 'All Services', aiAgents: 'AI Agents (Council of Five)', smartTools: 'Smart Tools',
  civicServices: 'Civic Services', healthAssistant: 'Health Assistant', welfareSchemes: 'Welfare Schemes',
  financeAdvisor: 'Finance Advisor', legalAid: 'Legal Aid',
  schemeDNAScanner: 'Scheme DNA Scanner', schemeScanDesc: 'Scan & match schemes',
  bureaucracyXRay: 'Bureaucracy X-Ray', trackApplications: 'Track applications',
  civicKarma: 'Civic Karma', yourImpactScore: 'Your impact score',
  back: 'Back', close: 'Close', newItem: 'New', cancel: 'Cancel', submit: 'Submit', loading: 'Loading…',
  myCasesTracking: 'My Cases & Tracking', activeCases: 'Active', resolvedCases: 'Resolved', totalCases: 'Total',
  filterAll: 'All', filterCivic: 'Civic', filterSchemes: 'Schemes', filterHealth: 'Health',
  filterLegal: 'Legal', filterFinance: 'Finance',
  noCasesYet: 'No cases yet', fileGrievanceBtn: '+ File Grievance',
  fileGrievancePrompt: 'File a grievance or ask an agent to get started',
  grievanceTitle: 'File a Grievance', grievancePlaceholder: 'Describe your issue here…',
  grievanceCategory: 'Select category', grievanceSubmit: 'Submit Grievance', grievanceAnalyzing: 'AI Analysing…',
  catWater: '💧 Water Supply', catRoad: '🛣️ Road & Infrastructure', catElectricity: '⚡ Electricity',
  catSanitation: '🧹 Sanitation', catStreetlight: '🔦 Street Lighting', catOther: '📋 Other',
  tapMicSpeak: 'Tap mic and speak', listeningLabel: 'Listening… tap to stop',
  analysingLabel: 'Analysing your query…', trySaying: 'Try saying…', changeLang: 'change',
  liveTranscript: 'Live Transcript', capturing: 'Capturing…', classifyingIntent: 'Classifying intent…',
  bestAgentForQuery: 'Best agent for your query', topicDetected: 'Topic detected',
  specialisesIn: 'Specialises in', autoConnecting: 'Auto-connecting', talkTo: 'Talk to',
  whoCanHelp: 'Who can help you?', chooseDifferent: 'Choose different', reRecord: 'Re-record',
  youSaid: 'You said',
  chatPlaceholder: 'Type in English or Hindi…',
  sosTitle: 'Emergency SOS Active', sosDesc: 'Your DIGIPIN location has been shared with emergency services.',
  scamAlertTitle: 'AI Scam Shield Active', talkAboutScams: 'Talk to Arthik Salahkar about Scams',
  impactTitle: 'Citizen Impact Dashboard',
  totalScore: 'Total Score', schemesApplied: 'Schemes Applied', complaintsResolved: 'Complaints Resolved', healthChecks: 'Health Checks', shareImpact: 'Share',
  knowYourDigipin: 'Know Your DIGIPIN', indiaPostIsro: 'India Post · ISRO Geocoding Technology', live: 'LIVE',
  detectMyDigipin: '📍 Detect My DIGIPIN', lookupDigipin: '🔍 Lookup DIGIPIN',
  yourDigipin: 'Your DIGIPIN', digipinLocation: 'DIGIPIN Location', sampleDigipins: 'Sample DIGIPINs',
  copiedClipboard: 'Copied!', detectingLocation: 'Detecting your location…',
  enterDigipin: 'Enter DIGIPIN code', viewOnMap: 'View on Map', latitude: 'Latitude', longitude: 'Longitude',
  yourNeighbourhood: 'Your Neighbourhood', zoneActivityMeter: 'Zone Activity Meter',
  activeComplaintsCount: 'active complaints', poweredByDigipin: 'Powered by DIGIPIN + NagarSamwad',
  joinVoice: 'Join Voice', joinedLabel: 'Joined!', voicesCount: 'voices',
  viewMapLabel: 'View Map', fileReferenceLabel: 'File Reference',
  scanningProfile: 'Scanning Your Profile', eligibleSchemes: 'Eligible Schemes Found',
  requiredDocuments: 'Required Documents', applyNow: 'Apply Now',
  clearChatHistory: 'Clear chat history?', clearBtn: 'Clear', tapToSwitch: 'Tap to switch', stayWith: 'Stay with',
  analyzingGrievance: 'analyzing your grievance…',
  isroDigipinLabel: 'ISRO DIGIPIN Location', safetyNote: 'Azure Content Safety protects your data.',
  profileFetched: 'Profile Fetched!', isroMapped: 'ISRO · Mapped',
  goodMorning: 'Good Morning', goodAfternoon: 'Good Afternoon', goodEvening: 'Good Evening',
  dir: 'ltr',
};

const bn: UIStrings = {
  navHome: 'হোম', navServices: 'সেবাসমূহ', navSOS: 'SOS', navTrack: 'ট্র্যাক', navCommunity: 'সম্প্রদায়',
  allServices: 'সব সেবাসমূহ', aiAgents: 'AI এজেন্ট (পঞ্চ পরিষদ)', smartTools: 'স্মার্ট টুলস',
  civicServices: 'নাগরিক সেবা', healthAssistant: 'স্বাস্থ্য সহায়তাকারী', welfareSchemes: 'কল্যাণমূলক প্রকল্প',
  financeAdvisor: 'আর্থিক উপদেষ্টা', legalAid: 'আইনি সহায়তা',
  schemeDNAScanner: 'প্রকল্প DNA স্ক্যানার', schemeScanDesc: 'প্রকল্প স্ক্যান করুন',
  bureaucracyXRay: 'আমলাতন্ত্র X-Ray', trackApplications: 'আবেদন ট্র্যাক করুন',
  civicKarma: 'নাগরিক কর্ম', yourImpactScore: 'আপনার প্রভাব স্কোর',
  back: 'পেছনে', close: 'বন্ধ করুন', newItem: 'নতুন', cancel: 'বাতিল', submit: 'জমা দিন', loading: 'লোড হচ্ছে…',
  myCasesTracking: 'আমার মামলা ও ট্র্যাকিং', activeCases: 'সক্রিয়', resolvedCases: 'সমাধান হয়েছে', totalCases: 'মোট',
  filterAll: 'সব', filterCivic: 'নাগরিক', filterSchemes: 'প্রকল্প', filterHealth: 'স্বাস্থ্য',
  filterLegal: 'আইনি', filterFinance: 'অর্থ',
  noCasesYet: 'এখনো কোনো মামলা নেই', fileGrievanceBtn: '+ অভিযোগ দায়ের করুন',
  fileGrievancePrompt: 'অভিযোগ দায়ের করুন বা শুরু করতে এজেন্টকে জিজ্ঞেস করুন',
  grievanceTitle: 'অভিযোগ দায়ের করুন', grievancePlaceholder: 'আপনার সমস্যা এখানে লিখুন…',
  grievanceCategory: 'বিভাগ নির্বাচন করুন', grievanceSubmit: 'অভিযোগ জমা দিন', grievanceAnalyzing: 'AI বিশ্লেষণ…',
  catWater: '💧 পানি সরবরাহ', catRoad: '🛣️ সড়ক ও অবকাঠামো', catElectricity: '⚡ বিদ্যুৎ',
  catSanitation: '🧹 পরিচ্ছন্নতা', catStreetlight: '🔦 রাস্তার আলো', catOther: '📋 অন্যান্য',
  tapMicSpeak: 'মাইকে চাপুন ও বলুন', listeningLabel: 'শুনছি… থামাতে চাপুন',
  analysingLabel: 'বিশ্লেষণ হচ্ছে…', trySaying: 'বলে দেখুন…', changeLang: 'পরিবর্তন',
  liveTranscript: 'লাইভ ট্রান্সক্রিপ্ট', capturing: 'রেকর্ড হচ্ছে…', classifyingIntent: 'বিষয় শনাক্ত হচ্ছে…',
  bestAgentForQuery: 'আপনার প্রশ্নের জন্য সেরা এজেন্ট', topicDetected: 'বিষয় শনাক্ত হয়েছে',
  specialisesIn: 'বিশেষজ্ঞতা', autoConnecting: 'সংযোগ হচ্ছে', talkTo: 'কথা বলুন',
  whoCanHelp: 'কে সাহায্য করতে পারবেন?', chooseDifferent: 'অন্যটি বেছে নিন', reRecord: 'আবার রেকর্ড করুন',
  youSaid: 'আপনি বললেন',
  chatPlaceholder: 'বাংলা বা English-এ টাইপ করুন…',
  sosTitle: 'জরুরি SOS সক্রিয়', sosDesc: 'আপনার DIGIPIN অবস্থান জরুরি সেবায় শেয়ার করা হয়েছে।',
  scamAlertTitle: 'AI প্রতারণা সুরক্ষা সক্রিয়', talkAboutScams: 'প্রতারণা সম্পর্কে কথা বলুন',
  impactTitle: 'নাগরিক প্রভাব ড্যাশবোর্ড',
  totalScore: 'মোট স্কোর', schemesApplied: 'প্রকল্পে আবেদন', complaintsResolved: 'অভিযোগ সমাধান', healthChecks: 'স্বাস্থ্য পরীক্ষা', shareImpact: 'শেয়ার করুন',
  knowYourDigipin: 'আপনার DIGIPIN জানুন', indiaPostIsro: 'ইন্ডিয়া পোস্ট · ISRO জিওকোডিং প্রযুক্তি', live: 'লাইভ',
  detectMyDigipin: '📍 আমার DIGIPIN খুঁজুন', lookupDigipin: '🔍 DIGIPIN খুঁজুন',
  yourDigipin: 'আপনার DIGIPIN', digipinLocation: 'DIGIPIN অবস্থান', sampleDigipins: 'নমুনা DIGIPIN',
  copiedClipboard: 'কপি হয়েছে!', detectingLocation: 'আপনার অবস্থান খুঁজছি…',
  enterDigipin: 'DIGIPIN কোড লিখুন', viewOnMap: 'ম্যাপে দেখুন', latitude: 'অক্ষাংশ', longitude: 'দ্রাঘিমাংশ',
  yourNeighbourhood: 'আপনার পাড়া', zoneActivityMeter: 'জোন কর্মকাণ্ড মিটার',
  activeComplaintsCount: 'সক্রিয় অভিযোগ', poweredByDigipin: 'DIGIPIN + নগরসংবাদ দ্বারা পরিচালিত',
  joinVoice: 'আওয়াজ তুলুন', joinedLabel: 'যুক্ত হয়েছে!', voicesCount: 'কণ্ঠস্বর',
  viewMapLabel: 'ম্যাপ দেখুন', fileReferenceLabel: 'ফাইল রেফারেন্স',
  scanningProfile: 'আপনার প্রোফাইল স্ক্যান হচ্ছে', eligibleSchemes: 'যোগ্য প্রকল্প পাওয়া গেছে',
  requiredDocuments: 'প্রয়োজনীয় নথিপত্র', applyNow: 'এখনই আবেদন করুন',
  clearChatHistory: 'চ্যাট ইতিহাস মুছে ফেলুন?', clearBtn: 'মুছুন', tapToSwitch: 'পরিবর্তন করতে ট্যাপ করুন', stayWith: 'এখানেই থাকুন',
  analyzingGrievance: 'আপনার অভিযোগ বিশ্লেষণ হচ্ছে…',
  isroDigipinLabel: 'ISRO DIGIPIN অবস্থান', safetyNote: 'Azure Content Safety আপনার তথ্য সুরক্ষিত করে।',
  profileFetched: 'প্রোফাইল পাওয়া গেছে!', isroMapped: 'ISRO · ম্যাপড',
  goodMorning: 'শুভ সকাল', goodAfternoon: 'শুভ দুপুর', goodEvening: 'শুভ সন্ধ্যা',
  dir: 'ltr',
};

const te: UIStrings = {
  navHome: 'హోమ్', navServices: 'సేవలు', navSOS: 'SOS', navTrack: 'ట్రాక్', navCommunity: 'సమాజం',
  allServices: 'అన్ని సేవలు', aiAgents: 'AI ఏజెంట్లు (పంచ పరిషత్)', smartTools: 'స్మార్ట్ టూల్స్',
  civicServices: 'పౌర సేవలు', healthAssistant: 'ఆరోగ్య సహాయకుడు', welfareSchemes: 'సంక్షేమ పథకాలు',
  financeAdvisor: 'ఆర్థిక సలహాదారు', legalAid: 'న్యాయ సహాయం',
  schemeDNAScanner: 'పథకం DNA స్కానర్', schemeScanDesc: 'పథకాలను స్కాన్ చేయండి',
  bureaucracyXRay: 'అధికారశాహి X-Ray', trackApplications: 'దరఖాస్తులు ట్రాక్ చేయండి',
  civicKarma: 'పౌర కర్మ', yourImpactScore: 'మీ ప్రభావ స్కోర్',
  back: 'వెనక్కి', close: 'మూసివేయి', newItem: 'కొత్తది', cancel: 'రద్దు', submit: 'సమర్పించు', loading: 'లోడవుతోంది…',
  myCasesTracking: 'నా కేసులు & ట్రాకింగ్', activeCases: 'చురుకుగా', resolvedCases: 'పరిష్కరించబడింది', totalCases: 'మొత్తం',
  filterAll: 'అన్నీ', filterCivic: 'పౌర', filterSchemes: 'పథకాలు', filterHealth: 'ఆరోగ్యం',
  filterLegal: 'న్యాయ', filterFinance: 'ఆర్థిక',
  noCasesYet: 'ఇంకా కేసులు లేవు', fileGrievanceBtn: '+ ఫిర్యాదు దాఖలు చేయండి',
  fileGrievancePrompt: 'ఫిర్యాదు చేయండి లేదా ఏజెంట్‌ను అడగండి',
  grievanceTitle: 'ఫిర్యాదు దాఖలు చేయండి', grievancePlaceholder: 'మీ సమస్యను ఇక్కడ లిఖించండి…',
  grievanceCategory: 'వర్గాన్ని ఎంచుకోండి', grievanceSubmit: 'ఫిర్యాదు సమర్పించు', grievanceAnalyzing: 'AI విశ్లేషణ…',
  catWater: '💧 నీటి సరఫరా', catRoad: '🛣️ రహదారి & మౌలికసదుపాయాలు', catElectricity: '⚡ విద్యుత్',
  catSanitation: '🧹 పారిశుద్ధ్యం', catStreetlight: '🔦 వీధిలైట్లు', catOther: '📋 ఇతర',
  tapMicSpeak: 'మైక్ నొక్కి మాట్లాడండి', listeningLabel: 'వింటున్నాం… ఆపడానికి నొక్కండి',
  analysingLabel: 'విశ్లేషిస్తున్నాం…', trySaying: 'ఇలా చెప్పండి…', changeLang: 'మార్చు',
  liveTranscript: 'లైవ్ ట్రాన్స్‌క్రిప్ట్', capturing: 'రికార్డవుతోంది…', classifyingIntent: 'విషయం గుర్తిస్తున్నాం…',
  bestAgentForQuery: 'మీ ప్రశ్నకు అత్యుత్తమ ఏజెంట్', topicDetected: 'విషయం గుర్తించబడింది',
  specialisesIn: 'ప్రత్యేకత', autoConnecting: 'కనెక్ట్ అవుతోంది', talkTo: 'తో మాట్లాడండి',
  whoCanHelp: 'ఎవరు సహాయం చేయగలరు?', chooseDifferent: 'వేరొకటి ఎంచుకోండి', reRecord: 'మళ్ళీ రికార్డ్ చేయండి',
  youSaid: 'మీరు అన్నారు',
  chatPlaceholder: 'తెలుగు లేదా English లో టైప్ చేయండి…',
  sosTitle: 'అత్యవసర SOS చురుకుగా ఉంది', sosDesc: 'మీ DIGIPIN స్థానం అత్యవసర సేవలతో పంచుకోబడింది.',
  scamAlertTitle: 'AI మోసం రక్షణ చురుకుగా ఉంది', talkAboutScams: 'మోసాల గురించి మాట్లాడండి',
  impactTitle: 'పౌర ప్రభావ డ్యాష్‌బోర్డ్',
  totalScore: 'మొత్తం స్కోర్', schemesApplied: 'పథకాలకు దరఖాస్తు', complaintsResolved: 'ఫిర్యాదులు పరిష్కారం', healthChecks: 'ఆరోగ్య పరీక్షలు', shareImpact: 'షేర్ చేయండి',
  knowYourDigipin: 'మీ DIGIPIN తెలుసుకోండి', indiaPostIsro: 'ఇండియా పోస్ట్ · ISRO జియోకోడింగ్ టెక్నాలజీ', live: 'లైవ్',
  detectMyDigipin: '📍 నా DIGIPIN గుర్తించండి', lookupDigipin: '🔍 DIGIPIN వెతకండి',
  yourDigipin: 'మీ DIGIPIN', digipinLocation: 'DIGIPIN స్థానం', sampleDigipins: 'నమూనా DIGIPIN',
  copiedClipboard: 'కాపీ అయింది!', detectingLocation: 'మీ స్థానాన్ని గుర్తిస్తున్నాం…',
  enterDigipin: 'DIGIPIN కోడ్ నమోదు చేయండి', viewOnMap: 'మ్యాప్‌లో చూడండి', latitude: 'అక్షాంశం', longitude: 'రేఖాంశం',
  yourNeighbourhood: 'మీ ప్రాంతం', zoneActivityMeter: 'జోన్ కార్యకలాప మీటర్',
  activeComplaintsCount: 'సక్రియ ఫిర్యాదులు', poweredByDigipin: 'DIGIPIN + నగరసంవాద్ ద్వారా',
  joinVoice: 'గళం కలపండి', joinedLabel: 'చేరారు!', voicesCount: 'గళాలు',
  viewMapLabel: 'మ్యాప్ చూడండి', fileReferenceLabel: 'ఫైల్ రెఫరెన్స్',
  scanningProfile: 'మీ ప్రొఫైల్ స్క్యాన్ అవుతోంది', eligibleSchemes: 'అర్హత పథకాలు దొరికాయి',
  requiredDocuments: 'అవసరమైన పత్రాలు', applyNow: 'ఇప్పుడే దరఖాస్తు చేయండి',
  clearChatHistory: 'చాట్ చరిత్ర తొలగించాలా?', clearBtn: 'తొలగించు', tapToSwitch: 'మార్చడానికి ట్యాప్ చేయండి', stayWith: 'ఇక్కడే ఉండండి',
  analyzingGrievance: 'మీ ఫిర్యాదు విశ్లేషిస్తున్నాం…',
  isroDigipinLabel: 'ISRO DIGIPIN స్థానం', safetyNote: 'Azure Content Safety మీ డేటాను రక్షిస్తుంది.',
  profileFetched: 'ప్రొఫైల్ లభించింది!', isroMapped: 'ISRO · మ్యాప్‌డ్',
  goodMorning: 'శుభోదయం', goodAfternoon: 'శుభ మధ్యాహ్నం', goodEvening: 'శుభ సాయంత్రం',
  dir: 'ltr',
};

const mr: UIStrings = {
  navHome: 'मुख्यपृष्ठ', navServices: 'सेवा', navSOS: 'SOS', navTrack: 'ट्रॅक', navCommunity: 'समुदाय',
  allServices: 'सर्व सेवा', aiAgents: 'AI एजंट (पंच परिषद)', smartTools: 'स्मार्ट टूल्स',
  civicServices: 'नागरी सेवा', healthAssistant: 'आरोग्य सहाय्यक', welfareSchemes: 'कल्याण योजना',
  financeAdvisor: 'आर्थिक सल्लागार', legalAid: 'कायदेशीर मदत',
  schemeDNAScanner: 'योजना DNA स्कॅनर', schemeScanDesc: 'योजना स्कॅन करा',
  bureaucracyXRay: 'नोकरशाही X-Ray', trackApplications: 'अर्ज ट्रॅक करा',
  civicKarma: 'नागरी कर्म', yourImpactScore: 'तुमचा प्रभाव स्कोर',
  back: 'मागे', close: 'बंद करा', newItem: 'नवीन', cancel: 'रद्द करा', submit: 'सबमिट करा', loading: 'लोड होत आहे…',
  myCasesTracking: 'माझे प्रकरण आणि ट्रॅकिंग', activeCases: 'सक्रिय', resolvedCases: 'सोडवले', totalCases: 'एकूण',
  filterAll: 'सर्व', filterCivic: 'नागरी', filterSchemes: 'योजना', filterHealth: 'आरोग्य',
  filterLegal: 'कायदेशीर', filterFinance: 'वित्त',
  noCasesYet: 'अजून कोणतेही प्रकरण नाही', fileGrievanceBtn: '+ तक्रार दाखल करा',
  fileGrievancePrompt: 'तक्रार दाखल करा किंवा एजंटला विचारा',
  grievanceTitle: 'तक्रार दाखल करा', grievancePlaceholder: 'तुमची समस्या येथे लिहा…',
  grievanceCategory: 'श्रेणी निवडा', grievanceSubmit: 'तक्रार सबमिट करा', grievanceAnalyzing: 'AI विश्लेषण…',
  catWater: '💧 पाणी पुरवठा', catRoad: '🛣️ रस्ते व पायाभूत सुविधा', catElectricity: '⚡ वीज',
  catSanitation: '🧹 स्वच्छता', catStreetlight: '🔦 रस्त्यावरील दिवे', catOther: '📋 इतर',
  tapMicSpeak: 'मायक दाबा आणि बोला', listeningLabel: 'ऐकत आहोत… थांबवण्यासाठी दाबा',
  analysingLabel: 'विश्लेषण होत आहे…', trySaying: 'असे सांगा…', changeLang: 'बदला',
  liveTranscript: 'थेट ट्रान्सक्रिप्ट', capturing: 'रेकॉर्ड होत आहे…', classifyingIntent: 'विषय ओळखला जात आहे…',
  bestAgentForQuery: 'तुमच्या प्रश्नासाठी सर्वोत्तम', topicDetected: 'विषय ओळखला',
  specialisesIn: 'विशेषज्ञता', autoConnecting: 'जोडत आहोत', talkTo: 'शी बोला',
  whoCanHelp: 'कोण मदत करू शकते?', chooseDifferent: 'दुसरा निवडा', reRecord: 'पुन्हा रेकॉर्ड करा',
  youSaid: 'तुम्ही म्हणालात',
  chatPlaceholder: 'मराठी किंवा English मध्ये टाइप करा…',
  sosTitle: 'आपत्कालीन SOS सक्रिय', sosDesc: 'तुमचे DIGIPIN स्थान आपत्कालीन सेवांसोबत शेअर केले.',
  scamAlertTitle: 'AI घोटाळा संरक्षण सक्रिय', talkAboutScams: 'घोटाळ्याबद्दल बोला',
  impactTitle: 'नागरिक प्रभाव डॅशबोर्ड',
  totalScore: 'एकूण स्कोर', schemesApplied: 'योजनांमध्ये अर्ज', complaintsResolved: 'तक्रारी सोडवल्या', healthChecks: 'आरोग्य तपासणी', shareImpact: 'शेअर करा',
  knowYourDigipin: 'तुमचे DIGIPIN जाणून घ्या', indiaPostIsro: 'इंडिया पोस्ट · ISRO जिओकोडिंग तंत्रज्ञान', live: 'लाइव्ह',
  detectMyDigipin: '📍 माझे DIGIPIN शोधा', lookupDigipin: '🔍 DIGIPIN शोधा',
  yourDigipin: 'तुमचे DIGIPIN', digipinLocation: 'DIGIPIN स्थान', sampleDigipins: 'नमुना DIGIPIN',
  copiedClipboard: 'कॉपी झाले!', detectingLocation: 'तुमचे स्थान शोधत आहोत…',
  enterDigipin: 'DIGIPIN कोड टाका', viewOnMap: 'नकाशावर पहा', latitude: 'अक्षांश', longitude: 'रेखांश',
  yourNeighbourhood: 'तुमचा परिसर', zoneActivityMeter: 'झोन कार्यकलाप मीटर',
  activeComplaintsCount: 'सक्रिय तक्रारी', poweredByDigipin: 'DIGIPIN + नगरसंवाद द्वारा',
  joinVoice: 'आवाज उठवा', joinedLabel: 'सामील झाला!', voicesCount: 'आवाज',
  viewMapLabel: 'नकाशा पहा', fileReferenceLabel: 'फाइल संदर्भ',
  scanningProfile: 'तुमची प्रोफाइल स्कॅन होत आहे', eligibleSchemes: 'पात्र योजना सापडल्या',
  requiredDocuments: 'आवश्यक कागदपत्रे', applyNow: 'आत्ता अर्ज करा',
  clearChatHistory: 'चॅट इतिहास मिटवायचा?', clearBtn: 'मिटवा', tapToSwitch: 'बदलण्यासाठी टॅप करा', stayWith: 'येथेच राहा',
  analyzingGrievance: 'तुमच्या तक्रारीचे विश्लेषण होत आहे…',
  isroDigipinLabel: 'ISRO DIGIPIN स्थान', safetyNote: 'Azure Content Safety तुमच्या डेटाचे संरक्षण करतो.',
  profileFetched: 'प्रोफाइल मिळाली!', isroMapped: 'ISRO · मॅप्ड',
  goodMorning: 'शुभ सकाळ', goodAfternoon: 'नमस्कार', goodEvening: 'शुभ संध्याकाळ',
  dir: 'ltr',
};

const ta: UIStrings = {
  navHome: 'முகப்பு', navServices: 'சேவைகள்', navSOS: 'SOS', navTrack: 'கண்காணி', navCommunity: 'சமூகம்',
  allServices: 'அனைத்து சேவைகளும்', aiAgents: 'AI முகவர்கள் (பஞ்ச பரிஷத்)', smartTools: 'ஸ்மார்ட் கருவிகள்',
  civicServices: 'குடிமை சேவைகள்', healthAssistant: 'சுகாதார உதவியாளர்', welfareSchemes: 'நலத் திட்டங்கள்',
  financeAdvisor: 'நிதி ஆலோசகர்', legalAid: 'சட்ட உதவி',
  schemeDNAScanner: 'திட்டம் DNA ஸ்கேனர்', schemeScanDesc: 'திட்டங்களை ஸ்கேன் செய்யுங்கள்',
  bureaucracyXRay: 'அதிகாரவர்க்க X-Ray', trackApplications: 'விண்ணப்பங்களை கண்காணி',
  civicKarma: 'குடிமை கர்மா', yourImpactScore: 'உங்கள் தாக்க மதிப்பெண்',
  back: 'பின்செல்', close: 'மூடு', newItem: 'புதியது', cancel: 'ரத்து', submit: 'சமர்ப்பி', loading: 'ஏற்றுகிறது…',
  myCasesTracking: 'என் வழக்குகள் & கண்காணிப்பு', activeCases: 'செயலில்', resolvedCases: 'தீர்க்கப்பட்டது', totalCases: 'மொத்தம்',
  filterAll: 'அனைத்தும்', filterCivic: 'குடிமை', filterSchemes: 'திட்டங்கள்', filterHealth: 'சுகாதாரம்',
  filterLegal: 'சட்டம்', filterFinance: 'நிதி',
  noCasesYet: 'இன்னும் வழக்குகள் இல்லை', fileGrievanceBtn: '+ புகார் தாக்கல் செய்',
  fileGrievancePrompt: 'புகார் தாக்கல் செய்யுங்கள் அல்லது முகவரிடம் கேளுங்கள்',
  grievanceTitle: 'புகார் தாக்கல் செய்யுங்கள்', grievancePlaceholder: 'உங்கள் பிரச்சினையை இங்கே எழுதுங்கள்…',
  grievanceCategory: 'வகையை தேர்ந்தெடுங்கள்', grievanceSubmit: 'புகார் சமர்ப்பி', grievanceAnalyzing: 'AI பகுப்பாய்வு…',
  catWater: '💧 நீர் வழங்கல்', catRoad: '🛣️ சாலை & உள்கட்டமைப்பு', catElectricity: '⚡ மின்சாரம்',
  catSanitation: '🧹 சுகாதாரம்', catStreetlight: '🔦 தெரு விளக்கு', catOther: '📋 மற்றவை',
  tapMicSpeak: 'மைக்கை தொட்டு பேசுங்கள்', listeningLabel: 'கேட்கிறோம்… நிறுத்த தொடுங்கள்',
  analysingLabel: 'பகுப்பாய்வு செய்கிறோம்…', trySaying: 'இப்படி சொல்லுங்கள்…', changeLang: 'மாற்று',
  liveTranscript: 'நேரடி டிரான்ஸ்கிரிப்ட்', capturing: 'பதிவு ஆகிறது…', classifyingIntent: 'விஷயம் கண்டுபிடிக்கிறோம்…',
  bestAgentForQuery: 'உங்கள் கேள்விக்கு சிறந்த முகவர்', topicDetected: 'விஷயம் கண்டறியப்பட்டது',
  specialisesIn: 'நிபுணத்துவம்', autoConnecting: 'இணைக்கிறோம்', talkTo: 'உடன் பேசுங்கள்',
  whoCanHelp: 'யார் உதவ முடியும்?', chooseDifferent: 'வேற ஒன்றை தேர்ந்தெடு', reRecord: 'மீண்டும் பதிவு',
  youSaid: 'நீங்கள் சொன்னது',
  chatPlaceholder: 'தமிழ் அல்லது English-ல் தட்டச்சு செய்யுங்கள்…',
  sosTitle: 'அவசர SOS செயலில் உள்ளது', sosDesc: 'உங்கள் DIGIPIN இருப்பிடம் அவசர சேவைகளுடன் பகிரப்பட்டது.',
  scamAlertTitle: 'AI மோசடி பாதுகாப்பு செயலில்', talkAboutScams: 'மோசடிகளைப் பற்றி பேசுங்கள்',
  impactTitle: 'குடிமை தாக்க டாஷ்போர்டு',
  totalScore: 'மொத்த மதிப்பெண்', schemesApplied: 'திட்டங்களில் விண்ணப்பம்', complaintsResolved: 'புகார்கள் தீர்க்கப்பட்டது', healthChecks: 'சுகாதார பரிசோதனை', shareImpact: 'பகிரு',
  knowYourDigipin: 'உங்கள் DIGIPIN தெரியுங்கள்', indiaPostIsro: 'இந்தியா போஸ்ட் · ISRO ஜியோகோடிங் தொழில்நுட்பம்', live: 'நேரடி',
  detectMyDigipin: '📍 என் DIGIPIN கண்டறியுங்கள்', lookupDigipin: '🔍 DIGIPIN தேடுங்கள்',
  yourDigipin: 'உங்கள் DIGIPIN', digipinLocation: 'DIGIPIN இடம்', sampleDigipins: 'மாதிரி DIGIPIN',
  copiedClipboard: 'நகலெடுத்தப்பட்டது!', detectingLocation: 'உங்கள் இடம் கண்டறியப்படுகிறது…',
  enterDigipin: 'DIGIPIN கோடை உள்ளிடுங்கள்', viewOnMap: 'வரைபடத்தில் பார்க்கவும்', latitude: 'அட்சகோடு', longitude: 'நெடுங்கோடு',
  yourNeighbourhood: 'உங்கள் பகுதி', zoneActivityMeter: 'மண்டல செயல்பாடு மீட்டர்',
  activeComplaintsCount: 'செயலிலுள்ள புகார்கள்', poweredByDigipin: 'DIGIPIN + நகரசம்வாத் மூலம்',
  joinVoice: 'குரல் கொடுங்கள்', joinedLabel: 'சேர்ந்தீர்கள்!', voicesCount: 'குரல்கள்',
  viewMapLabel: 'வரைபடம் பார்க்கவும்', fileReferenceLabel: 'கோப்பு குறிப்பு',
  scanningProfile: 'உங்கள் ப்ரொபைல் ஸ்கான் ஆகிறது', eligibleSchemes: 'தகுதியுள்ள திட்டங்கள் கண்டறியப்பட்டன',
  requiredDocuments: 'தேவையான ஆவணங்கள்', applyNow: 'இப்போதே விண்ணப்பிக்கவும்',
  clearChatHistory: 'சாட் வரலாறு அழிக்கவா?', clearBtn: 'அழிக்கவும்', tapToSwitch: 'மாற்ற தொடுங்கள்', stayWith: 'இங்கே தங்குங்கள்',
  analyzingGrievance: 'உங்கள் புகார் பகுப்பாய்வு செய்யப்படுகிறது…',
  isroDigipinLabel: 'ISRO DIGIPIN இடம்', safetyNote: 'Azure Content Safety உங்கள் தரவுகளை பாதுகாக்கிறது.',
  profileFetched: 'ப்ரொபைல் பெறப்பட்டது!', isroMapped: 'ISRO · மாப்பட்',
  goodMorning: 'காலை வணக்கம்', goodAfternoon: 'மதிய வணக்கம்', goodEvening: 'மாலை வணக்கம்',
  dir: 'ltr',
};

const gu: UIStrings = {
  navHome: 'ઘર', navServices: 'સેવાઓ', navSOS: 'SOS', navTrack: 'ટ્રૅક', navCommunity: 'સમુદાય',
  allServices: 'તમામ સેવાઓ', aiAgents: 'AI એજન્ટ (પંચ પરિષદ)', smartTools: 'સ્માર્ટ ટૂલ્સ',
  civicServices: 'નાગરિક સેવાઓ', healthAssistant: 'આરોગ્ય સહાયક', welfareSchemes: 'કલ્યાણ યોજનાઓ',
  financeAdvisor: 'નાણાકીય સલાહકાર', legalAid: 'કાનૂની સહાય',
  schemeDNAScanner: 'યોજના DNA સ્કેનર', schemeScanDesc: 'યોજનાઓ સ્કેન કરો',
  bureaucracyXRay: 'અમલદારશાહી X-Ray', trackApplications: 'અરજી ટ્રૅક કરો',
  civicKarma: 'નાગરિક કર્મ', yourImpactScore: 'તમારો પ્રભાવ સ્કોર',
  back: 'પાછળ', close: 'બંધ કરો', newItem: 'નવો', cancel: 'રદ', submit: 'સબમિટ', loading: 'લોડ થઈ રહ્યું છે…',
  myCasesTracking: 'મારા કેસ અને ટ્રૅકિંગ', activeCases: 'સક્રિય', resolvedCases: 'ઉકેલ થઈ ગયો', totalCases: 'કુલ',
  filterAll: 'બધા', filterCivic: 'નાગરિક', filterSchemes: 'યોજનાઓ', filterHealth: 'આરોગ્ય',
  filterLegal: 'કાનૂની', filterFinance: 'નાણાં',
  noCasesYet: 'હજી કોઈ કેસ નથી', fileGrievanceBtn: '+ ફરિયાદ નોંધો',
  fileGrievancePrompt: 'ફરિયાદ નોંધો અથવા એજન્ટને પૂછો',
  grievanceTitle: 'ફરિયાદ નોંધો', grievancePlaceholder: 'તમારી સમસ્યા અહીં લખો…',
  grievanceCategory: 'શ્રેણી પસંદ કરો', grievanceSubmit: 'ફરિયાદ સબમિટ', grievanceAnalyzing: 'AI વિશ્લેષણ…',
  catWater: '💧 પાણी પુરવઠો', catRoad: '🛣️ રોડ અને ઈન્ફ્રાસ્ટ્રક્ચર', catElectricity: '⚡ વીજળી',
  catSanitation: '🧹 સ્વચ્છતા', catStreetlight: '🔦 સ્ટ્રીટ લાઇટ', catOther: '📋 અન્ય',
  tapMicSpeak: 'માઇક દાબો અને બોલો', listeningLabel: 'સાંભળી રહ્યા છીએ… રોકવા દાબો',
  analysingLabel: 'વિશ્લેષણ થઈ રહ્યું છે…', trySaying: 'આ કહો…', changeLang: 'બદલો',
  liveTranscript: 'લાઇવ ટ્રાન્સક્રિપ્ટ', capturing: 'રેકોર્ડ થઈ રહ્યું…', classifyingIntent: 'વિષય ઓળખાઈ રહ્યો…',
  bestAgentForQuery: 'તમારા સવાલ માટે શ્રેષ્ઠ', topicDetected: 'વિષય ઓળખ્યો',
  specialisesIn: 'વિશેષજ્ઞતા', autoConnecting: 'કનેક્ટ થઈ રહ્યા', talkTo: 'સાથે વાત કરો',
  whoCanHelp: 'કોણ મદદ કરી શકે?', chooseDifferent: 'બીજો પસંદ કરો', reRecord: 'ફરી રેકોર્ડ',
  youSaid: 'તમે કહ્યું',
  chatPlaceholder: 'ગુજરાતી અથવા English માં ટાઇપ કરો…',
  sosTitle: 'ઇમર્જન્સી SOS સક્રિય', sosDesc: 'તમારું DIGIPIN સ્થાન ઈમર્જન્સી સેવાઓ સાથે શૅર કર્યું.',
  scamAlertTitle: 'AI ઠગ સુરક્ષા સક્રિય', talkAboutScams: 'ઠગ વિશે વાત કરો',
  impactTitle: 'નાગરિક અસર ડૅશબૉર્ડ',
  totalScore: 'કુલ સ્કોર', schemesApplied: 'યોજનામાં અરજી', complaintsResolved: 'ફરિયાદો ઉકેલ', healthChecks: 'આરોગ્ય તપાસ', shareImpact: 'શેયર કરો',
  knowYourDigipin: 'તમારું DIGIPIN જાણો', indiaPostIsro: 'ઇંડિયા પોસ્ટ · ISRO જિઓકોડિંગ તકનીક', live: 'લાઇવ',
  detectMyDigipin: '📍 મારું DIGIPIN શોધો', lookupDigipin: '🔍 DIGIPIN શોધો',
  yourDigipin: 'તમારું DIGIPIN', digipinLocation: 'DIGIPIN સ્થાન', sampleDigipins: 'નમૂના DIGIPIN',
  copiedClipboard: 'કોપી થયું!', detectingLocation: 'તમારું સ્થાન શોધાઈ રહ્યું છે…',
  enterDigipin: 'DIGIPIN કોડ દાખલ કરો', viewOnMap: 'નકશા પર જુઓ', latitude: 'અક્ષાંશ', longitude: 'રેખાંશ',
  yourNeighbourhood: 'તમારું પડોશ', zoneActivityMeter: 'ઝોન ગતિવિધિ મીટર',
  activeComplaintsCount: 'સક્રિય ફરિયાદો', poweredByDigipin: 'DIGIPIN + નગરસંવાદ દ્વારા',
  joinVoice: 'અવાજ ઉટાવો', joinedLabel: 'જોડાયા!', voicesCount: 'અવાજો',
  viewMapLabel: 'નકશો જુઓ', fileReferenceLabel: 'ફાઇલ સંદર્ભ',
  scanningProfile: 'તમારી પ્રોફાઇલ સ્કેન થઈ રહી છે', eligibleSchemes: 'પાત્ર યોજનાઓ મળી',
  requiredDocuments: 'જરૂરી દસ્તાવેજો', applyNow: 'અત્યારે અરજી કરો',
  clearChatHistory: 'ચૅટ ઇતિહાસ કાઢવું?', clearBtn: 'કાઢો', tapToSwitch: 'બદલવા માટે ટેપ કરો', stayWith: 'અહીં રહો',
  analyzingGrievance: 'તમારી ફરિયાદનું વિશ્લેષણ થઈ રહ્યું છે…',
  isroDigipinLabel: 'ISRO DIGIPIN સ્થાન', safetyNote: 'Azure Content Safety તમારા ડેટાની સુરક્ષા કરે છે.',
  profileFetched: 'પ્રોફાઇલ મળી!', isroMapped: 'ISRO · મૅપ્ડ',
  goodMorning: 'શુભ સવાર', goodAfternoon: 'નમસ્તે', goodEvening: 'શુભ સાંજ',
  dir: 'ltr',
};

const kn: UIStrings = {
  navHome: 'ಮನೆ', navServices: 'ಸೇವೆಗಳು', navSOS: 'SOS', navTrack: 'ಟ್ರ್ಯಾಕ್', navCommunity: 'ಸಮಾಜ',
  allServices: 'ಎಲ್ಲಾ ಸೇವೆಗಳು', aiAgents: 'AI ಏಜೆಂಟ್‌ಗಳು (ಪಂಚ ಪರಿಷತ್)', smartTools: 'ಸ್ಮಾರ್ಟ್ ಟೂಲ್ಸ್',
  civicServices: 'ನಾಗರಿಕ ಸೇವೆಗಳು', healthAssistant: 'ಆರೋಗ್ಯ ಸಹಾಯಕ', welfareSchemes: 'ಕಲ್ಯಾಣ ಯೋಜನೆಗಳು',
  financeAdvisor: 'ಆರ್ಥಿಕ ಸಲಹೆಗಾರ', legalAid: 'ಕಾನೂನು ಸಹಾಯ',
  schemeDNAScanner: 'ಯೋಜನೆ DNA ಸ್ಕ್ಯಾನರ್', schemeScanDesc: 'ಯೋಜನೆಗಳನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ',
  bureaucracyXRay: 'ಅಧಿಕಾರಶಾಹಿ X-Ray', trackApplications: 'ಅರ್ಜಿಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ',
  civicKarma: 'ನಾಗರಿಕ ಕರ್ಮ', yourImpactScore: 'ನಿಮ್ಮ ಪ್ರಭಾವ ಅಂಕ',
  back: 'ಹಿಂದೆ', close: 'ಮುಚ್ಚು', newItem: 'ಹೊಸದು', cancel: 'ರದ್ದು', submit: 'ಸಲ್ಲಿಸು', loading: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ…',
  myCasesTracking: 'ನನ್ನ ಪ್ರಕರಣಗಳು ಮತ್ತು ಟ್ರ್ಯಾಕಿಂಗ್', activeCases: 'ಸಕ್ರಿಯ', resolvedCases: 'ಪರಿಹರಿಸಿದ', totalCases: 'ಒಟ್ಟು',
  filterAll: 'ಎಲ್ಲಾ', filterCivic: 'ನಾಗರಿಕ', filterSchemes: 'ಯೋಜನೆಗಳು', filterHealth: 'ಆರೋಗ್ಯ',
  filterLegal: 'ಕಾನೂನು', filterFinance: 'ಆರ್ಥಿಕ',
  noCasesYet: 'ಇನ್ನೂ ಯಾವುದೇ ಪ್ರಕರಣಗಳಿಲ್ಲ', fileGrievanceBtn: '+ ದೂರು ದಾಖಲಿಸಿ',
  fileGrievancePrompt: 'ದೂರು ದಾಖಲಿಸಿ ಅಥವಾ ಏಜೆಂಟ್ ಅನ್ನು ಕೇಳಿ',
  grievanceTitle: 'ದೂರು ದಾಖಲಿಸಿ', grievancePlaceholder: 'ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ…',
  grievanceCategory: 'ವರ್ಗ ಆಯ್ಕೆ', grievanceSubmit: 'ದೂರು ಸಲ್ಲಿಸಿ', grievanceAnalyzing: 'AI ವಿಶ್ಲೇಷಣೆ…',
  catWater: '💧 ನೀರು ಸರಬರಾಜು', catRoad: '🛣️ ರಸ್ತೆ ಮತ್ತು ಮೂಲ ಸೌಕರ್ಯ', catElectricity: '⚡ ವಿದ್ಯುತ್',
  catSanitation: '🧹 ಸ್ವಚ್ಛತೆ', catStreetlight: '🔦 ರಸ್ತೆ ದೀಪ', catOther: '📋 ಇತರ',
  tapMicSpeak: 'ಮೈಕ್ ಒತ್ತಿ ಮಾತನಾಡಿ', listeningLabel: 'ಕೇಳುತ್ತಿದ್ದೇವೆ… ನಿಲ್ಲಿಸಲು ಒತ್ತಿ',
  analysingLabel: 'ವಿಶ್ಲೇಷಿಸುತ್ತಿದ್ದೇವೆ…', trySaying: 'ಹೀಗೆ ಹೇಳಿ…', changeLang: 'ಬದಲಾಯಿಸಿ',
  liveTranscript: 'ಲೈವ್ ಟ್ರಾನ್‌ಸ್ಕ್ರಿಪ್ಟ್', capturing: 'ರೆಕಾರ್ಡ್ ಆಗುತ್ತಿದೆ…', classifyingIntent: 'ವಿಷಯ ಗುರುತಿಸಲಾಗುತ್ತಿದೆ…',
  bestAgentForQuery: 'ನಿಮ್ಮ ಪ್ರಶ್ನೆಗೆ ಅತ್ಯುತ್ತಮ', topicDetected: 'ವಿಷಯ ಗುರುತಿಸಲಾಗಿದೆ',
  specialisesIn: 'ವಿಶೇಷಜ್ಞತೆ', autoConnecting: 'ಸಂಪರ್ಕ ಆಗುತ್ತಿದೆ', talkTo: 'ಜೊತೆ ಮಾತನಾಡಿ',
  whoCanHelp: 'ಯಾರು ಸಹಾಯ ಮಾಡಬಹುದು?', chooseDifferent: 'ಬೇರೊಂದನ್ನು ಆಯ್ಕೆಮಾಡಿ', reRecord: 'ಮತ್ತೆ ರೆಕಾರ್ಡ್',
  youSaid: 'ನೀವು ಹೇಳಿದ್ದು',
  chatPlaceholder: 'ಕನ್ನಡ ಅಥವಾ English ನಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ…',
  sosTitle: 'ತುರ್ತು SOS ಸಕ್ರಿಯ', sosDesc: 'ನಿಮ್ಮ DIGIPIN ಸ್ಥಳ ತುರ್ತು ಸೇವೆಗಳೊಂದಿಗೆ ಹಂಚಿಕೊಳ್ಳಲಾಗಿದೆ.',
  scamAlertTitle: 'AI ವಂಚನೆ ರಕ್ಷಣೆ ಸಕ್ರಿಯ', talkAboutScams: 'ವಂಚನೆ ಬಗ್ಗೆ ಮಾತನಾಡಿ',
  impactTitle: 'ನಾಗರಿಕ ಪ್ರಭಾವ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
  totalScore: 'ಒಟ್ಟು ಅಂಕ', schemesApplied: 'ಯೋಜನೆಗಳಲ್ಲಿ ಅರ್ಜಿ', complaintsResolved: 'ದೂರುಗಳು ಪರಿಹರಿಸಲಾಗಿದೆ', healthChecks: 'ಆರೋಗ್ಯ ಪರೀಕ್ಷೆ', shareImpact: 'ಹಂಚಿಕೊಳ್ಳಿ',
  knowYourDigipin: 'ನಿಮ್ಮ DIGIPIN ತಿಳಿಯಿರಿ', indiaPostIsro: 'ಇಂಡಿಯಾ ಪೋಸ್ಟ್ · ISRO ಜಿಯೋಕೋಡಿಂಗ್ ತಂತ್ರಜ್ಞಾನ', live: 'ಲೈವ್',
  detectMyDigipin: '📍 ನನ್ನ DIGIPIN ಗುರುತಿಸಿ', lookupDigipin: '🔍 DIGIPIN ಹುಡುಕಿ',
  yourDigipin: 'ನಿಮ್ಮ DIGIPIN', digipinLocation: 'DIGIPIN ಸ್ಥಳ', sampleDigipins: 'ಮಾದರಿ DIGIPIN',
  copiedClipboard: 'ನಕಲಿಸಲಾಗಿದೆ!', detectingLocation: 'ನಿಮ್ಮ ಸ್ಥಳವನ್ನು ಗುರುತಿಸಲಾಗುತ್ತಿದೆ…',
  enterDigipin: 'DIGIPIN ಕೋಡ್ ನಮೂದಿಸಿ', viewOnMap: 'ನಕ್ಷೆಯಲ್ಲಿ ನೋಡಿ', latitude: 'ಅಕ್ಷಾಂಶ', longitude: 'ರೇಖಾಂಶ',
  yourNeighbourhood: 'ನಿಮ್ಮ ನೆರೆಹೊರೆ', zoneActivityMeter: 'ವಲಯ ಚಟುವಟಿಕೆ ಮೀಟರ್',
  activeComplaintsCount: 'ಸಕ್ರಿಯ ದೂರುಗಳು', poweredByDigipin: 'DIGIPIN + ನಗರಸಂವಾದ್ ಮೂಲಕ',
  joinVoice: 'ಧ್ವನಿ ಸೇರಿಸಿ', joinedLabel: 'ಸೇರಿದ್ದೀರಿ!', voicesCount: 'ಧ್ವನಿಗಳು',
  viewMapLabel: 'ನಕ್ಷೆ ನೋಡಿ', fileReferenceLabel: 'ಫೈಲ್ ಉಲ್ಲೇಖ',
  scanningProfile: 'ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಸ್ಕ್ಯಾನ್ ಆಗುತ್ತಿದೆ', eligibleSchemes: 'ಅರ್ಹ ಯೋಜನೆಗಳು ಸಿಕ್ಕವು',
  requiredDocuments: 'ಅಗತ್ಯ ದಾಖಲೆಗಳು', applyNow: 'ಈಗ ಅರ್ಜಿ ಮಾಡಿ',
  clearChatHistory: 'ಚಾಟ್ ಇತಿಹಾಸ ಅಳಿಸುವುದೇ?', clearBtn: 'ಅಳಿಸಿ', tapToSwitch: 'ಬದಲಾಯಿಸಲು ಟ್ಯಾಪ್ ಮಾಡಿ', stayWith: 'ಇಲ್ಲೇ ಇರಿ',
  analyzingGrievance: 'ನಿಮ್ಮ ದೂರು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ…',
  isroDigipinLabel: 'ISRO DIGIPIN ಸ್ಥಳ', safetyNote: 'Azure Content Safety ನಿಮ್ಮ ಡೇಟಾವನ್ನು ರಕ್ಷಿಸುತ್ತದೆ.',
  profileFetched: 'ಪ್ರೊಫೈಲ್ ಸಿಕ್ಕಿದೆ!', isroMapped: 'ISRO · ಮ್ಯಾಪ್ಡ್',
  goodMorning: 'ಶುಭೋದಯ', goodAfternoon: 'ನಮಸ್ಕಾರ', goodEvening: 'ಶುಭ ಸಂಜೆ',
  dir: 'ltr',
};

const ml: UIStrings = {
  navHome: 'ഹോം', navServices: 'സേവനങ്ങൾ', navSOS: 'SOS', navTrack: 'ട്രാക്ക്', navCommunity: 'കമ്മ്യൂണിറ്റി',
  allServices: 'എല്ലാ സേവനങ്ങളും', aiAgents: 'AI ഏജന്റുകൾ (പഞ്ച പരിഷദ്)', smartTools: 'സ്മാർട്ട് ടൂൾസ്',
  civicServices: 'നാഗരിക സേവനങ്ങൾ', healthAssistant: 'ആരോഗ്യ സഹായി', welfareSchemes: 'ക്ഷേമ പദ്ധതികൾ',
  financeAdvisor: 'സാമ്പത്തിക ഉപദേഷ്ടാവ്', legalAid: 'നിയമ സഹായം',
  schemeDNAScanner: 'പദ്ധതി DNA സ്കാനർ', schemeScanDesc: 'പദ്ധതികൾ സ്കാൻ ചെയ്യൂ',
  bureaucracyXRay: 'ഉദ്യോഗസ്ഥ X-Ray', trackApplications: 'അപേക്ഷകൾ ട്രാക്ക് ചെയ്യൂ',
  civicKarma: 'നാഗരിക കർമം', yourImpactScore: 'നിങ്ങളുടെ ഇംപാക്ട് സ്കോർ',
  back: 'പിന്നോട്ട്', close: 'അടയ്ക്കുക', newItem: 'പുതിയത്', cancel: 'റദ്ദ്', submit: 'സമർപ്പിക്കുക', loading: 'ലോഡ് ആകുന്നു…',
  myCasesTracking: 'എന്റെ കേസുകളും ട്രാക്കിങ്ങും', activeCases: 'സജീവം', resolvedCases: 'പരിഹരിച്ചു', totalCases: 'ആകെ',
  filterAll: 'എല്ലാം', filterCivic: 'നാഗരിക', filterSchemes: 'പദ്ധതികൾ', filterHealth: 'ആരോഗ്യം',
  filterLegal: 'നിയമം', filterFinance: 'സാമ്പത്തികം',
  noCasesYet: 'ഇതുവരെ കേസുകൾ ഇല്ല', fileGrievanceBtn: '+ പരാതി ഫയൽ ചെയ്യൂ',
  fileGrievancePrompt: 'പരാതി ഫയൽ ചെയ്യൂ അല്ലെങ്കിൽ ഏജന്റിനോട് ചോദിക്കൂ',
  grievanceTitle: 'പരാതി ഫയൽ ചെയ്യൂ', grievancePlaceholder: 'നിങ്ങളുടെ പ്രശ്നം ഇവിടെ എഴുതൂ…',
  grievanceCategory: 'വിഭാഗം തിരഞ്ഞെടുക്കൂ', grievanceSubmit: 'പരാതി സമർപ്പിക്കൂ', grievanceAnalyzing: 'AI വിശകലനം…',
  catWater: '💧 ജലവിതരണം', catRoad: '🛣️ റോഡും അടിസ്ഥാന സൌകര്യവും', catElectricity: '⚡ വൈദ്യുതി',
  catSanitation: '🧹 ശുചിത്വം', catStreetlight: '🔦 തെരുവ് വിളക്ക്', catOther: '📋 മറ്റുള്ളവ',
  tapMicSpeak: 'മൈക്ക് അമർത്തി സംസാരിക്കൂ', listeningLabel: 'കേൾക്കുന്നു… നിർത്താൻ അമർത്തൂ',
  analysingLabel: 'വിശകലനം ചെയ്യുന്നു…', trySaying: 'ഇങ്ങനെ പറഞ്ഞ് നോക്കൂ…', changeLang: 'മാറ്റുക',
  liveTranscript: 'ലൈവ് ട്രാൻസ്ക്രിപ്റ്റ്', capturing: 'റെക്കോർഡ് ആകുന്നു…', classifyingIntent: 'വിഷയം തിരിച്ചറിയുന്നു…',
  bestAgentForQuery: 'നിങ്ങളുടെ ചോദ്യത്തിന് ഏറ്റവും അനുയോജ്യം', topicDetected: 'വിഷയം തിരിച്ചറിഞ്ഞു',
  specialisesIn: 'വൈദഗ്ധ്യം', autoConnecting: 'ബന്ധിക്കുന്നു', talkTo: 'സംസാരിക്കൂ',
  whoCanHelp: 'ആർക്ക് സഹായിക്കാൻ കഴിയും?', chooseDifferent: 'മറ്റൊന്ന് തിരഞ്ഞെടുക്കൂ', reRecord: 'വീണ്ടും റെക്കോർഡ്',
  youSaid: 'നിങ്ങൾ പറഞ്ഞത്',
  chatPlaceholder: 'മലയാളം അല്ലെങ്കിൽ English-ൽ ടൈപ്പ് ചെയ്യൂ…',
  sosTitle: 'അടിയന്തര SOS സജീവം', sosDesc: 'നിങ്ങളുടെ DIGIPIN സ്ഥാനം അടിയന്തര സേവനങ്ങളുമായി പങ്കിട്ടു.',
  scamAlertTitle: 'AI തട്ടിപ്പ് സംരക്ഷണം സജീവം', talkAboutScams: 'തട്ടിപ്പിനെ കുറിച്ച് സംസാരിക്കൂ',
  impactTitle: 'നാഗരിക ഇംപാക്ട് ഡാഷ്ബോർഡ്',
  totalScore: 'മൊത്തം സ്‌കോർ', schemesApplied: 'പദ്ധതികളിൽ അപേക്ഷ', complaintsResolved: 'പരാതികള്‍ പരിഹരിച്ചു', healthChecks: 'ആരോഗ്യ പരിശോധന', shareImpact: 'പംകിടൂ',
  knowYourDigipin: 'നിങ്ങളുടെ DIGIPIN അറിയൂ', indiaPostIsro: 'ഇന്ത്യാ പോസ്റ്റ് · ISRO ജിയോകോഡിംഗ് താർക്കിക', live: 'ലൈവ്',
  detectMyDigipin: '📍 എന്റെ DIGIPIN കണ്ടെത്തൂ', lookupDigipin: '🔍 DIGIPIN തിരയൂ',
  yourDigipin: 'നിങ്ങളുടെ DIGIPIN', digipinLocation: 'DIGIPIN സ്ഥാനം', sampleDigipins: 'മാതൃകാ DIGIPIN',
  copiedClipboard: 'കോപ്പി ചെയ്തു!', detectingLocation: 'നിങ്ങളുടെ സ്ഥാനം കണ്ടെത്തുന്നു…',
  enterDigipin: 'DIGIPIN കോഡ് നൽകൂ', viewOnMap: 'മാപ്പിൽ കാണൂ', latitude: 'അക്ഷാംശം', longitude: 'രേഖാംശം',
  yourNeighbourhood: 'നിങ്ങളുടെ പ്രദേശം', zoneActivityMeter: 'സോൺ പ്രവർത്തന മീറ്റർ',
  activeComplaintsCount: 'സജീവ പരാതികൾ', poweredByDigipin: 'DIGIPIN + നഗരസംവാദ് മൂലം',
  joinVoice: 'കൂടേ ചേരൂ', joinedLabel: 'ചേർന്നു!', voicesCount: 'കണ്ഠങ്ങൾ',
  viewMapLabel: 'മാപ്പ് കാണൂ', fileReferenceLabel: 'ഫയൽ റെഫറന്‍സ്',
  scanningProfile: 'നിങ്ങളുടെ പ്രൊഫൈൽ സ്‌ക്യാൻ ആകുന്നു', eligibleSchemes: 'അർഹ പദ്ധതികൾ കണ്ടെത്തി',
  requiredDocuments: 'ആവശ്യമായ രേഖകൾ', applyNow: 'ഇപ്പോൾ അപേക്ഷിക്കൂ',
  clearChatHistory: 'ചാട്ട് ചരിത്രം മായ്‌ക്കലാണോ?', clearBtn: 'മായ്‌ക്കൂ', tapToSwitch: 'മാറാൻ ടാപ്പ് ചെയ്യൂ', stayWith: 'ഇവിടെ തുടരൂ',
  analyzingGrievance: 'നിങ്ങളുടെ പരാതി വിശകലനം ചെയ്യുന്നു…',
  isroDigipinLabel: 'ISRO DIGIPIN സ്ഥാനം', safetyNote: 'Azure Content Safety നിങ്ങളുടെ ഡേറ്റ സംരക്ഷിക്കുന്നു.',
  profileFetched: 'പ്രൊഫൈൽ ലഭിച്ചു!', isroMapped: 'ISRO · മാപ്പ്ഡ്',
  goodMorning: 'ശുഭ പ്രഭാതം', goodAfternoon: 'നമസ്‌കാരം', goodEvening: 'ശുഭ സന്ധ്യ',
  dir: 'ltr',
};

const pa: UIStrings = {
  navHome: 'ਘਰ', navServices: 'ਸੇਵਾਵਾਂ', navSOS: 'SOS', navTrack: 'ਟ੍ਰੈਕ', navCommunity: 'ਭਾਈਚਾਰਾ',
  allServices: 'ਸਾਰੀਆਂ ਸੇਵਾਵਾਂ', aiAgents: 'AI ਏਜੰਟ (ਪੰਚ ਪਰਿਸ਼ਦ)', smartTools: 'ਸਮਾਰਟ ਟੂਲਜ਼',
  civicServices: 'ਨਾਗਰਿਕ ਸੇਵਾਵਾਂ', healthAssistant: 'ਸਿਹਤ ਸਹਾਇਕ', welfareSchemes: 'ਭਲਾਈ ਯੋਜਨਾਵਾਂ',
  financeAdvisor: 'ਵਿੱਤੀ ਸਲਾਹਕਾਰ', legalAid: 'ਕਾਨੂੰਨੀ ਸਹਾਇਤਾ',
  schemeDNAScanner: 'ਯੋਜਨਾ DNA ਸਕੈਨਰ', schemeScanDesc: 'ਯੋਜਨਾਵਾਂ ਸਕੈਨ ਕਰੋ',
  bureaucracyXRay: 'ਅਫਸਰਸ਼ਾਹੀ X-Ray', trackApplications: 'ਅਰਜ਼ੀਆਂ ਟ੍ਰੈਕ ਕਰੋ',
  civicKarma: 'ਨਾਗਰਿਕ ਕਰਮ', yourImpactScore: 'ਤੁਹਾਡਾ ਪ੍ਰਭਾਵ ਸਕੋਰ',
  back: 'ਵਾਪਸ', close: 'ਬੰਦ ਕਰੋ', newItem: 'ਨਵਾਂ', cancel: 'ਰੱਦ', submit: 'ਜਮ੍ਹਾਂ ਕਰੋ', loading: 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ…',
  myCasesTracking: 'ਮੇਰੇ ਕੇਸ ਅਤੇ ਟ੍ਰੈਕਿੰਗ', activeCases: 'ਸਰਗਰਮ', resolvedCases: 'ਹੱਲ ਹੋਏ', totalCases: 'ਕੁੱਲ',
  filterAll: 'ਸਾਰੇ', filterCivic: 'ਨਾਗਰਿਕ', filterSchemes: 'ਯੋਜਨਾਵਾਂ', filterHealth: 'ਸਿਹਤ',
  filterLegal: 'ਕਾਨੂੰਨੀ', filterFinance: 'ਵਿੱਤ',
  noCasesYet: 'ਅਜੇ ਕੋਈ ਕੇਸ ਨਹੀਂ', fileGrievanceBtn: '+ ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰੋ',
  fileGrievancePrompt: 'ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰੋ ਜਾਂ ਏਜੰਟ ਤੋਂ ਪੁੱਛੋ',
  grievanceTitle: 'ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰੋ', grievancePlaceholder: 'ਆਪਣੀ ਸਮੱਸਿਆ ਇੱਥੇ ਲਿਖੋ…',
  grievanceCategory: 'ਸ਼੍ਰੇਣੀ ਚੁਣੋ', grievanceSubmit: 'ਸ਼ਿਕਾਇਤ ਜਮ੍ਹਾਂ ਕਰੋ', grievanceAnalyzing: 'AI ਵਿਸ਼ਲੇਸ਼ਣ…',
  catWater: '💧 ਪਾਣੀ ਦੀ ਸਪਲਾਈ', catRoad: '🛣️ ਸੜਕ ਅਤੇ ਬੁਨਿਆਦੀ ਢਾਂਚਾ', catElectricity: '⚡ ਬਿਜਲੀ',
  catSanitation: '🧹 ਸਫਾਈ', catStreetlight: '🔦 ਗਲੀ ਦੀ ਲਾਈਟ', catOther: '📋 ਹੋਰ',
  tapMicSpeak: 'ਮਾਇਕ ਦਬਾਓ ਅਤੇ ਬੋਲੋ', listeningLabel: 'ਸੁਣ ਰਹੇ ਹਾਂ… ਰੋਕਣ ਲਈ ਦਬਾਓ',
  analysingLabel: 'ਵਿਸ਼ਲੇਸ਼ਣ ਹੋ ਰਿਹਾ ਹੈ…', trySaying: 'ਇਹ ਕਹੋ…', changeLang: 'ਬਦਲੋ',
  liveTranscript: 'ਲਾਈਵ ਟ੍ਰਾਂਸਕ੍ਰਿਪਟ', capturing: 'ਰਿਕਾਰਡ ਹੋ ਰਿਹਾ…', classifyingIntent: 'ਵਿਸ਼ਾ ਪਛਾਣਿਆ ਜਾ ਰਿਹਾ…',
  bestAgentForQuery: 'ਤੁਹਾਡੇ ਸਵਾਲ ਲਈ ਸਭ ਤੋਂ ਵਧੀਆ', topicDetected: 'ਵਿਸ਼ਾ ਪਛਾਣਿਆ',
  specialisesIn: 'ਮਾਹਿਰਤਾ', autoConnecting: 'ਕਨੈਕਟ ਹੋ ਰਹੇ', talkTo: 'ਨਾਲ ਗੱਲ ਕਰੋ',
  whoCanHelp: 'ਕੌਣ ਮਦਦ ਕਰ ਸਕਦਾ ਹੈ?', chooseDifferent: 'ਹੋਰ ਚੁਣੋ', reRecord: 'ਦੁਬਾਰਾ ਰਿਕਾਰਡ',
  youSaid: 'ਤੁਸੀਂ ਕਿਹਾ',
  chatPlaceholder: 'ਪੰਜਾਬੀ ਜਾਂ English ਵਿੱਚ ਟਾਈਪ ਕਰੋ…',
  sosTitle: 'ਐਮਰਜੈਂਸੀ SOS ਸਰਗਰਮ', sosDesc: 'ਤੁਹਾਡਾ DIGIPIN ਟਿਕਾਣਾ ਐਮਰਜੈਂਸੀ ਸੇਵਾਵਾਂ ਨਾਲ ਸਾਂਝਾ ਕੀਤਾ।',
  scamAlertTitle: 'AI ਧੋਖਾ ਸੁਰੱਖਿਆ ਸਰਗਰਮ', talkAboutScams: 'ਧੋਖੇ ਬਾਰੇ ਗੱਲ ਕਰੋ',
  impactTitle: 'ਨਾਗਰਿਕ ਪ੍ਰਭਾਵ ਡੈਸ਼ਬੋਰਡ',
  totalScore: 'ਕੁੱਲ ਸਕੋਰ', schemesApplied: 'ਯੋਜਨਾਵਾਂ ਵਿੱਚ ਅਰਜ਼ੀ', complaintsResolved: 'ਸ਼ਿਕਾਇਤਾਂ ਹੱਲ', healthChecks: 'ਸਿਹਤ ਜਾਂਚ', shareImpact: 'ਸਾਂਝਾ ਕਰੋ',
  knowYourDigipin: 'ਆਪਣਾ DIGIPIN ਜਾਣੋ', indiaPostIsro: 'ਇੰਡਿਆ ਪੋਸਟ · ISRO ਜਿਓਕੋਡਿੰਗ ਤਕਨੀਕ', live: 'ਲਾਇਵ',
  detectMyDigipin: '📍 ਮੇਰਾ DIGIPIN ਲੱਭੋ', lookupDigipin: '🔍 DIGIPIN ਲੱਭੋ',
  yourDigipin: 'ਤੁਹਾਡਾ DIGIPIN', digipinLocation: 'DIGIPIN ਟਿਕਾਣਾ', sampleDigipins: 'ਨਮੂਨਾ DIGIPIN',
  copiedClipboard: 'ਕਾਪੀ ਹੋ ਗਈ!', detectingLocation: 'ਤੁਹਾਡਾ ਟਿਕਾਣਾ ਲੱਭਿਆ ਜਾ ਰਿਹਾ ਹੈ…',
  enterDigipin: 'DIGIPIN ਕੋਡ ਦਰਜ ਕਰੋ', viewOnMap: 'ਨਕਸ਼ੇ ਉੱਤੇ ਦੇਖੋ', latitude: 'ਅਕਸ਼ਾਂਸ਼', longitude: 'ਦੇਸ਼ਾਂਤਰ',
  yourNeighbourhood: 'ਤੁਹਾਡਾ ਇਲਾਕਾ', zoneActivityMeter: 'ਜ਼ੋਨ ਗਤਿਵਿਧੀ ਮੀਟਰ',
  activeComplaintsCount: 'ਸਰਗਰਮ ਸ਼ਿਕਾਇਤਾਂ', poweredByDigipin: 'DIGIPIN + ਨਗਰਸੰਵਾਦ ਦੁਆਰਾ',
  joinVoice: 'ਆਵਾਜ਼ ਉਠਾਓ', joinedLabel: 'ਸ਼ਾਮਿਲ ਹੋ ਗਏ!', voicesCount: 'ਆਵਾਜ਼ਾਂ',
  viewMapLabel: 'ਨਕਸ਼ਾ ਦੇਖੋ', fileReferenceLabel: 'ਫਾਇਲ ਹਵਾਲਾ',
  scanningProfile: 'ਤੁਹਾਡੀ ਪ੍ਰੋਫਾਇਲ ਸਕੈਨ ਹੋ ਰਹੀ ਹੈ', eligibleSchemes: 'ਯੋਗ ਯੋਜਨਾਵਾਂ ਮਿਲੀਆਂ',
  requiredDocuments: 'ਲੋੜੀਂਦੇ ਦਸਤਾਵੇਜ਼', applyNow: 'ਹੁਣੇ ਅਰਜ਼ੀ ਕਰੋ',
  clearChatHistory: 'ਚੈਟ ਇਤਿਹਾਸ ਮਿਟਾਉਣਾ?', clearBtn: 'ਮਿਟਾਓ', tapToSwitch: 'ਬਦਲਣ ਲਈ ਟੈਪ ਕਰੋ', stayWith: 'ਇੱਥੇ ਰਹੋ',
  analyzingGrievance: 'ਤੁਹਾਡੀ ਸ਼ਿਕਾਇਤ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਹੋ ਰਿਹਾ ਹੈ…',
  isroDigipinLabel: 'ISRO DIGIPIN ਟਿਕਾਣਾ', safetyNote: 'Azure Content Safety ਤੁਹਾਡੇ ਡੇਟਾ ਦੀ ਸੁਰੱਖਿਆ ਕਰਦਾ ਹੈ।',
  profileFetched: 'ਪ੍ਰੋਫਾਇਲ ਮਿਲੀ!', isroMapped: 'ISRO · ਮੈਪਡ',
  goodMorning: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ', goodAfternoon: 'ਨਮਸਕਾਰ', goodEvening: 'ਸ਼ੁਭ ਸ਼ਾਮ',
  dir: 'ltr',
};

const or_lang: UIStrings = {
  navHome: 'ମୁଖ୍ୟ', navServices: 'ସେବା', navSOS: 'SOS', navTrack: 'ଟ୍ରାକ', navCommunity: 'ସମ୍ପ୍ରଦାୟ',
  allServices: 'ସମସ୍ତ ସେବା', aiAgents: 'AI ଏଜେଣ୍ଟ (ପଞ୍ଚ ପରିଷଦ)', smartTools: 'ସ୍ମାର୍ଟ ଟୁଲ୍ସ',
  civicServices: 'ନାଗରିକ ସେବା', healthAssistant: 'ସ୍ୱାସ୍ଥ୍ୟ ସହାୟକ', welfareSchemes: 'କଲ୍ୟାଣ ଯୋଜନା',
  financeAdvisor: 'ଆର୍ଥିକ ପରାମର୍ଶଦାତା', legalAid: 'ଆଇନ ସହାୟତା',
  schemeDNAScanner: 'ଯୋଜନା DNA ସ୍କାନର', schemeScanDesc: 'ଯୋଜନା ସ୍କାନ କରନ୍ତୁ',
  bureaucracyXRay: 'ଅଫିସ X-Ray', trackApplications: 'ଆବେଦନ ଟ୍ରାକ କରନ୍ତୁ',
  civicKarma: 'ନାଗରିକ କର୍ମ', yourImpactScore: 'ଆପଣଙ୍କ ପ୍ରଭାବ ସ୍କୋର',
  back: 'ଫେରନ୍ତୁ', close: 'ବନ୍ଦ କରନ୍ତୁ', newItem: 'ନୂଆ', cancel: 'ବାତିଲ', submit: 'ଦାଖଲ', loading: 'ଲୋଡ ହେଉଛି…',
  myCasesTracking: 'ମୋ ମାମଲା ଓ ଟ୍ରାକିଂ', activeCases: 'ସକ୍ରିୟ', resolvedCases: 'ସମାଧାନ ହୋଇଛି', totalCases: 'ମୋଟ',
  filterAll: 'ସବୁ', filterCivic: 'ନାଗରିକ', filterSchemes: 'ଯୋଜନା', filterHealth: 'ସ୍ୱାସ୍ଥ୍ୟ',
  filterLegal: 'ଆଇନ', filterFinance: 'ଆର୍ଥିକ',
  noCasesYet: 'ଏ ଯାଏ କୌଣସି ମାମଲା ନାହିଁ', fileGrievanceBtn: '+ ଅଭିଯୋଗ ଦାଏର',
  fileGrievancePrompt: 'ଅଭିଯୋଗ ଦାଏର କରନ୍ତୁ ବା ଏଜେଣ୍ଟଙ୍କୁ ପଚାରନ୍ତୁ',
  grievanceTitle: 'ଅଭିଯୋଗ ଦାଏର', grievancePlaceholder: 'ଆପଣଙ୍କ ସମସ୍ୟା ଏଠି ଲେଖନ୍ତୁ…',
  grievanceCategory: 'ବର୍ଗ ବାଛନ୍ତୁ', grievanceSubmit: 'ଅଭିଯୋଗ ଦାଖଲ', grievanceAnalyzing: 'AI ବିଶ୍ଲେଷଣ…',
  catWater: '💧 ଜଳ ଯୋଗାଣ', catRoad: '🛣️ ରାସ୍ତା ଓ ଭିତ୍ତିଭୂମି', catElectricity: '⚡ ବିଦ୍ୟୁତ',
  catSanitation: '🧹 ସ୍ୱଚ୍ଛତା', catStreetlight: '🔦 ରାସ୍ତା ଆଲୋକ', catOther: '📋 ଅନ୍ୟ',
  tapMicSpeak: 'ମାଇକ ଦବାଇ କୁହନ୍ତୁ', listeningLabel: 'ଶୁଣୁଛୁ… ଅଟକାଇବାକୁ ଦବାନ୍ତୁ',
  analysingLabel: 'ବିଶ୍ଲେଷଣ ହେଉଛି…', trySaying: 'କୁହନ୍ତୁ…', changeLang: 'ବଦଳନ୍ତୁ',
  liveTranscript: 'ଲାଇଭ ଟ୍ରାନ୍ସକ୍ରିପ୍ଟ', capturing: 'ରେକର୍ଡ ହେଉଛି…', classifyingIntent: 'ବିଷୟ ଚିହ୍ନଟ ହେଉଛି…',
  bestAgentForQuery: 'ଆପଣଙ୍କ ପ୍ରଶ୍ନ ପାଇଁ ସର୍ବୋତ୍ତମ', topicDetected: 'ବିଷୟ ଚିହ୍ନଟ ହୋଇଛି',
  specialisesIn: 'ବିଶେଷଜ୍ଞତା', autoConnecting: 'ସଂଯୋଗ ହେଉଛି', talkTo: 'ସହ କଥା ହୁଅ',
  whoCanHelp: 'କିଏ ସାହାଯ୍ୟ କରିପାରିବ?', chooseDifferent: 'ଅନ୍ୟ ବାଛନ୍ତୁ', reRecord: 'ପୁଣି ରେକର୍ଡ',
  youSaid: 'ଆପଣ କହିଲେ',
  chatPlaceholder: 'ଓଡ଼ିଆ ବା English ରେ ଟାଇପ କରନ୍ତୁ…',
  sosTitle: 'ଜରୁରୀ SOS ସକ୍ରିୟ', sosDesc: 'ଆପଣଙ୍କ DIGIPIN ଅବସ୍ଥାନ ଜରୁରୀ ସେବା ସହ ସ୍ୱେୟାର ହୋଇଛି।',
  scamAlertTitle: 'AI ଠକ ସୁରକ୍ଷା ସକ୍ରିୟ', talkAboutScams: 'ଠକ ବିଷୟରେ କଥା ହୁଅ',
  impactTitle: 'ନାଗରିକ ପ୍ରଭାବ ଡ୍ୟାସ୍‌ବୋର୍ଡ',
  totalScore: 'ମୋଟ ସ୍କୋର', schemesApplied: 'ଯୋଜନାରେ ଆବେଦନ', complaintsResolved: 'ଅଭିଯୋଗ ସମାଧାନ', healthChecks: 'ସ୍ୱାସ୍ଥ୍ୟ ପରୀକ୍ଷା', shareImpact: 'ଶେୟର କରନ୍ତୁ',
  knowYourDigipin: 'ଆପଣଙ୍କ DIGIPIN ଜାଣନ୍ତୁ', indiaPostIsro: 'ଇଣ୍ଡିଆ ପୋସ୍ଟ · ISRO ଜିଓକୋଡିଙ୍ଗ ପ୍ରଯୁକ୍ତି', live: 'ଲାଇଭ',
  detectMyDigipin: '📍 ମୋ DIGIPIN ଖୋଜନ୍ତୁ', lookupDigipin: '🔍 DIGIPIN ଖୋଜନ୍ତୁ',
  yourDigipin: 'ଆପଣଙ୍କ DIGIPIN', digipinLocation: 'DIGIPIN ଅବସ୍ଥାନ', sampleDigipins: 'ନମୁନା DIGIPIN',
  copiedClipboard: 'କପି ହେଲା!', detectingLocation: 'ଆପଣଙ୍କ ଅବସ୍ଥାନ ଖୋଜା ଯାଉଛି…',
  enterDigipin: 'DIGIPIN କୋଡ ଦାଖଲ କରନ୍ତୁ', viewOnMap: 'ନକଶାରେ ଦେଖନ୍ତୁ', latitude: 'ଅକ୍ଷାଂଶ', longitude: 'ଦେଶାନ୍ତର',
  yourNeighbourhood: 'ଆପଣଙ୍କ ଅଞ୍ଚଳ', zoneActivityMeter: 'ଜୋନ କାର୍ଯ୍ୟକଳାପ ମୀଟର',
  activeComplaintsCount: 'ସକ୍ରିୟ ଅଭିଯୋଗ', poweredByDigipin: 'DIGIPIN + ନଗରସଂବାଦ ଦ୍ବାରା',
  joinVoice: 'ସ୍ୱର ଯୋଡ଼ନ୍ତୁ', joinedLabel: 'ଯୋଡ଼ି ହେଲା!', voicesCount: 'ସ୍ୱର',
  viewMapLabel: 'ନକଶା ଦେଖନ୍ତୁ', fileReferenceLabel: 'ଫାଇଲ ସନ୍ଦର୍ଭ',
  scanningProfile: 'ଆପଣଙ୍କ ପ୍ରୋଫାଇଲ ସ୍କାନ ହେଉଛି', eligibleSchemes: 'ପାତ୍ର ଯୋଜନା ମିଳିଲା',
  requiredDocuments: 'ଆବଶ୍ୟକ ଦଲିଲ', applyNow: 'ଏବେ ଆବେଦନ କରନ୍ତୁ',
  clearChatHistory: 'ଚାଟ ଇତିହାସ ମେଟାଇବ?', clearBtn: 'ମେଟାନ୍ତୁ', tapToSwitch: 'ବଦଳାଇବା ପାଇଁ ଟାପ କରନ୍ତୁ', stayWith: 'ଏଠି ରହନ୍ତୁ',
  analyzingGrievance: 'ଆପଣଙ୍କ ଅଭିଯୋଗ ବିଶ୍ଲେଷଣ ହେଉଛି…',
  isroDigipinLabel: 'ISRO DIGIPIN ଅବସ୍ଥାନ', safetyNote: 'Azure Content Safety ଆପଣଙ୍କ ତଥ୍ୟ ସୁରକ୍ଷିତ ରଖେ।',
  profileFetched: 'ପ୍ରୋଫାଇଲ ମିଳିଲା!', isroMapped: 'ISRO · ମ୍ୟାପ୍ଡ',
  goodMorning: 'ସୁପ୍ରଭାତ', goodAfternoon: 'ନମସ୍କାର', goodEvening: 'ଶୁଭ ସନ୍ଧ୍ୟା',
  dir: 'ltr',
};

const as_lang: UIStrings = {
  navHome: 'হোম', navServices: 'সেৱা', navSOS: 'SOS', navTrack: 'ট্ৰেক', navCommunity: 'সম্প্ৰদায়',
  allServices: 'সকলো সেৱা', aiAgents: 'AI এজেন্ট (পঞ্চ পৰিষদ)', smartTools: 'স্মাৰ্ট টুলছ',
  civicServices: 'নাগৰিক সেৱা', healthAssistant: 'স্বাস্থ্য সহায়ক', welfareSchemes: 'কল্যাণ আঁচনি',
  financeAdvisor: 'আৰ্থিক পৰামৰ্শদাতা', legalAid: 'আইনী সহায়তা',
  schemeDNAScanner: 'আঁচনি DNA স্কেনাৰ', schemeScanDesc: 'আঁচনি স্কেন কৰক',
  bureaucracyXRay: 'আমোলাতন্ত্ৰ X-Ray', trackApplications: 'আবেদন ট্ৰেক কৰক',
  civicKarma: 'নাগৰিক কৰ্ম', yourImpactScore: 'আপোনাৰ প্ৰভাৱ স্কোৰ',
  back: 'পিছলৈ', close: 'বন্ধ কৰক', newItem: 'নতুন', cancel: 'বাতিল', submit: 'দাখিল কৰক', loading: 'লোড হৈছে…',
  myCasesTracking: 'মোৰ গোচৰ আৰু ট্ৰেকিং', activeCases: 'সক্ৰিয়', resolvedCases: 'সমাধান হৈছে', totalCases: 'মুঠ',
  filterAll: 'সকলো', filterCivic: 'নাগৰিক', filterSchemes: 'আঁচনি', filterHealth: 'স্বাস্থ্য',
  filterLegal: 'আইনী', filterFinance: 'আৰ্থিক',
  noCasesYet: 'এতিয়ালৈ কোনো গোচৰ নাই', fileGrievanceBtn: '+ অভিযোগ দাখিল',
  fileGrievancePrompt: 'অভিযোগ দাখিল কৰক বা এজেন্টক সুধক',
  grievanceTitle: 'অভিযোগ দাখিল', grievancePlaceholder: 'আপোনাৰ সমস্যা এইয়াত লিখক…',
  grievanceCategory: 'শ্ৰেণী বাছনি', grievanceSubmit: 'অভিযোগ দাখিল', grievanceAnalyzing: 'AI বিশ্লেষণ…',
  catWater: '💧 পানী যোগান', catRoad: '🛣️ পথ আৰু আন্তঃগাঁথনি', catElectricity: '⚡ বিদ্যুৎ',
  catSanitation: '🧹 পৰিষ্কাৰ', catStreetlight: '🔦 পথৰ পোহৰ', catOther: '📋 অন্যান্য',
  tapMicSpeak: 'মাইক টিপক আৰু কওক', listeningLabel: 'শুনি আছো… বন্ধ কৰিবলৈ টিপক',
  analysingLabel: 'বিশ্লেষণ হৈছে…', trySaying: 'কওক চাওক…', changeLang: 'সলনি',
  liveTranscript: 'লাইভ ট্ৰান্সক্ৰিপ্ট', capturing: 'ৰেকৰ্ড হৈছে…', classifyingIntent: 'বিষয় চিনাক্ত হৈছে…',
  bestAgentForQuery: 'আপোনাৰ প্ৰশ্নৰ বাবে সৰ্বোত্তম', topicDetected: 'বিষয় চিনাক্ত',
  specialisesIn: 'বিশেষজ্ঞতা', autoConnecting: 'সংযোগ হৈছে', talkTo: 'ৰ সৈতে কথা',
  whoCanHelp: 'কোনে সহায় কৰিব পাৰে?', chooseDifferent: 'আন বাছক', reRecord: 'পুনৰ ৰেকৰ্ড',
  youSaid: 'আপুনি কলে',
  chatPlaceholder: 'অসমীয়া বা English-ত টাইপ কৰক…',
  sosTitle: 'জৰুৰীকালীন SOS সক্ৰিয়', sosDesc: 'আপোনাৰ DIGIPIN অৱস্থান জৰুৰীকালীন সেৱাৰ সৈতে ভাগ কৰা হৈছে।',
  scamAlertTitle: 'AI ঠগ সুৰক্ষা সক্ৰিয়', talkAboutScams: 'ঠগৰ বিষয়ে কথা',
  impactTitle: 'নাগৰিক প্ৰভাৱ ডেছব\u2019ৰ্ড',
  totalScore: 'মুঠ স্কোৰ', schemesApplied: 'আঁচনিত আবেদন', complaintsResolved: 'অভিযোগ সমাধান', healthChecks: 'স্বাস্থ্য পৰীক্ষা', shareImpact: 'শেয়াৰ কৰক',
  knowYourDigipin: 'আপোনাৰ DIGIPIN জানক', indiaPostIsro: 'ইণ্ডিয়া পোষ্ট · ISRO জিঅকোডিং প্ৰযুক্তি', live: 'লাইভ',
  detectMyDigipin: '📍 মোৰ DIGIPIN বিচাৰক', lookupDigipin: '🔍 DIGIPIN বিচাৰক',
  yourDigipin: 'আপোনাৰ DIGIPIN', digipinLocation: 'DIGIPIN অৱস্থান', sampleDigipins: 'নমুনা DIGIPIN',
  copiedClipboard: 'কপি হৈছে!', detectingLocation: 'আপোনাৰ অৱস্থান বিচাৰি আছে…',
  enterDigipin: 'DIGIPIN কোড দিয়ক', viewOnMap: 'মেপত চাওক', latitude: 'অক্ষাংশ', longitude: 'দেশান্তৰ',
  yourNeighbourhood: 'আপোনাৰ আচল', zoneActivityMeter: 'জোন কাৰ্যকলাপ মিটাৰ',
  activeComplaintsCount: 'সক্ৰিয় অভিযোগ', poweredByDigipin: 'DIGIPIN + নগৰসংবাদ দ্বাৰা',
  joinVoice: 'স্বৰ যোড়া দিয়ক', joinedLabel: 'যোগদান দিলে!', voicesCount: 'স্বৰ',
  viewMapLabel: 'মেপ চাওক', fileReferenceLabel: 'ফাইল রেফাৰেন্স',
  scanningProfile: 'আপোনাৰ প্ৰোফাইল স্কেন হৈছে', eligibleSchemes: 'যোগ্য আঁচনি পোৱা গৈছে',
  requiredDocuments: 'আৱশ্যকীয় নথিপত্ৰ', applyNow: 'এতিয়া আবেদন কৰক',
  clearChatHistory: 'চ্যাট ইতিহাস মচিব?', clearBtn: 'মচক', tapToSwitch: 'সলনি কৰিবলৈ টেপ কৰক', stayWith: 'এঠাতেই থাকক',
  analyzingGrievance: 'আপোনাৰ অভিযোগ বিশ্লেষণ হৈছে…',
  isroDigipinLabel: 'ISRO DIGIPIN অৱস্থান', safetyNote: 'Azure Content Safety আপোনাৰ তথ্য সুৰক্ষিত ৰাখে।',
  profileFetched: 'প্ৰোফাইল পোৱা গৈছে!', isroMapped: 'ISRO · মেপড',
  goodMorning: 'শুভ প্ৰভাত', goodAfternoon: 'নমস্কাৰ', goodEvening: 'শুভ সন্ধিয়া',
  dir: 'ltr',
};

const ur: UIStrings = {
  navHome: 'ہوم', navServices: 'خدمات', navSOS: 'SOS', navTrack: 'ٹریک', navCommunity: 'برادری',
  allServices: 'تمام خدمات', aiAgents: 'AI ایجنٹ (پنچ پریشد)', smartTools: 'سمارٹ ٹولز',
  civicServices: 'شہری خدمات', healthAssistant: 'صحت معاون', welfareSchemes: 'فلاحی منصوبے',
  financeAdvisor: 'مالی مشیر', legalAid: 'قانونی مدد',
  schemeDNAScanner: 'اسکیم DNA اسکینر', schemeScanDesc: 'اسکیمیں اسکین کریں',
  bureaucracyXRay: 'بیوروکریسی X-Ray', trackApplications: 'درخواستیں ٹریک کریں',
  civicKarma: 'شہری کارما', yourImpactScore: 'آپ کا اثر اسکور',
  back: 'واپس', close: 'بند کریں', newItem: 'نیا', cancel: 'منسوخ', submit: 'جمع کریں', loading: 'لوڈ ہو رہا ہے…',
  myCasesTracking: 'میرے مقدمات اور ٹریکنگ', activeCases: 'فعال', resolvedCases: 'حل شدہ', totalCases: 'کل',
  filterAll: 'سب', filterCivic: 'شہری', filterSchemes: 'اسکیمیں', filterHealth: 'صحت',
  filterLegal: 'قانونی', filterFinance: 'مالی',
  noCasesYet: 'ابھی کوئی مقدمہ نہیں', fileGrievanceBtn: '+ شکایت درج کریں',
  fileGrievancePrompt: 'شکایت درج کریں یا ایجنٹ سے پوچھیں',
  grievanceTitle: 'شکایت درج کریں', grievancePlaceholder: 'اپنا مسئلہ یہاں لکھیں…',
  grievanceCategory: 'زمرہ منتخب کریں', grievanceSubmit: 'شکایت جمع کریں', grievanceAnalyzing: 'AI تجزیہ…',
  catWater: '💧 پانی کی فراہمی', catRoad: '🛣️ سڑک و بنیادی ڈھانچہ', catElectricity: '⚡ بجلی',
  catSanitation: '🧹 صفائی', catStreetlight: '🔦 اسٹریٹ لائٹ', catOther: '📋 دیگر',
  tapMicSpeak: 'مائیک دبائیں اور بولیں', listeningLabel: 'سن رہے ہیں… رکنے کے لیے دبائیں',
  analysingLabel: 'تجزیہ ہو رہا ہے…', trySaying: 'یہ کہیں…', changeLang: 'تبدیل',
  liveTranscript: 'لائیو ٹرانسکرپٹ', capturing: 'ریکارڈ ہو رہا ہے…', classifyingIntent: 'موضوع پہچانا جا رہا ہے…',
  bestAgentForQuery: 'آپ کے سوال کے لیے بہترین', topicDetected: 'موضوع پہچانا گیا',
  specialisesIn: 'مہارت', autoConnecting: 'جڑ رہے ہیں', talkTo: 'سے بات کریں',
  whoCanHelp: 'کون مدد کر سکتا ہے؟', chooseDifferent: 'دوسرا چنیں', reRecord: 'دوبارہ ریکارڈ',
  youSaid: 'آپ نے کہا',
  chatPlaceholder: 'اردو یا English میں ٹائپ کریں…',
  sosTitle: 'ہنگامی SOS فعال', sosDesc: 'آپ کا DIGIPIN مقام ہنگامی خدمات سے شیئر کیا گیا۔',
  scamAlertTitle: 'AI دھوکہ دہی تحفظ فعال', talkAboutScams: 'دھوکہ دہی کے بارے میں بات کریں',
  impactTitle: 'شہری اثر ڈیش بورڈ',
  totalScore: 'کل اسکور', schemesApplied: 'اسکیموں میں درخواست', complaintsResolved: 'شکایات حل', healthChecks: 'صحت جانچ', shareImpact: 'شیئر کریں',
  knowYourDigipin: 'اپنا DIGIPIN جانیں', indiaPostIsro: 'انڈیا پوسٹ · ISRO جیوکوڈنگ ٹیکنالوجی', live: 'لائیو',
  detectMyDigipin: '📍 میرا DIGIPIN تلاش کریں', lookupDigipin: '🔍 DIGIPIN تلاش کریں',
  yourDigipin: 'آپ کا DIGIPIN', digipinLocation: 'DIGIPIN مقام', sampleDigipins: 'نمونہ DIGIPIN',
  copiedClipboard: 'کاپی ہو گیا!', detectingLocation: 'آپ کی مقام تلاش کی جا رہی ہے…',
  enterDigipin: 'DIGIPIN کوڈ درج کریں', viewOnMap: 'نقشے پر دیکھیں', latitude: 'عرض البلد', longitude: 'طول البلد',
  yourNeighbourhood: 'آپ کا محلہ', zoneActivityMeter: 'زون سرگرمی میٹر',
  activeComplaintsCount: 'فعال شکایات', poweredByDigipin: 'DIGIPIN + نگرسمواد کی طرف سے',
  joinVoice: 'آواز اٹھئیں', joinedLabel: 'شامل ہو گئے!', voicesCount: 'آوازیں',
  viewMapLabel: 'نقشہ دیکھیں', fileReferenceLabel: 'فائل حوالہ',
  scanningProfile: 'آپ کی پروفائل اسکین ہو رہی ہے', eligibleSchemes: 'اہل اسکیمیں ملیں',
  requiredDocuments: 'ضروری دستاویزات', applyNow: 'ابھی درخواست دیں',
  clearChatHistory: 'چیٹ تاریخ مٹائیں?', clearBtn: 'مٹائیں', tapToSwitch: 'تبدیلی کے لیے دبائیں', stayWith: 'یہیں رہیں',
  analyzingGrievance: 'آپ کی شکایت کا تجزیہ ہو رہا ہے…',
  isroDigipinLabel: 'ISRO DIGIPIN مقام', safetyNote: 'Azure Content Safety آپ کے ڈیٹا کی حفاظت کرتا ہے۔',
  profileFetched: 'پروفائل مل گئی!', isroMapped: 'ISRO · میپڈ',
  goodMorning: 'صبح بخیر', goodAfternoon: 'اسلام علیکم', goodEvening: 'شام بخیر',
  dir: 'rtl',
};

const ne: UIStrings = {
  navHome: 'मुख्य', navServices: 'सेवाहरू', navSOS: 'SOS', navTrack: 'ट्र्याक', navCommunity: 'समुदाय',
  allServices: 'सबै सेवाहरू', aiAgents: 'AI एजेन्ट (पञ्च परिषद)', smartTools: 'स्मार्ट टुल्स',
  civicServices: 'नागरिक सेवाहरू', healthAssistant: 'स्वास्थ्य सहायक', welfareSchemes: 'कल्याण योजनाहरू',
  financeAdvisor: 'आर्थिक सल्लाहकार', legalAid: 'कानूनी सहायता',
  schemeDNAScanner: 'योजना DNA स्क्यानर', schemeScanDesc: 'योजनाहरू स्क्यान गर्नुहोस्',
  bureaucracyXRay: 'नोकरशाही X-Ray', trackApplications: 'आवेदन ट्र्याक गर्नुहोस्',
  civicKarma: 'नागरिक कर्म', yourImpactScore: 'तपाईंको प्रभाव स्कोर',
  back: 'पछि', close: 'बन्द गर्नुहोस्', newItem: 'नयाँ', cancel: 'रद्द', submit: 'पेश गर्नुहोस्', loading: 'लोड हुँदैछ…',
  myCasesTracking: 'मेरा मुद्दाहरू र ट्र्याकिङ', activeCases: 'सक्रिय', resolvedCases: 'समाधान भयो', totalCases: 'जम्मा',
  filterAll: 'सबै', filterCivic: 'नागरिक', filterSchemes: 'योजनाहरू', filterHealth: 'स्वास्थ्य',
  filterLegal: 'कानूनी', filterFinance: 'आर्थिक',
  noCasesYet: 'अझै कुनै मुद्दा छैन', fileGrievanceBtn: '+ उजुरी दर्ता',
  fileGrievancePrompt: 'उजुरी दर्ता गर्नुहोस् वा एजेन्टलाई सोध्नुहोस्',
  grievanceTitle: 'उजुरी दर्ता', grievancePlaceholder: 'यहाँ आफ्नो समस्या लेख्नुहोस्…',
  grievanceCategory: 'श्रेणी छान्नुहोस्', grievanceSubmit: 'उजुरी पेश', grievanceAnalyzing: 'AI विश्लेषण…',
  catWater: '💧 पानी आपूर्ति', catRoad: '🛣️ सडक र पूर्वाधार', catElectricity: '⚡ बिजुली',
  catSanitation: '🧹 सरसफाइ', catStreetlight: '🔦 सडक बत्ती', catOther: '📋 अन्य',
  tapMicSpeak: 'माइक थिचेर बोल्नुहोस्', listeningLabel: 'सुनिरहेछौं… रोक्न थिच्नुहोस्',
  analysingLabel: 'विश्लेषण भइरहेछ…', trySaying: 'भन्नुस्…', changeLang: 'बदल्नुहोस्',
  liveTranscript: 'लाइभ ट्रान्सक्रिप्ट', capturing: 'रेकर्ड भइरहेछ…', classifyingIntent: 'विषय पहिचान भइरहेछ…',
  bestAgentForQuery: 'तपाईंको प्रश्नका लागि उत्तम', topicDetected: 'विषय पहिचान भयो',
  specialisesIn: 'विशेषज्ञता', autoConnecting: 'जडान भइरहेछ', talkTo: 'सँग कुरा',
  whoCanHelp: 'कसले सहयोग गर्न सक्छ?', chooseDifferent: 'अर्को छान्नुहोस्', reRecord: 'फेरि रेकर्ड',
  youSaid: 'तपाईंले भन्नुभयो',
  chatPlaceholder: 'नेपाली वा English मा टाइप गर्नुहोस्…',
  sosTitle: 'आपतकालीन SOS सक्रिय', sosDesc: 'तपाईंको DIGIPIN स्थान आपतकालीन सेवाहरूसँग साझा गरियो।',
  scamAlertTitle: 'AI ठगी सुरक्षा सक्रिय', talkAboutScams: 'ठगीबारे कुरा',
  impactTitle: 'नागरिक प्रभाव ड्यासबोर्ड',
  totalScore: 'जम्मा स्कोर', schemesApplied: 'योजनामा आवेदन', complaintsResolved: 'उजुरी समाधान', healthChecks: 'स्वास्थ्य जाँच', shareImpact: 'साझा गर्नुहोस्',
  knowYourDigipin: 'तपाईंको DIGIPIN जान्नुहोस्', indiaPostIsro: 'इण्डिया पोस्ट · ISRO जियोकोडिङ तकनिक', live: 'लाइभ',
  detectMyDigipin: '📍 मेरो DIGIPIN खोज्नुहोस्', lookupDigipin: '🔍 DIGIPIN खोज्नुहोस्',
  yourDigipin: 'तपाईंको DIGIPIN', digipinLocation: 'DIGIPIN स्थान', sampleDigipins: 'नमुना DIGIPIN',
  copiedClipboard: 'कपी भयो!', detectingLocation: 'तपाईंको स्थान खोजिन्छ…',
  enterDigipin: 'DIGIPIN कोड लेख्नुहोस्', viewOnMap: 'नक्शामा हेर्नुहोस्', latitude: 'अक्षांश', longitude: 'देशान्तर',
  yourNeighbourhood: 'तपाईंको छिमेक', zoneActivityMeter: 'जोन गतिविधि मिटर',
  activeComplaintsCount: 'सक्रिय उजुरी', poweredByDigipin: 'DIGIPIN + नगरसंवाद द्वारा',
  joinVoice: 'आवाज उठाउनुहोस्', joinedLabel: 'सामेल भयो!', voicesCount: 'आवाजहरू',
  viewMapLabel: 'नक्शा हेर्नुहोस्', fileReferenceLabel: 'फाइल सन्दर्भ',
  scanningProfile: 'तपाईंको प्रोफाइल स्क्यान हुँदैछ', eligibleSchemes: 'योग्य योजना भेटियो',
  requiredDocuments: 'आवश्यक कागजातहरू', applyNow: 'अहिले आवेदन गर्नुहोस्',
  clearChatHistory: 'च्याट इतिहास मेटाउने?', clearBtn: 'मेटाउ', tapToSwitch: 'बदल्न ट्याप गर्नुहोस्', stayWith: 'यहीँ बस्नुहोस्',
  analyzingGrievance: 'तपाईंको उजुरीको विश्लेषण हुँदैछ…',
  isroDigipinLabel: 'ISRO DIGIPIN स्थान', safetyNote: 'Azure Content Safety तपाईंको डाटा सुरक्षित राख्छ।',
  profileFetched: 'प्रोफाइल प्राप्त!', isroMapped: 'ISRO · म्याप्ड',
  goodMorning: 'शुभप्रभात', goodAfternoon: 'नमस्ते', goodEvening: 'शुभसन्ध्या',
  dir: 'ltr',
};

// Fallback languages — use English for unsupported scripts
// mai (Maithili), kok (Konkani), mni (Manipuri), doi (Dogri), sat (Santali), brx (Bodo), ks (Kashmiri), sd (Sindhi)
const mai: UIStrings = {
  navHome: 'घर', navServices: 'सेवा सभ', navSOS: 'SOS', navTrack: 'ट्रैक', navCommunity: 'समुदाय',
  allServices: 'सभ सेवा', aiAgents: 'AI एजेंट (पंच परिषद)', smartTools: 'स्मार्ट टूल्स',
  civicServices: 'नागरिक सेवा', healthAssistant: 'स्वास्थ्य सहायक', welfareSchemes: 'कल्याण योजना सभ',
  financeAdvisor: 'वित्त सलाहकार', legalAid: 'कानूनी सहायता',
  schemeDNAScanner: 'योजना DNA स्कैनर', schemeScanDesc: 'योजना सभ स्कैन करू',
  bureaucracyXRay: 'नौकरशाही X-Ray', trackApplications: 'आवेदन ट्रैक करू',
  civicKarma: 'नागरिक कर्मा', yourImpactScore: 'अहाँक प्रभाव स्कोर',
  back: 'वापस', close: 'बंद करू', newItem: 'नव', cancel: 'रद्द', submit: 'जमा करू', loading: 'लोड भ रहल अछि…',
  myCasesTracking: 'हमर मामला आ ट्रैकिंग', activeCases: 'सक्रिय', resolvedCases: 'सुलझाएल', totalCases: 'कुल',
  filterAll: 'सभ', filterCivic: 'नागरिक', filterSchemes: 'योजना', filterHealth: 'स्वास्थ्य',
  filterLegal: 'कानूनी', filterFinance: 'वित्त',
  noCasesYet: 'अखन कोनो मामला नहि', fileGrievanceBtn: '+ शिकायत दर्ज करू',
  fileGrievancePrompt: 'शिकायत दर्ज करू या शुरू करबाक लेल एजेंट सँ पूछू',
  grievanceTitle: 'शिकायत दर्ज करू', grievancePlaceholder: 'अपन समस्या एतय लिखू…',
  grievanceCategory: 'श्रेणी चुनू', grievanceSubmit: 'शिकायत दर्ज करू', grievanceAnalyzing: 'AI विश्लेषण…',
  catWater: '💧 पानि आपूर्ति', catRoad: '🛣️ सड़क आ बुनियादी ढांचा', catElectricity: '⚡ बिजली',
  catSanitation: '🧹 सफाई', catStreetlight: '🔦 स्ट्रीट लाइट', catOther: '📋 अन्य',
  tapMicSpeak: 'माइक दबाउ आ बोलू', listeningLabel: 'सुनि रहल अछि… बंद करू',
  analysingLabel: 'विश्लेषण भ रहल अछि…', trySaying: 'अहाँ कहि सकैत छी…', changeLang: 'बदलू',
  liveTranscript: 'लाइव ट्रांसक्रिप्ट', capturing: 'रिकॉर्ड भ रहल अछि…', classifyingIntent: 'विषय पहचानल जा रहल अछि…',
  bestAgentForQuery: 'अहाँक सवालक लेल सर्वोत्तम', topicDetected: 'विषय पहचानल गेल',
  specialisesIn: 'विशेषज्ञता', autoConnecting: 'जुड़ि रहल अछि', talkTo: 'सँ बात करू',
  whoCanHelp: 'के मदद कऽ सकैत अछि?', chooseDifferent: 'दोसर चुनू', reRecord: 'फेर रिकॉर्ड करू',
  youSaid: 'अहाँ कहलहुँ',
  chatPlaceholder: 'मैथिली या English मे टाइप करू…',
  sosTitle: 'आपातकाल SOS सक्रिय', sosDesc: 'DIGIPIN स्थान आपातकालीन सेवा सभ सँ साझा कएल गेल।',
  scamAlertTitle: 'धोखाधड़ी चेतावनी सिस्टम', talkAboutScams: 'धोखाधड़ीक बारे मे बात करू',
  impactTitle: 'नागरिक प्रभाव डैशबोर्ड',
  totalScore: 'कुल स्कोर', schemesApplied: 'योजना मे आवेदन', complaintsResolved: 'शिकायत हल', healthChecks: 'स्वास्थ्य जाँच', shareImpact: 'शेयर करू',
  knowYourDigipin: 'अपन DIGIPIN जानू', indiaPostIsro: 'इंडिया पोस्ट · ISRO जियोकोडिंग तकनीक', live: 'लाइव',
  detectMyDigipin: '📍 हमर DIGIPIN खोजू', lookupDigipin: '🔍 DIGIPIN खोजू',
  yourDigipin: 'अहाँक DIGIPIN', digipinLocation: 'DIGIPIN स्थान', sampleDigipins: 'नमूना DIGIPIN',
  copiedClipboard: 'कॉपी भ गेल!', detectingLocation: 'अहाँक स्थान खोजल जा रहल अछि…',
  enterDigipin: 'DIGIPIN कोड दर्ज करू', viewOnMap: 'नक्शा पर देखू', latitude: 'अक्षांश', longitude: 'देशांतर',
  yourNeighbourhood: 'अहाँक मोहल्ला', zoneActivityMeter: 'जोन गतिविधि मीटर',
  activeComplaintsCount: 'सक्रिय शिकायत सभ', poweredByDigipin: 'DIGIPIN + नगरसंवाद द्वारा संचालित',
  joinVoice: 'आवाज उठाउ', joinedLabel: 'शामिल भ गेलहुँ!', voicesCount: 'आवाज सभ',
  viewMapLabel: 'नक्शा देखू', fileReferenceLabel: 'फाइल संदर्भ',
  scanningProfile: 'अहाँक प्रोफाइल स्कैन भ रहल अछि', eligibleSchemes: 'पात्र योजना भेटल',
  requiredDocuments: 'आवश्यक दस्तावेज', applyNow: 'अखन आवेदन करू',
  clearChatHistory: 'चैट इतिहास हटाउ?', clearBtn: 'हटाउ', tapToSwitch: 'बदलबाक लेल टैप करू', stayWith: 'एतहि रहू',
  analyzingGrievance: 'अहाँक शिकायतक विश्लेषण भ रहल अछि…',
  isroDigipinLabel: 'ISRO DIGIPIN स्थान', safetyNote: 'Azure Content Safety अहाँक डेटाक सुरक्षा करैत अछि।',
  profileFetched: 'प्रोफाइल प्राप्त!', isroMapped: 'ISRO · मैप्ड',
  goodMorning: 'सुप्रभात', goodAfternoon: 'नमस्कार', goodEvening: 'शुभ संध्या',
  dir: 'ltr',
};
const kok: UIStrings = { ...mr, navHome: 'घर', chatPlaceholder: 'कोंकणी या English मध्ये टाइप करा…' };
const mni: UIStrings = { ...en, chatPlaceholder: 'Type in Meitei or English…' };
const doi: UIStrings = { ...hi, chatPlaceholder: 'डोगरी या English विच टाइप करो…' };
const sat: UIStrings = { ...en, chatPlaceholder: 'Type in Santali or English…' };
const brx: UIStrings = { ...en, chatPlaceholder: 'Type in Bodo or English…' };
const ks: UIStrings = { ...ur };
const sd: UIStrings = { ...ur, chatPlaceholder: 'سنڌي يا English ۾ ٽائيپ ڪريو…', dir: 'rtl' };

export const translations: Record<LangCode, UIStrings> = {
  hi, en, bn, te, mr, ta, gu, kn, ml, pa,
  or: or_lang, as: as_lang, ur, ne, mai, kok, mni, doi, sat, brx, ks, sd,
};

/** Resolve a user profile language string (e.g. "hi", "hi-IN", "hin_Deva") to a LangCode */
export function resolveLang(raw?: string): LangCode {
  if (!raw) return 'hi';
  const code = raw.split(/[-_]/)[0].toLowerCase();
  if (code in translations) return code as LangCode;
  // Map IndicTrans2 codes (hin_Deva → hi, etc.)
  const map: Record<string, LangCode> = {
    hin: 'hi', eng: 'en', ben: 'bn', tel: 'te', mar: 'mr', tam: 'ta',
    guj: 'gu', kan: 'kn', mal: 'ml', pan: 'pa', ori: 'or', asm: 'as',
    urd: 'ur', nep: 'ne', mai: 'mai', kok: 'kok', mni: 'mni', doi: 'doi',
    sat: 'sat', brx: 'brx', kas: 'ks', snd: 'sd',
  };
  return map[code] || 'hi';
}
