import { useState } from 'react';
import { X, ArrowRight, CheckCircle2, Workflow, Database, PlayCircle } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const TOUR_STEPS = [
  {
    title: "Welcome to Agent Flow! 👋",
    description: "You're looking at the ultimate production-grade canvas. Built to be lightning fast and visually stunning. Let's take a quick 3-step tour.",
    icon: <Workflow size={40} className="text-purple-400" />
  },
  {
    title: "Nodes & Integrations",
    description: "Open the sidebar on the left. You can drag and drop Database connectors, AI Agents, Email nodes, and more directly onto the grid. Everything is real-time.",
    icon: <Database size={40} className="text-blue-400" />
  },
  {
    title: "Temporal Execution Engine",
    description: "Connect the dots and hit Deploy on the top right. We map this graph directly into a Temporal Workflow backend, making it scalable, resumable, and invincible to crashes.",
    icon: <PlayCircle size={40} className="text-green-400" />
  }
];

export default function TutorialOverlay({ onClose }: Props) {
  const [step, setStep] = useState(0);

  const nextStep = () => {
    if (step < TOUR_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      // Complete
      handleComplete();
    }
  };

  const handleComplete = () => {
    // In a full DB implementation, we should send an API request to `auth/me/tutorial-seen`
    // to mark `has_seen_tutorial = true` on the database. 
    // Here we will just close it.
    onClose();
  };

  const current = TOUR_STEPS[step];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-500">
      <div className="bg-gray-900 border border-purple-500/30 w-full max-w-lg rounded-3xl p-8 shadow-[0_0_100px_rgba(147,51,234,0.2)] relative overflow-hidden transition-all text-center">
        {/* Abstract shapes */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-purple-600/20 blur-[80px] rounded-full" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-blue-600/20 blur-[80px] rounded-full" />
        
        <button onClick={handleComplete} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors bg-white/5 rounded-full p-2">
           <X size={20} />
        </button>

        <div className="relative z-10 flex flex-col items-center pt-4">
           {/* Step Indicator */}
           <div className="flex gap-2 mb-8">
              {TOUR_STEPS.map((_, i) => (
                <div key={i} className={`w-3 h-3 rounded-full transition-all duration-300 ${i === step ? 'bg-purple-500 scale-125' : 'bg-white/20'}`} />
              ))}
           </div>

           <div className="mb-6 bg-white/5 p-6 rounded-3xl border border-white/10 shadow-inner">
             {current.icon}
           </div>

           <h2 className="text-2xl font-bold text-white mb-4">{current.title}</h2>
           <p className="text-gray-400 leading-relaxed mb-10 min-h-[80px] text-lg font-light">
             {current.description}
           </p>

           <button onClick={nextStep} className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(147,51,234,0.4)] transition-all transform hover:scale-105">
             {step === TOUR_STEPS.length - 1 ? (
               <>Got it, let's build! <CheckCircle2 size={20} /></>
             ) : (
               <>Next <ArrowRight size={20} /></>
             )}
           </button>
        </div>
      </div>
    </div>
  );
}
