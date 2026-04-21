import { Heart, Instagram, Youtube, Facebook } from "lucide-react";
import logoFooter from "../assets/logo-footer.jpg.png";

export default function Footer() {
  return (
    <footer className="px-6 py-12 border-t border-primary/10 bg-transparent">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center">
          <div className="max-w-[200px] h-auto rounded-2xl overflow-hidden bg-transparent">
            <img 
              src={logoFooter} 
              alt="Oppa Dorama Club" 
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-6">
            <a 
              href="https://www.facebook.com/oppadoramaclub" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 bg-[#1877F2]/10 text-[#1877F2] rounded-full hover:bg-[#1877F2] hover:text-white transition-all duration-300"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a 
              href="https://www.youtube.com/@oppadoramaclub" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 bg-[#FF0000]/10 text-[#FF0000] rounded-full hover:bg-[#FF0000] hover:text-white transition-all duration-300"
            >
              <Youtube className="w-5 h-5" />
            </a>
            <a 
              href="https://www.instagram.com/oppadoramaclub" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 bg-primary/10 text-primary rounded-full hover:bg-primary hover:text-white transition-all duration-300"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a 
              href="https://www.tiktok.com/@oppadoramaclub" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 bg-black/10 text-black rounded-full hover:bg-black hover:text-white transition-all duration-300"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.03 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
            </a>
          </div>
          <div className="flex gap-8 text-sm font-medium text-accent/40">
            <a href="#" className="hover:text-primary transition-colors">Privacidade</a>
            <a href="#" className="hover:text-primary transition-colors">Termos</a>
            <a href="#" className="hover:text-primary transition-colors">Contato</a>
          </div>
        </div>

        <p className="text-sm text-accent/40">
          © 2026 Oppa Dorama Club. Feito com <Heart className="inline w-3 h-3 text-primary fill-current" /> para Dorameiros.
        </p>
      </div>
    </footer>
  );
}
