import { motion } from "motion/react";
import { Helmet } from "react-helmet-async";
import { ShoppingCart, Star, Tag, Hammer, ArrowUpDown, X } from "lucide-react";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";

import { PRODUCTS } from "../constants/products";

const CATEGORIES = ["Todos", ...new Set(PRODUCTS.map(p => p.category))];

export default function Store() {
  const [imageError, setImageError] = useState(false);
  const [filter, setFilter] = useState("Todos");
  const [sortBy, setSortBy] = useState("default"); // default, price-asc, price-desc, name
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    if (filter !== "Todos") {
      result = result.filter(p => p.category === filter);
    }

    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [filter, sortBy]);

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Oppa Store | Loja Oficial de Doramas</title>
        <meta name="description" content="Encontre produtos exclusivos para dorameiros na Oppa Store. Canecas, moletons, adesivos e muito mais!" />
        <link rel="canonical" href="https://oppadoramaclub.com.br/store" />
      </Helmet>
      {/* Store Hero */}
      <section className="bg-accent/80 backdrop-blur-sm text-white py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h1 className="text-4xl md:text-6xl font-display font-black mb-6 tracking-tight">
              A Sua Loja de <span className="text-primary underline decoration-4 underline-offset-8">Doramas</span>
            </h1>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Leve um pedacinho do mundo dos Doramas para sua casa. Produtos exclusivos feitos de fã para fã.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm font-bold uppercase tracking-widest text-primary">
              <Tag className="w-4 h-4" />
              <span>Frete grátis em compras acima de R$ 200</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <h2 className="text-3xl font-display font-bold text-accent">Nossa Coleção</h2>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 bg-secondary/10 p-1 rounded-2xl border border-accent/5">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                    filter === cat 
                      ? "bg-primary text-white shadow-lg shadow-primary/20" 
                      : "text-accent/60 hover:text-accent hover:bg-secondary/20"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-10 pr-8 py-3 bg-secondary/10 rounded-2xl text-xs font-black text-accent border border-accent/5 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              >
                <option value="default">Ordenar por</option>
                <option value="price-asc">Menor Preço</option>
                <option value="price-desc">Maior Preço</option>
                <option value="name">Nome (A-Z)</option>
              </select>
              <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredProducts.map((product, index) => (
            <Link key={product.id} to={`/product/${product.id}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                <div className="relative aspect-square rounded-3xl overflow-hidden bg-secondary/10 mb-6 shadow-lg shadow-accent/5 group-hover:shadow-xl group-hover:shadow-accent/10 transition-all">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className={`w-full h-full object-cover transition-transform duration-500 ${product.soldOut ? 'grayscale opacity-60' : 'group-hover:scale-105'}`}
                    referrerPolicy="no-referrer"
                  />
                  
                  {product.soldOut && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-accent/90 text-white px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest transform -rotate-12 border-2 border-white/20 shadow-2xl">
                        Esgotado
                      </div>
                    </div>
                  )}

                  {!product.soldOut && (
                    <div className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg hover:bg-primary hover:text-white transition-all transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                      <ShoppingCart className="w-6 h-6" />
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">{product.category}</p>
                      <h3 className="text-xl font-display font-bold text-accent">{product.name}</h3>
                    </div>
                    <p className="text-xl font-black text-accent">R$ {product.price.toFixed(2)}</p>
                  </div>
                  
                  <p className="text-sm text-accent/60 leading-relaxed mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center gap-1 text-primary/40">
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-[10px] ml-2 font-bold text-accent/40">(0 avaliações)</span>
                  </div>
                  
                  {product.soldOut && (
                    <div className="w-full mt-4 py-4 bg-secondary/20 text-accent/40 rounded-2xl font-black text-center text-xs uppercase tracking-widest cursor-not-allowed">
                      Indisponível no momento
                    </div>
                  )}
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-accent/60 font-display text-xl">Nenhum produto encontrado nesta categoria.</p>
          </div>
        )}
      </section>

      {/* Newsletter */}
      <section className="bg-white/20 backdrop-blur-md py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-display font-bold mb-4 text-accent">Ganhe 10% de desconto</h2>
          <p className="text-accent/70 mb-8">Inscreva-se na nossa newsletter e receba ofertas exclusivas da Oppa Store.</p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input type="email" placeholder="Seu melhor e-mail" className="flex-1 p-4 rounded-2xl border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary bg-white/60" />
            <button className="px-8 py-4 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all">Quero meu desconto</button>
          </form>
        </div>
      </section>
    </div>
  );
}
