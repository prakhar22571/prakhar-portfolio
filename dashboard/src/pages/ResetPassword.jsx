import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button } from "@portfolio/shared/components/ui/button";
import { Input } from "@portfolio/shared/components/ui/input";
import { AuthPage } from "@/components/auth-page";
import { acceptSession, sessionReceived } from "@/store/slices/userSlice";
import api from "@/lib/api";
export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState({ loading: false, error: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  async function submit(event) {
    event.preventDefault();
    if (password !== confirmPassword) {
      setStatus({ loading: false, error: "Passwords do not match." });
      return;
    }
    setStatus({ loading: true, error: "" });
    try {
      const { data } = await api.put(`/api/v1/user/password/reset/${token}`, {
        password,
        confirmPassword,
      });
      dispatch(sessionReceived(acceptSession(data)));
      navigate("/", { replace: true });
    } catch (error) {
      setStatus({
        loading: false,
        error: error.response?.data?.message || error.message,
      });
    }
  }
  return (
    <AuthPage
      title="Reset password"
      description="Choose a new password."
      image="/reset.png"
    >
      <form onSubmit={submit} className="grid gap-4">
        <label className="grid gap-2">
          Password
          <Input
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <label className="grid gap-2">
          Confirm password
          <Input
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </label>
        {status.error && <p role="alert">{status.error}</p>}
        <Button type="submit" disabled={status.loading}>
          {status.loading ? "Resetting?" : "Reset password"}
        </Button>
      </form>
    </AuthPage>
  );
}
