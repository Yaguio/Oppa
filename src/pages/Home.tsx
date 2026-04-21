import { motion } from "motion/react";
import { Helmet } from "react-helmet-async";
import { Play, Star, ExternalLink, Heart, ShoppingBag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCarousel from "../components/ProductCarousel";
import InstagramFeed from "../components/InstagramFeed";
import { TOP_DORAMAS } from "../constants/doramas";

// Use the first 4 from Top 100 as recommendations
const RECOMMENDATIONS = TOP_DORAMAS.slice(0, 4);

export default function Home() {
  return (
    <div>
      <Helmet>
        <title>Oppa Dorama Club | Início - O Melhor dos Dramas Asiáticos</title>
        <meta name="description" content="Bem-vindo ao Oppa Dorama Club! Explore nossas recomendações de doramas, resenhas exclusivas e nossa loja oficial." />
        <link rel="canonical" href="https://oppadoramaclub.com.br/" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Oppa Dorama Club",
            "url": "https://oppadoramaclub.com.br/",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://oppadoramaclub.com.br/top100?search={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Oppa Dorama Club",
            "url": "https://oppadoramaclub.com.br/",
            "logo": "https://oppadoramaclub.com.br/banners/image1.png",
            "sameAs": [
              "https://instagram.com/oppadoramaclub",
              "https://tiktok.com/@oppadoramaclub"
            ]
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative px-6 pt-12 pb-24 md:pt-24 md:pb-32 overflow-hidden">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-6">
              <Star className="w-4 h-4 fill-current" />
              <span>O seu portal favorito de Doramas</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-black text-accent leading-[1.1] mb-6">
              Bem-vindo ao seu guia completo de <span className="text-primary italic">Doramas</span>
            </h1>
            <p className="text-lg text-accent/80 mb-8 max-w-lg leading-relaxed">
              Descubra as melhores recomendações, resenhas sinceras e uma comunidade apaixonada por dramas asiáticos. Tudo o que você precisa para sua próxima maratona está aqui.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/top100" className="px-8 py-4 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all hover:scale-105 flex items-center gap-2 text-center justify-center">
                <Play className="w-5 h-5 fill-current" />
                Explorar Agora
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
              <img 
                src="/banners/image1.png" 
                alt="Comunidade Oppa Dorama Club - Melhores Recomendações de Dramas Asiáticos" 
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-rose-200 rounded-full blur-3xl opacity-60"></div>
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-purple-200 rounded-full blur-3xl opacity-60"></div>
          </motion.div>
        </div>
      </section>

      {/* Recommendations Grid */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <h2 className="text-4xl font-display font-bold text-accent mb-4">Melhores Recomendações de Doramas</h2>
              <p className="text-accent/60 max-w-md">Selecionamos os melhores títulos de dramas asiáticos para você não perder tempo escolhendo o que assistir.</p>
            <Link to="/top100" className="text-primary-dark font-black flex items-center gap-2 hover:underline">
              Ver todas as resenhas <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {RECOMMENDATIONS.map((item, index) => (
              <motion.div
                key={item.rank}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Link to={`/top100?id=${item.rank}`} className="block cursor-pointer">
                  <div className="relative h-[400px] rounded-3xl overflow-hidden mb-4 shadow-lg group-hover:shadow-xl transition-all">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-primary">
                      {item.category || "Drama"}
                    </div>
                    <div className="absolute bottom-4 right-4 flex flex-col gap-1">
                      <div className="flex items-center gap-1 px-2 py-1 bg-zinc-900/80 backdrop-blur-sm rounded-lg text-[10px] font-bold text-white">
                        <Star className="w-3 h-3 text-accent fill-current" />
                        IMDb: {item.imdb}
                      </div>
                      {item.adoroCinema && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-zinc-900/80 backdrop-blur-sm rounded-lg text-[10px] font-bold text-white">
                          <Heart className="w-3 h-3 text-primary fill-current" />
                          AC: {item.adoroCinema}
                        </div>
                      )}
                    </div>
                  </div>
                  <h3 className="text-lg font-display font-bold text-zinc-900 group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-[10px] text-zinc-400 font-medium mb-1 uppercase tracking-wider">{item.original}</p>
                  <p className="text-sm text-zinc-500 line-clamp-2">{item.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Feed Section */}
      <InstagramFeed username="oppadoramaclub" widgetId="77965b81b8965fc98c2e0b4a1e719ab1" />

      {/* Subtle Store Showcase */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/60 backdrop-blur-md rounded-[3rem] p-8 md:p-16 shadow-xl shadow-accent/10 border border-accent/5 flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/3 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest mb-8">
                <ShoppingBag className="w-4 h-4" />
                <span>Oppa Store</span>
              </div>
              
              <div className="mb-8 flex justify-center lg:justify-start">
                <motion.img 
                  src="/banners/store-doll.png"
                  alt="Mascote Oppa Store"
                  className="w-32 h-32 md:w-56 md:h-56 object-contain pointer-events-none"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              <h2 className="text-4xl font-display font-bold text-accent mb-6">Produtos Exclusivos para Dorameiros</h2>
              <p className="text-accent/60 mb-8 leading-relaxed">
                Produtos exclusivos pensados para quem vive e respira o mundo dos Doramas. De canecas a moletons, encontre o presente perfeito para você ou para aquela amiga dorameira.
              </p>
              <Link to="/store" className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white rounded-2xl font-bold hover:bg-accent/90 transition-all group">
                Visitar Loja
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="lg:w-2/3 w-full">
              <ProductCarousel />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
