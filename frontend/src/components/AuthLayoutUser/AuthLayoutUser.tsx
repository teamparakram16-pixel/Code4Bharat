import { FC } from "react";
import AuthLayoutUserProps from "./AuthLayoutUser.types";
import { motion } from "framer-motion";
import { Leaf, HeartPulse, Shield } from "lucide-react";

const AuthLayoutUser: FC<AuthLayoutUserProps> = ({ children, title, subtitle }) => {
  return (
    <div className="w-screen h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl h-[90vh] min-h-[600px] flex flex-col md:flex-row bg-white shadow-xl rounded-2xl overflow-hidden border border-green-100"
      >
        {/* Ayurvedic-themed Left Section */}
        <div className="w-full md:w-2/5 bg-gradient-to-br from-green-700 to-green-600 p-8 sm:p-10 lg:p-12 text-white relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-10 bg-[url('/images/ayurvedic-pattern.svg')] bg-repeat"></div>
          <div className="relative z-10 h-full flex flex-col">
            
            {/* Header */}
            <div className="flex items-center gap-2 mb-8">
              <Leaf className="w-8 h-8 text-green-300" />
              <span className="text-2xl font-bold text-green-100">ArogyaPath</span>
            </div>

            {/* Content */}
            <div className="flex-grow flex flex-col justify-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">{title}</h1>
              <p className="text-green-100 text-lg mb-8">{subtitle}</p>
              
              <div className="space-y-6 mt-8">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-green-500/20 rounded-full">
                    <HeartPulse className="w-5 h-5 text-green-200" />
                  </div>
                  <div>
                    <h3 className="font-medium text-green-50">Holistic Wellness</h3>
                    <p className="text-green-100 text-sm">
                      Discover natural healing through Ayurvedic wisdom
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-green-500/20 rounded-full">
                    <Shield className="w-5 h-5 text-green-200" />
                  </div>
                  <div>
                    <h3 className="font-medium text-green-50">Personalized Care</h3>
                    <p className="text-green-100 text-sm">
                      Get customized wellness plans from certified Vaidyas
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-auto pt-6 border-t border-green-500/30">
              <p className="text-xs text-green-300">
                &copy; 2025 ArogyaPath — Ancient Wisdom, Modern Wellness
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full md:w-3/5 flex items-center justify-center p-6 sm:p-8 md:p-10 lg:p-12 bg-white">
          <div className="w-full max-w-md space-y-6">
            {children}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayoutUser;