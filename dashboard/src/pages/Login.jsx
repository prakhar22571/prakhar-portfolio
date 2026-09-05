import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "@portfolio/shared/components/ui/button";
import { Input } from "@portfolio/shared/components/ui/input";
import { AuthPage } from "@/components/auth-page";
import { login } from "@/store/slices/userSlice";
import { useMutation } from "@/hooks/use-mutation";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const mutate = useMutation();
  useEffect(() => {
    if (isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated, navigate]);
  return (
    <AuthPage
      title="Login"
      description="Sign in to manage your portfolio."
      image="/login.png"
    >
      <form
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          mutate(login(email, password));
        }}
      >
        <label className="grid gap-2">
          Email
          <Input
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label className="grid gap-2">
          Password
          <Input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <Link className="text-sm underline text-right" to="/password/forgot">
          Forgot your password?
        </Link>
        <Button type="submit" disabled={loading}>
          {loading ? "Signing in?" : "Login"}
        </Button>
      </form>
    </AuthPage>
  );
}
