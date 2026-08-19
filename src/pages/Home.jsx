import {
  Package,
  ShieldCheck,
  ArrowRight,
  Search,
  Calculator,
  Handshake,
  PackageCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Home() {
  // ============================
  // LEFT PANEL ANIMATION
  // ============================
  const leftContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const leftItem = {
    hidden: {
      opacity: 0,
      x: -15,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  // ============================
  // RIGHT PANEL ANIMATION
  // ============================
  const rightContainer = {
    hidden: {
      opacity: 0,
      y: 15,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.2,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="grid min-h-screen lg:grid-cols-[42%_58%]">

        {/* ===================== LEFT SIDE ===================== */}
        <section className="relative flex min-h-[560px] flex-col bg-[#173563] px-8 py-8 text-white sm:px-10 lg:min-h-screen lg:px-12">

          {/* Logo */}
          <Link to="/" className="flex w-fit items-center">
            <motion.span
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
              }}
              className="font-serif text-[34px] tracking-tight sm:text-[38px]"
            >
              Import
              <span className="text-[#F5C518]">Ease</span>
            </motion.span>
          </Link>

          {/* Main Content */}
          <motion.div
            variants={leftContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-1 items-center"
          >
            <div className="max-w-[440px]">

              {/* Headline */}
              <motion.h1
                variants={leftItem}
                className="font-serif text-[32px] leading-[1.25] tracking-tight text-white sm:text-[38px]"
              >
                Import clearing,
                <br />
                simplified for everyone.
              </motion.h1>

              {/* Features */}
              <motion.div
                variants={leftContainer}
                className="mt-10 space-y-5"
              >

                {/* Feature 1 */}
                <motion.div
                  variants={leftItem}
                  className="flex items-start gap-3.5"
                >
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/10">
                    <Search className="h-3.5 w-3.5 text-blue-100" />
                  </div>

                  <p className="text-[14px] leading-6 text-blue-100">
                    Search HS codes and duty rates instantly
                  </p>
                </motion.div>

                {/* Feature 2 */}
                <motion.div
                  variants={leftItem}
                  className="flex items-start gap-3.5"
                >
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/10">
                    <Calculator className="h-3.5 w-3.5 text-blue-100" />
                  </div>

                  <p className="text-[14px] leading-6 text-blue-100">
                    Calculate your full landed cost before you buy
                  </p>
                </motion.div>

                {/* Feature 3 */}
                <motion.div
                  variants={leftItem}
                  className="flex items-start gap-3.5"
                >
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/10">
                    <Handshake className="h-3.5 w-3.5 text-blue-100" />
                  </div>

                  <p className="text-[14px] leading-6 text-blue-100">
                    Get competitive bids from licensed agents
                  </p>
                </motion.div>

                {/* Feature 4 */}
                <motion.div
                  variants={leftItem}
                  className="flex items-start gap-3.5"
                >
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/10">
                    <PackageCheck className="h-3.5 w-3.5 text-blue-100" />
                  </div>

                  <p className="text-[14px] leading-6 text-blue-100">
                    Track every step of your clearance live
                  </p>
                </motion.div>

              </motion.div>
            </div>
          </motion.div>

          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.7,
              ease: "easeOut",
            }}
            className="pt-8"
          >
            <p className="text-[12px] text-blue-300/50">
              © 2026 ImportEase. All rights reserved.
            </p>
          </motion.div>
        </section>

        {/* ===================== RIGHT SIDE ===================== */}
        <section className="flex min-h-[560px] items-center justify-center bg-[#F7F9FC] px-6 py-14 sm:px-10 lg:min-h-screen">

          <motion.div
            variants={rightContainer}
            initial="hidden"
            animate="visible"
            className="flex w-full max-w-[380px] flex-col items-center text-center"
          >

            {/* Logo */}
            <motion.img
              src="/logo.jpeg"
              alt="ImportEase Logo"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.3,
                ease: "easeOut",
              }}
              className="mb-2 h-20 w-auto object-contain mix-blend-multiply sm:h-24"
            />

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.35,
                ease: "easeOut",
              }}
              className="mt-4 font-serif text-[28px] text-[#173563] sm:text-[32px]"
            >
              Get Started
            </motion.h2>

            {/* User Type Cards */}
            <div className="mt-8 w-full space-y-3.5">

              {/* ================= IMPORTER / SME ================= */}
              <motion.div
                whileHover={{
                  y: -3,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                transition={{
                  duration: 0.2,
                  ease: "easeOut",
                }}
              >
                <Link
                  to="/SignIn"
                  className="group flex min-h-[76px] items-center gap-4 rounded-xl border border-gray-200/80 bg-white px-5 py-4 shadow-sm transition-all duration-200 hover:border-blue-300 hover:shadow-md"
                >
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{
                      duration: 0.2,
                      ease: "easeOut",
                    }}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50"
                  >
                    <Package className="h-5 w-5 text-[#173563]" />
                  </motion.div>

                  {/* Text */}
                  <div className="flex-1 text-left">
                    <h3 className="text-[15px] font-semibold text-[#173563]">
                      Importer / SME
                    </h3>

                    <p className="mt-0.5 text-[13px] leading-snug text-gray-500">
                      I want to import goods and manage my clearance
                    </p>
                  </div>

                  {/* Arrow */}
                  <motion.div
                    whileHover={{ x: 6 }}
                    transition={{
                      duration: 0.2,
                      ease: "easeOut",
                    }}
                  >
                    <ArrowRight className="h-4 w-4 text-gray-300 transition-colors duration-200 group-hover:text-blue-500" />
                  </motion.div>
                </Link>
              </motion.div>

              {/* ================= CLEARING AGENT ================= */}
              <motion.div
                whileHover={{
                  y: -3,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                transition={{
                  duration: 0.2,
                  ease: "easeOut",
                }}
              >
                <Link
                  to="/agent-signin"
                  className="group flex min-h-[76px] items-center gap-4 rounded-xl border border-gray-200/80 bg-white px-5 py-4 shadow-sm transition-all duration-200 hover:border-emerald-300 hover:shadow-md"
                >
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{
                      duration: 0.2,
                      ease: "easeOut",
                    }}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-50"
                  >
                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  </motion.div>

                  {/* Text */}
                  <div className="flex-1 text-left">
                    <h3 className="text-[15px] font-semibold text-[#173563]">
                      Clearing Agent
                    </h3>

                    <p className="mt-0.5 text-[13px] leading-snug text-gray-500">
                      I want to bid on shipments and manage clearances
                    </p>
                  </div>

                  {/* Arrow */}
                  <motion.div
                    whileHover={{ x: 6 }}
                    transition={{
                      duration: 0.2,
                      ease: "easeOut",
                    }}
                  >
                    <ArrowRight className="h-4 w-4 text-gray-300 transition-colors duration-200 group-hover:text-emerald-500" />
                  </motion.div>
                </Link>
              </motion.div>
            </div>

            {/* Create Account */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.55,
                ease: "easeOut",
              }}
              className="mt-8 text-center"
            >
              <p className="text-[13.5px] text-gray-500">
                New to ImportEase?{" "}
                <Link
                  to="/signup"
                  className="font-semibold text-[#173563] transition-colors hover:text-blue-600 hover:underline"
                >
                  Create an account
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}

export default Home;