import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Workflow, Server, Shield, Smartphone, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-hidden selection:bg-purple-500/30">
      {/* Navbar */}
      <nav className="fixed w-full z-50 top-0 border-b border-white/5 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Zap size={24} className="text-white fill-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Agent Flow</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/tutorial" className="text-sm text-gray-400 hover:text-white transition-colors">Tutorial</Link>
            <Link to="/login" className="text-sm font-medium hover:text-purple-400 transition-colors">Sign In</Link>
            <Link to="/signup" className="text-sm font-medium bg-white text-black px-5 py-2.5 rounded-full hover:bg-gray-100 transition-transform hover:scale-105">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/20 rounded-full blur-[120px] opacity-50 mix-blend-screen pointer-events-none" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] opacity-40 mix-blend-screen pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-500 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Build Workflows. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
              Ship Faster.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-150 font-light">
            The ultimate production-grade agent builder. Connect APIs, LLMs, and databases visually without compromising on performance. 
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
            <Link to="/signup" className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-[0_0_40px_rgba(147,51,234,0.4)] transition-all hover:scale-105">
              Sign Up Free
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/tutorial" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-colors">
              Read Tutorial
            </Link>
          </div>
          
          <div className="mt-8">
             <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
               <Smartphone size={16} className="text-purple-400" /> Enroll with mobile, get <strong className="text-white">30 credits/month</strong> free!
             </p>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
          {[
            { value: '200+', label: 'Tool Integrations' },
            { value: '10×', label: 'Faster Automation' },
            { value: '99.9%', label: 'Uptime SLA' },
            { value: 'Free', label: 'To Start' },
          ].map((stat) => (
            <div key={stat.label} className="bg-black/60 px-8 py-8 text-center hover:bg-white/[0.03] transition-colors">
              <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Node Graph Illustration */}
      <div className="max-w-5xl mx-auto px-6 pb-32">
        <div className="relative rounded-3xl border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent overflow-hidden p-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(147,51,234,0.06)_0%,transparent_70%)]" />
          <svg viewBox="0 0 900 320" className="w-full h-auto opacity-90" aria-label="Workflow automation diagram">
            <line x1="160" y1="160" x2="290" y2="160" stroke="#9333ea" strokeWidth="1.5" strokeDasharray="6 3" opacity="0.5" />
            <line x1="410" y1="160" x2="490" y2="160" stroke="#9333ea" strokeWidth="1.5" strokeDasharray="6 3" opacity="0.5" />
            <line x1="490" y1="160" x2="570" y2="100" stroke="#9333ea" strokeWidth="1.5" strokeDasharray="6 3" opacity="0.5" />
            <line x1="490" y1="160" x2="570" y2="220" stroke="#9333ea" strokeWidth="1.5" strokeDasharray="6 3" opacity="0.5" />
            <line x1="690" y1="100" x2="770" y2="160" stroke="#9333ea" strokeWidth="1.5" strokeDasharray="6 3" opacity="0.5" />
            <line x1="690" y1="220" x2="770" y2="160" stroke="#9333ea" strokeWidth="1.5" strokeDasharray="6 3" opacity="0.5" />
            <rect x="60" y="130" width="100" height="60" rx="14" fill="rgba(168,85,247,0.15)" stroke="rgba(168,85,247,0.5)" strokeWidth="1.5" />
            <text x="110" y="154" textAnchor="middle" fill="#d8b4fe" fontSize="9" fontWeight="600">WEBHOOK</text>
            <text x="110" y="170" textAnchor="middle" fill="#e9d5ff" fontSize="11" fontWeight="700">Trigger</text>
            <rect x="290" y="130" width="120" height="60" rx="14" fill="rgba(59,130,246,0.12)" stroke="rgba(59,130,246,0.4)" strokeWidth="1.5" />
            <text x="350" y="154" textAnchor="middle" fill="#93c5fd" fontSize="9" fontWeight="600">HTTP · GET</text>
            <text x="350" y="170" textAnchor="middle" fill="#bfdbfe" fontSize="11" fontWeight="700">Fetch Data</text>
            <rect x="490" y="130" width="80" height="60" rx="14" fill="rgba(234,179,8,0.12)" stroke="rgba(234,179,8,0.4)" strokeWidth="1.5" />
            <text x="530" y="154" textAnchor="middle" fill="#fde68a" fontSize="9" fontWeight="600">LOGIC</text>
            <text x="530" y="170" textAnchor="middle" fill="#fef3c7" fontSize="11" fontWeight="700">Router</text>
            <rect x="570" y="70" width="120" height="60" rx="14" fill="rgba(16,185,129,0.12)" stroke="rgba(16,185,129,0.4)" strokeWidth="1.5" />
            <text x="630" y="94" textAnchor="middle" fill="#6ee7b7" fontSize="9" fontWeight="600">AI AGENT</text>
            <text x="630" y="110" textAnchor="middle" fill="#a7f3d0" fontSize="11" fontWeight="700">Draft Email</text>
            <rect x="570" y="190" width="120" height="60" rx="14" fill="rgba(244,63,94,0.12)" stroke="rgba(244,63,94,0.4)" strokeWidth="1.5" />
            <text x="630" y="214" textAnchor="middle" fill="#fda4af" fontSize="9" fontWeight="600">LLM</text>
            <text x="630" y="230" textAnchor="middle" fill="#fecdd3" fontSize="11" fontWeight="700">Summarise</text>
            <rect x="770" y="130" width="100" height="60" rx="14" fill="rgba(147,51,234,0.15)" stroke="rgba(147,51,234,0.5)" strokeWidth="1.5" />
            <text x="820" y="154" textAnchor="middle" fill="#d8b4fe" fontSize="9" fontWeight="600">END</text>
            <text x="820" y="170" textAnchor="middle" fill="#e9d5ff" fontSize="11" fontWeight="700">Complete</text>
            <circle r="3" fill="#a855f7" opacity="0.9">
              <animateMotion dur="2s" repeatCount="indefinite" path="M160,160 L290,160" />
            </circle>
            <circle r="3" fill="#a855f7" opacity="0.9">
              <animateMotion dur="2.5s" repeatCount="indefinite" path="M410,160 L490,160" />
            </circle>
            <circle r="3" fill="#22c55e" opacity="0.9">
              <animateMotion dur="3s" repeatCount="indefinite" path="M490,160 L570,100" />
            </circle>
            <circle r="3" fill="#f43f5e" opacity="0.9">
              <animateMotion dur="3s" repeatCount="indefinite" path="M490,160 L570,220" />
            </circle>
          </svg>
          <p className="text-center text-xs text-gray-600 mt-2 tracking-widest uppercase">Visual Workflow Canvas — Drag, Drop, Connect</p>
        </div>
      </div>

      {/* Features Section */}
      <div className="border-t border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={<Shield size={32} className="text-blue-400" />}
              title="Enterprise Grade Security"
              description="Built to run in zero-trust environments. End-to-end encryption with seamless SSO integration and robust RBAC."
            />
            <FeatureCard 
              icon={<Server size={32} className="text-purple-400" />}
              title="Lightweight & Fast"
              description="Under the hood, we use an ultra-lean Rust/NestJS engine. Designed to run smoothly even on 512MB RAM instances."
            />
            <FeatureCard 
              icon={<Workflow size={32} className="text-pink-400" />}
              title="Dynamic Graph Execution"
              description="Powered by Temporal. Pause, resume, and version workflows without losing state or skipping a beat."
            />
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="border-t border-white/5 py-12 text-center text-gray-500 text-sm">
        <p>© 2026 Agent Flow Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-3xl border border-white/5 hover:border-purple-500/30 hover:bg-white/[0.02] transition-colors group">
      <div className="mb-6 p-4 rounded-2xl bg-white/5 inline-block group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed font-light">{description}</p>
    </div>
  );
}
