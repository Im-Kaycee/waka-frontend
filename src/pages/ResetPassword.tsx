import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { confirmPasswordReset } from "@/services/auth";
import { Loader2, Eye, EyeOff, CheckCircle2, Lock } from "lucide-react";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Extract token and uid from URL params
  const token = searchParams.get("token");
  const uid = searchParams.get("uid");

  useEffect(() => {
    // Check if token and uid are present
    if (!token || !uid) {
      toast({
        title: "Invalid Reset Link",
        description: "The password reset link is invalid or has expired.",
        variant: "destructive",
      });
      navigate("/forgot-password");
    }
  }, [token, uid, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !password2) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    if (password !== password2) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 8 characters.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const result = await confirmPasswordReset(
      uid!,
      token!,
      password,
      password2,
    );

    setLoading(false);

    if (result.success) {
      setResetSuccess(true);
    } else {
      toast({
        title: "Reset Failed",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  if (resetSuccess) {
    return (
      <MobileLayout showNav={false}>
        <div className="flex flex-col min-h-screen justify-center px-6 py-8">
          <div className="text-center animate-fade-in">
            <div className="flex justify-center mb-6">
              <div className="bg-primary/10 p-4 rounded-full">
                <CheckCircle2 className="h-12 w-12 text-primary" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-foreground mb-4">
              Password Reset Successfully!
            </h1>

            <p className="text-muted-foreground mb-8">
              Your password has been changed. You can now sign in with your new
              password.
            </p>

            <Button
              onClick={() => navigate("/auth")}
              className="w-full"
              size="lg"
            >
              Go to Sign In
            </Button>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout showNav={false}>
      <div className="flex flex-col min-h-screen justify-center px-6 py-8">
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Lock className="h-8 w-8 text-primary" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-2">
            Reset Password
          </h1>

          <p className="text-muted-foreground">
            Enter your new password below.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className="pr-10"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm New Password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            autoComplete="new-password"
          />

          <div className="text-xs text-muted-foreground space-y-1">
            <p>Password must:</p>
            <ul className="list-disc list-inside space-y-0.5 ml-2">
              <li>Be at least 8 characters long</li>
              <li>Match in both fields</li>
            </ul>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Resetting password...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>

        <div
          className="mt-6 text-center text-sm text-muted-foreground animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          <p>
            Remember your password?{" "}
            <button
              onClick={() => navigate("/auth")}
              className="text-primary font-medium hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </MobileLayout>
  );
}
