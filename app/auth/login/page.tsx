import LoginPage from "@/components/auth/loginpage";

interface LoginRouteProps {
  searchParams?: {
    next?: string;
  };
}

export default function Page({ searchParams }: LoginRouteProps) {
  return <LoginPage redirectTo={searchParams?.next} />;
}