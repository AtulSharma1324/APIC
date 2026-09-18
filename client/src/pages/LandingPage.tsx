import React from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  BookOpen, 
  Award, 
  FileText, 
  ClipboardCheck, 
  Bot, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck,
  Search,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Logo } from '../components/Logo';

export const LandingPage: React.FC = () => {
  const featureCards = [
    {
      title: 'Program Information',
      description: 'Explore full degree structures including MCA, MSc, BCA, and BSc with specialized tracks.',
      icon: GraduationCap,
      color: 'bg-blue-500/10 text-blue-600',
      link: '/programs'
    },
    {
      title: 'Semester-wise Curriculum',
      description: 'Filter subjects by program, specialization, and semester to understand course progressions.',
      icon: BookOpen,
      color: 'bg-indigo-500/10 text-indigo-600',
      link: '/student/curriculum'
    },
    {
      title: 'Subject Credits',
      description: 'Transparent breakdown of core, elective, lab, and project credit allocations.',
      icon: Award,
      color: 'bg-amber-500/10 text-amber-600',
      link: '/student/credits'
    },
    {
      title: 'Syllabus Download',
      description: 'Access official PDF syllabus documents with version control and downloadable guides.',
      icon: FileText,
      color: 'bg-emerald-500/10 text-emerald-600',
      link: '/student/syllabus'
    },
    {
      title: 'CA Information',
      description: 'Understand Continuous Assessment rules, best-of-N policies, and weightage rules.',
      icon: ClipboardCheck,
      color: 'bg-rose-500/10 text-rose-600',
      link: '/student/assessment'
    },
    {
      title: 'AI Academic Assistant',
      description: 'Ask instant academic questions answered strictly using verified database records.',
      icon: Bot,
      color: 'bg-purple-500/10 text-purple-600',
      link: '/student/ai-assistant',
      badge: 'Gemini AI'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Hero Section - Sunset Theme matching Image 1 Splash Screen */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-sunset-header text-white shadow-xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Logo with Concentric Ripple Ring */}
          <div className="flex justify-center mb-8">
            <div className="relative rounded-full logo-ripple">
              <div className="w-28 h-28 sm:w-36 sm:h-36 bg-white rounded-full shadow-2xl border-4 border-white/90 flex items-center justify-center animate-in zoom-in-95 duration-500 overflow-hidden p-0">
                <Logo size="full" showText={false} className="w-full h-full" />
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 border border-white/30 text-white text-xs font-black mb-6 backdrop-blur-xs">
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>ACADEMICZ &bull; Official Institutional Credit Portal</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto drop-shadow-sm">
            Academic Program & Credit Information System
          </h1>

          <p className="mt-6 text-base sm:text-lg text-orange-100 max-w-2xl mx-auto font-medium leading-relaxed">
            Your centralized portal for degree structures, credits, syllabus files, Continuous Assessment (CA) rules, and grounded AI assistance.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/programs"
              className="px-6 py-3.5 text-sm font-black text-slate-900 bg-white rounded-2xl hover:bg-orange-50 transition shadow-xl shadow-orange-950/10 flex items-center gap-2"
            >
              <span>Explore Programs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/student/ai-assistant"
              className="px-6 py-3.5 text-sm font-black text-white bg-slate-900 rounded-2xl hover:bg-slate-800 transition shadow-xl flex items-center gap-2"
            >
              <Bot className="w-4 h-4 text-amber-400" />
              <span>Ask AI Assistant</span>
            </Link>

            <Link
              to="/login"
              className="px-6 py-3.5 text-sm font-extrabold text-white border-2 border-white/60 bg-white/10 rounded-2xl hover:bg-white/20 transition backdrop-blur-xs"
            >
              Student Login
            </Link>

            <Link
              to="/admin/login"
              className="px-6 py-3.5 text-sm font-extrabold text-white border-2 border-amber-300/60 bg-amber-500/20 rounded-2xl hover:bg-amber-500/30 transition flex items-center gap-1.5 backdrop-blur-xs"
            >
              <ShieldCheck className="w-4 h-4 text-amber-200" />
              <span>Admin Login</span>
            </Link>
          </div>

          {/* Institutional Highlights */}
          <div className="mt-16 pt-10 border-t border-white/20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-orange-100 text-xs font-semibold">
            <div>
              <span className="text-xl sm:text-2xl font-black text-white block">100%</span>
              <span>Database Grounded</span>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black text-white block">Official</span>
              <span>Syllabus PDFs</span>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black text-white block">Configurable</span>
              <span>CA Regulations</span>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black text-white block">Gemini AI</span>
              <span>Instant Assistant</span>
            </div>
          </div>

        </div>
      </section>

      {/* Explanation Banner */}
      <section className="py-10 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            "Everything students need to understand their academic journey in one place."
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-2xl mx-auto font-medium">
            Designed specifically for students navigating degree structures, credits, evaluation rules, and official syllabus contents.
          </p>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Comprehensive Academic Modules
          </h2>
          <p className="text-slate-600 text-sm mt-3">
            Access verified academic information maintained directly by institutional administrators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <Link
                key={i}
                to={card.link}
                className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${card.color}`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    {card.badge && (
                      <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase bg-purple-100 text-purple-700 rounded-md">
                        {card.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors mb-2">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {card.description}
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-brand-600">
                  <span>Explore Feature</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-brand-400" />
            <span className="font-bold text-white">Academic Program & Credit Information System</span>
          </div>
          <div>
            Built with React, Express, PostgreSQL & Google Gemini AI.
          </div>
        </div>
      </footer>
    </div>
  );
};
