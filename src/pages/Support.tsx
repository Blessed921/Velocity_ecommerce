import React from 'react';
import { motion } from 'motion/react';
import { Shield, Truck, RefreshCcw, HelpCircle, Mail, MessageSquare } from 'lucide-react';

const SupportSection = ({ id, title, icon: Icon, children }: any) => (
  <section id={id} className="scroll-mt-32 space-y-10 py-16 border-b border-white/5">
    <div className="flex items-center gap-6">
      <div className="w-16 h-16 bg-white/5 flex items-center justify-center rounded-full border border-white/10 text-white">
        <Icon size={24} />
      </div>
      <h2 className="text-4xl font-black italic tracking-tighter uppercase">{title}</h2>
    </div>
    <div className="max-w-3xl space-y-6 text-stone-400 font-medium leading-relaxed">
      {children}
    </div>
  </section>
);

export default function Support() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-20">
      <div className="max-w-3xl mb-24 space-y-8 text-center mx-auto">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-500">Concierge Center</p>
        <h1 className="text-7xl font-black italic tracking-tighter uppercase leading-[0.9]">How can we assist your journey?</h1>
        <div className="flex flex-wrap justify-center gap-4 pt-8">
          <a href="#shipping" className="bg-white/5 border border-white/10 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all">Shipping</a>
          <a href="#returns" className="bg-white/5 border border-white/10 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all">Returns</a>
          <a href="#privacy" className="bg-white/5 border border-white/10 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all">Privacy</a>
          <a href="#faq" className="bg-white/5 border border-white/10 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all">FAQ</a>
        </div>
      </div>

      <div className="space-y-12">
        <SupportSection id="shipping" title="Global Logistics" icon={Truck}>
          <p>We provide expedited global transit for all Signature Series acquisitions. Our logistics network ensures that your gear reaches you within 3-5 business days, regardless of your location on the grid.</p>
          <ul className="space-y-4 list-disc pl-5 uppercase text-[10px] font-black tracing-widest">
            <li>Free shipping on all missions over $150</li>
            <li>Priority flight for elite members</li>
            <li>Real-time satellite tracking provided with every order</li>
          </ul>
        </SupportSection>

        <SupportSection id="returns" title="Returns & Refits" icon={RefreshCcw}>
          <p>Accuracy is paramount. If your gear doesn't perform to your expectations, we offer a 30-day window for refits or full credit returns.</p>
          <p>Items must be in original condition, with all technical tags intact. Returns are strictly prohibited on limited series drops unless a manufacturer defect is detected.</p>
        </SupportSection>

        <SupportSection id="privacy" title="Privacy Protocols" icon={Shield}>
          <p>Your identity is your most valuable asset. We employ military-grade encryption for all transaction data and personal identifiers. We never sell your biometric or purchase data to third-party entities.</p>
          <p>For a full analysis of our data handling protocols, please download our comprehensive Privacy Whitepaper.</p>
        </SupportSection>

        <SupportSection id="faq" title="Common Queries" icon={HelpCircle}>
          <div className="space-y-12">
            <div>
              <h4 className="text-white font-black uppercase text-sm mb-2 tracking-widest">Are release dates guaranteed?</h4>
              <p>Due to the complexity of our engineering process, release dates are target milestones. We prioritize build quality over rapid deployment.</p>
            </div>
            <div>
              <h4 className="text-white font-black uppercase text-sm mb-2 tracking-widest">What payment methods are cleared?</h4>
              <p>We currently accept all major credit cards, Apple Pay, and Google Pay through our secure portal powered by Paystack.</p>
            </div>
            <div>
              <h4 className="text-white font-black uppercase text-sm mb-2 tracking-widest">Can I alter my order after deployment?</h4>
              <p>Orders move to our fulfillment phase instantly. Amendments are only possible within 30 minutes of order confirmation.</p>
            </div>
          </div>
        </SupportSection>
      </div>

      <div className="mt-32 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-stone-900 border border-white/10 p-12 space-y-6">
          <Mail className="text-red-500" size={32} />
          <h3 className="text-2xl font-black italic uppercase italic tracking-tighter">Transmission</h3>
          <p className="text-stone-500 text-sm font-medium">Reach our dedicated support team via encrypted email for complex inquiries.</p>
          <p className="text-white font-black tracking-widest uppercase text-xs">Support@Velocity.Labs</p>
        </div>
        <div className="bg-white text-black p-12 space-y-6">
          <MessageSquare size={32} />
          <h3 className="text-2xl font-black italic uppercase italic tracking-tighter">Live Comms</h3>
          <p className="text-stone-600 text-sm font-medium">Real-time assistance available Monday through Friday, 0800 to 1800 GMT.</p>
          <button className="bg-black text-white px-8 py-3 font-black uppercase text-[10px] tracking-widest">Initiate Link</button>
        </div>
      </div>
    </div>
  );
}
