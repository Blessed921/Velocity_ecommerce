import { useEffect, useState } from 'react';

export const usePaystack = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (document.getElementById('paystack-script')) {
      setLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.id = 'paystack-script';
    script.async = true;
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);

    return () => {
      // Keep it for future use to avoid re-loading if navigating back
    };
  }, []);

  const initializePayment = ({ 
    email, 
    amount, 
    onSuccess, 
    onClose 
  }: { 
    email: string; 
    amount: number; 
    onSuccess: (response: any) => void; 
    onClose: () => void; 
  }) => {
    if (!loaded) {
      console.error('Paystack script not loaded');
      return;
    }

    const handler = (window as any).PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      email: email,
      amount: amount * 100, // Paystack expects kobo/cents
      currency: 'USD',
      callback: (response: any) => {
        onSuccess(response);
      },
      onClose: () => {
        onClose();
      }
    });

    handler.openIframe();
  };

  return { initializePayment, loaded };
};
