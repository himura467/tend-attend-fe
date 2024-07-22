import SignupForm from "@/components/host/signup-form";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function SignupPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <Header />
      <div className="container mx-auto flex max-w-[1200px] flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <SignupForm />
      </div>
      <Footer />
    </div>
  );
}
