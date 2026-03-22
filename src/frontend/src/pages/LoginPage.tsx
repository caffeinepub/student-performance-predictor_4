import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Loader2,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const features = [
  {
    icon: TrendingUp,
    title: "Smart Predictions",
    desc: "ML-powered score forecasting",
  },
  {
    icon: Users,
    title: "Student Tracking",
    desc: "Monitor cohort performance",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Private",
    desc: "Blockchain-backed data",
  },
];

export default function LoginPage() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="min-h-screen flex" data-ocid="login.page">
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12"
        style={{ background: "oklch(var(--sidebar))" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "oklch(var(--primary))" }}
          >
            <GraduationCap className="w-6 h-6" style={{ color: "white" }} />
          </div>
          <span
            className="text-xl font-bold"
            style={{ color: "oklch(var(--sidebar-accent-foreground))" }}
          >
            AcadPredict
          </span>
        </div>

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1
              className="text-4xl font-bold leading-tight"
              style={{ color: "oklch(var(--sidebar-accent-foreground))" }}
            >
              Predict Academic
              <br />
              <span style={{ color: "oklch(var(--primary))" }}>
                Performance
              </span>
              <br />
              with AI
            </h1>
            <p
              className="mt-4 text-base leading-relaxed"
              style={{ color: "oklch(0.65 0.02 264)" }}
            >
              Leverage machine learning to forecast student outcomes and improve
              educational success rates.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {features.map((f) => (
              <div
                key={f.title}
                className="flex items-start gap-4 p-4 rounded-xl"
                style={{ background: "oklch(var(--sidebar-accent))" }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: "oklch(var(--primary) / 0.2)" }}
                >
                  <f.icon
                    className="w-5 h-5"
                    style={{ color: "oklch(var(--primary))" }}
                  />
                </div>
                <div>
                  <p
                    className="font-semibold text-sm"
                    style={{ color: "oklch(var(--sidebar-accent-foreground))" }}
                  >
                    {f.title}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "oklch(0.65 0.02 264)" }}
                  >
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <p className="text-xs" style={{ color: "oklch(0.55 0.02 264)" }}>
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            caffeine.ai
          </a>
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              AcadPredict
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground">Welcome back</h2>
            <p className="text-muted-foreground mt-2">
              Sign in to access your academic dashboard
            </p>
          </div>

          <div className="bg-card rounded-2xl border border-border p-8 shadow-card">
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-border bg-muted/50">
                <div className="flex items-center gap-3 mb-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-sm text-foreground">
                    Secure Authentication
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your identity is secured using Internet Identity — no
                  passwords required.
                </p>
              </div>

              <Button
                className="w-full h-12 text-base font-semibold"
                onClick={() => login()}
                disabled={isLoggingIn}
                data-ocid="login.primary_button"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing
                    in...
                  </>
                ) : (
                  <>Sign in with Internet Identity</>
                )}
              </Button>

              <p className="text-center text-xs text-muted-foreground pt-2">
                New users are automatically registered on first login.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
