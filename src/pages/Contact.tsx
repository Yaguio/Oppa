import { motion } from "motion/react";
import { Helmet } from "react-helmet-async";
import { Instagram, MessageCircle, Mail, MapPin, Send, CheckCircle2, Loader2 } from "lucide-react";
import { useState, FormEvent } from "react";
import emailjs from "@emailjs/browser";

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');

    setIsSubmitting(true);

    try {
      // Usando o mesmo Service ID e Public Key do Checkout
      // Você precisará criar um novo template no EmailJS para o formulário de contato
      // Por enquanto, vou usar um template genérico ou você pode me passar o ID depois
      const templateParams = {
        from_name: name,
        from_email: email,
        subject: subject,
        message: message,
        to_name: "Oppa Dorama Club",
      };

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID || "oppadoramaclub",
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID_CONTACT || "template_9jzu8ud",
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "RyTlfKdI6BWqOwijs"
      );

      setIsSubmitted(true);
      form.reset();
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      alert("Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente ou use o WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Contato | Oppa Dorama Club - Fale Conosco</title>
        <meta name="description" content="Entre em contato com o Oppa Dorama Club. Tire suas dúvidas, envie sugestões ou faça parcerias." />
        <link rel="canonical" href="https://oppadoramaclub.com.br/contact" />
      </Helmet>
      {/* Header Section */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-display font-black text-accent mb-6 tracking-tight">
              Vamos <span className="text-primary italic">Conversar?</span>
            </h1>
            <p className="text-accent/70 text-lg max-w-2xl mx-auto leading-relaxed">
              Dúvidas sobre a loja, sugestões de doramas ou propostas de parcerias? Nossa equipe está pronta para te ouvir.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div className="space-y-8">
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white group aspect-[16/9]">
                <img 
                  src="/banners/contact.png" 
                  alt="Contato Oppa Dorama Club" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent pointer-events-none"></div>
              </div>
              
              <div>
                <h2 className="text-3xl font-display font-bold text-accent mb-8">Informações de Contato</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                    <Mail className="text-primary w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-accent">E-mail Profissional</h4>
                    <p className="text-accent/50">oppadoramaclub@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-secondary/20 rounded-2xl flex items-center justify-center shrink-0">
                    <MessageCircle className="text-accent w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-accent">WhatsApp</h4>
                    <p className="text-accent/50">Suporte exclusivo para membros do clube</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                    <Instagram className="text-primary w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-accent">Instagram</h4>
                    <p className="text-accent/50">@oppadoramaclub</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-secondary/20 rounded-2xl flex items-center justify-center shrink-0">
                    <MapPin className="text-accent w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-accent">Localização</h4>
                    <p className="text-accent/50">Comunidade Global de Dorameiros</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/40 backdrop-blur-md rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-primary/10 border border-white/20"
          >
            {isSubmitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center py-12"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="text-green-600 w-10 h-10" />
                </div>
                <h3 className="text-2xl font-display font-bold text-zinc-900 mb-2">Mensagem Enviada!</h3>
                <p className="text-zinc-500">Obrigado por entrar em contato. Responderemos o mais breve possível.</p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="mt-8 text-primary-dark font-black hover:underline"
                >
                  Enviar outra mensagem
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700 ml-1">Nome Completo</label>
                    <input 
                      required
                      name="name"
                      type="text" 
                      placeholder="Como podemos te chamar?" 
                      className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700 ml-1">E-mail</label>
                    <input 
                      required
                      name="email"
                      type="email" 
                      placeholder="seu@email.com" 
                      className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary transition-all" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-700 ml-1">Assunto</label>
                  <select name="subject" className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary transition-all appearance-none">
                    <option>Dúvida sobre a Loja</option>
                    <option>Sugestão de Dorama</option>
                    <option>Parcerias e Eventos</option>
                    <option>Outros</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-700 ml-1">Mensagem</label>
                  <textarea 
                    required
                    name="message"
                    placeholder="Escreva aqui sua mensagem..." 
                    rows={5} 
                    className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                  ></textarea>
                </div>

                <button 
                  disabled={isSubmitting}
                  className="w-full py-5 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  )}
                  {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
