import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { PageTransition } from './PageTransition';
import ComingSoon from '@/pages/ComingSoon';
import Index from '@/pages/Index';
import Why from '@/pages/Why';
import Use from '@/pages/Use';
import WhatsUp from '@/pages/WhatsUp';
import About from '@/pages/About';
import NotFound from '@/pages/NotFound';

export function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<ComingSoon />} />
        <Route path="/hub" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/why" element={<PageTransition><Why /></PageTransition>} />
        <Route path="/use" element={<PageTransition><Use /></PageTransition>} />
        <Route path="/whatsup" element={<PageTransition><WhatsUp /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}
