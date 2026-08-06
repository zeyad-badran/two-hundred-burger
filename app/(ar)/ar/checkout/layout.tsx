import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'إتمام الطلب | Two Hundred Burger',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutLayoutAr({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
