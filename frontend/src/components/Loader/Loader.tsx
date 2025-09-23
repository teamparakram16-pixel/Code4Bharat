import React from "react";
import { Box } from "@mui/material";
import { keyframes } from "@emotion/react";
import ayLogo from "../../assets/ay.svg";

// Keyframes for orbiting animation
const orbit = keyframes`
  0% { transform: rotate(0deg) translateX(115px) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(115px) rotate(-360deg); }
`;

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(0, 255, 128, 0.7); }
  50% { box-shadow: 0 0 50px 25px rgba(0, 255, 128, 0.2); }
`;

const Loader: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        minWidth: '100vw',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #e0ffe7 0%, #b2f7ef 100%)',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 2000,
      }}
    >
      <Box sx={{ 
        position: 'relative', 
        width: 460, // Outer container (orbit diameter = 230px radius * 2)
        height: 460,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '@media (max-width: 600px)': {
          width: 360,
          height: 360,
        }
      }}>
        {/* Logo */}
        <Box
          sx={{
            position: 'absolute',
            width: 200, // Logo container
            height: 200,
            zIndex: 2,
            filter: 'drop-shadow(0 4px 24px #00c89688)',
            background: 'rgba(255,255,255,0.7)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 40px 0 #00c89644',
            animation: `${pulse} 2.5s infinite`,
            '@media (max-width: 600px)': {
              width: 160,
              height: 160,
            }
          }}
        >
          <Box
            component="img"
            src={ayLogo}
            alt="Arogya Logo"
            sx={{ 
              width: 200, // Actual logo size
              height: 200,
              objectFit: 'contain',
              '@media (max-width: 600px)': {
                width: 110,
                height: 110,
              }
            }}
          />
        </Box>
        
        {/* Outer circle (220px) */}
        <Box
          sx={{
            position: 'absolute',
            width: 220,
            height: 220,
            borderRadius: '50%',
            border: '2px dashed rgba(0, 200, 150, 0.3)',
            '@media (max-width: 600px)': {
              width: 180,
              height: 180,
            }
          }}
        />
        
        {/* Orbiting loader (230px radius) */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            animation: `${orbit} 2s linear infinite`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #00c896 0%, #00e6d0 100%)',
              boxShadow: '0 0 20px 6px #00e6d088',
              border: '3px solid #fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '@media (max-width: 600px)': {
                width: 24,
                height: 24,
              }
            }}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: 'radial-gradient(circle, #fff 60%, #00c896 100%)',
                boxShadow: '0 0 8px 1px #00c896',
                '@media (max-width: 600px)': {
                  width: 10,
                  height: 10,
                }
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Loader;