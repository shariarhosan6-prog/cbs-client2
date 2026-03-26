import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Heart, 
  ChevronRight, 
  Lock, 
  Unlock, 
  DollarSign, 
  Search,
  Bell,
  Home,
  PlusCircle,
  Settings,
  ArrowRight,
  Utensils,
  Building2,
  Calculator,
  ChevronLeft,
  Shield,
  Plane,
  ShoppingCart,
  Newspaper
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

// --- Types ---
type JourneyMode = 'pre-arrival' | 'post-arrival';
type Screen = 'onboarding' | 'home' | 'jobs' | 'community' | 'pr-tracker' | 'profile' | 'vault' | 'apply' | 'news' | 'messages';

interface StudentData {
  name: string;
  university: string;
  course: string;
  intakeDate: string;
  visaSubclass: string;
}

interface Message {
  id: number;
  sender: 'advisor' | 'student';
  text: string;
  timestamp: string;
}

interface Conversation {
  id: number;
  advisorName: string;
  lastMessage: string;
  unread: boolean;
  messages: Message[];
}

interface AppStatusStep {
  label: string;
  status: 'Completed' | 'In Progress' | 'Pending';
}

interface ChecklistItem {
  id: number;
  text: string;
  done: boolean;
}

interface IeltsScores {
  L: number;
  R: number;
  W: number;
  S: number;
}

// --- Mock Data ---
const BLOG_POSTS = [
  { id: 1, title: 'New Visa Rules 2026: What you need to know', category: 'Visa Update', date: '2 hours ago', image: 'https://picsum.photos/seed/visa/400/200' },
  { id: 2, title: 'Top 5 Cities in Australia for International Students', category: 'Life', date: 'Yesterday', image: 'https://picsum.photos/seed/city/400/200' },
  { id: 3, title: 'How to find your first job in Melbourne', category: 'Career', date: '2 days ago', image: 'https://picsum.photos/seed/job/400/200' },
];

const JOBS = [
  { id: 1, title: 'Kitchen Hand', company: 'Nando\'s CBD', pay: '$28/hr', type: 'Part-time', referral: true },
  { id: 2, title: 'Delivery Driver', company: 'Uber Eats', pay: 'Flexible', type: 'Contract', referral: false },
  { id: 3, title: 'Retail Assistant', company: '7-Eleven', pay: '$26/hr', type: 'Casual', referral: true },
  { id: 4, title: 'Warehouse Picker', company: 'Amazon Dandenong', pay: '$31/hr', type: 'Casual', referral: false },
];

const COMMUNITY_PLACES = [
  { id: 1, name: 'Madina Halal Meats', type: 'Grocery', distance: '0.8km', rating: 4.8 },
  { id: 2, name: 'Melbourne City Mosque', type: 'Mosque', distance: '1.2km', rating: 4.9 },
  { id: 3, name: 'Desi Dhaba', type: 'Restaurant', distance: '0.5km', rating: 4.5 },
  { id: 4, name: 'BD Mart Footscray', type: 'Grocery', distance: '4.5km', rating: 4.7 },
];

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 1,
    advisorName: 'Advisor Sarah',
    lastMessage: 'Your COE has been received! Check your vault.',
    unread: true,
    messages: [
      { id: 1, sender: 'advisor', text: 'Hello! I am Sarah, your dedicated advisor.', timestamp: '9:00 AM' },
      { id: 2, sender: 'student', text: 'Hi Sarah, thanks for the help!', timestamp: '9:05 AM' },
      { id: 3, sender: 'advisor', text: 'Your COE has been received! Check your vault.', timestamp: '10:30 AM' },
    ]
  }
];

// --- Components ---

const MobileFrame = ({ children }: { children: React.ReactNode }) => (
  <div className="flex justify-center items-center min-h-screen bg-slate-100 p-4 sm:p-8">
    <div className="w-full max-w-[375px] h-[min(812px,90vh)] bg-white rounded-[2.5rem] shadow-2xl border-[8px] border-slate-900 relative overflow-hidden flex flex-col">
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-50 flex items-center justify-center">
        <div className="w-8 h-1 bg-slate-800 rounded-full" />
      </div>
      {children}
    </div>
  </div>
);

