import React from 'react';
import { BookOpen, Users, Code, Server, Layout } from 'lucide-react';

const About = () => {
  return (
    <div className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-xl shadow-slate-900/50">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400 mb-4">
            About AniSphere
          </h1>
          <p className="text-slate-400 text-lg">
            Anime Browser & Discovery Web App
          </p>
        </div>

        {/* Course Requirements */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4 border-b border-slate-700 pb-2">
            <BookOpen className="w-6 h-6 text-indigo-400" />
            <h2 className="text-2xl font-bold text-slate-100">Project Overview</h2>
          </div>
          <p className="text-slate-300 leading-relaxed">
            This project is an academic submission for the course <strong className="text-white">INTECH 3112</strong>.
            It demonstrates proficiency in building modern web applications using React and consuming RESTful APIs asynchronously.
          </p>
        </section>

        {/* Tech Stack */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4 border-b border-slate-700 pb-2">
            <Code className="w-6 h-6 text-indigo-400" />
            <h2 className="text-2xl font-bold text-slate-100">Technologies Used</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Code className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="font-bold text-slate-200">React</h3>
                <p className="text-xs text-slate-400">Functional Components & Hooks</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
              <div className="p-2 bg-teal-500/10 rounded-lg">
                <Layout className="w-6 h-6 text-teal-400" />
              </div>
              <div>
                <h3 className="font-bold text-slate-200">Tailwind CSS</h3>
                <p className="text-xs text-slate-400">Utility-first Styling</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Server className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="font-bold text-slate-200">Kitsu API</h3>
                <p className="text-xs text-slate-400">RESTful Data Source</p>
              </div>
            </div>
          </div>
        </section>

        {/* Component Hierarchy */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4 border-b border-slate-700 pb-2">
            <Layout className="w-6 h-6 text-indigo-400" />
            <h2 className="text-2xl font-bold text-slate-100">Component Hierarchy</h2>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-sm text-slate-300 border border-slate-700/50 overflow-x-auto">
            <pre>{`App (State: activeView, Data)
├── Navbar
├── Home
├── Browse
│   ├── SearchBar
│   ├── FilterBar
│   ├── Loading / ErrorState
│   └── AnimeCard (Grid)
├── About
└── Footer`}</pre>
          </div>
        </section>

        {/* Credits */}
        <section>
          <div className="flex items-center gap-3 mb-4 border-b border-slate-700 pb-2">
            <Users className="w-6 h-6 text-indigo-400" />
            <h2 className="text-2xl font-bold text-slate-100">Credits</h2>
          </div>
          <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-lg">
            <p className="text-slate-300">
              Developed by Ruiz, Prince Cathric, Esteban, Emilio and Ortiz, John Lloyd as part of First and Second term Project. Special thanks to the creators of the <a href="https://kitsu.docs.apiary.io/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Kitsu API</a> for providing open access to anime data.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
};

export default About;
