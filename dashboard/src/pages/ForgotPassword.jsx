import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@portfolio/shared/components/ui/button";
import { Input } from "@portfolio/shared/components/ui/input";
import { AuthPage } from "@/components/auth-page";
import api from "@/lib/api";
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({
    loading: false,
    error: "",
    message: "",
  });
  async function submit(event) {
    event.preventDefault();
    setStatus({ loading: true, error: "", message: "" });
    try {
      const { data } = await api.post("/api/v1/user/password/forgot", {
        email,
      });
      setStatus({ loading: false, error: "", message: data.message });
    } catch (error) {
      setStatus({
        loading: false,
        error: error.response?.data?.message || error.message,
        message: "",
      });
    }
  }
  return (
    <AuthPage
      title="Forgot password"
      description="Request a link to reset your password."
      image="/forgot.png"
    >
      <form onSubmit={submit} className="grid gap-4">
        <label className="grid gap-2">
          Email
          <Input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        {status.error && <p role="alert">{status.error}</p>}
        {status.message && <p role="status">{status.message}</p>}
        <Button type="submit" disabled={status.loading}>
          {status.loading ? "Requesting?" : "Send reset link"}
        </Button>
        <Link to="/login" className="text-sm underline">
          Return to login
        </Link>
      </form>
    </AuthPage>
  );
}
