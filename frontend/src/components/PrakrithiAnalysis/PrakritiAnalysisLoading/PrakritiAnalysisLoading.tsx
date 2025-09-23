import { CircularProgress, Typography } from "@mui/material";
import { CloudDownload } from "@mui/icons-material";
import { motion } from "framer-motion";
import React from "react";
import { PrakritiAnalysisLoadingProps } from "./PrakritiAnalysisLoading.types";

const PrakritiAnalysisLoading: React.FC<PrakritiAnalysisLoadingProps> = ({
  ParticlesBackground,
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex flex-col items-center justify-center min-h-screen w-screen bg-gradient-to-br from-teal-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden"
  >
    <ParticlesBackground />
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative z-10 text-center p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl"
    >
      <CircularProgress
        color="primary"
        size={80}
        thickness={2.5}
        className="text-teal-500"
      />
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Typography
          variant="h4"
          className="mt-8 text-teal-600 dark:text-teal-400 font-bold"
        >
          Analyzing Your Prakriti...
        </Typography>
        <Typography
          variant="body1"
          className="mt-4 text-gray-600 dark:text-gray-300 max-w-md"
        >
          We're carefully evaluating your responses to provide the most accurate
          Ayurvedic insights.
        </Typography>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-6"
      >
        <div className="inline-block animate-pulse">
          <CloudDownload className="text-teal-500 text-4xl" />
        </div>
      </motion.div>
    </motion.div>
  </motion.div>
);

export default PrakritiAnalysisLoading;
