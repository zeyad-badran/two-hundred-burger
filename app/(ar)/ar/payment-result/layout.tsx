import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'نتيجة الدفع | Two Hundred Burger',
  robots: {
    index: false,
    follow: false,
  },
};

export default function PaymentResultLayoutAr({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
