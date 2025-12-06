import Layout from "@/components/layouts/Layout";
import "@/app/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ImageGen",
  description: "Image Generation App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  );
}