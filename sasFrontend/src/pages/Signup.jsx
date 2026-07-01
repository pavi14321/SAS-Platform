import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaGoogle,
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaLock,
  FaUser,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowLeft,
} from "react-icons/fa";
import toast from "react-hot-toast";
import api, { getErrorMessage } from "../utils/api";

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
export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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

  const validate = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = "Full name is required";

    if (!email) newErrors.email = "Email is required";
    else if (!EMAIL_REGEX.test(email))
      newErrors.email = "Please enter a valid email format";

    if (!password) newErrors.password = "Password is required";
    else if (!isPasswordStrong)
      newErrors.password = "Password doesn't meet all the requirements below";

    if (!confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    else if (confirmPassword !== password)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // OTP is skipped for now — signup goes straight to account creation.
  // (Backend's /auth/signup route never checked OTP anyway, so no
  // backend change was needed here. See Forgotpassword.jsx for the
  // matching change on the reset side, which did need a backend route.)
  const signupHandler = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const { data } = await api.post("/auth/signup", { name, email, password });

      localStorage.setItem("token", data.token);
      localStorage.setItem("store", JSON.stringify(data.store));
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (err) {
      // e.g. 409 "An account with this email already exists"
      setErrors((prev) => ({ ...prev, email: getErrorMessage(err, "Signup failed.") }));
      toast.error(getErrorMessage(err, "Signup failed."));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") signupHandler();
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
          <div className="text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-green-600 mx-auto flex items-center justify-center text-white text-2xl sm:text-3xl font-bold">
              S
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold mt-4 sm:mt-6">
              Create Account
            </h1>

            <p className="text-gray-500 mt-2">Sign up for the SAS Platform</p>
          </div>

          <div className="mt-6 sm:mt-8">
            <label className="font-medium">Full Name</label>

            <div className="relative mt-2">
              <FaUser className="absolute left-4 top-4 text-gray-400" />

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                autoFocus
                className="w-full border rounded-xl pl-12 pr-4 py-3.5 outline-none focus:border-green-600"
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-sm mt-2">{errors.name}</p>
            )}

            <label className="font-medium block mt-4">Email Address</label>

            <div className="relative mt-2">
              <FaEnvelope className="absolute left-4 top-4 text-gray-400" />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
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
                className={`text-xs mt-1.5 flex items-center gap-1.5 ${
                  isEmailValid ? "text-green-600" : "text-red-500"
                }`}
              >
                {isEmailValid ? (
                  <>
                    <FaCheckCircle size={11} /> Valid email format
                  </>
                ) : (
                  <>
                    <FaTimesCircle size={11} /> Enter valid email
                  </>
                )}
              </p>
            )}
            {errors.email && (
              <p className="text-red-500 text-sm mt-2">{errors.email}</p>
            )}

            <label className="font-medium block mt-4">Password</label>

            <div className="relative mt-2">
              <FaLock className="absolute left-4 top-4 text-gray-400" />

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                placeholder="Create a password"
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
            {errors.password && (
              <p className="text-red-500 text-sm mt-2">{errors.password}</p>
            )}

            <label className="font-medium block mt-4">Confirm Password</label>

            <div className="relative mt-2">
              <FaLock className="absolute left-4 top-4 text-gray-400" />

              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Re-enter your password"
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
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-2">
                {errors.confirmPassword}
              </p>
            )}

            <button
              onClick={signupHandler}
              disabled={loading}
              className="w-full mt-6 bg-black hover:bg-gray-900 text-white py-3.5 rounded-xl font-semibold transition disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>

            <div className="flex items-center my-6 sm:my-8">
              <div className="flex-1 border-t" />
              <span className="mx-4 text-gray-500">OR</span>
              <div className="flex-1 border-t" />
            </div>

            <button className="w-full border rounded-xl py-3.5 hover:bg-gray-100 transition flex items-center justify-center gap-3 font-semibold">
              <FaGoogle className="text-red-500 text-xl" />
              Continue with Google
            </button>

            <p className="text-center mt-6 sm:mt-8 text-gray-600">
              Already have an account?
              <Link to="/login" className="text-green-600 font-semibold ml-2">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}