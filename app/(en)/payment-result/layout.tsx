import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Payment Result | Two Hundred Burger',
  robots: {
    index: false,
    follow: false,
  },
};

export default function PaymentResultLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
