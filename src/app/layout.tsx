
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Selink - Link Manager',
  description: 'Kelola semua tautan Anda di satu halaman yang indah dan dapat disesuaikan.',
  icons: {
    icon: "data:image/svg+xml,%3csvg width='28' height='27' viewBox='0 0 162 243' fill='%233366FF' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M86.7826 161.935C85.7016 163.014 84.8918 163.854 84.0549 164.666C76.8707 171.636 70.3241 171.808 63.1482 164.82C50.7373 152.735 38.4937 140.479 26.1618 128.312C21.8857 124.094 17.6622 119.833 14.6495 114.568C3.84262 95.6823 6.36194 73.0432 22.0256 56.4571C35.8582 41.81 50.1038 27.5144 64.7654 13.6984C84.7123 -5.09795 114.947 -4.36432 134.723 14.7515C138.556 18.4562 142.298 22.255 146.065 26.0277C165.147 45.1413 166.789 71.5898 150.221 92.8694C143.157 101.942 143.039 101.979 134.977 94.0243C131.778 90.8674 128.788 87.4987 125.618 84.3107C123.433 82.1127 123.527 80.3669 125.622 77.9418C135.198 66.8572 134.730 56.0111 124.481 45.6982C120.958 42.1531 117.478 38.5608 113.851 35.1246C105.366 27.0859 92.8911 26.8261 84.5248 34.9544C70.9061 48.1857 57.4544 61.5956 44.178 75.1706C35.0986 84.4542 35.2257 95.9666 44.4471 105.392C58.4251 119.68 72.6542 133.722 86.7757 147.869C93.0069 154.111 93.0290 155.313 86.7826 161.935Z' /%3e%3cpath d='M99.7846 183.979C105.587 178.206 111.206 172.748 116.678 167.146C126.818 156.766 126.686 145.921 116.324 135.67C102.939 122.428 89.4945 109.246 76.107 96.0067C74.455 94.373 72.9301 92.5979 71.4638 90.7928C69.9738 88.9588 69.5077 86.5053 70.5898 84.6594C73.9945 78.8514 78.218 73.6204 85.0621 71.7078C88.8685 70.6442 92.5503 72.1493 95.2063 74.7669C111.577 90.9004 128.962 106.110 143.742 123.721C157.406 140.002 156.597 166.056 142.424 181.796C127.485 198.386 111.714 214.278 94.9481 229.008C73.736 247.645 45.1663 246.142 25.0828 226.327C20.813 222.114 16.3811 218.044 12.361 213.603C-5.24871 194.149 -4.08626 163.972 16.1254 144.226C18.245 142.155 20.0664 142.241 22.1166 144.274C27.085 149.202 32.0632 154.123 37.1528 158.925C39.7542 161.379 38.0732 162.925 36.3759 164.697C30.2001 171.143 27.4379 178.588 29.9337 187.486C30.7089 190.249 31.9918 192.804 34.0004 194.858C38.4263 199.384 42.7753 204.010 47.4835 208.229C56.4013 216.221 67.4616 215.912 76.1476 207.499C84.0461 199.848 91.7469 191.994 99.7846 183.979Z' /%3e%3c/svg%3e",
  },
  openGraph: {
    title: 'Selink - Link Manager',
    description: 'Kelola semua tautan Anda di satu halaman yang indah dan dapat disesuaikan.',
    images: [
      {
        url: 'https://selink-space.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Selink - Link Manager',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Selink - Link Manager',
    description: 'Kelola semua tautan Anda di satu halaman yang indah dan dapat disesuaikan.',
    images: ['https://selink-space.vercel.app/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${plusJakartaSans.variable} font-sans antialiased`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
