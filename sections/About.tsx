
import React from 'react';
import { useApp } from '../context/AppContext';
import { User, Briefcase, GraduationCap, Calendar } from 'lucide-react';

const About: React.FC = () => {
  const { data } = useApp();

  return (
    <section id="about" className="py-20 lg:py-32 bg-white dark:bg-gray-950 overflow-hidden">
      <div className="container mx-auto px-6 sm:px-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          <div className="lg:w-1/2 order-2 lg:order-1">
            <div className="relative mb-10 text-center lg:text-left">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-600/5 rounded-full blur-2xl"></div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black flex items-center justify-center lg:justify-start gap-4">
                <span className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-2xl text-blue-600">
                   <User size={28} />
                </span>
                About Me
              </h2>
            </div>
            
            <div className="space-y-6 text-center lg:text-left">
              <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-200 font-bold leading-relaxed">
                {data.profile.bio}
              </p>
              <div className="text-base text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                {data.profile.aboutMe}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">
              <div className="p-6 rounded-[2rem] bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 shadow-sm transition-all hover:scale-[1.02]">
                <div className="flex items-center gap-3 mb-6 text-blue-600">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                    <Briefcase size={16} />
                  </div>
                  <h3 className="font-bold text-xs uppercase tracking-widest">Experience</h3>
                </div>
                <div className="space-y-5">
                  {data.experience.map(exp => (
                    <div key={exp.id} className="border-l-2 border-blue-200 dark:border-blue-800 pl-4 py-1">
                      <p className="font-bold text-sm leading-tight text-gray-900 dark:text-white">{exp.role}</p>
                      <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">{exp.company} • {exp.period}</p>
                    </div>
                  ))}
                  {data.experience.length === 0 && <p className="text-xs text-gray-400 italic">No experience added</p>}
                </div>
              </div>
              
              <div className="p-6 rounded-[2rem] bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 shadow-sm transition-all hover:scale-[1.02]">
                <div className="flex items-center gap-3 mb-6 text-indigo-600">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                    <GraduationCap size={16} />
                  </div>
                  <h3 className="font-bold text-xs uppercase tracking-widest">Education</h3>
                </div>
                <div className="space-y-5">
                  {data.education.map(edu => (
                    <div key={edu.id} className="border-l-2 border-indigo-200 dark:border-indigo-800 pl-4 py-1">
                      <p className="font-bold text-sm leading-tight text-gray-900 dark:text-white">{edu.degree}</p>
                      <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">{edu.institution} • {edu.period}</p>
                    </div>
                  ))}
                  {data.education.length === 0 && <p className="text-xs text-gray-400 italic">No education added</p>}
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 order-1 lg:order-2 w-full max-w-[280px] sm:max-w-sm md:max-w-md mx-auto">
             <div className="aspect-square relative group">
                <div className="absolute inset-0 bg-blue-600 rounded-[2.5rem] sm:rounded-[4rem] rotate-3 sm:rotate-6 opacity-20 group-hover:rotate-0 transition-transform duration-700"></div>
                <div className="absolute inset-0 bg-indigo-600 rounded-[2.5rem] sm:rounded-[4rem] -rotate-3 opacity-10 group-hover:rotate-0 transition-transform duration-700"></div>
                <img 
                  src={data.profile.photoUrl} 
                  alt="Sohan - About" 
                  className="absolute inset-0 w-full h-full object-cover rounded-[2.5rem] sm:rounded-[4rem] shadow-2xl relative z-10"
                />
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
