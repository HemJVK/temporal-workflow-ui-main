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
              Get Started
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
              Start Building Free
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

      {/* Mockup / Dashboard Preview Section */}
      <div className="max-w-6xl mx-auto px-6 pb-32">
        <div className="relative rounded-2xl border border-white/10 bg-black/40 overflow-hidden shadow-2xl shadow-purple-500/10 group backdrop-blur-xl">
           <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
           <div className="h-10 border-b border-white/5 flex items-center px-4 gap-2 bg-white/5">
             <div className="w-3 h-3 rounded-full bg-red-500/80" />
             <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
             <div className="w-3 h-3 rounded-full bg-green-500/80" />
           </div>
           {/* Abstract visual representing node graph */}
           <div className="h-[400px] md:h-[600px] w-full bg-[url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-luminosity transition-transform duration-1000 group-hover:scale-105"></div>
           
           <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
             <div className="w-24 h-24 bg-purple-600/30 backdrop-blur-md border border-purple-500/50 rounded-2xl flex items-center justify-center shadow-[0_0_50px_rgba(147,51,234,0.5)]">
               <Workflow size={40} className="text-purple-300" />
             </div>
           </div>
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
