import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaLock,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowLeft,
} from "react-icons/fa";
import toast from "react-hot-toast";

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const PASSWORD_RULES = [
  { key: "length", label: "At least 8 characters", test: (v) => v.length >= 8 },
  { key: "upper", label: "One uppercase letter (A-Z)", test: (v) => /[A-Z]/.test(v) },
  { key: "lower", label: "One lowercase letter (a-z)", test: (v) => /[a-z]/.test(v) },
  { key: "number", label: "One number (0-9)", test: (v) => /[0-9]/.test(v) },
  {
    key: "special",
    label: "One special character (!@#$%^&*...)",
    test: (v) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(v),
  },
];

function RuleRow({ passed, label }) {
  return (
    <li
      className={`flex items-center gap-2 text-xs ${
        passed ? "text-green-600" : "text-red-500"
      }`}
    >
      {passed ? <FaCheckCircle size={12} /> : <FaTimesCircle size={12} />}
      {label}
    </li>
  );
}

function OtpModal({ email, onClose, onVerified }) {
  const [digits, setDigits] = useState(Array(6).fill(""));
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(30);
  const inputsRef = useRef([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const handleChange = (idx, val) => {
    if (!/^[0-9]?$/.test(val)) return;
    const next = [...digits];
    next[idx] = val;
    setDigits(next);
    setError("");
    if (val && idx < 5) inputsRef.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
    if (e.key === "Enter") verifyHandler();
  };

  const handlePaste = (e) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!text) return;
    e.preventDefault();
    const next = text.split("");
    while (next.length < 6) next.push("");
    setDigits(next);
    inputsRef.current[Math.min(text.length, 5)]?.focus();
  };

  const verifyHandler = () => {
    const code = digits.join("");
    if (code.length < 6) {
      setError("Enter the full 6-digit code");
      return;
    }

    setVerifying(true);
    setError("");

    // TODO: replace with real verification call (e.g. axios.post("/api/auth/verify-otp", { email, code }))
    setTimeout(() => {
      setVerifying(false);
      onVerified();
    }, 1200);
  };

  const resendHandler = () => {
    if (resendCooldown > 0) return;
    // TODO: replace with real resend call (e.g. axios.post("/api/auth/resend-otp", { email }))
    toast.success("OTP resent to your email");
    setResendCooldown(30);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 sm:p-7 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
          aria-label="Close"
        >
          <FaTimesCircle size={18} />
        </button>

        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-green-600 mx-auto flex items-center justify-center text-white">
            <FaEnvelope size={22} />
          </div>

          <h2 className="text-2xl font-bold mt-4">Verify it's you</h2>

          <p className="text-gray-500 text-sm mt-2">
            We've sent a 6-digit OTP to your registered email id. Enter it
            below to confirm your new password.
          </p>
          <p className="text-green-700 font-semibold text-sm mt-1 break-all">
            {email}
          </p>
        </div>

        <div className="flex justify-between gap-2 mt-6" onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-11 h-12 sm:w-12 sm:h-14 text-center text-xl font-semibold border rounded-xl outline-none focus:border-green-600"
            />
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
        )}

        <button
          onClick={verifyHandler}
          disabled={verifying}
          className="w-full mt-6 bg-black hover:bg-gray-900 text-white py-3.5 rounded-xl font-semibold transition disabled:opacity-60"
        >
          {verifying ? "Verifying..." : "Verify OTP"}
        </button>

        <p className="text-center mt-5 text-sm text-gray-600">
          Didn't get the code?{" "}
          <button
            onClick={resendHandler}
            disabled={resendCooldown > 0}
            className={`font-semibold ${
              resendCooldown > 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-green-600"
            }`}
          >
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: email, 2: new password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);

  const isEmailValid = email.length > 0 && EMAIL_REGEX.test(email);
  const emailTouched = email.length > 0;

  const passwordChecks = PASSWORD_RULES.map((r) => ({
    ...r,
    passed: r.test(password),
  }));
  const isPasswordStrong = passwordChecks.every((r) => r.passed);

  const confirmTouched = confirmPassword.length > 0;
  const passwordsMatch =
    confirmTouched && password.length > 0 && confirmPassword === password;

  const continueHandler = () => {
    if (!email) {
      setError("Email is required");
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      setError("Please enter a valid email format");
      return;
    }

    setError("");
    setStep(2);
  };

  const updatePasswordHandler = () => {
    if (!password) {
      setError("New password is required");
      return;
    }
    if (!isPasswordStrong) {
      setError("Password doesn't meet all the requirements below");
      return;
    }
    if (!confirmPassword) {
      setError("Please confirm your new password");
      return;
    }
    if (confirmPassword !== password) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    setLoading(true);

    // TODO: replace with a real "send OTP" call (e.g. axios.post("/api/auth/send-otp", { email }))
    // The password itself is only changed after the OTP is verified (see onOtpVerified below).
    setTimeout(() => {
      setLoading(false);
      toast.success("OTP sent to your email");
      setShowOtpModal(true);
    }, 1500);
  };

  const handleKeyDown = (e, action) => {
    if (e.key === "Enter") action();
  };

  const onOtpVerified = () => {
    // TODO: replace with real call (e.g. axios.post("/api/auth/reset-password", { email, password }))
    toast.success("Password updated successfully");
    setShowOtpModal(false);
    navigate("/login");
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#071311] flex items-center justify-center px-4 py-4 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/30 via-transparent to-emerald-900/20" />

      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition"
      >
        <FaArrowLeft size={12} /> Back
      </button>

      <div className="relative w-full max-w-md max-h-full overflow-y-auto">
        <div className="backdrop-blur-xl bg-white/95 rounded-3xl shadow-2xl p-6 sm:p-8">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800"
          >
            <FaArrowLeft size={12} /> Back to Login
          </Link>

          <div className="text-center mt-2">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-green-600 mx-auto flex items-center justify-center text-white text-2xl sm:text-3xl font-bold">
              S
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold mt-4 sm:mt-6">
              Forgot Password
            </h1>

            <p className="text-gray-500 mt-2">
              {step === 1
                ? "Enter your registered email to continue"
                : "Set a new password for your account"}
            </p>
          </div>

          <div className="mt-6 sm:mt-8">
            {step === 1 && (
              <>
                <label className="font-medium">Email Address</label>

                <div className="relative mt-2">
                  <FaEnvelope className="absolute left-4 top-4 text-gray-400" />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, continueHandler)}
                    placeholder="Enter your registered email"
                    autoFocus
                    className={`w-full border rounded-xl pl-12 pr-10 py-3.5 outline-none transition-colors ${
                      emailTouched
                        ? isEmailValid
                          ? "border-green-500 focus:border-green-600"
                          : "border-red-400 focus:border-red-500"
                        : "focus:border-green-600"
                    }`}
                  />

                  {emailTouched && (
                    <span className="absolute right-4 top-4">
                      {isEmailValid ? (
                        <FaCheckCircle className="text-green-600" />
                      ) : (
                        <FaTimesCircle className="text-red-500" />
                      )}
                    </span>
                  )}
                </div>

                {emailTouched && (
                  <p
                    className={`text-sm mt-2 flex items-center gap-1.5 ${
                      isEmailValid ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {isEmailValid ? (
                      <>
                        <FaCheckCircle size={12} /> Valid email format
                      </>
                    ) : (
                      <>
                        <FaTimesCircle size={12} /> Enter valid email
                      </>
                    )}
                  </p>
                )}

                {error && (
                  <p className="text-red-500 text-sm mt-2">{error}</p>
                )}

                <button
                  onClick={continueHandler}
                  className="w-full mt-6 bg-black hover:bg-gray-900 text-white py-3.5 rounded-xl font-semibold transition"
                >
                  Continue
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <label className="font-medium">New Password</label>

                <div className="relative mt-2">
                  <FaLock className="absolute left-4 top-4 text-gray-400" />

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setPasswordFocused(true)}
                    placeholder="Enter new password"
                    autoFocus
                    className="w-full border rounded-xl pl-12 pr-12 py-3.5 outline-none focus:border-green-600"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-gray-500"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                {(passwordFocused || password.length > 0) && (
                  <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1 bg-gray-50 border rounded-xl p-3">
                    {passwordChecks.map((r) => (
                      <RuleRow key={r.key} passed={r.passed} label={r.label} />
                    ))}
                  </ul>
                )}

                <label className="font-medium block mt-4">
                  Confirm New Password
                </label>

                <div className="relative mt-2">
                  <FaLock className="absolute left-4 top-4 text-gray-400" />

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, updatePasswordHandler)}
                    placeholder="Re-enter new password"
                    className={`w-full border rounded-xl pl-12 pr-12 py-3.5 outline-none transition-colors ${
                      confirmTouched
                        ? passwordsMatch
                          ? "border-green-500 focus:border-green-600"
                          : "border-red-400 focus:border-red-500"
                        : "focus:border-green-600"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-4 top-4 text-gray-500"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {confirmTouched && (
                  <p
                    className={`text-xs mt-1.5 flex items-center gap-1.5 ${
                      passwordsMatch ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {passwordsMatch ? (
                      <>
                        <FaCheckCircle size={11} /> Passwords match
                      </>
                    ) : (
                      <>
                        <FaTimesCircle size={11} /> Passwords do not match
                      </>
                    )}
                  </p>
                )}

                {error && (
                  <p className="text-red-500 text-sm mt-2">{error}</p>
                )}

                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => {
                      setStep(1);
                      setError("");
                    }}
                    className="text-green-600 text-sm"
                  >
                    Change Email
                  </button>
                </div>

                <button
                  onClick={updatePasswordHandler}
                  disabled={loading}
                  className="w-full mt-6 bg-black hover:bg-gray-900 text-white py-3.5 rounded-xl font-semibold transition disabled:opacity-60"
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </>
            )}

            <p className="text-center mt-6 sm:mt-8 text-gray-600">
              Remembered your password?
              <Link to="/login" className="text-green-600 font-semibold ml-2">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      {showOtpModal && (
        <OtpModal
          email={email}
          onClose={() => setShowOtpModal(false)}
          onVerified={onOtpVerified}
        />
      )}
    </div>
  );
}