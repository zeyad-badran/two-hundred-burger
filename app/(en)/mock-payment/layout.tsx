import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mock Payment | Two Hundred Burger',
  robots: {
    index: false,
    follow: false,
  },
};

export default function MockPaymentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
