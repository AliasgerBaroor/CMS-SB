import { Provider } from "@/components/ui/provider"
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

export const metadata: Metadata = {
  title: "Saifee Burhani Creations",
  description: "Saifee Burhani Creations CMS",
  keywords: "CMS, Saifee, Burhani, Creations, SEO, Web Development",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Saifee Burhani Creations",
    description: "Discover Saifee Burhani Creations CMS",
    url: "https://yourwebsite.com",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        alt: "Saifee Burhani Creations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Saifee Burhani Creations",
    description: "Discover Saifee Burhani Creations CMS",
    images: ["/twitter-image.jpg"],
  },
};


const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body>
        <Provider>
        {children}
        </Provider>
      </body>
    </html>
  );
}

export default RootLayout