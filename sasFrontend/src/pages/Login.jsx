import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaGoogle,
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

export default function Login() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEmailValid = email.length > 0 && EMAIL_REGEX.test(email);
  const emailTouched = email.length > 0;

  const validateEmail = () => {
    if (!email) {
      setError("Email is required");
      return false;
    }
    if (!EMAIL_REGEX.test(email)) {
      setError("Please enter a valid email format");
      return false;
    }
    setError("");
    return true;
  };

  const continueHandler = () => {
    if (!validateEmail()) return;
    setStep(2);
  };

  const loginHandler = () => {
    if (!password) {
      setError("Password is required");
      return;
    }

    setError("");
    setLoading(true);

    // TODO: replace with real auth call (e.g. axios.post("/api/auth/login", { email, password }))
    // Have the backend return a generic error like "Incorrect email or password"
    // on failure (don't reveal whether the email exists or the password was wrong).
    setTimeout(() => {
      setLoading(false);
      toast.success("Login successful");
      navigate("/dashboard");
    }, 1500);
  };

  const handleKeyDown = (e, action) => {
    if (e.key === "Enter") action();
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
              Welcome Back
            </h1>

            <p className="text-gray-500 mt-2">Login to your SAS Platform</p>
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
                    placeholder="Enter your email"
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
                <label className="font-medium">Password</label>

                <div className="relative mt-2">
                  <FaLock className="absolute left-4 top-4 text-gray-400" />

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, loginHandler)}
                    placeholder="Enter Password"
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

                {error && (
                  <p className="text-red-500 text-sm mt-2">{error}</p>
                )}

                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => {
                      setStep(1);
                      setError("");
                    }}
                    className="text-green-600"
                  >
                    Change Email
                  </button>

                  <Link to="/forgot-password" className="text-green-600">
                    Forgot Password?
                  </Link>
                </div>

                <button
                  onClick={loginHandler}
                  disabled={loading}
                  className="w-full mt-6 bg-black hover:bg-gray-900 text-white py-3.5 rounded-xl font-semibold transition disabled:opacity-60"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </>
            )}

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
              Don't have an account?
              <Link
                to="/signup"
                className="text-green-600 font-semibold ml-2"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}