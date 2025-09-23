import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Box,
  Container,
  Typography,
  Paper,
  Avatar,
  useTheme,
} from "@mui/material";
import {
  Spa as LeafIcon,
  AccessTime as ClockIcon,
  LocalHospital as HospitalIcon,
  MenuBook as BookIcon,
} from "@mui/icons-material";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";

import useCheckAuth from "@/hooks/auth/useCheckAuth/useCheckAuth";
import Loader from "@/components/Loader";

// Enhanced animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.8,
      ease: [0.6, -0.05, 0.01, 0.99]
    } 
  },
};

const cardHover = {
  hover: {
    y: -10,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const FeatureCard = ({ icon, title, description, index }: FeatureCardProps) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <Box sx={{ width: { xs: "100%", sm: "50%", md: "25%" }, p: 2 }}>
      <motion.div
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={fadeInUp}
        transition={{ delay: index * 0.15 }}
        whileHover="hover"
      >
        <motion.div variants={cardHover}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              borderRadius: 4,
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(12px)",
              transition: "all 0.3s ease",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              "&:hover": {
                boxShadow: "0 15px 30px rgba(0, 0, 0, 0.15)",
              },
            }}
          >
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Avatar
                sx={{
                  bgcolor: "primary.light",
                  width: 80,
                  height: 80,
                  mb: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                }}
              >
                {icon}
              </Avatar>
            </motion.div>
            <Typography
              variant="h5"
              component="h3"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: "primary.dark",
                background: "linear-gradient(90deg, #166534 0%, #22c55e 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {title}
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ lineHeight: 1.7 }}
            >
              {description}
            </Typography>
          </Paper>
        </motion.div>
      </motion.div>
    </Box>
  );
};

