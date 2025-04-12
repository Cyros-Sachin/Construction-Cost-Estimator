import React from "react";
import { motion } from "framer-motion";
import { Hammer, BarChart, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: <Hammer className="h-8 w-8 text-blue-600" />,
    title: "Estimate Instantly",
    description: "Get accurate material and labor cost estimations in seconds.",
  },
  {
    icon: <BarChart className="h-8 w-8 text-green-600" />,
    title: "Visual Insights",
    description: "Interactive dashboards help you analyze cost distributions easily.",
  },
  {
    icon: <Sparkles className="h-8 w-8 text-purple-600" />,
    title: "Smart Optimization",
    description: "Optimize your spending with AI-powered suggestions.",
  },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-100 to-white flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
          🏗️ Smarter Construction Cost Estimator
        </h1>
        <p className="text-lg text-gray-600 max-w-xl mx-auto mb-8">
          Estimate, visualize, and optimize construction costs effortlessly using our AI-powered tool.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate("/estimate")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow transition"
          >
            🚀 Start Estimating
          </button>
          <button
            onClick={() => navigate("/history")}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-semibold border shadow transition"
          >
            📜 View History
          </button>
        </div>
      </motion.div>

      <motion.div
        className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
      >
        {features.map((feature, i) => (
          <motion.div
            key={i}
            className="bg-white p-6 rounded-2xl shadow-lg text-center border border-gray-100"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <div className="flex justify-center mb-4">{feature.icon}</div>
            <h3 className="font-semibold text-lg text-gray-800 mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default LandingPage;
