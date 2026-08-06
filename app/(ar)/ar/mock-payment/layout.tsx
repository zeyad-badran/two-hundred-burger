import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'الدفع الوهمي | Two Hundred Burger',
  robots: {
    index: false,
    follow: false,
  },
};

export default function MockPaymentLayoutAr({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
