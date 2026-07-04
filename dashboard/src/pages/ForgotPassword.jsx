import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard, CardContent } from "@/components/ui/glass-card";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { clearAllUserErrors } from "@/store/slices/userSlice";
import { forgotPassword } from "@/store/slices/forgotResetPasswordSlice";
import { toast } from "react-toastify";
import SpecialLoadingButton from "./sub-components/SpecialLoadingButton";
import { Reveal } from "@/components/reveal";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const { loading, error, message } = useSelector(
    (state) => state.forgotPassword
  );
  const { isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const handleForgotPassword = (email) => {
    dispatch(forgotPassword(email));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllUserErrors());
    }
    if (isAuthenticated) {
      navigateTo("/");
    }
    if (message !== null) {
      toast.success(message);
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
                <h1 className="text-3xl font-bold">Forgot Password</h1>
                <p className="text-balance text-muted-foreground">
                  Enter your email to request for reset password
                </p>
              </div>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="focus-visible:shadow-glow-sm"
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Link
                      to="/login"
                      className="ml-auto inline-block text-sm underline"
                    >
                      Remember your password?
                    </Link>
                  </div>
                </div>
                {!loading ? (
                  <Button
                    onClick={() => handleForgotPassword(email)}
                    className="w-full hover:shadow-glow"
                  >
                    Forgot Password
                  </Button>
                ) : (
                  <SpecialLoadingButton content={"Requesting"} />
                )}
              </div>
            </CardContent>
          </GlassCard>
        </Reveal>
      </div>
      <div className="flex justify-center items-center">
        <img
          src="/forgot.png"
          alt="login"
          loading="lazy"
          decoding="async"
          className="rounded-2xl shadow-glass opacity-90"
        />
      </div>
    </div>
  );
};

export default ForgotPassword;
