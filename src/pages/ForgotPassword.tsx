import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { requestPasswordReset } from "@/services/auth";
import { Loader2, ArrowLeft, Mail, CheckCircle2 } from "lucide-react";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const result = await requestPasswordReset(email);

    setLoading(false);

    if (result.success) {
      setEmailSent(true);
    } else {
      toast({
        title: "Request Failed",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  if (emailSent) {
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
              Check Your Email
            </h1>

            <p className="text-muted-foreground mb-2">
              We've sent password reset instructions to:
            </p>

            <p className="text-foreground font-medium mb-6">{email}</p>

            <p className="text-sm text-muted-foreground mb-8">
              If you don't see the email, check your spam folder or try again
              with a different email address.
            </p>

            <div className="space-y-3">
              <Button
                onClick={() => navigate("/auth")}
                className="w-full"
                size="lg"
              >
                Back to Sign In
              </Button>

              <Button
                onClick={() => {
                  setEmailSent(false);
                  setEmail("");
                }}
                variant="outline"
                className="w-full"
                size="lg"
              >
                Try Different Email
              </Button>
            </div>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout showNav={false}>
      <div className="flex flex-col min-h-screen justify-center px-6 py-8">
        <button
          onClick={() => navigate("/auth")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Sign In</span>
        </button>

        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Mail className="h-8 w-8 text-primary" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-2">
            Forgot Password?
          </h1>

          <p className="text-muted-foreground">
            Enter your email address and we'll send you instructions to reset
            your password.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            autoFocus
          />

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Sending instructions...
              </>
            ) : (
              "Send Reset Link"
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
