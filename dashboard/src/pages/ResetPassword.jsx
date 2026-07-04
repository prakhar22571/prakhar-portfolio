import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard, CardContent } from "@/components/ui/glass-card";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  resetPassword,
  clearAllForgotResetPassErrors,
} from "@/store/slices/forgotResetPasswordSlice";
import { getUser } from "@/store/slices/userSlice";
import SpecialLoadingButton from "./sub-components/SpecialLoadingButton";
import { toast } from "react-toastify";
import { Reveal } from "@/components/reveal";

const Login = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { loading, error, message } = useSelector(
    (state) => state.forgotPassword
  );
  const { isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const handleResetPassword = (password, confirmPassword) => {
    dispatch(resetPassword(token, password, confirmPassword));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllForgotResetPassErrors());
    }
    if (isAuthenticated) {
      navigateTo("/");
    }
    if (message !== null) {
      toast.success(message);
      dispatch(getUser());
    }
  }, [dispatch, isAuthenticated, error, loading]);

  return (
    <div className="relative w-full lg:grid lg:min-h-[100vh] lg:grid-cols-2 xl:min-h-[100vh]">
      <div
        aria-hidden="true"
        className="bg-aurora animate-float pointer-events-none fixed inset-0 -z-10"
      />
      <div className="min-h-[100vh] flex items-center justify-center py-12 px-4">
        <Reveal as="div" className="w-full max-w-[380px]">
          <GlassCard>
            <CardContent className="p-8">
              <div className="grid gap-2 text-center mb-6">
                <h1 className="text-3xl font-bold">Reset Password</h1>
                <p className="text-balance text-muted-foreground">
                  Set a new password
                </p>
              </div>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="focus-visible:shadow-glow-sm"
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Confirm Password</Label>
                  </div>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="focus-visible:shadow-glow-sm"
                  />
                </div>
                {!loading ? (
                  <Button
                    onClick={() => handleResetPassword(password, confirmPassword)}
                    className="w-full hover:shadow-glow"
                  >
                    Reset Password
                  </Button>
                ) : (
                  <SpecialLoadingButton content={"Resetting Your Password"} />
                )}
              </div>
            </CardContent>
          </GlassCard>
        </Reveal>
      </div>
      <div className="flex justify-center items-center">
        <img
          src="/reset.png"
          alt="login"
          loading="lazy"
          decoding="async"
          className="rounded-2xl shadow-glass opacity-90"
        />
      </div>
    </div>
  );
};

export default Login;
