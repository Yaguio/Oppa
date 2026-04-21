import { useState, useEffect, useRef, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Star, ChevronDown, Info, TrendingUp, BarChart3, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLocation } from "react-router-dom";
import { TOP_DORAMAS, Dorama } from "../constants/doramas";

export default function Top100() {
  const [visibleCount, setVisibleCount] = useState(10);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const listRef = useRef<HTMLDivElement>(null);

  const filteredDoramas = useMemo(() => {
    if (!searchTerm.trim()) return TOP_DORAMAS;
    
    const term = searchTerm.toLowerCase();
    return TOP_DORAMAS.filter(dorama => 
      dorama.title.toLowerCase().includes(term) || 
      dorama.original.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  // Preload images for the current visible batch
  useEffect(() => {
    const preloadImages = (urls: string[]) => {
      urls.forEach(url => {
        const img = new Image();
        img.src = url;
      });
    };

    // Preload the current visible batch
    const currentBatch = filteredDoramas.slice(0, visibleCount).map(dorama => dorama.image);
    preloadImages(currentBatch);
    
    // Also preload the NEXT batch (10 more) to be ready for "Load More"
    const nextBatch = filteredDoramas.slice(visibleCount, visibleCount + 10).map(dorama => dorama.image);
    preloadImages(nextBatch);
  }, [visibleCount, filteredDoramas]);

  useEffect(() => {
    // Reset visible count when searching to show matches
    if (searchTerm) {
      setVisibleCount(Math.min(20, filteredDoramas.length));
    }
  }, [searchTerm, filteredDoramas.length]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const idParam = params.get('id');
    
    if (idParam) {
      const id = parseInt(idParam);
      if (!isNaN(id)) {
        // Ensure the dorama is visible in the list
        if (id > visibleCount) {
          setVisibleCount(Math.ceil(id / 10) * 10);
        }
        
        // Expand the dorama
        setExpandedId(id);

        // Scroll to it after a short delay to allow for rendering/expansion
        setTimeout(() => {
          const element = document.getElementById(`dorama-${id}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 500);
      }
    }
  }, [location.search]);

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 10, filteredDoramas.length));
  };

  const toggleExpand = (rank: number) => {
    setExpandedId(expandedId === rank ? null : rank);
  };

  return (
    <section className="px-6 py-24">
      <Helmet>
        <title>Top 100 Doramas | Oppa Dorama Club - Melhores Dramas</title>
        <meta name="description" content="Confira o nosso ranking exclusivo dos 100 melhores doramas de todos os tempos. Resenhas sinceras e recomendações imperdíveis." />
        <link rel="canonical" href="https://oppadoramaclub.com.br/top100" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": TOP_DORAMAS.slice(0, 10).map((dorama, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "name": `${dorama.title} (${dorama.original})`,
              "url": `https://oppadoramaclub.com.br/top100?id=${dorama.rank}`,
              "image": `https://oppadoramaclub.com.br${dorama.image}`
            }))
          })}
        </script>
      </Helmet>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold text-accent mb-4">Top 100 Doramas Imperdíveis</h2>
          
          {/* Ranking Metric Clarification */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/10 rounded-2xl text-primary text-sm font-medium mb-8">
            <Info className="w-4 h-4" />
            <span>Ranking baseado na média entre notas IMDb e AdoroCinema</span>
          </div>

          <p className="text-accent/60 max-w-2xl mx-auto mb-12">
            Uma lista curada com os títulos mais aclamados pela crítica e pelo público. 
            Atualizado mensalmente com base em dados reais de audiência e crítica especializada.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative mb-12">
            <div className="relative group">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <Search className={`w-5 h-5 transition-colors ${searchTerm ? 'text-primary' : 'text-accent/30 group-focus-within:text-primary'}`} />
              </div>
              <input
                type="text"
                placeholder="Buscar por título ou nome original..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-12 py-4 bg-white/60 backdrop-blur-md border border-primary/10 rounded-2xl text-accent placeholder:text-accent/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all shadow-sm"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-4 flex items-center text-accent/30 hover:text-accent transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            {searchTerm && (
              <div className="absolute -bottom-6 left-0 right-0 text-center">
                <p className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">
                  {filteredDoramas.length} {filteredDoramas.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/40 backdrop-blur-sm rounded-[2.5rem] p-4 md:p-12 shadow-inner border border-white/20">
          <div className="flex flex-col gap-y-6">
            {filteredDoramas.length > 0 ? (
              filteredDoramas.slice(0, visibleCount).map((dorama, index) => (
                <motion.div 
                  key={dorama.rank} 
                  id={`dorama-${dorama.rank}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (index % 20) * 0.05 }}
                  className={`flex flex-col p-4 md:p-6 bg-white rounded-3xl shadow-sm hover:shadow-md transition-all border border-primary/10 group cursor-pointer ${expandedId === dorama.rank ? 'ring-2 ring-primary/20 bg-primary/[0.02]' : ''}`}
                  onClick={() => toggleExpand(dorama.rank)}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-4 md:gap-6">
                      <span className="text-3xl md:text-4xl font-display font-black text-primary/10 group-hover:text-primary/20 transition-colors w-12 md:w-16">
                        {String(dorama.rank).padStart(2, '0')}
                      </span>
                      <div>
                        {/* Reordered Titles: PT on top, EN below */}
                        <h4 className="font-bold text-accent leading-tight text-lg md:text-xl">{dorama.title}</h4>
                        <p className="text-[10px] md:text-xs text-accent/40 uppercase tracking-wider font-medium mt-0.5">{dorama.original} ({dorama.year})</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 md:gap-8">
                      <div className="hidden sm:flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 px-2 py-0.5 bg-yellow-400/10 rounded-full text-[10px] font-bold text-yellow-600" title="Nota IMDb">
                            <Star className="w-2.5 h-2.5 fill-current text-yellow-500" />
                            {dorama.imdb}
                          </div>
                          {dorama.adoroCinema && (
                            <div className="flex items-center gap-1 px-2 py-0.5 bg-orange-500/10 rounded-full text-[10px] font-bold text-orange-600" title="Nota AdoroCinema">
                              <span className="text-[8px] font-black">AC</span>
                              {dorama.adoroCinema}
                            </div>
                          )}
                          <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-500/5 rounded-full text-[10px] font-bold text-blue-600" title="Popularidade Global">
                            <TrendingUp className="w-2.5 h-2.5" />
                            {dorama.popularity}%
                          </div>
                        </div>
                        <div className="text-[10px] font-black text-accent/40 uppercase tracking-tighter flex items-center gap-1 bg-primary/5 px-2 py-0.5 rounded-full">
                          <BarChart3 className="w-2.5 h-2.5 text-primary/60" />
                          Score: <span className="text-primary">{dorama.averageScore}</span>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: expandedId === dorama.rank ? 180 : 0 }}
                        className="text-accent/20 group-hover:text-accent/40 transition-colors"
                      >
                        <ChevronDown className="w-6 h-6" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Expandable Content */}
                  <AnimatePresence>
                    {expandedId === dorama.rank && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="pt-6 flex flex-col md:flex-row gap-6">
                          <div className="w-full md:w-32 aspect-[2/3] rounded-2xl overflow-hidden shadow-lg flex-shrink-0">
                            <img 
                              src={dorama.image} 
                              alt={dorama.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="px-2 py-0.5 bg-accent/5 text-accent/60 rounded text-[10px] font-bold uppercase tracking-widest">
                                {dorama.category || "Drama"}
                              </span>
                              <span className="text-[10px] text-accent/40 uppercase font-bold">
                                Lançamento: {dorama.year}
                              </span>
                            </div>
                            <p className="text-sm text-accent/70 leading-relaxed mb-6">
                              {dorama.description}
                            </p>

                            {/* Resenha OPDC Section */}
                            <div className="bg-primary/5 rounded-2xl p-4 md:p-6 border border-primary/10">
                              <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                  <Star className="w-4 h-4 text-primary fill-current" />
                                </div>
                                <h5 className="font-display font-bold text-primary text-sm uppercase tracking-wider">Resenha OPDC</h5>
                              </div>
                              <p className="text-xs md:text-sm text-accent/80 italic leading-relaxed">
                                {dorama.review || "As criadoras do Oppa Dorama Club ainda não deixaram sua opinião sobre este título, mas ele está no nosso radar de favoritos!"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            ) : (
              <div className="py-20 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/5 rounded-full mb-6">
                  <Search className="w-10 h-10 text-primary/20" />
                </div>
                <h3 className="text-2xl font-display font-bold text-accent mb-2">Nenhum dorama encontrado</h3>
                <p className="text-accent/60">Tente buscar por outro termo ou verifique a ortografia.</p>
                <button 
                  onClick={() => setSearchTerm("")}
                  className="mt-6 text-primary font-bold hover:underline"
                >
                  Limpar busca
                </button>
              </div>
            )}
          </div>
          
          {visibleCount < filteredDoramas.length && (
            <div className="mt-12 text-center">
              <button 
                onClick={loadMore}
                className="px-8 py-3 bg-accent text-white rounded-xl font-black hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20"
              >
                Carregar mais títulos...
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