const Onboarding = ({ 
  onComplete, 
  setMode, 
  studentData, 
  setStudentData 
}: { 
  onComplete: () => void, 
  setMode: (m: JourneyMode) => void,
  studentData: StudentData,
  setStudentData: (d: StudentData) => void
}) => {
  const [step, setStep] = useState(0);
  const steps = [
    { 
      title: "Welcome to EduNavi", 
      desc: "Your complete guide from Dhaka to Australian PR.", 
      icon: <GraduationCap className="w-12 h-12 text-indigo-600" />,
      color: "bg-indigo-50"
    },
    { 
      title: "Where are you now?", 
      desc: "Help us personalize your journey roadmap.", 
      icon: <MapPin className="w-12 h-12 text-blue-600" />,
      color: "bg-blue-50",
      isSelection: true
    },
    {
      title: "Tell us about yourself",
      desc: "This helps our advisors guide you better.",
      icon: <Users className="w-12 h-12 text-indigo-600" />,
      color: "bg-indigo-50",
      isForm: true
    },
    { 
      title: "The Parent Visa Reward", 
      desc: "Maintain a 3.0+ CGPA and we'll process your parents' visitor visa for FREE.", 
      icon: <Heart className="w-12 h-12 text-rose-500" />,
      color: "bg-rose-50"
    }
  ];

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setStudentData({ ...studentData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex-1 flex flex-col p-8 pt-20 text-center relative overflow-y-auto">
      <div className="absolute top-10 right-8 z-10">
        <button onClick={onComplete} className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors">Skip</button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="flex-1 flex flex-col items-center justify-center"
        >
          <div className={cn("w-24 h-24 rounded-3xl flex items-center justify-center mb-8 shadow-sm shrink-0", steps[step].color)}>
            {steps[step].icon}
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">{steps[step].title}</h2>
          <p className="text-slate-500 leading-relaxed mb-8">{steps[step].desc}</p>

          {steps[step].isSelection && (
            <div className="w-full space-y-3">
              <button 
                onClick={() => { setMode('pre-arrival'); setStep(s => s + 1); }}
                className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-700 hover:border-indigo-600 hover:text-indigo-600 transition-all text-left flex items-center justify-between"
              >
                I am in Bangladesh (preparing)
                <ChevronRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => { setMode('post-arrival'); setStep(s => s + 1); }}
                className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-700 hover:border-indigo-600 hover:text-indigo-600 transition-all text-left flex items-center justify-between"
              >
                I arrived in Australia
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {steps[step].isForm && (
            <div className="w-full space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Full Name</label>
                <input name="name" value={studentData.name} onChange={handleFormChange} placeholder="e.g. Shariar Hosan" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-indigo-600" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">University</label>
                <input name="university" value={studentData.university} onChange={handleFormChange} placeholder="e.g. Monash University" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-indigo-600" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Course</label>
                  <input name="course" value={studentData.course} onChange={handleFormChange} placeholder="e.g. IT" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-indigo-600" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Intake Date</label>
                  <input name="intakeDate" type="date" value={studentData.intakeDate} onChange={handleFormChange} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-indigo-600" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Visa Subclass</label>
                <select name="visaSubclass" value={studentData.visaSubclass} onChange={handleFormChange} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-indigo-600 appearance-none">
                  <option value="500">500 (Student)</option>
                  <option value="485">485 (Graduate)</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {!steps[step].isSelection && (
        <div className="mt-auto space-y-6 pt-8">
          <div className="flex justify-center gap-2">
            {steps.map((_, i) => (
              <div key={i} className={cn("h-1.5 rounded-full transition-all", i === step ? "w-8 bg-indigo-600" : "w-2 bg-slate-200")} />
            ))}
          </div>
          <button 
            onClick={() => step < steps.length - 1 ? setStep(s => s + 1) : onComplete()}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
          >
            {step === steps.length - 1 ? "Start Your Journey" : "Continue"}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

const HomeScreen = ({ 
  gpa, 
  mode, 
  setMode, 
  checklist, 
  setChecklist, 
  ielts, 
  setIelts, 
  setScreen,
  appStatus,
  studentData
}: { 
  gpa: number, 
  mode: JourneyMode, 
  setMode: (m: JourneyMode) => void,
  checklist: ChecklistItem[],
  setChecklist: (c: ChecklistItem[]) => void,
  ielts: IeltsScores,
  setIelts: (i: IeltsScores) => void,
  setScreen: (s: Screen) => void,
  appStatus: AppStatusStep[],
  studentData: StudentData
}) => {
  const [showModeModal, setShowModeModal] = useState(false);

  const toggleCheck = (id: number) => {
    setChecklist(checklist.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  const doneCount = checklist.filter(i => i.done).length;

  const updateIelts = (mod: keyof IeltsScores, delta: number) => {
    const newVal = Math.min(9, Math.max(0, ielts[mod] + delta));
    setIelts({ ...ielts, [mod]: newVal });
  };

  const overallIelts = (ielts.L + ielts.R + ielts.W + ielts.S) / 4;

  return (
    <div className="flex-1 overflow-y-auto p-5 pt-16 space-y-6 relative">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 leading-tight">Assalamu Alaikum,</h1>
          <p className="text-sm font-bold text-indigo-600">{studentData.name || 'Student'}</p>
          <button 
            onClick={() => setShowModeModal(true)}
            className="mt-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold flex items-center gap-1.5 border border-indigo-100"
          >
            {mode === 'pre-arrival' ? '🇧🇩 Pre-Arrival' : '🇦🇺 In Australia'}
            <ChevronRight className="w-3 h-3 rotate-90" />
          </button>
        </div>
        <button onClick={() => setScreen('messages')} className="p-2 bg-slate-100 rounded-full relative">
          <Bell className="w-5 h-5 text-slate-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
        </button>
      </div>

      {/* Mode Switch Modal */}
      <AnimatePresence>
        {showModeModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModeModal(false)}
              className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="absolute top-1/4 left-5 right-5 bg-white rounded-3xl p-6 z-[70] shadow-2xl border border-slate-100"
            >
              <h3 className="font-bold text-slate-900 mb-4">Switch Journey Mode</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => { setMode('pre-arrival'); setShowModeModal(false); }}
                  className={cn("w-full p-4 rounded-2xl text-sm font-bold flex items-center justify-between", mode === 'pre-arrival' ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-600')}
                >
                  🇧🇩 Bangladesh (Preparing)
                  {mode === 'pre-arrival' && <CheckCircle2 className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => { setMode('post-arrival'); setShowModeModal(false); }}
                  className={cn("w-full p-4 rounded-2xl text-sm font-bold flex items-center justify-between", mode === 'post-arrival' ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-600')}
                >
                  🇦🇺 Australia (Arrived)
                  {mode === 'post-arrival' && <CheckCircle2 className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {mode === 'pre-arrival' ? (
        <>
          {/* Application Status */}
          <div className="bg-indigo-600 rounded-3xl p-5 text-white shadow-xl shadow-indigo-100">
            <h3 className="font-bold text-lg mb-4">Application Status</h3>
            <div className="space-y-4">
              {appStatus.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center", item.status === 'Completed' ? 'bg-emerald-400 border-emerald-400' : item.status === 'In Progress' ? 'border-amber-400' : 'border-indigo-300')}>
                    {item.status === 'Completed' && <CheckCircle2 className="w-2.5 h-2.5 text-indigo-900" />}
                    {item.status === 'In Progress' && <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span>{item.label}</span>
                      <span className={cn("opacity-70", item.status === 'In Progress' && "text-amber-200 opacity-100")}>{item.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* IELTS Tracker */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800">IELTS Preparation</h3>
              <span className="text-xs font-bold text-indigo-600">Overall: {overallIelts.toFixed(1)}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {(['L', 'R', 'W', 'S'] as const).map((mod) => (
                <div key={mod} className="flex items-center justify-between bg-slate-50 rounded-2xl border border-slate-100 p-2 px-3">
                  <span className="text-xs font-bold text-slate-400 w-4">{mod}</span>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => updateIelts(mod, -0.5)}
                      className="w-8 h-8 flex items-center justify-center text-rose-500 hover:bg-rose-100 rounded-full transition-colors"
                    >
                      <div className="w-3 h-0.5 bg-current rounded-full" />
                    </button>
                    <span className="text-sm font-black text-slate-700 min-w-[2.5ch] text-center">{ielts[mod]}</span>
                    <button 
                      onClick={() => updateIelts(mod, 0.5)}
                      className="w-8 h-8 flex items-center justify-center text-indigo-600 hover:bg-indigo-100 rounded-full transition-colors"
                    >
                      <PlusCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Parent Visa Card */}
          <div className="bg-indigo-600 rounded-3xl p-5 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg">Parent Visa Reward</h3>
                <p className="text-xs text-indigo-100">Target: 3.0+ CGPA for 2 Semesters</p>
              </div>
              {gpa >= 3.0 ? <Unlock className="w-5 h-5 text-emerald-300" /> : <Lock className="w-5 h-5 text-indigo-300" />}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold">
                <span>Current GPA: {gpa.toFixed(1)}</span>
                <span>Progress: {Math.min(100, (gpa/3.0)*100).toFixed(0)}%</span>
              </div>
              <div className="w-full h-2.5 bg-indigo-800 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (gpa/3.0)*100)}%` }} className="h-full bg-emerald-400" />
              </div>
            </div>
            <button className={cn("mt-5 w-full py-3 rounded-xl text-xs font-bold transition-all", gpa >= 3.0 ? "bg-white text-indigo-600 shadow-lg" : "bg-indigo-500/50 text-indigo-200 cursor-not-allowed")}>
              {gpa >= 3.0 ? "Claim Free Processing" : "Locked (Keep Studying!)"}
            </button>
          </div>

          {/* Arrival Checklist */}
          <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800">Arrival Checklist</h3>
              <span className="text-[10px] font-bold text-indigo-600">{doneCount}/{checklist.length} DONE</span>
            </div>
            <div className="space-y-4">
              {checklist.map((item) => (
                <div key={item.id} className="flex items-center gap-4 cursor-pointer" onClick={() => toggleCheck(item.id)}>
                  <div className={cn("w-5 h-5 rounded-lg border flex items-center justify-center transition-all", item.done ? "bg-indigo-600 border-indigo-600" : "border-slate-300")}>
                    {item.done && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <span className={cn("text-sm font-medium", item.done ? "text-slate-400 line-through" : "text-slate-700")}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-4">
        {mode === 'pre-arrival' ? (
          [
            { icon: <Search />, label: 'Universities', color: 'bg-blue-50 text-blue-600', action: () => setScreen('apply') },
            { icon: <Lock />, label: 'Documents', color: 'bg-orange-50 text-orange-600', action: () => setScreen('vault') },
            { icon: <GraduationCap />, label: 'IELTS Prep', color: 'bg-emerald-50 text-emerald-600', action: () => {} },
            { icon: <Calculator />, label: 'Savings Calc', color: 'bg-purple-50 text-purple-600', action: () => {} },
          ].map((item, i) => (
            <button key={i} onClick={item.action} className="flex flex-col items-center gap-2">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm", item.color)}>
                {React.cloneElement(item.icon as React.ReactElement, { className: "w-5 h-5" })}
              </div>
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider text-center leading-tight">{item.label}</span>
            </button>
          ))
        ) : (
          [
            { icon: <Briefcase />, label: 'Jobs', color: 'bg-blue-50 text-blue-600', action: () => setScreen('jobs') },
            { icon: <Utensils />, label: 'Halal', color: 'bg-orange-50 text-orange-600', action: () => setScreen('community') },
            { icon: <Calculator />, label: 'PR Points', color: 'bg-emerald-50 text-emerald-600', action: () => setScreen('pr-tracker') },
            { icon: <Users />, label: 'Desi', color: 'bg-purple-50 text-purple-600', action: () => setScreen('community') },
          ].map((item, i) => (
            <button key={i} onClick={item.action} className="flex flex-col items-center gap-2">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm", item.color)}>
                {React.cloneElement(item.icon as React.ReactElement, { className: "w-5 h-5" })}
              </div>
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider text-center leading-tight">{item.label}</span>
            </button>
          ))
        )}
      </div>

      {/* Latest Updates (Merged Feed) */}
      <div className="space-y-4 pb-20">
        <h3 className="font-bold text-slate-800">Latest Updates</h3>
        {BLOG_POSTS.map((post) => (
          <div key={post.id} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
            <img src={post.image} alt={post.title} className="w-full h-32 object-cover" referrerPolicy="no-referrer" />
            <div className="p-4 space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-lg">{post.category}</span>
                <span className="text-[9px] text-slate-400 font-medium">{post.date}</span>
              </div>
              <h4 className="text-sm font-bold text-slate-800 leading-tight">{post.title}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ApplyScreen = () => (
  <div className="flex-1 overflow-y-auto p-5 pt-16 space-y-6">
    <h2 className="text-2xl font-bold text-slate-900">Apply to Universities</h2>
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input type="text" placeholder="Search courses or universities..." className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:border-indigo-600 transition-all" />
    </div>
    <div className="space-y-4 pb-20">
      {['Monash University', 'University of Melbourne', 'RMIT University', 'Deakin University'].map((uni, i) => (
        <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-black">U</div>
            <div>
              <h4 className="font-bold text-slate-800">{uni}</h4>
              <p className="text-[10px] text-slate-500">Melbourne, VIC</p>
            </div>
          </div>
          <button className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg">View Courses</button>
        </div>
      ))}
    </div>
  </div>
);

const JobsScreen = ({ onApply }: { onApply: (title: string) => void }) => (
  <div className="flex-1 overflow-y-auto p-5 pt-16 space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-slate-900">Part-time Jobs</h2>
      <Search className="w-5 h-5 text-slate-400" />
    </div>
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {['All', 'Kitchen', 'Retail', 'Delivery', 'Cleaning'].map((cat, i) => (
        <button key={i} className={cn("px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap", i === 0 ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500")}>
          {cat}
        </button>
      ))}
    </div>
    <div className="space-y-4 pb-20">
      {JOBS.map((job) => (
        <div key={job.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center"><Building2 className="w-6 h-6 text-slate-400" /></div>
            <div>
              <h4 className="font-bold text-slate-800">{job.title}</h4>
              <p className="text-xs text-slate-500">{job.company}</p>
              <div className="flex gap-2 mt-1">
                <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-bold uppercase">{job.type}</span>
                {job.referral && <span className="text-[10px] bg-emerald-50 px-2 py-0.5 rounded text-emerald-600 font-bold uppercase">Mama/Bhai Referral</span>}
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-indigo-600 text-sm">{job.pay}</p>
            <button onClick={() => onApply(job.title)} className="mt-2 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg flex items-center gap-1">Apply <ChevronRight className="w-3 h-3" /></button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const CommunityScreen = () => (
  <div className="flex-1 overflow-y-auto p-5 pt-16 space-y-6">
    <h2 className="text-2xl font-bold text-slate-900">Desi Hub</h2>
    <div className="w-full h-48 bg-slate-200 rounded-3xl relative overflow-hidden flex items-center justify-center">
      <MapPin className="w-8 h-8 text-slate-400 animate-bounce" />
      <p className="absolute bottom-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Interactive Map Loading...</p>
    </div>
    <div className="space-y-4 pb-20">
      <h3 className="font-bold text-slate-800">Nearby Essentials</h3>
      {COMMUNITY_PLACES.map((place) => (
        <div key={place.id} className="flex gap-4 items-center bg-white p-4 rounded-2xl border border-slate-100">
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", place.type === 'Grocery' ? 'bg-emerald-50 text-emerald-600' : place.type === 'Mosque' ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600')}>
            {place.type === 'Grocery' ? <ShoppingCart className="w-6 h-6" /> : place.type === 'Mosque' ? <Users className="w-6 h-6" /> : <Utensils className="w-6 h-6" />}
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-slate-800">{place.name}</h4>
            <p className="text-xs text-slate-500">{place.type} • {place.distance}</p>
          </div>
          <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
            <TrendingUp className="w-3 h-3 text-amber-600" />
            <span className="text-[10px] font-bold text-amber-600">{place.rating}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const VaultScreen = ({ mode }: { mode: JourneyMode }) => {
  const docs = [
    { id: 1, name: 'Passport Copy', cat: 'Identity', s: 'Verified', icon: <Shield /> },
    { id: 2, name: 'Offer Letter - Monash', cat: 'Academic', s: 'Verified', icon: <GraduationCap /> },
    { id: 3, name: 'IELTS Certificate', cat: 'Academic', s: 'Verified', icon: <GraduationCap /> },
    { id: 4, name: 'COE (Enrolment)', cat: 'Visa', s: mode === 'pre-arrival' ? 'Not yet received' : 'Verified', icon: <Plane />, locked: mode === 'pre-arrival' },
  ];

  const categories = [
    { label: 'Identity', icon: <Shield /> },
    { label: 'Academic', icon: <GraduationCap /> },
    { label: 'Visa', icon: <Plane /> },
    { label: 'Financial', icon: <DollarSign /> },
  ];

  const getCount = (cat: string) => docs.filter(d => d.cat === cat).length;

  return (
    <div className="flex-1 overflow-y-auto p-5 pt-16 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Doc Vault</h2>
        <PlusCircle className="w-6 h-6 text-indigo-600" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {categories.map((cat) => (
          <div key={cat.label} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-indigo-600">
              {React.cloneElement(cat.icon as React.ReactElement, { className: "w-4 h-4" })}
            </div>
            <span className="text-xs font-bold text-slate-700">{cat.label}</span>
            <span className="text-[10px] text-slate-400">{getCount(cat.label)} {getCount(cat.label) === 1 ? 'File' : 'Files'}</span>
          </div>
        ))}
      </div>
      <div className="space-y-3 pb-20">
        <h3 className="font-bold text-slate-800 text-sm">Recent Uploads</h3>
        {docs.map((doc) => (
          <div key={doc.id} className={cn("flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100", doc.locked && "opacity-50")}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                {React.cloneElement(doc.icon as React.ReactElement, { className: "w-5 h-5" })}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">{doc.name}</h4>
                <p className="text-[10px] text-slate-400">{doc.cat}</p>
              </div>
            </div>
            <span className={cn("text-[8px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider", doc.s === 'Verified' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500')}>
              {doc.s}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const PRTrackerScreen = ({ mode, onTalkToMara }: { mode: JourneyMode, onTalkToMara: () => void }) => (
  <div className="flex-1 overflow-y-auto p-5 pt-16 space-y-6">
    <h2 className="text-2xl font-bold text-slate-900">PR Pathway</h2>
    {mode === 'pre-arrival' ? (
      <div className="bg-slate-50 rounded-3xl p-8 text-center space-y-4 border border-slate-100">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
          <Lock className="w-6 h-6 text-slate-300" />
        </div>
        <h3 className="font-bold text-slate-800">PR Pathway Preview</h3>
        <p className="text-xs text-slate-500 leading-relaxed">Complete your first semester in Australia to unlock your personalized PR points tracker.</p>
        <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold">Learn Requirements</button>
      </div>
    ) : (
      <div className="bg-emerald-600 rounded-3xl p-6 text-white shadow-xl shadow-emerald-100">
        <p className="text-xs font-bold text-emerald-100 uppercase tracking-widest mb-1">Current Points Estimate</p>
        <h3 className="text-4xl font-black mb-4">75 <span className="text-lg font-normal opacity-70">Points</span></h3>
        <div className="flex gap-2">
          <span className="text-[10px] bg-white/20 px-2 py-1 rounded-lg font-bold">Age: 30</span>
          <span className="text-[10px] bg-white/20 px-2 py-1 rounded-lg font-bold">Study: 20</span>
          <span className="text-[10px] bg-white/20 px-2 py-1 rounded-lg font-bold">Eng: 20</span>
        </div>
      </div>
    )}
    <div className="space-y-4 pb-20">
      <h3 className="font-bold text-slate-800">Next Milestones</h3>
      {[
        { t: "Professional Year", p: "+5 Points", d: false },
        { t: "NAATI CCL Exam", p: "+5 Points", d: false },
        { t: "Regional Study (2 Years)", p: "+5 Points", d: true },
        { t: "State Nomination (190)", p: "+15 Points", d: false },
      ].map((item, i) => (
        <div key={i} className="flex justify-between items-center p-4 bg-white rounded-2xl border border-slate-100">
          <div className="flex items-center gap-3">
            <div className={cn("w-4 h-4 rounded-full border", item.d ? "bg-emerald-500 border-emerald-500" : "border-slate-300")} />
            <span className="text-sm font-bold text-slate-700">{item.t}</span>
          </div>
          <span className="text-xs font-bold text-emerald-600">{item.p}</span>
        </div>
      ))}
      <button 
        onClick={onTalkToMara}
        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2"
      >
        Talk to MARA Agent <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  </div>
);

const NewsScreen = () => (
  <div className="flex-1 overflow-y-auto p-5 pt-16 space-y-6">
    <h2 className="text-2xl font-bold text-slate-900">EduNavi News</h2>
    <div className="space-y-6 pb-20">
      {BLOG_POSTS.map((post) => (
        <div key={post.id} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
          <img src={post.image} alt={post.title} className="w-full h-40 object-cover" referrerPolicy="no-referrer" />
          <div className="p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded-lg">{post.category}</span>
              <span className="text-[10px] text-slate-400 font-medium">{post.date}</span>
            </div>
            <h3 className="font-bold text-slate-800 leading-tight">{post.title}</h3>
            <button className="text-xs font-bold text-indigo-600 flex items-center gap-1 pt-2">Read More <ChevronRight className="w-3 h-3" /></button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ProfileScreen = ({ gpa, setGpa, studentData, mode, setMode }: { gpa: number, setGpa: (v: number) => void, studentData: StudentData, mode: JourneyMode, setMode: (m: JourneyMode) => void }) => {
  const [showModeModal, setShowModeModal] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto p-5 pt-16 space-y-8 relative">
      <div className="flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-4 relative">
          <Users className="w-10 h-10 text-indigo-600" />
          <button className="absolute bottom-0 right-0 p-2 bg-indigo-600 rounded-full text-white border-4 border-white"><PlusCircle className="w-4 h-4" /></button>
        </div>
        <h2 className="text-xl font-bold text-slate-900">{studentData.name || 'Shariar Hosan'}</h2>
        <p className="text-sm text-slate-500">{studentData.university || 'Monash University'} • {studentData.course || 'IT'}</p>
        {studentData.intakeDate && <p className="text-[10px] text-indigo-600 font-bold uppercase mt-1">Intake: {studentData.intakeDate}</p>}
        
        <button 
          onClick={() => setShowModeModal(true)}
          className="mt-4 px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold flex items-center gap-2 border border-slate-200"
        >
          {mode === 'pre-arrival' ? '🇧🇩 Pre-Arrival' : '🇦🇺 In Australia'}
          <ChevronRight className="w-3 h-3 rotate-90" />
        </button>
      </div>

      {/* Mode Switch Modal (Duplicate for Profile) */}
      <AnimatePresence>
        {showModeModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModeModal(false)}
              className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="absolute top-1/4 left-5 right-5 bg-white rounded-3xl p-6 z-[70] shadow-2xl border border-slate-100"
            >
              <h3 className="font-bold text-slate-900 mb-4">Switch Journey Mode</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => { setMode('pre-arrival'); setShowModeModal(false); }}
                  className={cn("w-full p-4 rounded-2xl text-sm font-bold flex items-center justify-between", mode === 'pre-arrival' ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-600')}
                >
                  🇧🇩 Bangladesh (Preparing)
                  {mode === 'pre-arrival' && <CheckCircle2 className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => { setMode('post-arrival'); setShowModeModal(false); }}
                  className={cn("w-full p-4 rounded-2xl text-sm font-bold flex items-center justify-between", mode === 'post-arrival' ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-600')}
                >
                  🇦🇺 Australia (Arrived)
                  {mode === 'post-arrival' && <CheckCircle2 className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        <h3 className="font-bold text-slate-800">Academic Status</h3>
        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-slate-600">Current CGPA</span>
            <span className="text-xl font-black text-indigo-600">{gpa.toFixed(1)}</span>
          </div>
          <input type="range" min="0" max="4" step="0.1" value={gpa} onChange={(e) => setGpa(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
          <p className="text-[10px] text-slate-400 mt-3 text-center uppercase font-bold tracking-widest">Slide to simulate GPA for Parent Visa unlock</p>
        </div>
      </div>
      <div className="space-y-2 pb-20">
        {[
          { icon: <Settings />, label: 'App Settings' },
          { icon: <DollarSign />, label: 'Remittance History' },
          { icon: <GraduationCap />, label: 'University Docs' },
          { icon: <Heart />, label: 'Help & Support' },
        ].map((item, i) => (
          <button key={i} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors">
            <div className="flex items-center gap-4">
              <div className="text-slate-400">{item.icon}</div>
              <span className="text-sm font-bold text-slate-700">{item.label}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300" />
          </button>
        ))}
      </div>
    </div>
  );
};

const MessagesScreen = ({ conversations, setConversations, initialMessage, onClearDraft }: { 
  conversations: Conversation[], 
  setConversations: (c: Conversation[]) => void, 
  initialMessage?: string,
  onClearDraft?: () => void
}) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [inputText, setInputText] = useState(initialMessage || '');

  useEffect(() => {
    if (initialMessage) {
      setInputText(initialMessage);
      // If there's an initial message, we likely want to talk to the MARA agent
      const maraConv = conversations.find(c => c.advisorName.includes('MARA'));
      if (maraConv) setSelectedId(maraConv.id);
      
      // Clear the draft in parent so it doesn't re-apply if we navigate away and back
      if (onClearDraft) onClearDraft();
    }
  }, [initialMessage, conversations, onClearDraft]);

  const selectedConversation = conversations.find(c => c.id === selectedId);

  const handleSendMessage = () => {
    if (!inputText.trim() || selectedId === null) return;

    const newMessage: Message = {
      id: Date.now(),
      sender: 'student',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setConversations(conversations.map(c => 
      c.id === selectedId 
        ? { ...c, lastMessage: inputText, messages: [...c.messages, newMessage] }
        : c
    ));
    setInputText('');
  };

  return (
    <div className="flex-1 flex flex-col pt-16 h-full overflow-hidden">
      <AnimatePresence mode="wait">
        {!selectedId ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 p-5 space-y-4 overflow-y-auto"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Messages</h2>
            {conversations.map(conv => (
              <button 
                key={conv.id}
                onClick={() => setSelectedId(conv.id)}
                className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-600 transition-all text-left"
              >
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold text-slate-800 truncate">{conv.advisorName}</h4>
                    {conv.unread && <div className="w-2 h-2 bg-indigo-600 rounded-full" />}
                  </div>
                  <p className="text-xs text-slate-500 truncate">{conv.lastMessage}</p>
                </div>
              </button>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="chat"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex-1 flex flex-col h-full"
          >
            <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-white">
              <button onClick={() => setSelectedId(null)} className="p-2 hover:bg-slate-50 rounded-full">
                <ChevronLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">{selectedConversation?.advisorName}</h4>
                <p className="text-[10px] text-emerald-500 font-bold uppercase">Online</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50">
              {selectedConversation?.messages.map(msg => (
                <div key={msg.id} className={cn("flex flex-col max-w-[80%]", msg.sender === 'student' ? "ml-auto items-end" : "mr-auto items-start")}>
                  <div className={cn("p-3 rounded-2xl text-sm", msg.sender === 'student' ? "bg-indigo-600 text-white rounded-tr-none" : "bg-white text-slate-700 border border-slate-100 rounded-tl-none")}>
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1 font-bold">{msg.timestamp}</span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-white border-t border-slate-100 flex gap-2 pb-8">
              <input 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-indigo-600"
              />
              <button 
                onClick={handleSendMessage}
                className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-100"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const [screen, setScreen] = useState<Screen>('onboarding');
  const [mode, setMode] = useState<JourneyMode>('pre-arrival');
  const [gpa, setGpa] = useState(2.8);
  const [toast, setToast] = useState<string | null>(null);
  const [ielts, setIelts] = useState<IeltsScores>({ L: 7, R: 7, W: 6.5, S: 7 });
  const [msgDraft, setMsgDraft] = useState<string | undefined>(undefined);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: 1, text: "Get Australian SIM", done: true },
    { id: 2, text: "Open Commonwealth Bank", done: true },
    { id: 3, text: "Apply for TFN", done: false },
    { id: 4, text: "Buy Myki Card", done: false },
  ]);

  const [studentData, setStudentData] = useState<StudentData>({
    name: '',
    university: '',
    course: '',
    intakeDate: '',
    visaSubclass: '500'
  });

  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);

  const [appStatus, setAppStatus] = useState<AppStatusStep[]>([
    { label: 'Offer Letter', status: 'Completed' },
    { label: 'COE (Enrolment)', status: 'In Progress' },
    { label: 'Visa Application', status: 'Pending' },
  ]);

  const handleTalkToMara = () => {
    const maraExists = conversations.some(c => c.advisorName.includes('MARA'));
    if (!maraExists) {
      const newConv: Conversation = {
        id: Date.now(),
        advisorName: 'MARA Agent David',
        lastMessage: 'How can I help with your PR pathway?',
        unread: false,
        messages: [
          { id: 1, sender: 'advisor', text: 'Hello! I am David, a registered MARA agent. How can I help with your PR pathway?', timestamp: 'Just now' }
        ]
      };
      setConversations([...conversations, newConv]);
    }
    setMsgDraft("I need help with my PR pathway.");
    setScreen('messages');
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const navItems = mode === 'pre-arrival' 
    ? [
        { id: 'home', label: 'Home', icon: <Home /> },
        { id: 'apply', label: 'Apply', icon: <Search /> },
        { id: 'messages', label: 'Inbox', icon: <Bell /> },
        { id: 'vault', label: 'Vault', icon: <Lock /> },
        { id: 'profile', label: 'Profile', icon: <Settings /> },
      ]
    : [
        { id: 'home', label: 'Home', icon: <Home /> },
        { id: 'jobs', label: 'Jobs', icon: <Briefcase /> },
        { id: 'messages', label: 'Inbox', icon: <Bell /> },
        { id: 'vault', label: 'Vault', icon: <Lock /> },
        { id: 'profile', label: 'Profile', icon: <Settings /> },
      ];

  return (
    <MobileFrame>
      <AnimatePresence mode="wait">
        {screen === 'onboarding' && (
          <motion.div key="onboarding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col">
            <Onboarding 
              onComplete={() => setScreen('home')} 
              setMode={setMode} 
              studentData={studentData}
              setStudentData={setStudentData}
            />
          </motion.div>
        )}
        
        {screen !== 'onboarding' && (
          <motion.div key="app" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col">
            <div className="flex-1 flex flex-col overflow-hidden relative">
              <AnimatePresence mode="wait">
                <motion.div key={screen} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="absolute inset-0 flex flex-col">
                  {screen === 'home' && (
                    <HomeScreen 
                      gpa={gpa} 
                      mode={mode} 
                      setMode={setMode} 
                      checklist={checklist} 
                      setChecklist={setChecklist} 
                      ielts={ielts} 
                      setIelts={setIelts} 
                      setScreen={setScreen} 
                      appStatus={appStatus}
                      studentData={studentData}
                    />
                  )}
                  {screen === 'jobs' && <JobsScreen onApply={(title) => showToast(`Applied for ${title}!`)} />}
                  {screen === 'community' && <CommunityScreen />}
                  {screen === 'pr-tracker' && <PRTrackerScreen mode={mode} onTalkToMara={handleTalkToMara} />}
                  {screen === 'profile' && <ProfileScreen gpa={gpa} setGpa={setGpa} studentData={studentData} mode={mode} setMode={setMode} />}
                  {screen === 'vault' && <VaultScreen mode={mode} />}
                  {screen === 'apply' && <ApplyScreen />}
                  {screen === 'news' && <NewsScreen />}
                  {screen === 'messages' && (
                    <MessagesScreen 
                      conversations={conversations} 
                      setConversations={setConversations} 
                      initialMessage={msgDraft} 
                      onClearDraft={() => setMsgDraft(undefined)}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {toast && (
                <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-2xl text-xs font-bold shadow-xl z-50 whitespace-nowrap">
                  {toast}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="h-20 bg-white border-t border-slate-100 flex items-center justify-around px-2 pb-4">
              {navItems.map((item) => (
                <button key={item.id} onClick={() => setScreen(item.id as Screen)} className={cn("flex flex-col items-center gap-1 p-1 transition-all", screen === item.id ? "text-indigo-600" : "text-slate-300")}>
                  {React.cloneElement(item.icon as React.ReactElement, { className: "w-5 h-5" })}
                  <span className="text-[9px] font-bold uppercase tracking-wider">{item.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </MobileFrame>
  );
}
