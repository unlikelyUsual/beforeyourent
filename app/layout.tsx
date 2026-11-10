import type { Metadata } from "next";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DemoBanner } from "@/components/demo-banner";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { APP_NAME } from "@/lib/copy";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s · ${APP_NAME}`,
  },
  description:
    "A local prototype for reading fictional sample rental notes and trying a demo review form. Not a live review service.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <TooltipProvider>
          <a className="skip-link" href="#main">
            Skip to content
          </a>
          <div className="flex min-h-dvh flex-col">
            <div className="sticky top-0 z-40">
              <SiteHeader />
              <DemoBanner />
            </div>
            <main id="main" className="flex-1">
              {children}
            </main>
            <SiteFooter />
          </div>
        </TooltipProvider>
      </body>
    </html>
  );
}
