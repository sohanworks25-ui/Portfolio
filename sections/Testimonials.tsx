
import React from 'react';
import { useApp } from '../context/AppContext';
import { Quote } from 'lucide-react';

const Testimonials: React.FC = () => {
  const { data } = useApp();
  const testimonials = data.testimonials.filter(t => t.published);

  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-24 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Client Feedback</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            See what my partners and clients have to say about our successful collaborations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.id} className="p-8 rounded-3xl bg-gray-50 dark:bg-gray-900/40 relative">
              <Quote className="absolute top-6 right-6 text-blue-600/20" size={48} />
              <p className="text-gray-600 dark:text-gray-300 italic mb-8 relative z-10">
                "{t.feedback}"
              </p>
              <div className="flex items-center gap-4">
                <img src={t.clientPhoto} alt={t.clientName} className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-800" />
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">{t.clientName}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Happy Client</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
