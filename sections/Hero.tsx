
import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, Download, Sparkles } from 'lucide-react';

const Hero: React.FC = () => {
  const { data } = useApp();

  const handleDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!data.profile.resumeUrl || data.profile.resumeUrl === '#') {
      e.preventDefault();
      alert("Resume hasn't been uploaded yet.");
      return;
    }

    e.preventDefault();
    try {
      const base64Data = data.profile.resumeUrl;
      const parts = base64Data.split(';base64,');
      if (parts.length !== 2) throw new Error("Malformed data");
      
      const contentType = parts[0].split(':')[1];
      const byteCharacters = atob(parts[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const blob = new Blob([new Uint8Array(byteNumbers)], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${data.profile.name.replace(/\s+/g, '_')}_Resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      window.open(data.profile.resumeUrl, '_blank');
    }
  };

  return (
    <section id="home" className="relative min-h-[90vh] lg:min-h-screen flex items-center pt-24 sm:pt-32 pb-12 overflow-hidden bg-white dark:bg-gray-950">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[80%] lg:w-[50%] h-[50%] bg-blue-600/5 blur-[80px] lg:blur-[120px] rounded-full -z-10 animate-pulse"></div>
      
      <div className="container mx-auto px-6 sm:px-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
          <div className="flex-[1.4] text-center lg:text-left order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 py-2 px-4 sm:px-5 mb-6 sm:mb-8 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100/50 dark:border-blue-800/30 text-blue-600 dark:text-blue-400 text-[10px] sm:text-xs font-bold tracking-widest uppercase">
              <Sparkles size={14} className="animate-spin duration-[4s]" />
              Creative Developer Portfolio
            </div>
            
            <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-black leading-[1.1] mb-6 sm:mb-8 bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 dark:from-white dark:via-gray-100 dark:to-gray-500 bg-clip-text text-transparent">
              Building the <span className="text-blue-600">future</span> of web.
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 sm:mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              I'm <span className="text-gray-900 dark:text-white font-bold">{data.profile.name}</span>, a {data.profile.designation}. {data.profile.bio}
            </p>
            
            <div className="flex flex-col xs:flex-row gap-4 sm:gap-5 justify-center lg:justify-start">
              <a href="#projects" className="group flex items-center justify-center gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm sm:text-lg transition-all shadow-xl shadow-blue-600/30 hover:-translate-y-1 active:scale-95">
                Explore Projects
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a 
                href={data.profile.resumeUrl} 
                onClick={handleDownload}
                className="flex items-center justify-center gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-2xl font-black text-sm sm:text-lg transition-all hover:-translate-y-1 active:scale-95"
              >
                <Download size={20} />
                Resume
              </a>
            </div>
          </div>
          
          <div className="flex-1 w-full max-w-[280px] xs:max-w-[320px] sm:max-w-[400px] lg:max-w-none relative order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative w-full aspect-square max-w-[440px]">
              <div className="absolute -inset-4 sm:-inset-8 bg-gradient-to-tr from-blue-600 to-indigo-600 opacity-20 blur-3xl rounded-full"></div>
              
              <div className="relative w-full h-full rounded-[2.5rem] xs:rounded-[3rem] sm:rounded-[4rem] overflow-hidden shadow-2xl ring-8 sm:ring-12 ring-white/50 dark:ring-gray-800/50 transform lg:rotate-3 transition-all duration-700">
                <img src={data.profile.photoUrl} alt={data.profile.name} className="w-full h-full object-cover" />
              </div>
              
              {/* Experience Badge - Hidden on mobile, shown on desktop */}
              <div className="hidden sm:block absolute -bottom-6 -left-6 bg-white dark:bg-gray-900 p-4 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-800 animate-bounce duration-[4s]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
                    <Sparkles size={18} />
                  </div>
                  <div className="pr-4">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Experience</p>
                    <p className="text-sm font-black text-gray-900 dark:text-white">{data.profile.yearsOfExperience || '5+'} Years</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
