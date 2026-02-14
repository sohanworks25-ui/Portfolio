import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Github, Linkedin, Twitter, Mail, Facebook, Instagram, 
  Youtube, Dribbble, Slack, Twitch, Disc as Discord, 
  MessageSquare, Globe, Link as LinkIcon, Lock,
  Music, Pin, Ghost, Share2, Layers as Behance, PenTool as Figma, 
  Video, Coffee, BookOpen
} from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  Github, 
  Linkedin, 
  Twitter, 
  Mail, 
  Facebook, 
  Instagram, 
  Youtube, 
  TikTok: Music, 
  Pinterest: Pin, 
  Snapchat: Ghost,
  Dribbble, 
  Behance, 
  Figma, 
  Medium: BookOpen, 
  Slack, 
  Twitch, 
  Discord, 
  MessageSquare, 
  Globe, 
  Link: LinkIcon, 
  BuyMeACoffee: Coffee
};

const Footer: React.FC = () => {
  const { data } = useApp();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{data.logo}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
              Crafting robust digital experiences with modern web technologies.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6">
            {/* Dynamically rendered social links based on profile.socials array */}
            {data.profile.socials?.map((social) => {
              const Icon = ICON_MAP[social.iconName];
              
              // Only display the platform if a corresponding icon exists in our map
              if (!Icon) return null;

              return (
                <a 
                  key={social.id}
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  title={social.platform}
                >
                  <Icon size={20} />
                </a>
              );
            })}
            
            {/* Formatted email link that opens in a new tab */}
            {data.profile.email && (
              <a 
                href={`mailto:${data.profile.email}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors" 
                title="Email Me"
              >
                <Mail size={20} />
              </a>
            )}
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-900 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">
            &copy; {year} {data.profile.name}. All rights reserved.
          </p>
          <Link 
            to="/admin" 
            className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-300 dark:text-gray-700 hover:text-blue-500 dark:hover:text-blue-400 transition-all"
          >
            <Lock size={10} className="group-hover:rotate-12 transition-transform" />
            Admin Entry
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;