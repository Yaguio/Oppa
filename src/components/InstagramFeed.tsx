import { motion } from "motion/react";
import { Instagram, ExternalLink } from "lucide-react";

interface InstagramFeedProps {
  username: string;
  widgetId?: string; // If they use a service like LightWidget or Elfsight
}

export default function InstagramFeed({ username, widgetId }: InstagramFeedProps) {
  // Mock posts for when no widget is provided
  const mockPosts = [
    { id: 1, url: "https://picsum.photos/seed/dorama1/600/600" },
    { id: 2, url: "https://picsum.photos/seed/dorama2/600/600" },
    { id: 3, url: "https://picsum.photos/seed/dorama3/600/600" },
    { id: 4, url: "https://picsum.photos/seed/dorama4/600/600" },
    { id: 5, url: "https://picsum.photos/seed/dorama5/600/600" },
    { id: 6, url: "https://picsum.photos/seed/dorama6/600/600" },
  ];

  return (
    <section className="px-6 py-16 bg-white/40 backdrop-blur-sm border-y border-primary/10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-100 text-rose-600 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <span>Live Feed</span>
            </div>
            <h2 className="text-4xl font-display font-bold text-accent mb-2">No nosso Instagram</h2>
            <p className="text-accent/60">Acompanhe @{username} para doses diárias de fofura e sofrimento dorameiro.</p>
          </div>
          
          <a 
            href={`https://www.instagram.com/${username}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-rose-500 text-white rounded-2xl font-bold shadow-lg shadow-rose-500/20 hover:scale-105 transition-all"
          >
            <Instagram className="w-5 h-5" />
            Seguir no Instagram
            <ExternalLink className="w-4 h-4 opacity-50" />
          </a>
        </div>

        {widgetId ? (
          <div className="max-w-4xl mx-auto">
            <div className="rounded-3xl overflow-hidden shadow-lg border-4 border-white bg-white">
               <iframe 
                  src={`https://cdn.lightwidget.com/widgets/${widgetId}.html`} 
                  scrolling="no" 
                  className="lightwidget-widget w-full border-none overflow-hidden"
                  style={{ width: '100%', border: 0, overflow: 'hidden' }}
               />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {mockPosts.map((post, index) => (
              <motion.a
                key={post.id}
                href={`https://www.instagram.com/${username}/`}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative aspect-square rounded-2xl overflow-hidden group shadow-sm hover:shadow-xl transition-all"
              >
                <img 
                  src={post.url} 
                  alt={`Instagram post ${post.id}`} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Instagram className="w-8 h-8 text-white" />
                </div>
              </motion.a>
            ))}
          </div>
        )}
        
        <div className="mt-12 p-6 bg-primary/5 rounded-3xl border border-primary/10 text-center">
          <p className="text-sm text-accent/60 italic">
            "O lugar onde a gente surta junto com cada lançamento e chora com cada final (feliz ou não)!" 
            <span className="block font-bold mt-2 text-primary">— @{username}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
