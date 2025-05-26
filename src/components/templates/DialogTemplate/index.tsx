import React from "react";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";

interface DialogTemplateProps {
  children: React.ReactNode;
}

export const DialogTemplate = ({ children }: DialogTemplateProps): React.JSX.Element => {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <Header />
      <div className="container mx-auto flex max-w-[1200px] flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        {children}
      </div>
      <Footer />
    </div>
  );
};
