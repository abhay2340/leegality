import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { snackbar } from "@/shared/components/snackbar/emitter";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      snackbar.error("Please enter both email and password.");
      return;
    }
    // Simulate auth login
    snackbar.success("Welcome back! Loading your portal...", 2000);
    // Wait for snackbar to show, then redirect to dashboard
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1200);
  };

  return (
    <div className="login-form-container">
      <div className="login-header">
        <h2>Welcome back</h2>
        <p>Enter your store administrator details to sign in.</p>
      </div>

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <div className="input-wrapper">
            <Mail className="input-icon" size={18} />
            <input
              type="email"
              id="email"
              placeholder="admin@pulseshop.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="input-wrapper">
            <Lock className="input-icon" size={18} />
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit" className="login-submit-btn">
          Sign In
        </button>
      </form>
    </div>
  );
}
