
import { PortfolioData } from './types';

export const INITIAL_DATA: PortfolioData = {
  siteName: "Sohan's Portfolio",
  logo: "Sohan.",
  seo: {
    metaTitle: "Sohan | Full Stack Developer",
    metaDescription: "Experienced Full Stack Developer building modern web applications.",
    keywords: "React, Node.js, TypeScript, Portfolio, Web Development",
    faviconUrl: "https://picsum.photos/32/32"
  },
  profile: {
    name: "Sohan",
    designation: "Senior Full Stack Engineer",
    bio: "I craft elegant and high-performance digital experiences with a focus on React, Node.js, and Cloud architectures.",
    aboutMe: "I am a dedicated professional with a strong background in building scalable digital solutions. My approach combines technical proficiency with a keen eye for design and user experience. Over the years, I've helped numerous clients transform their ideas into functional, beautiful realities.",
    photoUrl: "https://picsum.photos/400/400?random=1",
    resumeUrl: "#",
    phone: "+880 1700 000000",
    email: "sohan@example.com",
    yearsOfExperience: "5+",
    socials: [
      { id: '1', platform: 'GitHub', url: 'https://github.com', iconName: 'Github' },
      { id: '2', platform: 'LinkedIn', url: 'https://linkedin.com', iconName: 'Linkedin' },
      { id: '3', platform: 'Twitter', url: 'https://twitter.com', iconName: 'Twitter' }
    ]
  },
  skills: [
    { id: '1', name: 'React & Next.js', percentage: 95 },
    { id: '2', name: 'TypeScript', percentage: 90 },
    { id: '3', name: 'Node.js', percentage: 85 },
    { id: '4', name: 'Tailwind CSS', percentage: 95 },
    { id: '5', name: 'PostgreSQL', percentage: 80 }
  ],
  projects: [
    {
      id: 'p1',
      title: "E-Commerce Platform",
      description: "A full-featured online store with payment integration and inventory management.",
      image: "https://picsum.photos/600/400?random=2",
      category: "Web",
      techStack: ["Next.js", "Prisma", "Stripe"],
      liveLink: "https://example.com",
      published: true
    },
    {
      id: 'p2',
      title: "Task Management App",
      description: "Real-time collaboration tool for teams with drag and drop kanban boards.",
      image: "https://picsum.photos/600/400?random=3",
      category: "App",
      techStack: ["React", "Firebase", "Tailwind"],
      published: true
    }
  ],
  services: [
    {
      id: 's1',
      title: "Web Development",
      description: "Building responsive and scalable websites using the latest technologies.",
      icon: "Code",
      enabled: true
    },
    {
      id: 's2',
      title: "UI/UX Design",
      description: "Creating intuitive and beautiful user interfaces with modern design patterns.",
      icon: "Palette",
      enabled: true
    }
  ],
  experience: [
    {
      id: 'e1',
      company: "Tech Solutions Inc.",
      role: "Senior Developer",
      period: "2021 - Present",
      description: "Leading the frontend team in developing enterprise-level dashboard applications."
    }
  ],
  education: [
    {
      id: 'ed1',
      institution: "State University",
      degree: "B.S. Computer Science",
      period: "2015 - 2019"
    }
  ],
  testimonials: [
    {
      id: 't1',
      clientName: "John Doe",
      clientPhoto: "https://picsum.photos/100/100?random=10",
      feedback: "Sohan is an exceptional developer who delivered our project ahead of schedule and with great quality.",
      published: true
    }
  ],
  messages: [],
  analytics: {
    totalViews: 1284,
    viewHistory: [
      { name: 'Mon', views: 120 },
      { name: 'Tue', views: 150 },
      { name: 'Wed', views: 240 },
      { name: 'Thu', views: 180 },
      { name: 'Fri', views: 310 },
      { name: 'Sat', views: 420 },
      { name: 'Sun', views: 380 },
    ]
  },
  adminCredentials: {
    username: 'admin',
    password: 'admin123'
  }
};
