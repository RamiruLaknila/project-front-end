import { Link } from "react-router-dom";

export default function SignUp() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              IE
            </div>

            <span className="text-2xl font-bold text-slate-900">
              Import<span className="text-blue-600">Ease</span>
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-7">

          {/* Heading */}
          <div className="text-center mb-7">
            <h1 className="text-2xl font-bold text-slate-900">
              Create your account
            </h1>

            <p className="text-sm text-slate-500 mt-2">
              Start managing your imports with ImportEase
            </p>
          </div>

          {/* Form */}
          <form className="space-y-4">

            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Full name
              </label>

              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                className="w-full h-11 px-3 rounded-lg border border-slate-300 bg-white text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Business Name */}
            <div>
              <label
                htmlFor="business"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Business name
              </label>

              <input
                id="business"
                type="text"
                placeholder="Enter your business name"
                className="w-full h-11 px-3 rounded-lg border border-slate-300 bg-white text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                placeholder="you@company.com"
                className="w-full h-11 px-3 rounded-lg border border-slate-300 bg-white text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Create a password"
                className="w-full h-11 px-3 rounded-lg border border-slate-300 bg-white text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Confirm password
              </label>

              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                className="w-full h-11 px-3 rounded-lg border border-slate-300 bg-white text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2 pt-1">
              <input
                id="terms"
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />

              <label
                htmlFor="terms"
                className="text-xs leading-5 text-slate-500"
              >
                I agree to the{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
                .
              </label>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full h-11 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition shadow-sm"
            >
              Create account
            </button>
          </form>

          {/* Sign In */}
          <div className="text-center mt-6 pt-6 border-t border-slate-100">
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Back */}
        <div className="text-center mt-5">
          <Link
            to="/"
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            ← Back to ImportEase
          </Link>
        </div>

      </div>
    </div>
  );
}