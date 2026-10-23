import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.why': 'WHY',
    'nav.use': 'USE',
    'nav.whatsup': "WHAT'S UP",
    'nav.back': '← Bitcoin Roatán',
    
    // Home
    'home.title': 'Bitcoin Roatán',
    'home.subtitle': 'A practical guide to using Bitcoin on the island',
    'home.snapshot.title': 'Movement Snapshot',
    'home.snapshot.merchants': '55+ merchants accepting Bitcoin (mostly Lightning)',
    'home.snapshot.atms': '2 public Bitcoin ATMs',
    'home.snapshot.companies': '15+ Bitcoin-related companies, projects, and initiatives',
    'home.snapshot.events': 'Weekly workshops, monthly meetups, seasonal retreats',
    'home.map.title': 'Find Bitcoin on the Island',
    'home.about': 'About this guide',
    
    // Why page
    'why.title': 'Why Bitcoin Roatán',
    'why.sub.roatan': 'Why Roatán',
    'why.sub.guide': 'Why this guide',
    'why.roatan.title': 'Why Roatán',
    'why.roatan.intro': 'Roatán is quietly becoming one of the most practical places to use Bitcoin in everyday life.',
    'why.roatan.text': 'The island combines a tourism-driven economy, widespread use of multiple currencies (USD, HNL), and a growing Bitcoin-native community. Merchants increasingly accept Lightning payments for food, coffee, coworking, accommodation, and services.\n\nThe presence of the Próspera zone has attracted Bitcoin builders, entrepreneurs, and long-term residents experimenting with Bitcoin-based business models. Unlike many places, Bitcoin use here is practical rather than ideological.',
    'why.roatan.opportunity': 'Whether you\'re visiting with a Lightning wallet or exploring longer-term relocation or business, Roatán offers a working environment where Bitcoin is already part of daily transactions.',
    'why.guide.title': 'Why this guide',
    'why.guide.text': 'This guide exists to document what actually works on the ground.\nNo promotion. No speculation. Just verified, practical information for visitors, locals, and builders who want to use Bitcoin on Roatán.',
    'why.quick.title': 'Why Roatán might become a Bitcoin island',
    'why.quick.merchants': 'Active merchant adoption using Lightning',
    'why.quick.infrastructure': 'Functional Bitcoin ATMs and payment infrastructure',
    'why.quick.prospera': 'International visitors + Próspera regulatory zone',
    'why.quick.culture': 'Strong overlap of tourism, remote work, and Bitcoin culture',
    'why.important.title': 'Important note',
    'why.important.text': 'Bitcoin is not "crypto." It is a unique, decentralized monetary network with no company, no CEO, and no pre-mine. Unlike thousands of altcoins created for speculation, Bitcoin has a fixed supply of 21 million, cannot be inflated, and operates on the most secure computer network in history. It is sound money for the digital age — not a token, not a platform, just money that works.',
    
    // Use page
    'use.title': 'Use Bitcoin Roatán',
    'use.sub.map': 'Map',
    'use.sub.atms': 'ATMs',
    'use.sub.exchange': 'Exchange options',
    'use.sub.accept': 'Accept Bitcoin',
    'use.map.title': 'Map',
    'use.atms.title': 'ATMs',
    'use.atms.note': 'Fees and cash availability vary. Confirm on-site before large transactions.',
    'use.atms.buy': 'Buy fee',
    'use.atms.sell': 'Sell fee',
    'use.exchange.title': 'Exchange options',
    'use.exchange.intro': 'Bitcoin exchange on Roatán is mostly informal and practical rather than platform-based.',
    'use.exchange.howTitle': 'How people usually get Bitcoin on Roatán',
    'use.exchange.atms': 'Bitcoin ATMs (instant, higher fees)',
    'use.exchange.p2p': 'Peer-to-peer exchanges within the local community',
    'use.exchange.wallet': 'Arriving with Bitcoin already in a mobile wallet',
    'use.exchange.forVisitors': 'For visitors',
    'use.exchange.visitorsText': 'Most visitors bring Bitcoin with them and rely on Lightning for daily spending.',
    'use.exchange.forLocals': 'For locals',
    'use.exchange.localsText': 'Locals often mix cash and Bitcoin, using ATMs or trusted peer-to-peer exchanges as needed.',
    'use.exchange.safetyTitle': 'Important note',
    'use.exchange.safetyText': 'Use trusted contacts, meet in public places, start small. Bitcoin usage is voluntary and self-custodial.',
    'use.accept.title': 'Accept Bitcoin',
    'use.accept.text': 'Resources for businesses interested in accepting Bitcoin payments on Roatán.\nGuides, wallet recommendations, and local support contacts will be listed here.',
    'use.quick.title': 'Fast start',
    'use.quick.wallet': 'Install a Lightning wallet: Blink, Muun, Phoenix',
    'use.quick.arrive': 'Arrive with Bitcoin or buy a small amount locally',
    'use.quick.pay': 'Pay by scanning Lightning QR codes at merchants',
    'use.sub.checklist': 'Getting Started',
    'use.checklist.title': 'Getting Started Checklist',
    'use.checklist.intro': 'New to Bitcoin? Complete these steps before or during your visit.',
    'checklist.wallet': 'Install a Lightning wallet',
    'checklist.wallet.desc': 'Download Blink, Muun, or Phoenix on your phone',
    'checklist.backup': 'Back up your recovery phrase',
    'checklist.backup.desc': 'Write down your 12/24 words and store them safely offline',
    'checklist.sats': 'Get some sats',
    'checklist.sats.desc': 'Buy Bitcoin via ATM, exchange, or receive from a friend',
    'checklist.test': 'Make a test payment',
    'checklist.test.desc': 'Send a small amount to yourself or a friend to practice',
    'checklist.merchant': 'Pay at a local merchant',
    'checklist.merchant.desc': 'Buy a coffee or meal with Lightning at a Bitcoin-friendly spot',
    'checklist.community': 'Join the community',
    'checklist.community.desc': 'Connect on WhatsApp or attend a local Bitcoin event',
    'checklist.complete': 'You\'re ready to use Bitcoin on Roatán!',
    
    // What's Up page
    'whatsup.title': "What's Up Bitcoin Roatán",
    'whatsup.sub.community': 'Community',
    'whatsup.sub.events': 'Events',
    'whatsup.sub.links': 'Links',
    'whatsup.community.title': 'Community',
    'whatsup.community.intro': 'Roatán\'s Bitcoin community includes local residents, merchants, remote workers, and visiting Bitcoiners.',
    'whatsup.community.howTitle': 'How the community connects',
    'whatsup.community.whatsapp': 'WhatsApp: daily coordination, local questions',
    'whatsup.community.telegram': 'Telegram: broader discussions, short-term visitors',
    'whatsup.community.eventsPage': 'Events page: canonical source for scheduled activities',
    'whatsup.community.disclaimer': 'Channels are moderated but open. Always verify information independently.',
    'whatsup.events.title': 'Events',
    'whatsup.events.allEvents': 'View all events',
    'whatsup.events.generalNote': 'Events range from informal meetups to structured workshops and retreats. Formats change with seasonality.',
    'whatsup.links.title': 'Links',
    'whatsup.links.text': 'External resources relevant to Bitcoin users and builders on Roatán.',
    
    // Events
    'events.coworking.title': 'Coworking Tuesday',
    'events.coworking.desc': 'Every Tuesday at Bitcoin Center – 50% off coffee, Bitcoin help available, workshops at 4pm',
    'events.coworking.detail': 'Open coworking and informal meetups. No registration required.',
    'events.satoshi.title': 'Satoshi Saturday',
    'events.satoshi.desc': 'Monthly Bitcoin social and networking meetup',
    'events.satoshi.detail': 'Conversations, merchant feedback, community updates. Open to all levels.',
    'events.bitchill.title': 'Bitchill S02',
    'events.bitchill.desc': 'Bitcoin retreat, January 18–28, 2025',
    'events.bitchill.detail': 'Example of seasonal Bitcoin retreats hosted on the island',
    'events.schedule.weekly': 'Weekly',
    'events.schedule.monthly': 'Monthly',
    'events.schedule.once': 'Special',
    
    // Community
    'community.whatsapp.title': 'Bitcoin Roatán WhatsApp',
    'community.whatsapp.desc': 'Questions, updates, merchant info, peer support',
    'community.events.title': 'Events Calendar',
    'community.events.desc': 'All upcoming Bitcoin events on the island',
    
    // Now/Important
    'now.title': 'Now',
    
    // About page
    'about.title': 'About',
    'about.intro': 'Bitcoin Roatán is a community-maintained resource created by local organizations and volunteers.\nThe goal is accuracy, neutrality, and usefulness — not promotion.',
    'about.partners': 'Partners',
    'about.partner.bd': 'Bitcoin District',
    'about.partner.bd.desc': 'Local Bitcoin education, events, and adoption initiatives.',
    'about.partner.aa': 'AmityAge',
    'about.partner.aa.desc': 'Supporting grassroots Bitcoin communities globally.',
    
    // Language toggle
    'lang.en': 'EN',
    'lang.es': 'ES',
    
    // Email signup
    'email.title': 'Stay Updated',
    'email.description': 'Occasional updates on Bitcoin adoption, events, and infrastructure on Roatán. No spam. No marketing.',
    'email.placeholder': 'Your email',
    'email.submit': 'Subscribe',
    'email.sending': 'Sending...',
    'email.success': 'Subscribed',
    'email.successMessage': 'Thanks for subscribing. We\'ll keep you posted.',
    'email.error': 'Error',
    'email.errorEmpty': 'Please enter your email address.',
    'email.errorMessage': 'Something went wrong. Please try again.',
    'email.privacy': 'We don\'t share your email. Unsubscribe anytime.',
  },
  es: {
    // Navigation
    'nav.why': 'POR QUÉ',
    'nav.use': 'USAR',
    'nav.whatsup': 'NOVEDADES',
    'nav.back': '← Bitcoin Roatán',
    
    // Home
    'home.title': 'Bitcoin Roatán',
    'home.subtitle': 'Una guía práctica para usar Bitcoin en la isla',
    'home.snapshot.title': 'Panorama del Movimiento',
    'home.snapshot.merchants': '55+ comercios aceptan Bitcoin (principalmente Lightning)',
    'home.snapshot.atms': '2 cajeros Bitcoin públicos',
    'home.snapshot.companies': '15+ empresas, proyectos e iniciativas relacionadas con Bitcoin',
    'home.snapshot.events': 'Talleres semanales, encuentros mensuales, retiros estacionales',
    'home.map.title': 'Encuentra Bitcoin en la Isla',
    'home.about': 'Sobre esta guía',
    
    // Why page
    'why.title': 'Por Qué Bitcoin Roatán',
    'why.sub.roatan': 'Por Qué Roatán',
    'why.sub.guide': 'Por Qué Esta Guía',
    'why.roatan.title': 'Por Qué Roatán',
    'why.roatan.intro': 'Roatán se está convirtiendo silenciosamente en uno de los lugares más prácticos para usar Bitcoin en la vida diaria.',
    'why.roatan.text': 'La isla combina una economía impulsada por el turismo, uso generalizado de múltiples monedas (USD, HNL) y una creciente comunidad nativa de Bitcoin. Los comercios aceptan cada vez más pagos Lightning para comida, café, coworking, alojamiento y servicios.\n\nLa presencia de la zona Próspera ha atraído a constructores de Bitcoin, emprendedores y residentes a largo plazo que experimentan con modelos de negocio basados en Bitcoin. A diferencia de muchos lugares, el uso de Bitcoin aquí es práctico más que ideológico.',
    'why.roatan.opportunity': 'Ya sea que visites con una billetera Lightning o explores reubicación o negocios a largo plazo, Roatán ofrece un entorno funcional donde Bitcoin ya es parte de las transacciones diarias.',
    'why.guide.title': 'Por Qué Esta Guía',
    'why.guide.text': 'Esta guía existe para documentar lo que realmente funciona en el terreno.\nSin promoción. Sin especulación. Solo información verificada y práctica para visitantes, locales y constructores que quieren usar Bitcoin en Roatán.',
    'why.quick.title': 'Por qué Roatán podría convertirse en una isla Bitcoin',
    'why.quick.merchants': 'Adopción activa de comerciantes usando Lightning',
    'why.quick.infrastructure': 'Cajeros Bitcoin funcionales e infraestructura de pagos',
    'why.quick.prospera': 'Visitantes internacionales + zona regulatoria Próspera',
    'why.quick.culture': 'Fuerte superposición de turismo, trabajo remoto y cultura Bitcoin',
    'why.important.title': 'Nota importante',
    'why.important.text': 'Bitcoin no es "cripto." Es una red monetaria única y descentralizada sin empresa, sin CEO y sin pre-minado. A diferencia de miles de altcoins creadas para especulación, Bitcoin tiene un suministro fijo de 21 millones, no puede ser inflado y opera en la red informática más segura de la historia. Es dinero sólido para la era digital — no un token, no una plataforma, solo dinero que funciona.',
    
    // Use page
    'use.title': 'Usar Bitcoin Roatán',
    'use.sub.map': 'Mapa',
    'use.sub.atms': 'Cajeros',
    'use.sub.exchange': 'Opciones de cambio',
    'use.sub.accept': 'Aceptar Bitcoin',
    'use.map.title': 'Mapa',
    'use.atms.title': 'Cajeros',
    'use.atms.note': 'Las comisiones y disponibilidad de efectivo varían. Confirma en el lugar antes de transacciones grandes.',
    'use.atms.buy': 'Comisión compra',
    'use.atms.sell': 'Comisión venta',
    'use.exchange.title': 'Opciones de cambio',
    'use.exchange.intro': 'El intercambio de Bitcoin en Roatán es principalmente informal y práctico, más que basado en plataformas.',
    'use.exchange.howTitle': 'Cómo la gente obtiene Bitcoin en Roatán',
    'use.exchange.atms': 'Cajeros Bitcoin (instantáneo, comisiones más altas)',
    'use.exchange.p2p': 'Intercambios peer-to-peer dentro de la comunidad local',
    'use.exchange.wallet': 'Llegar con Bitcoin ya en una billetera móvil',
    'use.exchange.forVisitors': 'Para visitantes',
    'use.exchange.visitorsText': 'La mayoría de visitantes traen Bitcoin y dependen de Lightning para gastos diarios.',
    'use.exchange.forLocals': 'Para locales',
    'use.exchange.localsText': 'Los locales mezclan efectivo y Bitcoin, usando cajeros o intercambios peer-to-peer de confianza según necesiten.',
    'use.exchange.safetyTitle': 'Nota importante',
    'use.exchange.safetyText': 'Usa contactos de confianza, reúnete en lugares públicos, empieza con poco. El uso de Bitcoin es voluntario y auto-custodiado.',
    'use.accept.title': 'Aceptar Bitcoin',
    'use.accept.text': 'Recursos para negocios interesados en aceptar pagos Bitcoin en Roatán.\nGuías, recomendaciones de billeteras y contactos de soporte local se listarán aquí.',
    'use.quick.title': 'Inicio rápido',
    'use.quick.wallet': 'Instala una billetera Lightning: Blink, Muun, Phoenix',
    'use.quick.arrive': 'Llega con Bitcoin o compra una pequeña cantidad localmente',
    'use.quick.pay': 'Paga escaneando códigos QR Lightning en comercios',
    'use.sub.checklist': 'Primeros Pasos',
    'use.checklist.title': 'Lista de Primeros Pasos',
    'use.checklist.intro': '¿Nuevo en Bitcoin? Completa estos pasos antes o durante tu visita.',
    'checklist.wallet': 'Instala una billetera Lightning',
    'checklist.wallet.desc': 'Descarga Blink, Muun o Phoenix en tu teléfono',
    'checklist.backup': 'Respalda tu frase de recuperación',
    'checklist.backup.desc': 'Anota tus 12/24 palabras y guárdalas de forma segura offline',
    'checklist.sats': 'Obtén algunos sats',
    'checklist.sats.desc': 'Compra Bitcoin en cajero, exchange o recibe de un amigo',
    'checklist.test': 'Haz un pago de prueba',
    'checklist.test.desc': 'Envía una pequeña cantidad a ti mismo o a un amigo para practicar',
    'checklist.merchant': 'Paga en un comercio local',
    'checklist.merchant.desc': 'Compra un café o comida con Lightning en un lugar Bitcoin-friendly',
    'checklist.community': 'Únete a la comunidad',
    'checklist.community.desc': 'Conéctate en WhatsApp o asiste a un evento Bitcoin local',
    'checklist.complete': '¡Estás listo para usar Bitcoin en Roatán!',
    
    // What's Up page
    'whatsup.title': 'Novedades Bitcoin Roatán',
    'whatsup.sub.community': 'Comunidad',
    'whatsup.sub.events': 'Eventos',
    'whatsup.sub.links': 'Enlaces',
    'whatsup.community.title': 'Comunidad',
    'whatsup.community.intro': 'La comunidad Bitcoin de Roatán incluye residentes locales, comerciantes, trabajadores remotos y Bitcoiners visitantes.',
    'whatsup.community.howTitle': 'Cómo se conecta la comunidad',
    'whatsup.community.whatsapp': 'WhatsApp: coordinación diaria, preguntas locales',
    'whatsup.community.telegram': 'Telegram: discusiones más amplias, visitantes a corto plazo',
    'whatsup.community.eventsPage': 'Página de eventos: fuente canónica para actividades programadas',
    'whatsup.community.disclaimer': 'Los canales son moderados pero abiertos. Siempre verifica la información de forma independiente.',
    'whatsup.events.title': 'Eventos',
    'whatsup.events.allEvents': 'Ver todos los eventos',
    'whatsup.events.generalNote': 'Los eventos van desde encuentros informales hasta talleres estructurados y retiros. Los formatos cambian según la temporada.',
    'whatsup.links.title': 'Enlaces',
    'whatsup.links.text': 'Recursos externos relevantes para usuarios y constructores de Bitcoin en Roatán.',
    
    // Events
    'events.coworking.title': 'Coworking Tuesday',
    'events.coworking.desc': 'Cada martes en Bitcoin Center – 50% descuento en café, ayuda Bitcoin disponible, talleres a las 4pm',
    'events.coworking.detail': 'Coworking abierto y encuentros informales. No requiere registro.',
    'events.satoshi.title': 'Satoshi Saturday',
    'events.satoshi.desc': 'Encuentro mensual social y de networking Bitcoin',
    'events.satoshi.detail': 'Conversaciones, feedback de comerciantes, actualizaciones de comunidad. Abierto a todos los niveles.',
    'events.bitchill.title': 'Bitchill S02',
    'events.bitchill.desc': 'Retiro Bitcoin, 18–28 de enero de 2025',
    'events.bitchill.detail': 'Ejemplo de retiros Bitcoin estacionales organizados en la isla',
    'events.schedule.weekly': 'Semanal',
    'events.schedule.monthly': 'Mensual',
    'events.schedule.once': 'Especial',
    
    // Community
    'community.whatsapp.title': 'WhatsApp Bitcoin Roatán',
    'community.whatsapp.desc': 'Preguntas, actualizaciones, info de comercios, soporte entre pares',
    'community.events.title': 'Calendario de Eventos',
    'community.events.desc': 'Todos los próximos eventos Bitcoin en la isla',
    
    // Now/Important
    'now.title': 'Ahora',
    
    // About page
    'about.title': 'Acerca de',
    'about.intro': 'Bitcoin Roatán es un recurso mantenido por la comunidad, creado por organizaciones locales y voluntarios.\nEl objetivo es precisión, neutralidad y utilidad — no promoción.',
    'about.partners': 'Socios',
    'about.partner.bd': 'Bitcoin District',
    'about.partner.bd.desc': 'Educación local de Bitcoin, eventos e iniciativas de adopción.',
    'about.partner.aa': 'AmityAge',
    'about.partner.aa.desc': 'Apoyando comunidades Bitcoin de base a nivel mundial.',
    
    // Language toggle
    'lang.en': 'EN',
    'lang.es': 'ES',
    
    // Email signup
    'email.title': 'Mantente Informado',
    'email.description': 'Actualizaciones ocasionales sobre adopción de Bitcoin, eventos e infraestructura en Roatán. Sin spam. Sin marketing.',
    'email.placeholder': 'Tu email',
    'email.submit': 'Suscribirse',
    'email.sending': 'Enviando...',
    'email.success': 'Suscrito',
    'email.successMessage': 'Gracias por suscribirte. Te mantendremos informado.',
    'email.error': 'Error',
    'email.errorEmpty': 'Por favor ingresa tu email.',
    'email.errorMessage': 'Algo salió mal. Por favor intenta de nuevo.',
    'email.privacy': 'No compartimos tu email. Cancela cuando quieras.',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
