import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import { PRODUCTS } from "../constants/products";
import { ShoppingCart } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/autoplay";

export default function ProductCarousel() {
  return (
    <div className="w-full py-10">
      <Swiper
        modules={[Autoplay, FreeMode]}
        spaceBetween={32}
        slidesPerView="auto"
        loop={true}
        freeMode={true}
        speed={5000} // Slow and smooth transition
        touchRatio={0.5} // Lower sensitivity
        threshold={10} // Minimum movement before triggering drag
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          reverseDirection: true, // Moves from left to right as requested
        }}
        className="product-swiper"
      >
        {PRODUCTS.map((product) => (
          <SwiperSlide key={product.id} className="!w-[280px] md:!w-[320px]">
            <Link to={`/product/${product.id}`}>
              <motion.div
                whileHover={{ y: -5 }}
                className="group relative"
              >
                <div className="relative aspect-square rounded-3xl overflow-hidden bg-secondary/10 mb-4 shadow-lg group-hover:shadow-xl transition-all">
                  <img
                    src={product.image}
                    alt={product.name}
                    className={`w-full h-full object-cover transition-transform duration-500 ${
                      product.soldOut ? "grayscale opacity-60" : "group-hover:scale-105"
                    }`}
                    referrerPolicy="no-referrer"
                  />

                  {product.soldOut && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-accent/90 text-white px-4 py-1 rounded-full font-black text-xs uppercase tracking-widest transform -rotate-12 border-2 border-white/20 shadow-2xl">
                        Esgotado
                      </div>
                    </div>
                  )}

                  {!product.soldOut && (
                    <div className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all">
                      <ShoppingCart className="w-5 h-5 text-primary" />
                    </div>
                  )}
                </div>

                <div className="px-2">
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">
                    {product.category}
                  </p>
                  <h3 className="text-sm font-display font-bold text-accent truncate">
                    {product.name}
                  </h3>
                  <p className="text-sm font-black text-accent/60 mt-1">
                    R$ {product.price.toFixed(2)}
                  </p>
                </div>
              </motion.div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      <style>{`
        .product-swiper .swiper-wrapper {
          transition-timing-function: linear !important;
        }
      `}</style>
    </div>
  );
}
