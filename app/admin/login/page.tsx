import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-sm px-4 py-20">
      <h1 className="text-2xl font-bold">Agent login</h1>
      <p className="mb-6 mt-1 text-sm text-foreground/60">
        Sign in to manage listings and leads.
      </p>
      <LoginForm />
    </main>
  );
}