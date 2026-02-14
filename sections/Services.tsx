
import React from 'react';
import { useApp } from '../context/AppContext';
import { Code, Palette, Smartphone, Globe, Layers, Cpu } from 'lucide-react';

const iconMap: Record<string, any> = {
  Code, Palette, Smartphone, Globe, Layers, Cpu
};

const Services: React.FC = () => {
  const { data } = useApp();
  const activeServices = data.services.filter(s => s.enabled);

  return (
    <section id="services" className="py-24 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">My Services</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            High-quality solutions tailored to your business needs, from initial planning to final deployment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeServices.map((service) => {
            const IconComponent = iconMap[service.icon] || Code;
            return (
              <div key={service.id} className="p-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center mb-6">
                  <IconComponent size={28} />
                </div>
                <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
