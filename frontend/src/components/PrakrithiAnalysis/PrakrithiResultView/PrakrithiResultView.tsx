import React from "react";
import { PrakrithiResultViewProps } from "./PrakrithiResultView.types";
import { motion } from "framer-motion";
import { Typography, Button, CircularProgress } from "@mui/material";
import { CloudDownload, Email, People } from "@mui/icons-material";
import { Loader2 } from "lucide-react";

const PrakrithiResultView: React.FC<PrakrithiResultViewProps> = ({
  responseData,
  download,
  sendEmail,
  emailLoading,
  findSimilarPkUsers,
  findSimilarPkUsersLoad,
}) => {
//   if (!responseData) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative z-10 text-center p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl max-w-2xl mx-auto"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Typography
          variant="h4"
          className="mb-6 text-teal-600 dark:text-teal-400 font-bold"
        >
          Analysis Complete!
        </Typography>

        <Typography
          variant="h6"
          className="mb-4 text-gray-700 dark:text-gray-200"
        >
          Your dominant Prakriti is:{" "}
          <span className="font-bold text-indigo-600 dark:text-indigo-300">
            {responseData?.Dominant_Prakrithi}
          </span>
        </Typography>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Button
            variant="contained"
            color="primary"
            startIcon={<CloudDownload />}
            onClick={download}
            className="h-16"
            fullWidth
          >
            Download Report
          </Button>

          <Button
            variant="contained"
            color="secondary"
            startIcon={<Email />}
            onClick={sendEmail}
            disabled={emailLoading}
            className="h-16"
            fullWidth
          >
            {emailLoading ? <CircularProgress size={24} /> : "Send to Email"}
          </Button>

          <Button
            variant="outlined"
            color="primary"
            startIcon={<People />}
            onClick={findSimilarPkUsers}
            className="h-16"
            fullWidth
            disabled={findSimilarPkUsersLoad}
          >
            {findSimilarPkUsersLoad ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Connect with Similar Prakriti"
            )}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PrakrithiResultView;
