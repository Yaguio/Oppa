import React, { useState } from "react";
import { motion } from "motion/react";
import { Helmet } from "react-helmet-async";
import { useCart } from "../context/CartContext";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft, User, Mail, Phone, MapPin, CreditCard, Home, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import emailjs from "@emailjs/browser";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, totalPrice, totalItems } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, type: string, value: number} | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [isFetchingZip, setIsFetchingZip] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    confirmEmail: "",
    whatsapp: "",
    cpf: "",
    zipCode: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let maskedValue = value;

    // Máscaras de entrada
    if (name === "whatsapp") {
      maskedValue = value.replace(/\D/g, "");
      maskedValue = maskedValue.replace(/^(\d{2})(\d)/g, "($1) $2");
      maskedValue = maskedValue.replace(/(\d{5})(\d)/, "$1-$2");
      maskedValue = maskedValue.substring(0, 15);
    } else if (name === "cpf") {
      maskedValue = value.replace(/\D/g, "");
      maskedValue = maskedValue.replace(/(\d{3})(\d)/, "$1.$2");
      maskedValue = maskedValue.replace(/(\d{3})(\d)/, "$1.$2");
      maskedValue = maskedValue.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      maskedValue = maskedValue.substring(0, 14);
    } else if (name === "zipCode") {
      maskedValue = value.replace(/\D/g, "");
      maskedValue = maskedValue.replace(/^(\d{5})(\d)/, "$1-$2");
      maskedValue = maskedValue.substring(0, 9);
    }

    setFormData(prev => ({ ...prev, [name]: maskedValue }));

    // Busca de CEP automática
    if (name === "zipCode" && maskedValue.replace(/\D/g, "").length === 8) {
      fetchAddress(maskedValue.replace(/\D/g, ""));
    }
  };

  const fetchAddress = async (zip: string) => {
    setIsFetchingZip(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${zip}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          street: data.logradouro || "",
          neighborhood: data.bairro || "",
          city: data.localidade || "",
          state: data.uf || ""
        }));
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    } finally {
      setIsFetchingZip(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setIsValidatingCoupon(true);
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.trim().toUpperCase())
        .eq('active', true)
        .single();

      if (error || !data) {
        alert("Cupom inválido ou expirado.");
        setAppliedCoupon(null);
      } else {
        setAppliedCoupon({
          code: data.code,
          type: data.discount_type,
          value: Number(data.discount_value)
        });
        alert(`Cupom ${data.code} aplicado com sucesso!`);
      }
    } catch (err) {
      alert("Erro ao validar cupom.");
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'percentage') {
      return (totalPrice * appliedCoupon.value) / 100;
    }
    return appliedCoupon.value;
  };

  const discountAmount = calculateDiscount();
  const finalPrice = totalPrice - discountAmount;

  const sendOrderEmail = async (orderData: any) => {
    try {
      const itemsSummary = orderData.items.map((item: any) => 
        `${item.quantity}x ${item.name}${item.size ? ` (Tam: ${item.size})` : ""}${item.color ? ` (Cor: ${item.color})` : ""} - R$ ${(item.price * item.quantity).toFixed(2)}`
      ).join("<br>");

      const address = orderData.shipping_address;
      const formattedAddress = `${address.street}, ${address.number}${address.complement ? ` - ${address.complement}` : ""}, ${address.neighborhood}, ${address.city} - ${address.state}, CEP: ${address.zipCode}`;

      const templateParams = {
        order_number: orderData.order_number,
        customer_name: orderData.customer_name,
        customer_email: orderData.customer_email,
        customer_whatsapp: orderData.customer_whatsapp,
        items_summary: itemsSummary,
        subtotal: totalPrice.toFixed(2),
        discount_amount: discountAmount.toFixed(2),
        coupon_code: appliedCoupon?.code || "Nenhum",
        total_price: finalPrice.toFixed(2),
        shipping_address: formattedAddress,
      };

      await Promise.all([
        emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID || "oppadoramaclub",
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID_ADMIN || "template_9jzu8ud",
          templateParams,
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "RyTlfKdI6BWqOwijs"
        ),
        emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID || "oppadoramaclub",
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID_CUSTOMER || "template_9jzu8ud",
          templateParams,
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "RyTlfKdI6BWqOwijs"
        )
      ]);
      console.log("E-mails de notificação enviados com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar e-mail de notificação:", error);
    }
  };

  const handleCheckout = async () => {
    // Basic validation
    const requiredFields = ['name', 'email', 'confirmEmail', 'whatsapp', 'cpf', 'zipCode', 'street', 'number', 'neighborhood', 'city', 'state'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);

    if (missingFields.length > 0) {
      alert("Por favor, preencha todos os campos obrigatórios do cadastro.");
      return;
    }

    if (formData.email.toLowerCase() !== formData.confirmEmail.toLowerCase()) {
      alert("Os e-mails digitados não são iguais. Por favor, verifique.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Por favor, insira um e-mail válido.");
      return;
    }

    setIsSubmitting(true);
    console.log('Iniciando processo de checkout...');

    try {
      // Gerar número do pedido antes de salvar
      const generatedOrderNumber = `OPPA-${Math.floor(100000 + Math.random() * 900000)}`;

      // 1. Save to Supabase with a timeout to prevent infinite loading
      console.log('Enviando dados para o Supabase...');

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('A conexão com o banco de dados demorou muito (Timeout).')), 20000)
      );

      const supabasePromise = supabase
        .from('orders')
        .insert([
          {
            order_number: generatedOrderNumber,
            customer_name: formData.name,
            customer_email: formData.email,
            customer_whatsapp: formData.whatsapp,
            customer_cpf: formData.cpf,
            coupon_code: appliedCoupon?.code || null,
            discount_amount: discountAmount,
            shipping_address: {
              zipCode: formData.zipCode,
              street: formData.street,
              number: formData.number,
              complement: formData.complement,
              neighborhood: formData.neighborhood,
              city: formData.city,
              state: formData.state
            },
            items: cart,
            total_price: finalPrice,
            status: 'pending'
          }
        ])
        .select();

      const { data, error } = await Promise.race([supabasePromise, timeoutPromise]) as any;

      if (error) {
        throw error;
      }

      // 2. Enviar e-mail de notificação
      const orderInfo = {
        order_number: generatedOrderNumber,
        customer_name: formData.name,
        customer_email: formData.email,
        customer_whatsapp: formData.whatsapp,
        items: cart,
        shipping_address: {
          zipCode: formData.zipCode,
          street: formData.street,
          number: formData.number,
          complement: formData.complement,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state
        }
      };
      
      // Chamada assíncrona para não travar a tela de sucesso
      sendOrderEmail(orderInfo);

      // 3. Set success state and order number
      setOrderNumber(generatedOrderNumber);
      setIsSuccess(true);
      clearCart();

    } catch (err: any) {
      console.error('Erro no checkout:', err);
      alert(`Ocorreu um erro ao processar seu pedido: ${err.message}. Por favor, tente novamente.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-24">
        <Helmet>
          <title>Pedido Confirmado | Oppa Store</title>
        </Helmet>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-lg bg-white/60 backdrop-blur-md p-12 rounded-[3rem] border border-accent/5 shadow-2xl"
        >
          <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <ShoppingBag className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-4xl font-display font-bold text-accent mb-4">Pedido Recebido!</h2>
          <p className="text-accent/60 mb-6">
            Obrigado por comprar na Oppa Store. Seu pedido foi registrado com sucesso em nosso sistema.
          </p>
          
          <div className="bg-secondary/10 p-6 rounded-2xl mb-8">
            <p className="text-xs font-black text-accent/40 uppercase tracking-widest mb-1">Número do Pedido</p>
            <p className="text-2xl font-black text-primary">{orderNumber}</p>
          </div>

          <p className="text-sm text-accent/60 mb-8 leading-relaxed">
            Nossa equipe entrará em contato via <strong>WhatsApp</strong> ou <strong>E-mail</strong> em breve para confirmar o pagamento e os detalhes da entrega.
          </p>

          <Link 
            to="/store" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar para a Loja
          </Link>
        </motion.div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <Helmet>
          <title>Carrinho Vazio | Oppa Store</title>
        </Helmet>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <ShoppingBag className="w-10 h-10 text-primary/40" />
          </div>
          <h2 className="text-3xl font-display font-bold text-accent mb-4">Seu carrinho está vazio</h2>
          <p className="text-accent/60 mb-8 max-w-xs mx-auto">Parece que você ainda não escolheu seus mimos dorameiros favoritos.</p>
          <Link 
            to="/store" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar para a Loja
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 md:py-32 px-6">
      <Helmet>
        <title>{`Meu Carrinho (${totalItems}) | Oppa Store`}</title>
      </Helmet>
      
      <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h1 className="text-4xl font-display font-bold text-accent">Meu Carrinho</h1>
            <div className="flex items-center gap-4">
              <Link to="/store" className="text-primary font-bold hover:underline flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Continuar Comprando
              </Link>
            </div>
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Lista de Itens e Cadastro */}
          <div className="lg:col-span-2 space-y-12">
            {/* Itens */}
            <div className="space-y-6">
              <h2 className="text-xl font-display font-bold text-accent flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                Itens no Carrinho
              </h2>
              {cart.map((item) => (
                <motion.div 
                  key={`${item.id}-${item.size}-${item.color}`}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/60 backdrop-blur-md rounded-3xl p-6 border border-accent/5 flex flex-col sm:flex-row items-center gap-6 shadow-xl shadow-accent/5"
                >
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-secondary/10 shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-lg font-display font-bold text-accent mb-1">{item.name}</h3>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-3 text-xs font-bold text-accent/40 uppercase tracking-wider mb-2">
                      {item.size && <span>Tam: {item.size}</span>}
                      {item.color && <span>Cor: {item.color}</span>}
                    </div>
                    <p className="text-primary font-black">R$ {item.price.toFixed(2)}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-secondary/10 rounded-xl p-1">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1, item.size, item.color)}
                        className="p-2 hover:bg-white rounded-lg transition-colors text-accent/60"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-black text-accent">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1, item.size, item.color)}
                        className="p-2 hover:bg-white rounded-lg transition-colors text-accent/60"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item.id, item.size, item.color)}
                      className="p-3 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Cadastro */}
            <div className="bg-white/60 backdrop-blur-md rounded-[2.5rem] p-8 border border-accent/5 shadow-xl shadow-accent/5">
              <h2 className="text-2xl font-display font-bold text-accent mb-8 flex items-center gap-3">
                <User className="w-6 h-6 text-primary" />
                Dados para Entrega
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nome Completo */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-accent/40 uppercase tracking-widest mb-2 ml-1">Nome Completo *</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent/20" />
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Como podemos te chamar?"
                      className="w-full h-14 pl-12 pr-6 bg-secondary/5 border-2 border-transparent rounded-2xl focus:border-primary/20 focus:bg-white transition-all outline-none font-bold text-accent"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:col-span-2">
                  <div>
                    <label className="block text-xs font-black text-accent/40 uppercase tracking-widest mb-2 ml-1">E-mail *</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent/20" />
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="seu@email.com"
                        className="w-full h-14 pl-12 pr-6 bg-secondary/5 border-2 border-transparent rounded-2xl focus:border-primary/20 focus:bg-white transition-all outline-none font-bold text-accent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-accent/40 uppercase tracking-widest mb-2 ml-1">Confirmar E-mail *</label>
                    <div className="relative">
                      <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${formData.confirmEmail && formData.email !== formData.confirmEmail ? "text-rose-500" : "text-accent/20"}`} />
                      <input 
                        type="email" 
                        name="confirmEmail"
                        value={formData.confirmEmail}
                        onChange={handleInputChange}
                        placeholder="Repita seu e-mail"
                        className={`w-full h-14 pl-12 pr-6 bg-secondary/5 border-2 rounded-2xl focus:bg-white transition-all outline-none font-bold text-accent ${
                          formData.confirmEmail && formData.email !== formData.confirmEmail 
                            ? "border-rose-500/50 focus:border-rose-500" 
                            : "border-transparent focus:border-primary/20"
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-xs font-black text-accent/40 uppercase tracking-widest mb-2 ml-1">WhatsApp *</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent/20" />
                    <input 
                      type="tel" 
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      placeholder="(00) 00000-0000"
                      className="w-full h-14 pl-12 pr-6 bg-secondary/5 border-2 border-transparent rounded-2xl focus:border-primary/20 focus:bg-white transition-all outline-none font-bold text-accent"
                    />
                  </div>
                </div>

                {/* CPF */}
                <div>
                  <label className="block text-xs font-black text-accent/40 uppercase tracking-widest mb-2 ml-1">CPF *</label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent/20" />
                    <input 
                      type="text" 
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleInputChange}
                      placeholder="000.000.000-00"
                      className="w-full h-14 pl-12 pr-6 bg-secondary/5 border-2 border-transparent rounded-2xl focus:border-primary/20 focus:bg-white transition-all outline-none font-bold text-accent"
                    />
                  </div>
                </div>

                {/* CEP */}
                <div>
                  <label className="block text-xs font-black text-accent/40 uppercase tracking-widest mb-2 ml-1">CEP *</label>
                  <div className="relative">
                    <MapPin className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isFetchingZip ? "text-primary animate-bounce" : "text-accent/20"}`} />
                    <input 
                      type="text" 
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      placeholder="00000-000"
                      maxLength={9}
                      className="w-full h-14 pl-12 pr-6 bg-secondary/5 border-2 border-transparent rounded-2xl focus:border-primary/20 focus:bg-white transition-all outline-none font-bold text-accent"
                    />
                  </div>
                </div>

                {/* Rua */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-accent/40 uppercase tracking-widest mb-2 ml-1">Rua / Logradouro *</label>
                  <div className="relative">
                    <Home className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isFetchingZip ? "text-primary/40" : "text-accent/20"}`} />
                    <input 
                      type="text" 
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      placeholder={isFetchingZip ? "Buscando..." : "Nome da rua ou avenida"}
                      disabled={isFetchingZip}
                      className="w-full h-14 pl-12 pr-6 bg-secondary/5 border-2 border-transparent rounded-2xl focus:border-primary/20 focus:bg-white transition-all outline-none font-bold text-accent disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Número e Complemento */}
                <div>
                  <label className="block text-xs font-black text-accent/40 uppercase tracking-widest mb-2 ml-1">Número *</label>
                  <input 
                    type="text" 
                    name="number"
                    value={formData.number}
                    onChange={handleInputChange}
                    placeholder="Ex: 123"
                    className="w-full h-14 px-6 bg-secondary/5 border-2 border-transparent rounded-2xl focus:border-primary/20 focus:bg-white transition-all outline-none font-bold text-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-accent/40 uppercase tracking-widest mb-2 ml-1">Complemento</label>
                  <input 
                    type="text" 
                    name="complement"
                    value={formData.complement}
                    onChange={handleInputChange}
                    placeholder="Apto, Bloco, etc."
                    className="w-full h-14 px-6 bg-secondary/5 border-2 border-transparent rounded-2xl focus:border-primary/20 focus:bg-white transition-all outline-none font-bold text-accent"
                  />
                </div>

                {/* Bairro, Cidade e Estado */}
                <div>
                  <label className="block text-xs font-black text-accent/40 uppercase tracking-widest mb-2 ml-1">Bairro *</label>
                  <input 
                    type="text" 
                    name="neighborhood"
                    value={formData.neighborhood}
                    onChange={handleInputChange}
                    placeholder={isFetchingZip ? "Buscando..." : "Seu bairro"}
                    disabled={isFetchingZip}
                    className="w-full h-14 px-6 bg-secondary/5 border-2 border-transparent rounded-2xl focus:border-primary/20 focus:bg-white transition-all outline-none font-bold text-accent disabled:opacity-50"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-black text-accent/40 uppercase tracking-widest mb-2 ml-1">Cidade *</label>
                    <input 
                      type="text" 
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder={isFetchingZip ? "Buscando..." : "Sua cidade"}
                      disabled={isFetchingZip}
                      className="w-full h-14 px-6 bg-secondary/5 border-2 border-transparent rounded-2xl focus:border-primary/20 focus:bg-white transition-all outline-none font-bold text-accent disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-accent/40 uppercase tracking-widest mb-2 ml-1">UF *</label>
                    <input 
                      type="text" 
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder={isFetchingZip ? "..." : "SP"}
                      maxLength={2}
                      disabled={isFetchingZip}
                      className="w-full h-14 px-6 bg-secondary/5 border-2 border-transparent rounded-2xl focus:border-primary/20 focus:bg-white transition-all outline-none font-bold text-accent text-center uppercase disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <div className="bg-accent text-white rounded-[2.5rem] p-8 shadow-2xl sticky top-32">
              <h2 className="text-2xl font-display font-bold mb-8">Resumo</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-white/60">
                  <span>Subtotal</span>
                  <span>R$ {totalPrice.toFixed(2)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-400 font-bold">
                    <span>Desconto ({appliedCoupon.code})</span>
                    <span>- R$ {discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-white/60">
                  <span>Frete</span>
                  <span className="text-green-400 font-bold">Grátis</span>
                </div>
                <div className="pt-4 border-t border-white/10 flex justify-between text-xl font-black">
                  <span>Total</span>
                  <span>R$ {finalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Aviso de Estoque */}
              <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-pulse" /> Aviso de Estoque
                </p>
                <p className="text-[11px] text-white/60 leading-relaxed">
                  Seu pedido reserva o estoque por <strong className="text-amber-500">24 horas</strong>. Caso não consigamos contato via E-mail ou WhatsApp neste prazo, o pedido será cancelado automaticamente para liberação dos itens.
                </p>
              </div>

              {/* Campo de Cupom */}
              {!appliedCoupon ? (
                <div className="mb-8">
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2 ml-1">Possui um cupom?</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="CÓDIGO"
                      className="min-w-0 flex-1 h-12 px-4 bg-white/10 border border-white/10 rounded-xl focus:bg-white/20 transition-all outline-none font-bold text-white uppercase placeholder:text-white/20"
                    />
                    <button 
                      onClick={handleApplyCoupon}
                      disabled={isValidatingCoupon || !couponCode.trim()}
                      className="shrink-0 px-6 bg-white text-accent rounded-xl font-black text-xs hover:bg-primary hover:text-white transition-all disabled:opacity-50 whitespace-nowrap"
                    >
                      {isValidatingCoupon ? "..." : "Aplicar"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mb-8 p-4 bg-green-500/20 border border-green-500/30 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-green-400 uppercase tracking-widest">Cupom Ativo</p>
                    <p className="font-bold text-white">{appliedCoupon.code}</p>
                  </div>
                  <button 
                    onClick={() => {setAppliedCoupon(null); setCouponCode("");}}
                    className="text-[10px] font-black text-white/40 hover:text-white uppercase underline"
                  >
                    Remover
                  </button>
                </div>
              )}

              <button 
                onClick={handleCheckout}
                disabled={isSubmitting}
                className="w-full py-5 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    Finalizar Pedido
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <p className="mt-6 text-center text-[10px] text-white/40 uppercase tracking-widest leading-relaxed">
                Ao clicar em finalizar, seu pedido será registrado e entraremos em contato para combinar o pagamento.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
