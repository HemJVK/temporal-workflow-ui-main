import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, BookOpen, GitMerge, FileJson, PlayCircle, ArrowLeft } from 'lucide-react';

export default function TutorialPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-y-auto selection:bg-purple-500/30">
      <nav className="w-full border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ArrowLeft size={20} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-300">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Zap size={16} className="text-white fill-white" />
            </div>
            <span className="font-bold tracking-tight">Agent Flow</span>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
            How to Build Workflows
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
            Master the canvas. Learn how to drag, drop, connect, and deploy production-grade agentic workflows in minutes.
          </p>
        </div>

        <div className="space-y-12">
          <TutorialStep 
            number={1} 
            title="Drag & Drop Nodes" 
            icon={<BookOpen className="text-blue-400" size={24} />}
            description="Open the left sidebar to discover all available nodes. We have Triggers, Logic Gates, integrations, and DB connectors. Drag any node directly onto the canvas."
            image="https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=2070&auto=format&fit=crop"
          />
          
          <TutorialStep 
            number={2} 
            title="Configure Node Properties" 
            icon={<FileJson className="text-purple-400" size={24} />}
            description="Click on any node on the canvas to open the right-side configuration panel. Here you can set parameters, URLs, API keys, and map dynamic variables."
            image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
          />

          <TutorialStep 
            number={3} 
            title="Connect the Dots" 
            icon={<GitMerge className="text-pink-400" size={24} />}
            description="Click and drag from the output handle (right side) of one node to the input handle (left side) of another. This defines the execution path of your workflow."
            image="https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop"
          />

          <TutorialStep 
            number={4} 
            title="Deploy & Execute" 
            icon={<PlayCircle className="text-green-400" size={24} />}
            description="Hit the 'Deploy Workflow' button on the top right. This pushes your graph to our Temporal-backed engine. Once deployed, click 'Run Workflow' to see it in action!"
            image="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop"
          />
        </div>
        
        <div className="mt-20 text-center bg-white/5 border border-white/10 rounded-3xl p-12 backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-4">Ready to start?</h2>
          <p className="text-gray-400 mb-8">Sign up now and get 30 free monthly credits when you enroll with your mobile phone.</p>
          <Link to="/signup" className="flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-200 transition-colors mx-auto w-fit">
            Create Your First Workflow
            <Zap size={18} className="fill-black" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function TutorialStep({ number, title, description, icon, image }: { number: number, title: string, description: string, icon: React.ReactNode, image: string }) {
  return (
    <div className="flex flex-col md:flex-row gap-8 items-start bg-white/[0.02] border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-colors group">
      <div className="flex-1 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-xl font-black text-white mb-6 shadow-inner group-hover:scale-110 transition-transform">
          {number}
        </div>
        <h3 className="text-2xl font-bold flex items-center gap-3">
          {icon}
          {title}
        </h3>
        <p className="text-gray-400 text-lg leading-relaxed font-light">
          {description}
        </p>
      </div>
      <div className="w-full md:w-1/2 aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
         <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-transparent transition-colors" />
         <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 mix-blend-luminosity" />
      </div>
    </div>
  );
}
