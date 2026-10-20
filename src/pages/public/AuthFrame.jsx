import { motion } from 'framer-motion';
import Logo from '../../components/layout/Logo';
import BodyTwin from '../../components/twin/BodyTwin';
import { SyntheticBanner } from '../../components/ui';

/** Two-column frame shared by login / signup / reset / verify. */
export default function AuthFrame({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-white">
      <SyntheticBanner />
      <div className="grid min-h-[calc(100vh-30px)] lg:grid-cols-[1fr_1.05fr]">
        <div className="flex flex-col px-6 py-8 sm:px-12">
          <Logo tagline />
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto my-auto w-full max-w-md py-10">
            <h1 className="text-3xl font-bold text-navy">{title}</h1>
            {subtitle && <p className="mt-2 text-sm text-subtle">{subtitle}</p>}
            <div className="mt-7">{children}</div>
          </motion.div>
        </div>
        <div className="relative hidden border-l border-line bg-mist lg:block" aria-hidden>
          <div className="absolute left-1/2 top-1/2 h-[540px] -translate-x-1/2 -translate-y-1/2"><BodyTwin className="h-full" /></div>
          <p className="absolute inset-x-0 bottom-10 px-12 text-center text-lg font-medium text-navy">“A Lifetime of Health, Connected.”</p>
        </div>
      </div>
    </div>
  );
}
