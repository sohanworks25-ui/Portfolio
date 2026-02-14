
import React from 'react';
import { useApp } from '../context/AppContext';

const Skills: React.FC = () => {
  const { data } = useApp();

  return (
    <section id="skills" className="py-24 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          <div className="lg:w-1/3">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Technical Skills</h2>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
              I specialize in a wide range of frontend and backend technologies, ensuring I can build comprehensive full-stack solutions.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800">
                <span className="block text-2xl font-bold text-blue-600">50+</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Projects Done</span>
              </div>
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-800">
                <span className="block text-2xl font-bold text-indigo-600">100%</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Client Satisfaction</span>
              </div>
            </div>
          </div>
          
          <div className="lg:w-2/3 w-full grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
            {data.skills.map((skill) => (
              <div key={skill.id} className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-700 dark:text-gray-300">{skill.name}</span>
                  <span className="text-sm font-semibold text-blue-600">{skill.percentage}%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-1000"
                    style={{ width: `${skill.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
