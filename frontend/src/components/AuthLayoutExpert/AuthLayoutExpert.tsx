import { FC } from "react";
import { Leaf, HeartPulse, IndianRupee } from "lucide-react";
import AuthLayoutExpertProps from "./AuthLayoutExpert.types";
import Button from "@mui/material/Button";


const AuthLayoutExpert: FC<AuthLayoutExpertProps> = ({
  children,
  title,
  subtitle,
}) => {
  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Outer centered container with width constraint */}
      <div className="w-full max-w-7xl mx-auto shadow-xl rounded-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row w-full min-h-[80vh] bg-white">
          {/* Left Ayurvedic panel */}
          <div className="w-full lg:w-1/2 bg-gradient-to-br from-amber-600 to-amber-800 text-white p-8 sm:p-12 lg:p-16">
            <div className="h-full flex flex-col max-w-xl mx-auto">
              {/* Logo */}
              <div className="flex items-center mb-8">
                <Leaf className="w-8 h-8 mr-3" />
                <span className="text-2xl font-bold">ArogyaPath</span>
              </div>

              {/* Ayurvedic Messaging */}
              <div className="flex-grow flex flex-col justify-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
                <p className="text-amber-100 text-xl mb-12">{subtitle}</p>

                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <HeartPulse className="w-6 h-6 text-amber-200 mt-1" />
                    <div>
                      <h3 className="text-xl font-medium mb-1">Ancient Wisdom</h3>
                      <p className="text-amber-100">
                        Access 3000+ years of Ayurvedic knowledge
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <IndianRupee className="w-6 h-6 text-amber-200 mt-1" />
                    <div>
                      <h3 className="text-xl font-medium mb-1">Holistic Practice</h3>
                      <p className="text-amber-100">
                        Manage your patients with natural healing approaches
                      </p>
                      <Button
  variant="outlined"
  color="inherit"
  sx={{ mt: 2, borderColor: 'white', color: 'white', '&:hover': { borderColor: '#facc15' } }}
>
  Learn More
</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form panel */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 md:p-12 lg:p-16 bg-white">
          <div className="w-full max-w-md">
  {children}

</div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayoutExpert;