const HomePage = () => {
  const { checkAuthStatus, loading, authState } = useCheckAuth();
  const theme = useTheme();

  useEffect(() => {
    const check = async () => {
      await checkAuthStatus();
    };
    check();
  }, []);

  if (loading) return <Loader />;

  return (
    <Box sx={{ 
      minHeight: "100vh", 
      width: "100vw", 
      overflowX: "hidden",
      background: theme.palette.background.default
    }}>
      {/* Hero Section */}
      <Box
        sx={{
          pt: { xs: 12, md: 5 },
          pb: { xs: 12, md: 5 },
          background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
          position: "relative",
          overflow: "hidden",
          minHeight: { xs: "85vh", md: "90vh" },
          display: "flex",
          alignItems: "center",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: "url('/assets/ayurvedic-pattern.png')",
            backgroundSize: "300px",
            opacity: 0.03,
            zIndex: 0,
          },
        }}
      >
        {/* Floating elements */}
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            top: "20%",
            left: "5%",
            width: 30,
            height: 30,
            borderRadius: "50%",
            backgroundColor: "rgba(34, 197, 94, 0.15)",
            filter: "blur(4px)",
          }}
        />
        <motion.div
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          style={{
            position: "absolute",
            top: "60%",
            right: "10%",
            width: 40,
            height: 40,
            borderRadius: "50%",
            backgroundColor: "rgba(22, 101, 52, 0.1)",
            filter: "blur(4px)",
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Box sx={{ 
            display: "flex", 
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center", 
            gap: { xs: 8, md: 10 },
            minHeight: { xs: "auto", md: "600px" }
          }}>
            <Box sx={{ 
              flex: 1,
              width: { xs: "100%", md: "50%" },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              order: { xs: 2, md: 1 },
              pr: { md: 4 }
            }}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: "2.5rem", md: "3.75rem", lg: "4rem" },
                    fontWeight: 800,
                    lineHeight: 1.2,
                    mb: 3,
                    color: "primary.dark",
                    textAlign: { xs: "center", md: "left" }
                  }}
                >
                  Discover Your{" "}
                  <Box
                    component="span"
                    sx={{ 
                      color: "secondary.main", 
                      display: "inline-block",
                      background: "linear-gradient(90deg, #166534 0%, #22c55e 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Prakriti
                  </Box>{" "}
                  with ArogyaPath
                </Typography>
                
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontSize: { xs: "1.1rem", md: "1.25rem" },
                    color: "text.secondary",
                    mb: 4,
                    lineHeight: 1.8,
                    maxWidth: { xs: "100%", md: "90%" },
                    textAlign: { xs: "center", md: "left" }
                  }}
                >
                  Unlock personalized Ayurvedic wellness through our advanced
                  Prakriti analysis. Connect with certified Ayurvedic doctors and
                  embark on a journey to holistic health.
                </Typography>

                <AnimatePresence>
                  {!authState?.loggedIn && (
                    <Box sx={{ 
                      display: "flex", 
                      gap: 3, 
                      flexWrap: "wrap",
                      alignItems: "center",
                      justifyContent: { xs: "center", md: "flex-start" }
                    }}>
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <Button
                          variant="contained"
                          size="large"
                          component={Link}
                          to="/auth"
                          sx={{
                            background: "linear-gradient(90deg, #166534 0%, #22c55e 100%)",
                            color: "white",
                            px: 5,
                            py: 1.5,
                            borderRadius: 50,
                            fontWeight: 700,
                            boxShadow: "0 4px 14px rgba(22, 163, 74, 0.3)",
                            fontSize: "1.1rem",
                            "&:hover": {
                              boxShadow: "0 8px 20px rgba(22, 163, 74, 0.4)",
                            },
                          }}
                        >
                          Begin Your Journey
                        </Button>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <Button
                          variant="outlined"
                          size="large"
                          component={Link}
                          to="/learn-more"
                          sx={{
                            borderColor: "primary.main",
                            color: "primary.main",
                            px: 5,
                            py: 1.5,
                            borderRadius: 50,
                            fontWeight: 600,
                            fontSize: "1.1rem",
                            "&:hover": {
                              backgroundColor: "rgba(220, 252, 231, 0.3)",
                              borderColor: "primary.dark",
                            },
                          }}
                        >
                          Learn More
                        </Button>
                      </motion.div>
                    </Box>
                  )}
                </AnimatePresence>
              </motion.div>
            </Box>
            <Box sx={{ 
              flex: 1,
              width: { xs: "100%", md: "50%" },
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              order: { xs: 1, md: 2 },
              pl: { md: 4 }
            }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                style={{
                  position: "relative",
                  width: "100%",
                  maxWidth: "500px",
                }}
              >
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b"
                  alt="Ayurvedic Medicine"
                  sx={{
                    width: "100%",
                    height: "auto",
                    borderRadius: 4,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.2)",
                    zIndex: 1,
                    position: "relative",
                    border: "8px solid white",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    background: "radial-gradient(#86efac 0%, transparent 70%)",
                    top: 0,
                    left: 0,
                    zIndex: 0,
                    borderRadius: "50%",
                    filter: "blur(60px)",
                    opacity: 0.5,
                  }}
                />
                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 40,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    position: "absolute",
                    top: "-20px",
                    right: "-20px",
                    width: "80px",
                    height: "80px",
                    zIndex: 2,
                  }}
                >
                  <LeafIcon sx={{ 
                    color: "secondary.main", 
                    fontSize: "80px",
                    opacity: 0.6 
                  }} />
                </motion.div>
              </motion.div>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      {/* <Box sx={{ 
        py: 12, 
        backgroundColor: "primary.light",
        position: "relative",
        overflow: "hidden"
      }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: "flex", 
            flexWrap: "wrap", 
            justifyContent: "center",
            alignItems: "center",
            gap: 0,
            position: "relative",
            zIndex: 1
          }}>
            {[
              { number: "5000+", label: "Happy Patients" },
              { number: "200+", label: "Certified Doctors" },
              { number: "98%", label: "Satisfaction Rate" },
              { number: "24/7", label: "Support Available" },
            ].map((stat, index) => (
              <Box key={index} sx={{ 
                width: { xs: "50%", sm: "25%" }, 
                p: 3,
                position: "relative",
                "&:not(:last-child)::after": {
                  content: '""',
                  position: "absolute",
                  right: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  height: "50%",
                  width: "1px",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  display: { xs: "none", sm: index < 3 ? "block" : "none" }
                }
              }}>
                <Box
                  sx={{
                    textAlign: "center",
                    p: 2,
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 800,
                      mb: 1,
                      background: "linear-gradient(90deg, #166534 0%, #22c55e 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontSize: { xs: "2.5rem", md: "3rem" }
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{ 
                      color: "primary.dark", 
                      fontWeight: 600,
                      fontSize: { xs: "1rem", md: "1.1rem" }
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
          
          <--Decorative elements--> 
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              position: "absolute",
              bottom: "-100px",
              left: "-100px",
              width: "300px",
              height: "300px",
              borderRadius: "50%",
              border: "2px dashed rgba(22, 101, 52, 0.2)",
              zIndex: 0,
            }}
          />
        </Container>
      </Box> */}

      {/* Features Section */}
      <Box sx={{ 
        py: 12, 
        position: "relative",
        background: "linear-gradient(to bottom, #f0fdf4 0%, #ffffff 100%)"
      }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            textAlign: "center",
            mb: 8,
            position: "relative"
          }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "2rem", md: "2.75rem", lg: "3rem" },
                  fontWeight: 800,
                  mb: 2,
                  color: "primary.dark",
                  position: "relative",
                  display: "inline-block",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: -8,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "80px",
                    height: "4px",
                    background: "linear-gradient(90deg, #166534 0%, #22c55e 100%)",
                    borderRadius: "2px"
                  }
                }}
              >
                Why Choose ArogyaPath?
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  maxWidth: 700,
                  mx: "auto",
                  color: "text.secondary",
                  fontSize: { xs: "1rem", md: "1.1rem" },
                  lineHeight: 1.8,
                  mt: 3
                }}
              >
                Experience the perfect blend of ancient wisdom and modern
                technology for your wellness journey.
              </Typography>
            </motion.div>
          </Box>

          <Box sx={{ 
            display: "flex", 
            flexWrap: "wrap", 
            justifyContent: "center",
            alignItems: "stretch",
            gap: 2,
            position: "relative",
            zIndex: 1
          }}>
            {[
              {
                icon: <LeafIcon sx={{ fontSize: 36, color: "secondary.main" }} />,
                title: "Prakriti Analysis",
                description: "Discover your unique body constitution through our advanced assessment tool.",
              },
              {
                icon: <HospitalIcon sx={{ fontSize: 36, color: "secondary.main" }} />,
                title: "Expert Consultations",
                description: "Connect with certified Ayurvedic doctors for personalized guidance.",
              },
              {
                icon: <ClockIcon sx={{ fontSize: 36, color: "secondary.main" }} />,
                title: "Daily Routines",
                description: "Get customized Dinacharya plans based on your Prakriti.",
              },
              {
                icon: <BookIcon sx={{ fontSize: 36, color: "secondary.main" }} />,
                title: "Ayurvedic Knowledge",
                description: "Access authentic Ayurvedic resources and remedies.",
              },
            ].map((feature, index) => (
              <FeatureCard key={index} index={index} {...feature} />
            ))}
          </Box>
          
          {/* Background pattern */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: "url('/assets/ayurvedic-pattern-light.png')",
              backgroundSize: "400px",
              opacity: 0.03,
              zIndex: 0,
              pointerEvents: "none"
            }}
          />
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ 
        py: 12, 
        backgroundColor: "#f8faf7",
        position: "relative",
        overflow: "hidden"
      }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            textAlign: "center",
            mb: 8
          }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "2rem", md: "2.75rem", lg: "3rem" },
                  fontWeight: 800,
                  mb: 2,
                  color: "primary.dark",
                  position: "relative",
                  display: "inline-block",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: -8,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "80px",
                    height: "4px",
                    background: "linear-gradient(90deg, #166534 0%, #22c55e 100%)",
                    borderRadius: "2px"
                  }
                }}
              >
                How ArogyaPath Works
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  maxWidth: 700,
                  mx: "auto",
                  color: "text.secondary",
                  fontSize: { xs: "1rem", md: "1.1rem" },
                  lineHeight: 1.8,
                  mt: 3
                }}
              >
                Your journey to holistic health in just a few simple steps.
              </Typography>
            </motion.div>
          </Box>

          <Box sx={{ 
            display: "flex", 
            flexDirection: { xs: "column", lg: "row" },
            alignItems: { xs: "center", lg: "flex-start" }, 
            gap: { xs: 8, lg: 6 },
            position: "relative"
          }}>
            <Box sx={{ 
              width: { xs: "100%", lg: "50%" },
              position: "relative",
              minHeight: { xs: 400, lg: 600 },
              order: { xs: 1, lg: 1 }
            }}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                style={{
                  position: "relative",
                  height: "100%",
                  width: "100%"
                }}
              >
                <Box
                  component="img"
                  src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgAoDPnO49RPE1XJ5-U9n_DHmR5iAR1ekL0mWEAJHzZOOiKaBTsGxvaBpUeJ9L032LpP0QtN3QcS-J2XWY-Bm5QrjjHZljibOG3f1JB_D9T6smKVyENlO0zP51fn05lyUxV_Spx2z3Atvad35cbf0fIbzerApbU1iOEAocKoKbNoPxcFacrZOVhnWaEzkQ/s800/ayur.png"
                  alt="Prakriti Analysis"
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: { xs: "5%", lg: 0 },
                    width: { xs: "70%", lg: "75%" },
                    maxWidth: 450,
                    borderRadius: 4,
                    boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.15)",
                    zIndex: 2,
                    border: "6px solid white"
                  }}
                />
                {/* <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f"
                  alt="Doctor Consultation"
                  sx={{
                    position: "absolute",
                    bottom: 60,
                    right: { xs: "5%", lg: 0 },
                    width: { xs: "55%", lg: "55%" },
                    maxWidth: 350,
                    borderRadius: 4,
                    boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.15)",
                    zIndex: 1,
                    border: "6px solid white"
                  }}
                /> */}
                
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    position: "absolute",
                    top: "25%",
                    right: "15%",
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    backgroundColor: "rgba(34, 197, 94, 0.15)",
                    filter: "blur(8px)",
                    zIndex: 0
                  }}
                />
              </motion.div>
            </Box>
            <Box sx={{ 
              width: { xs: "100%", lg: "50%" },
              order: { xs: 2, lg: 2 }
            }}>
              <Box sx={{ 
                maxWidth: { xs: "100%", lg: 550 },
                mx: { xs: "auto", lg: 0 },
                ml: { lg: 6 },
                textAlign: { xs: "center", lg: "left" }
              }}>
                {[
                  {
                    step: "01",
                    title: "Complete Your Prakriti Analysis",
                    description: "Take our comprehensive questionnaire to determine your unique mind-body constitution.",
                  },
                  {
                    step: "02",
                    title: "Get Personalized Recommendations",
                    description: "Receive diet, lifestyle, and herbal suggestions tailored to your Prakriti.",
                  },
                  {
                    step: "03",
                    title: "Connect with Ayurvedic Experts",
                    description: "Schedule consultations with our certified practitioners for deeper guidance.",
                  },
                  {
                    step: "04",
                    title: "Track Your Progress",
                    description: "Monitor your wellness journey with our interactive dashboard.",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    style={{ marginBottom: 48 }}
                  >
                    <Box sx={{ 
                      display: "flex", 
                      gap: 4,
                      alignItems: "flex-start",
                      justifyContent: { xs: "center", lg: "flex-start" },
                      textAlign: { xs: "center", lg: "left" }
                    }}>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Box
                          sx={{
                            width: 80,
                            height: 80,
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #166534 0%, #22c55e 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            color: "white",
                            boxShadow: "0 8px 20px rgba(22, 101, 52, 0.2)",
                          }}
                        >
                          <Typography
                            variant="h5"
                            sx={{ fontWeight: 800 }}
                          >
                            {item.step}
                          </Typography>
                        </Box>
                      </motion.div>
                      <Box sx={{ flex: 1, textAlign: { xs: "left", lg: "left" }, pl: 1 }}>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 700,
                            mb: 2,
                            color: "primary.dark",
                            lineHeight: 1.3,
                            fontSize: { xs: "1.25rem", md: "1.5rem" }
                          }}
                        >
                          {item.title}
                        </Typography>
                        <Typography 
                          variant="body1" 
                          color="text.secondary"
                          sx={{ 
                            lineHeight: 1.8,
                            fontSize: { xs: "1rem", md: "1.1rem" }
                          }}
                        >
                          {item.description}
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>
                ))}
              </Box>
            </Box>
          </Box>
        </Container>
        
        {/* Floating leaves decoration */}
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 2, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            bottom: "10%",
            left: "5%",
            zIndex: 0,
            opacity: 0.2
          }}
        >
          <LeafIcon sx={{ fontSize: 100, color: "secondary.main" }} />
        </motion.div>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 16,
          background: "linear-gradient(135deg, #166534 0%, #22c55e 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        {/* Animated background elements */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          }}
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
          style={{
            position: "absolute",
            bottom: "-150px",
            left: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          }}
        />
        
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            style={{ 
              textAlign: "center",
              position: "relative",
              zIndex: 1
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2rem", md: "2.75rem", lg: "3rem" },
                fontWeight: 800,
                mb: 3,
                lineHeight: 1.3
              }}
            >
              Ready to Transform Your Health?
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                fontSize: { xs: "1.1rem", md: "1.25rem" },
                mb: 5,
                opacity: 0.9,
                maxWidth: 700,
                mx: "auto",
                lineHeight: 1.8
              }}
            >
              Join thousands who have discovered the power of Ayurveda through
              ArogyaPath.
            </Typography>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="contained"
                size="large"
                component={Link}
                to={authState?.loggedIn ? "/dashboard" : "/auth"}
                sx={{
                  backgroundColor: "white",
                  color: "secondary.dark",
                  px: 6,
                  py: 1.8,
                  borderRadius: 50,
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    boxShadow: "0 12px 28px rgba(0, 0, 0, 0.25)",
                  },
                }}
              >
                {authState?.loggedIn ? "Go to Dashboard" : "Get Started Free"}
              </Button>
            </motion.div>
            
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                position: "absolute",
                top: "-50px",
                right: "-50px",
                width: "150px",
                height: "150px",
                zIndex: -1,
                opacity: 0.5
              }}
            >
              <LeafIcon sx={{ 
                color: "white", 
                fontSize: "150px",
              }} />
            </motion.div>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;