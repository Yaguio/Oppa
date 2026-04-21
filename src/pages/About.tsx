import { Helmet } from "react-helmet-async";

export default function About() {
  return (
    <section className="px-6 py-24">
      <Helmet>
        <title>Quem Somos | Oppa Dorama Club - Nossa História</title>
        <meta name="description" content="Conheça a história do Oppa Dorama Club. De um grupo de amigas para uma das maiores comunidades de dorameiros do Brasil." />
        <link rel="canonical" href="https://oppadoramaclub.com.br/about" />
      </Helmet>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1">
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white group">
            <img 
              src="/banners/about.png" 
              alt="Oppa Dorama Club Vibe" 
              className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent pointer-events-none"></div>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <h2 className="text-4xl font-display font-bold text-accent mb-6">Sobre o Oppa Dorama Club</h2>
          <p className="text-lg text-accent/80 mb-6 leading-relaxed">
            O Oppa Dorama Club nasceu da paixão compartilhada por histórias que atravessam fronteiras. O que começou com duas amigas trocando indicações no WhatsApp, transformou-se em uma das maiores comunidades de dorameiros do Brasil.
          </p>
          <p className="text-lg text-accent/80 mb-8 leading-relaxed">
            Nossa missão é ser o seu guia definitivo no universo dos dramas asiáticos, oferecendo resenhas honestas, notícias em primeira mão e um espaço onde todo fã se sinta em casa. Seja você um veterano das maratonas ou alguém que acabou de descobrir seu primeiro dorama, aqui é o seu lugar.
          </p>
            <div className="flex gap-4">
              <div className="text-center">
                <p className="text-3xl font-black text-primary">11k+</p>
                <p className="text-sm text-accent/50 font-medium">Seguidores</p>
              </div>
              <div className="w-px h-12 bg-primary/20"></div>
              <div className="text-center">
                <p className="text-3xl font-black text-primary">Incontáveis</p>
                <p className="text-sm text-accent/50 font-medium">Resenhas</p>
              </div>
              <div className="w-px h-12 bg-primary/20"></div>
              <div className="text-center">
                <p className="text-3xl font-black text-primary">24/7</p>
                <p className="text-sm text-accent/50 font-medium">Maratonando...</p>
              </div>
            </div>
        </div>
      </div>
    </section>
  );
}
