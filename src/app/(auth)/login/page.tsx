"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Compass, Mail, Lock, KeyRound, ArrowRight, ShieldCheck, CheckCircle2, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/layout/theme-toggle";

type LoginMode = "password" | "otp";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<LoginMode>("otp");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid college email address");
      return;
    }
    setErrorMsg("");
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
      setSuccessMsg("Demo OTP (4242) sent to " + email);
    }, 600);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg("Signed in successfully! Redirecting...");
      setTimeout(() => {
        router.push("/map");
      }, 700);
    }, 600);
  };

  const handleQuickDemoLogin = (role: "student" | "faculty" | "admin") => {
    setIsLoading(true);
    setErrorMsg("");
    const demoAccounts = {
      student: { name: "Aarav Sharma", email: "aarav.cs24@campus.edu", role: "Student (CSE Year 3)" },
      faculty: { name: "Dr. Sunita Rao", email: "sunita.rao@campus.edu", role: "Faculty (HOD CSE)" },
      admin: { name: "Campus Facilities Admin", email: "admin@campus.edu", role: "Administrator" },
    };

    const target = demoAccounts[role];
    setEmail(target.email);

    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg(`Signed in as ${target.name} (${target.role})! Redirecting...`);
      setTimeout(() => {
        router.push("/map");
      }, 700);
    }, 500);
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-background via-background to-muted/30">
      {/* Top right theme toggle */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle className="rounded-xl border border-border/50" />
      </div>

      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 mb-1 transition-transform hover:scale-105">
            <Compass className="h-8 w-8 stroke-[2.2]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Sign in to Campus<span className="text-primary">Hub</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xs mx-auto">
            Your university portal for campus navigation, facility hours, and academic life.
          </p>
        </div>

        {/* Card Container */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xl shadow-black/5 dark:shadow-black/30 backdrop-blur-sm space-y-6">
          {/* Mode Switcher */}
          <div className="flex rounded-xl bg-muted p-1 text-xs font-semibold select-none">
            <button
              type="button"
              onClick={() => {
                setMode("otp");
                setErrorMsg("");
                setOtpSent(false);
              }}
              className={`flex-1 min-h-[38px] rounded-lg transition-all ${
                mode === "otp"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Email OTP Login
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("password");
                setErrorMsg("");
                setOtpSent(false);
              }}
              className={`flex-1 min-h-[38px] rounded-lg transition-all ${
                mode === "password"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              College Credentials
            </button>
          </div>

          {/* Alerts */}
          {errorMsg && (
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive font-medium animate-fade-in">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-400 font-medium animate-fade-in">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          {mode === "otp" ? (
            <form onSubmit={otpSent ? handleLoginSubmit : handleSendOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="college-email"
                  className="text-xs font-semibold text-foreground flex items-center justify-between"
                >
                  <span>College Email</span>
                  <span className="text-[10px] text-muted-foreground font-normal">
                    e.g. rollno@campus.edu
                  </span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="college-email"
                    type="email"
                    placeholder="student@campus.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={otpSent || isLoading}
                    className="pl-10 h-11 rounded-xl"
                  />
                </div>
              </div>

              {otpSent && (
                <div className="space-y-1.5 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <label htmlFor="otp-input" className="text-xs font-semibold text-foreground">
                      One-Time Password (OTP)
                    </label>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-[11px] text-primary hover:underline font-medium"
                    >
                      Change email
                    </button>
                  </div>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="otp-input"
                      type="text"
                      placeholder="Enter 4-digit OTP (e.g. 4242)"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      maxLength={6}
                      disabled={isLoading}
                      className="pl-10 h-11 tracking-widest font-mono text-center sm:text-left rounded-xl"
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Demo code is <strong className="text-foreground">4242</strong>
                  </p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 min-h-[44px] rounded-xl font-semibold gap-2 shadow-md shadow-primary/20"
              >
                {isLoading ? (
                  <span>Processing...</span>
                ) : otpSent ? (
                  <>
                    <span>Verify & Continue</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="cred-email" className="text-xs font-semibold text-foreground">
                  Email or Roll Number
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="cred-email"
                    type="text"
                    placeholder="22BCS104 or roll@campus.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pl-10 h-11 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="cred-password" className="text-xs font-semibold text-foreground">
                    Password
                  </label>
                  <a href="#" className="text-[11px] text-primary hover:underline">
                    Forgot?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="cred-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pl-10 h-11 rounded-xl"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 min-h-[44px] rounded-xl font-semibold gap-2 shadow-md shadow-primary/20"
              >
                {isLoading ? "Signing in..." : "Sign In with Password"}
              </Button>
            </form>
          )}

          {/* Quick Demo Logins Section */}
          <div className="pt-2 border-t border-border/60">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mb-3">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Quick Demo Roles (One-Tap Test):</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickDemoLogin("student")}
                className="h-10 text-xs rounded-xl font-medium border-border/80"
              >
                Student
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickDemoLogin("faculty")}
                className="h-10 text-xs rounded-xl font-medium border-border/80"
              >
                Faculty
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickDemoLogin("admin")}
                className="h-10 text-xs rounded-xl font-medium border-border/80"
              >
                Admin
              </Button>
            </div>
          </div>
        </div>

        {/* Guest fallback link */}
        <div className="text-center">
          <Link
            href="/map"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary hover:underline min-h-[44px] px-3"
          >
            <span>Explore Campus Map as Guest</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </main>
  );
}