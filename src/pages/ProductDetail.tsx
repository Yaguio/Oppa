import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { PRODUCTS } from "../constants/products";
import { motion } from "motion/react";
import { ArrowLeft, ShoppingCart, Check, Star } from "lucide-react";
import { useState } from "react";

import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const product = PRODUCTS.find((p) => p.id === Number(id));

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [isAdded, setIsAdded] = useState(false);
  const [showError, setShowError] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-display font-bold text-accent mb-4">Produto não encontrado</h2>
          <button 
            onClick={() => navigate("/store")}
            className="text-primary font-bold hover:underline flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar para a loja
          </button>
        </div>
      </div>
    );
  }

  const validateSelection = () => {
    if ((product.sizes && !selectedSize) || (product.colors && !selectedColor)) {
      setShowError(true);
      alert(`Por favor, selecione ${!selectedSize && product.sizes ? "o tamanho" : ""}${!selectedSize && product.sizes && !selectedColor && product.colors ? " e " : ""}${!selectedColor && product.colors ? "a cor" : ""} antes de continuar.`);
      return false;
    }
    setShowError(false);
    return true;
  };

  const handleAddToCart = () => {
    if (!validateSelection()) return;

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      size: selectedSize,
      color: selectedColor
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!validateSelection()) return;

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      size: selectedSize,
      color: selectedColor
    });

    navigate("/cart");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-24 md:py-32">
      <Helmet>
        <title>{`${product.name} | Oppa Store`}</title>
        <meta name="description" content={product.description} />
        <link rel="canonical" href={`https://oppadoramaclub.com.br/product/${product.id}`} />
      </Helmet>
      <button 
        onClick={() => navigate(-1)}
        className="group mb-8 text-accent/60 hover:text-accent flex items-center gap-2 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Voltar
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        {/* Imagem */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative aspect-square rounded-[40px] overflow-hidden bg-secondary/10 shadow-2xl"
        >
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {product.soldOut && (
            <div className="absolute inset-0 bg-accent/20 backdrop-blur-[2px] flex items-center justify-center">
              <div className="bg-accent text-white px-8 py-3 rounded-full font-black text-xl uppercase tracking-widest transform -rotate-12 shadow-2xl border-4 border-white/20">
                Esgotado
              </div>
            </div>
          )}
        </motion.div>

        {/* Informações */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <div className="mb-8">
            <p className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-3">
              {product.category}
            </p>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-accent leading-tight mb-4">
              {product.name}
            </h1>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <span className="text-sm text-accent/40 font-medium">(12 avaliações)</span>
            </div>
            <p className="text-3xl font-black text-accent">
              R$ {product.price.toFixed(2)}
            </p>
          </div>

          <div className="space-y-8 mb-10">
            <p className="text-accent/70 leading-relaxed text-lg">
              {product.description}
            </p>

            {/* Escolha de Cor */}
            {product.colors && (
              <div className={showError && !selectedColor ? "animate-bounce" : ""}>
                <h4 className={`text-xs font-black uppercase tracking-widest mb-4 ${showError && !selectedColor ? "text-rose-500" : "text-accent"}`}>
                  Cor {showError && !selectedColor && " (Obrigatório)"}
                </h4>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => {
                        setSelectedColor(color.name);
                        setShowError(false);
                      }}
                      className={`w-10 h-10 rounded-full border-2 transition-all p-1 ${
                        selectedColor === color.name ? "border-primary scale-110" : "border-transparent"
                      } ${showError && !selectedColor ? "border-rose-300" : ""}`}
                      title={color.name}
                    >
                      <div 
                        className="w-full h-full rounded-full shadow-inner border border-black/5" 
                        style={{ backgroundColor: color.hex }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Escolha de Tamanho */}
            {product.sizes && (
              <div className={showError && !selectedSize ? "animate-bounce" : ""}>
                <h4 className={`text-xs font-black uppercase tracking-widest mb-4 ${showError && !selectedSize ? "text-rose-500" : "text-accent"}`}>
                  Tamanho {showError && !selectedSize && " (Obrigatório)"}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setSelectedSize(size);
                        setShowError(false);
                      }}
                      className={`min-w-[50px] h-12 rounded-xl border-2 font-black text-sm transition-all ${
                        selectedSize === size 
                          ? "border-primary bg-primary text-white" 
                          : showError && !selectedSize
                            ? "border-rose-300 text-rose-400"
                            : "border-secondary/20 text-accent/60 hover:border-secondary/40"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Especificações */}
            <div>
              <h4 className="text-xs font-black text-accent uppercase tracking-widest mb-4">Especificações</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.specifications?.map((spec, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-accent/60">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    {spec}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-auto flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleAddToCart}
              disabled={product.soldOut}
              className={`flex-1 h-16 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${
                product.soldOut 
                  ? "bg-secondary/20 text-accent/30 cursor-not-allowed" 
                  : isAdded 
                    ? "bg-green-500 text-white" 
                    : "bg-accent text-white hover:bg-accent/90 hover:shadow-xl"
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-5 h-5" /> Adicionado!
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" /> Adicionar ao Carrinho
                </>
              )}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.soldOut}
              className={`flex-1 h-16 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-[0.98] ${
                product.soldOut 
                  ? "bg-secondary/20 text-accent/30 cursor-not-allowed" 
                  : "bg-primary text-white hover:bg-primary-dark hover:shadow-xl"
              }`}
            >
              Comprar Agora
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
