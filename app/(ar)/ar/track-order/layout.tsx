import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'تتبع الطلب | Two Hundred Burger',
  robots: {
    index: false,
    follow: false,
  },
};

export default function TrackOrderLayoutAr({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
