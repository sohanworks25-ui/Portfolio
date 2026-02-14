
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ExternalLink, Github, ChevronRight } from 'lucide-react';

const Projects: React.FC = () => {
  const { data } = useApp();
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Web', 'App', 'Design'];
  const projects = data.projects.filter(p => 
    p.published && (filter === 'All' || p.category === filter)
  );

  return (
    <section id="projects" className="py-24 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Portfolio Projects</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            A selection of my best works in web development, application design, and complex problem-solving.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                filter === cat 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="group bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-500"
            >
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <div className="flex gap-4">
                    {project.liveLink && (
                      <a href={project.liveLink} target="_blank" rel="noreferrer" className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-white/40">
                        <ExternalLink size={20} />
                      </a>
                    )}
                    {project.githubLink && (
                      <a href={project.githubLink} target="_blank" rel="noreferrer" className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-white/40">
                        <Github size={20} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">{project.category}</span>
                <h3 className="text-xl font-bold mt-2 mb-3 group-hover:text-blue-600 transition-colors">{project.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-6">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map(tech => (
                    <span key={tech} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-[10px] font-bold text-gray-600 dark:text-gray-300">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {projects.length === 0 && (
          <div className="text-center py-20 text-gray-400 italic">
            No projects found in this category.
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
