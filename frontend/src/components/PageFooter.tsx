import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Email,
  Phone,
  Place,
  Spa,
  Facebook,
  Twitter,
  Instagram,
  YouTube,
  LinkedIn,
  MenuBook,
  ContactSupport,
  People,
  Article,
  ArrowUpward,
  Send,
  Star,
  Home as HomeIcon,
  Feed as FeedIcon,
  FitnessCenter as FitnessIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import {
  Box,
  Container,
  Typography,
  Link,
  Divider,
  IconButton,
  useTheme,
  Slide,
  Fade,
  TextField,
  Button,
  Tooltip,
  Grow,
  Collapse,
  alpha,
  useMediaQuery,
  Alert,
  AlertTitle
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import { Link as RouterLink, useLocation } from "react-router-dom";
import AyLogo from "@/assets/ay.svg";
import { toast } from "react-toastify";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';



// Floating animation
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

// Add animation keyframes
const logoPulse = keyframes`
  0% { transform: scale(1) rotate(-2deg); filter: drop-shadow(0 2px 8px #00e5ff); }
  50% { transform: scale(1.13) rotate(2deg); filter: drop-shadow(0 8px 24px #ffd600); }
  100% { transform: scale(1) rotate(-2deg); filter: drop-shadow(0 2px 8px #00e5ff); }
`;

const FloatingIcon = styled(Box)(({ theme }) => ({
  position: "absolute",
  background: `linear-gradient(135deg, #fffde7 0%, #00e5ff 100%)`, // Brighter blue/white
  color: theme.palette.primary.contrastText,
  borderRadius: "50%",
  width: 80,
  height: 80,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 6px 32px 0 #00e5ff55",
  zIndex: 1,
  animation: `${float} 6s ease-in-out infinite`,
  transition: "all 0.3s ease",
  border: "3px solid #ffd600", // Gold border for pop
  "&:hover": {
    transform: "scale(1.13)",
    boxShadow: "0 12px 36px 0 #00e5ff99",
    background: `linear-gradient(135deg, #ffd600 0%, #00e5ff 100%)`,
    border: "3px solid #00e5ff",
  },
  "& img": {
    width: 68,
    height: 68,
    objectFit: "contain",
    filter: "drop-shadow(0 2px 12px #00e5ff)",
  },
}));

// const StyledLink = styled(Link)(({ theme }) => ({
//   display: "flex",
//   alignItems: "center",
//   gap: theme.spacing(1),
//   transition: "all 0.3s ease",
//   padding: theme.spacing(0.5, 0),
//   color: alpha(theme.palette.primary.contrastText, 0.85),
//   "&:hover": {
//     color: theme.palette.secondary.main,
//     transform: "translateX(5px)",
//     textDecoration: "none",
//     "& svg": {
//       transform: "rotate(5deg)",
//     },
//   },
//   "& svg": {
//     transition: "all 0.3s ease",
//   },
//   "&.active": {
//     color: theme.palette.secondary.main,
//     fontWeight: 600,
//     "& svg": {
//       color: theme.palette.secondary.main,
//     },
//   },
// }));

const AnimatedDivider = styled(Divider)(({ theme }) => ({
  background: `linear-gradient(90deg, transparent, ${alpha(
    theme.palette.secondary.main,
    0.7
  )}, transparent)`,
  height: 2,
  width: "100%",
  margin: "0 auto",
}));

const NavButton: any = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  fontWeight: 700,
  fontSize: "1.05rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  padding: theme.spacing(1.2, 2.5),
  borderRadius: 18,
  position: "relative",
  overflow: "hidden",
  background: `linear-gradient(90deg, #00e5ff 0%, #1976d2 100%)`,
  boxShadow: "0 2px 12px 0 #00e5ff33",
  margin: theme.spacing(0.5, 0),
  transition: "all 0.35s cubic-bezier(.4,2,.6,1)",
  "& .MuiButton-startIcon": {
    color: "#ffd600",
    fontSize: "1.3em",
    marginRight: theme.spacing(1),
    transition: "color 0.3s",
  },
  "&:hover": {
    background: `linear-gradient(90deg, #ffd600 0%, #00e5ff 100%)`,
    color: "#0d47a1",
    transform: "translateY(-4px) scale(1.04)",
    boxShadow: "0 6px 24px 0 #ffd60055",
    "& .MuiButton-startIcon": {
      color: "#1976d2",
    },
    "&:after": {
      width: "100%",
      background: "linear-gradient(90deg, #ffd600 0%, #00e5ff 100%)",
    },
  },
  "&:after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 0,
    height: 3,
    background: "linear-gradient(90deg, #ffd600 0%, #00e5ff 100%)",
    borderRadius: 2,
    transition: "width 0.3s",
    zIndex: 1,
  },
  "&.active": {
    color: "#ffd600",
    fontWeight: 900,
    background: "linear-gradient(90deg, #1976d2 0%, #ffd600 100%)",
    "&:after": {
      width: "100%",
      background: "linear-gradient(90deg, #ffd600 0%, #1976d2 100%)",
    },
    "& .MuiButton-startIcon": {
      color: "#ffd600",
    },
  },
}));

// Enhance section titles
const FooterSectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 900,
  fontSize: "1.35rem",
  color: "#fff",
  letterSpacing: "0.08em",
  textShadow: "0 2px 8px #1976d2",
  marginBottom: theme.spacing(2),
  textTransform: "uppercase",
  display: "flex",
  alignItems: "center",
}));

// Enhance navigation and contact links
const FooterLink: any = styled(Link)(({ theme }) => ({
  color: "#fff",
  fontWeight: 700,
  fontSize: "1.08rem",
  letterSpacing: "0.04em",
  textShadow: "0 2px 8px #1976d2",
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(1.2),
  transition: "color 0.2s, text-shadow 0.2s",
  "&:hover": {
    color: "#ffd600",
    textShadow: "0 4px 16px #00e5ff",
    textDecoration: "underline",
  },
}));

// Enhance contact info
// const FooterContactText = styled(Typography)(({ theme }) => ({
//   color: "#fff",
//   fontWeight: 600,
//   fontSize: "1.08rem",
//   letterSpacing: "0.03em",
//   textShadow: "0 2px 8px #1976d2",
//   marginBottom: theme.spacing(1.2),
//   display: "flex",
//   alignItems: "center",
// }));

// Enhanced icon style for neon yellow
// const FooterIconStyle = {
//   color: "#ffd600", // Neon yellow
//   filter: "drop-shadow(0 0 8px #ffd600)", // Neon glow
//   fontSize: "1.5em",
//   marginRight: 12,
//   transition: "color 0.2s, filter 0.2s",
// };
// const FooterIconHoverStyle = {
//   color: "#fff", // White on hover for contrast
//   filter: "drop-shadow(0 0 16px #fff)",
// };

const PageFooter = () => {
  const auth = useAuth();
  const role = auth && auth.role ? auth.role : "noUser";
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [scrollPosition, setScrollPosition] = useState(0);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  // const [showTOC, setShowTOC] = React.useState(false);


  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (re.test(email)) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
    else {
      toast.error("Please enter a valid Email Address");
      setEmail("");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.pageYOffset);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const footerLinks = {
    expert: [
      // {
      //   title: "Professional",
      //   icon: <MedicalInformation />,
      //   links: [
      //     { label: "Dashboard", href: "/dashboard", icon: <Dashboard /> },
      //     { label: "Patient Management", href: "/patients", icon: <Group /> },
      //     { label: "Resources", href: "/resources", icon: <LibraryBooks /> },
      //     {
      //       label: "Clinical Guidelines",
      //       href: "/guidelines",
      //       icon: <Healing />,
      //     },
      //   ],

      //   links: [
      //     { label: "About Us", href: "/about-us", icon: <People /> },
      //     // { label: "Services", href: "/services", icon: <LocalHospital /> },
      //     { label: "Contact Us", href: "/contact-us", icon: <Article /> },
      //     {
      //       label: "Success Stories",
      //       href: "/success-stories",
      //       icon: <Star />,
      //     },
      //   ],
      // },
      // {
      //   title: "Support",
      //   icon: <ContactSupport />,
      //   links: [
      //     { label: "Help Center", href: "/help", icon: <QuestionAnswer /> },
      //     { label: "Documentation", href: "/docs", icon: <MenuBook /> },
      //     { label: "Community", href: "/community", icon: <People /> },
      //   ],
      // },

      {
        title: "Discover",
        icon: <Spa />,
        links: [
          { label: " About Us", href: "/about-us", icon: <People /> },
          // { label: "Services", href: "/services", icon: <LocalHospital /> },
          { label: " Contact Us", href: "/contact-us", icon: <Article /> },
          {
            label: " Success Stories",
            href: "/success-stories",
            icon: <Star />,
          },
        ],
      },
      {
        title: "Quick Links",
        icon: <MenuBook />,
        links: [
          { label: " Home", href: "/", icon: <HomeIcon /> },
          { label: " Health Feed", href: "/gposts", icon: <FeedIcon /> },
          { label: " Routines", href: "/routines", icon: <FitnessIcon /> },
          { label: " AI Query", href: "/ai-query", icon: <SearchIcon /> },
        ],
      },
    ],
    user: [
      // {
      //   title: "Health",
      //   icon: <HealthAndSafety />,
      //   // links: [
      //   //   { label: "Find Experts", href: "/experts", icon: <LocalHospital /> },
      //   //   { label: "Health Articles", href: "/articles", icon: <Article /> },
      //   //   { label: "Wellness Tips", href: "/tips", icon: <Lightbulb /> },
      //   //   { label: "Emergency Care", href: "/emergency", icon: <Emergency /> },
      //   // ],
      //   links: [
      //     { label: "About Us", href: "/about-us", icon: <People /> },
      //     // { label: "Services", href: "/services", icon: <LocalHospital /> },
      //     { label: "Contact Us", href: "/contact-us", icon: <Article /> },
      //     {
      //       label: "Success Stories",
      //       href: "/success-stories",
      //       icon: <Star />,
      //     },
      //   ],
      // },
      // {
      //   title: "Support",
      //   icon: <ContactSupport />,
      //   links: [
      //     { label: "FAQs", href: "/faqs", icon: <QuestionAnswer /> },
      //     { label: "Contact Us", href: "/contact", icon: <Email /> },
      //     {
      //       label: "Patient Rights",
      //       href: "/rights",
      //       icon: <HealthAndSafety />,
      //     },
      //   ],
      // },

      {
        title: "Discover",
        icon: <Spa />,
        links: [
          { label: " About Us", href: "/about-us", icon: <People /> },
          // { label: " Services", href: "/services", icon: <LocalHospital /> },
          { label: " Contact Us", href: "/contact-us", icon: <Article /> },
          {
            label: " Success Stories",
            href: "/success-stories",
            icon: <Star />,
          },
          {
            label: " Go Premium",
            href: "/premium",
            icon: <WorkspacePremiumIcon />,
          },
          {
            label: " Search Doctors",
            href: "/search/doctor",
            icon: <MedicalInformationIcon />,
          },
        ],
      },
      {
        title: "Quick Links",
        icon: <MenuBook />,
        links: [
          { label: " Home", href: "/", icon: <HomeIcon /> },
          { label: " Health Feed", href: "/gposts", icon: <FeedIcon /> },
          { label: " Routines", href: "/routines", icon: <FitnessIcon /> },
          { label: " AI Query", href: "/ai-query", icon: <SearchIcon /> },
        ],
      },
    ],
    noUser: [
      {
        title: "Discover",
        icon: <Spa />,
        links: [
          { label: " About Us", href: "/about-us", icon: <People /> },
          // { label: " Services", href: "/services", icon: <LocalHospital /> },
          { label: " Contact Us", href: "/contact-us", icon: <Article /> },
          {
            label: " Success Stories",
            href: "/success-stories",
            icon: <Star />,
          },
          {
            label: " Search Doctors",
            href: "/search/doctor",
            icon: <MedicalInformationIcon />,
          },
        ],
      },
      {
        title: "Quick Links",
        icon: <MenuBook />,
        links: [
          { label: " Home", href: "/", icon: <HomeIcon /> },
          { label: " Health Feed", href: "/gposts", icon: <FeedIcon /> },
          { label: " Routines", href: "/routines", icon: <FitnessIcon /> },
          { label: " AI Query", href: "/ai-query", icon: <SearchIcon /> },
        ],
      },
    ],
  };

  const socialMedia = [
    { icon: <Facebook />, name: "Facebook", color: "#3b5998" },
    { icon: <Twitter />, name: "Twitter", color: "#1da1f2" },
    { icon: <Instagram />, name: "Instagram", color: "#e1306c" },
    { icon: <YouTube />, name: "YouTube", color: "#ff0000" },
    { icon: <LinkedIn />, name: "LinkedIn", color: "#0077b5" },
  ];

  return (
    <Box
      component="footer"
      sx={{
        background: `linear-gradient(135deg, #0d47a1 0%, #1976d2 50%, #00e5ff 100%)`, // More vibrant blue gradient
        color: "#f4f7fa",
        position: "relative",
        overflow: "hidden",
        pt: 12,
        pb: 8,
        boxShadow: "0 8px 32px 0 rgba(13,71,161,0.25)", // Add a soft shadow for depth
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "6px",
          background: `linear-gradient(90deg, #00e5ff, #ffd600, #1976d2, #82b1ff)`, // Multi-color accent bar
        },
      }}
    >
      {/* Decorative elements */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          overflow: "hidden",
          zIndex: 0,
          opacity: 0.12,
          backgroundImage:
            "radial-gradient(circle, #fff 1.5px, transparent 1.5px), radial-gradient(circle, #ffd600 1.5px, transparent 1.5px), radial-gradient(circle, #00e5ff 1.5px, transparent 1.5px)",
          backgroundSize: "28px 28px, 60px 60px, 90px 90px",
        }}
      />

      <FloatingIcon
        sx={{
          top: "3%",
          left: "47%",
          animationDelay: "0.5s",
          display: { xs: "none", lg: "flex" },
        }}
      >
        <img src={AyLogo} alt="Ayurveda icon" />
      </FloatingIcon>

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 2 }}>
        {/* Main footer content */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 6,
            mb: 6,
          }}
        >
          {/* Brand and description */}
          <Box
            sx={{
              flex: { md: 1, lg: 1.5 },
              minWidth: { md: "300px" },
              position: "relative",
              pr: { md: 4 },
            }}
          >
            <Slide direction="up" in={true} timeout={500}>
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 3,
                    position: "relative",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: -8,
                      left: 0,
                      width: "60px",
                      height: "3px",
                      background: theme.palette.secondary.main,
                      borderRadius: "3px",
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={AyLogo}
                    alt="ArogyaPath Icon"
                    sx={{
                      width: 60,
                      height: 60,
                      mr: 2.5,
                      filter: "drop-shadow(0 2px 8px #00e5ff)",
                      animation: `${logoPulse} 2.5s infinite cubic-bezier(.4,2,.6,1)`,
                      transition: "all 0.3s",
                    }}
                  />
                  <Typography
                    variant="h3"
                    component={RouterLink}
                    to="/"
                    sx={{
                      fontWeight: 900,
                      color: "inherit",
                      textDecoration: "none",
                      letterSpacing: "2px",
                      background:
                        "linear-gradient(90deg, #ffd600 10%, #00e5ff 60%, #1976d2 100%)", // Eye-catching gradient
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontSize: { xs: "2.3rem", md: "3rem" },
                      textShadow: "0 2px 12px #1976d2",
                      "&:hover": {
                        transform: "scale(1.06)",
                        textShadow: "0 4px 24px #00e5ff",
                      },
                      transition: "all 0.3s cubic-bezier(.4,2,.6,1)",
                    }}
                  >
                    ArogyaPath
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 3,
                    opacity: 1,
                    lineHeight: 1.8,
                    fontSize: { xs: "1.15rem", md: "1.25rem" },
                    color: "#fff",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    textShadow: "0 2px 8px #1976d2",
                  }}
                >
                  Empowering health through traditional wisdom and modern care.
                  Our integrative approach combines ancient Ayurvedic practices
                  with contemporary medical expertise.
                </Typography>

                {/* Quick Navigation for Mobile */}
                {isMobile && (
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        mb: 2,
                        fontWeight: 800,
                        fontSize: { xs: "1.2rem", md: "1.3rem" },
                        display: "flex",
                        alignItems: "center",
                        color: "#ffd600",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        textShadow: "0 2px 8px #1976d2",
                        "&::before": {
                          content: '""',
                          display: "inline-block",
                          width: "30px",
                          height: "2px",
                          background: "#00e5ff",
                          mr: 1.5,
                        },
                      }}
                    >
                      Quick Links
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                        mb: 3,
                      }}
                    >
                      {footerLinks.noUser[1].links.map((link) => (
                        <NavButton
                          key={link.href}
                          component={RouterLink as any}
                          to={link.href}
                          startIcon={link.icon}
                          className={isActive(link.href) ? "active" : ""}
                          size="small"
                        >
                          {link.label}
                        </NavButton>
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Newsletter Subscription */}
                <Box sx={{ mt: 2 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      mb: 2,
                      fontWeight: 600,
                      fontSize: "1.1rem",
                      display: "flex",
                      alignItems: "center",
                      "&::before": {
                        content: '""',
                        display: "inline-block",
                        width: "30px",
                        height: "2px",
                        background: theme.palette.secondary.main,
                        mr: 1.5,
                      },
                    }}
                  >
                    Stay Updated
                  </Typography>
                  <Collapse in={!subscribed}>
                    <Box
                      component="form"
                      onSubmit={handleSubscribe}
                      sx={{
                        display: "flex",
                        gap: 1,
                        alignItems: "center",
                        maxWidth: "400px",
                      }}
                    >
                      <TextField
                        variant="outlined"
                        placeholder="Your email address"
                        size="small"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            color: theme.palette.primary.contrastText,
                            "& fieldset": {
                              borderColor: "rgba(255, 255, 255, 0.3)",
                              borderRadius: "50px",
                            },
                            "&:hover fieldset": {
                              borderColor: theme.palette.secondary.main,
                            },
                          },
                          "& .MuiInputLabel-root": {
                            color: "rgba(255, 255, 255, 0.7)",
                          },
                        }}
                      />
                      <Tooltip title="Subscribe" arrow>
                        <Button
                          type="submit"
                          variant="contained"
                          color="secondary"
                          sx={{
                            minWidth: 0,
                            height: 40,
                            width: 40,
                            borderRadius: "50%",
                            boxShadow: `0 4px 10px ${alpha(
                              theme.palette.secondary.main,
                              0.3
                            )}`,
                            "&:hover": {
                              transform: "translateY(-2px)",
                              boxShadow: `0 6px 15px ${alpha(
                                theme.palette.secondary.main,
                                0.4
                              )}`,
                            },
                            transition: "all 0.3s ease",
                          }}
                        >
                          <Send />
                        </Button>
                      </Tooltip>
                    </Box>
                  </Collapse>
                  <Collapse in={subscribed}>
                    <Alert
                      icon={<CheckCircleIcon fontSize="inherit" />}
                      severity="success"
                      sx={{
                        mt: 1,
                        py:0.5,
                        px:1.5,
                        borderRadius: 1,
                        fontStyle: "italic",
                        alignItems: "center",
                      }}
                    >
                      <AlertTitle>Subscription Confirmed</AlertTitle>
                      Thank you for subscribing to our newsletter!
                    </Alert>
                  </Collapse>
                </Box>
              </Box>
            </Slide>
          </Box>

          {/* Links sections */}
          <Box
            sx={{
              flex: 2,
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              gap: { xs: 4, md: 3, lg: 4 },
              ml: { md: 2 },
            }}
          >
            {(footerLinks[role] || footerLinks.noUser).map((section, index) => (
              <Box
                key={index}
                sx={{
                  minWidth: { xs: "160px", sm: "180px", md: "200px" },
                  flex: 1,
                }}
              >
                <Grow in={true} timeout={(index + 1) * 300}>
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 2.5,
                        position: "relative",
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          bottom: -5,
                          left: 0,
                          width: "30px",
                          height: "2px",
                          background: theme.palette.secondary.main,
                          borderRadius: "2px",
                        },
                      }}
                    >
                      {React.cloneElement(section.icon, {
                        sx: {
                          color: theme.palette.secondary.main,
                          mr: 1.5,
                          fontSize: 22,
                        },
                      })}
                      <FooterSectionTitle variant="h6">
                        {section.title}
                      </FooterSectionTitle>
                    </Box>
                    <Box
                      component="ul"
                      sx={{
                        listStyle: "none",
                        p: 0,
                        m: 0,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5,
                      }}
                    >
                      {section.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <FooterLink
                            component={RouterLink as any}
                            to={link.href}
                            underline="none"
                            className={isActive(link.href) ? "active" : ""}
                            sx={{ fontSize: "0.95rem" }}
                          >
                            {React.cloneElement(link.icon, {
                              sx: {
                                fontSize: 18,
                                color: isActive(link.href)
                                  ? theme.palette.secondary.main
                                  : alpha(theme.palette.secondary.main, 0.8),
                              },
                            })}
                            {link.label}
                          </FooterLink>
                        </li>
                      ))}
                    </Box>
                  </Box>
                </Grow>
              </Box>
            ))}

            {/* Contact section */}
            <Box
              sx={{
                minWidth: { xs: "160px", sm: "180px", md: "200px" },
                flex: 1,
              }}
            >
              <Slide direction="up" in={true} timeout={900}>
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2.5,
                      position: "relative",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: -5,
                        left: 0,
                        width: "30px",
                        height: "2px",
                        background: theme.palette.secondary.main,
                        borderRadius: "2px",
                      },
                    }}
                  >
                    <ContactSupport
                      sx={{
                        color: theme.palette.secondary.main,
                        mr: 1.5,
                        fontSize: 22,
                      }}
                    />
                    <FooterSectionTitle variant="h6">
                      Contact
                    </FooterSectionTitle>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    <FooterLink
                      href="mailto:teamparakram16@gmail.com"
                      color="inherit"
                      underline="none"
                    >
                      <Email
                        sx={{
                          fontSize: 18,
                          color: alpha(theme.palette.secondary.main, 0.8),
                        }}
                      />
                      teamparakram16@gmail.com
                    </FooterLink>
                    <FooterLink
                      href="tel:+918904156468"
                      color="inherit"
                      underline="none"
                    >
                      <Phone
                        sx={{
                          fontSize: 18,
                          color: alpha(theme.palette.secondary.main, 0.8),
                        }}
                      />
                      8904156468
                    </FooterLink>
                    <FooterLink href="#" color="inherit" underline="none">
                      <Place
                        sx={{
                          fontSize: 18,
                          color: alpha(theme.palette.secondary.main, 0.8),
                        }}
                      />
                      Mangaluru, India
                    </FooterLink>
                  </Box>

                  {/* Social Media */}
                  <Box sx={{ mt: 4 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        mb: 2,
                        fontWeight: 600,
                        fontSize: "1.1rem",
                        display: "flex",
                        alignItems: "center",
                        "&::before": {
                          content: '""',
                          display: "inline-block",
                          width: "30px",
                          height: "2px",
                          background: theme.palette.secondary.main,
                          mr: 1.5,
                        },
                      }}
                    >
                      Follow Us
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        flexWrap: "wrap",
                      }}
                    >
                      {socialMedia.map((social) => (
                        <Tooltip title={social.name} key={social.name} arrow>
                          <IconButton
                            aria-label={social.name}
                            sx={{
                              background:
                                hoveredIcon === social.name
                                  ? social.color
                                  : alpha(theme.palette.background.paper, 0.1),
                              color:
                                hoveredIcon === social.name
                                  ? "#fff"
                                  : theme.palette.primary.contrastText,
                              transition: "all 0.3s ease",
                              "&:hover": {
                                background: social.color,
                                color: "#fff",
                                transform: "translateY(-3px)",
                                boxShadow: `0 5px 15px ${alpha(
                                  social.color,
                                  0.4
                                )}`,
                              },
                            }}
                            onMouseEnter={() => setHoveredIcon(social.name)}
                            onMouseLeave={() => setHoveredIcon(null)}
                          >
                            {social.icon}
                          </IconButton>
                        </Tooltip>
                      ))}
                    </Box>
                  </Box>
                </Box>
              </Slide>
            </Box>
          </Box>
        </Box>

        <AnimatedDivider
          sx={{
            my: 6,
            maxWidth: "1200px",
          }}
        />

        {/* Bottom footer */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column-reverse", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            pt: 2,
          }}
        >
          <Fade in={true} timeout={1500}>
            <Typography
              variant="body2"
              sx={{
                opacity: 0.8,
                fontSize: "0.85rem",
              }}
            >
              © {new Date().getFullYear()} ArogyaPath. All rights reserved.
            </Typography>
          </Fade>

          <Fade in={true} timeout={1500}>
            <Box
              sx={{
                display: "flex",
                gap: { xs: 1.5, sm: 3 },
                flexWrap: "wrap",
                justifyContent: { xs: "center", sm: "flex-end" },
              }}
            >
              <Link
                component={RouterLink}
                to="/privacy-policy"
                color="inherit"
                underline="hover"
                variant="body2"
                sx={{
                  opacity: 0.8,
                  "&:hover": {
                    opacity: 1,
                    color: theme.palette.secondary.main,
                  },
                  fontSize: "0.85rem",
                  transition: "all 0.2s ease",
                }}
              >
                Privacy Policy
              </Link>

              <Link
                component={RouterLink}
                to="/terms-and-conditions"
                color="inherit"
                underline="hover"
                variant="body2"
                sx={{
                  opacity: 0.8,
                  "&:hover": {
                    opacity: 1,
                    color: theme.palette.secondary.main,
                  },
                  fontSize: "0.85rem",
                  transition: "all 0.2s ease",
                }}
              >
                Terms of Service
              </Link>
              <Link
                component={RouterLink}
                to="/cookie-policy"
                color="inherit"
                underline="hover"
                variant="body2"
                sx={{
                  opacity: 0.8,
                  "&:hover": {
                    opacity: 1,
                    color: theme.palette.secondary.main,
                  },
                  fontSize: "0.85rem",
                  transition: "all 0.2s ease",
                }}
              >
                Cookie Policy
              </Link>
            </Box>
          </Fade>
        </Box>
      </Container>

      {/* Floating back to top button */}
      <Fade in={scrollPosition > 300}>
        <Box
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            width: 50,
            height: 50,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.light} 100%)`,
            color: theme.palette.secondary.contrastText,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: `0 4px 20px ${alpha(theme.palette.secondary.main, 0.3)}`,
            zIndex: 1000,
            transition: "all 0.3s",
            opacity: scrollPosition > 300 ? 1 : 0,
            "&:hover": {
              transform: "translateY(-5px) scale(1.1)",
              boxShadow: `0 8px 25px ${alpha(
                theme.palette.secondary.main,
                0.4
              )}`,
              animation: `${pulse} 1.5s infinite`,
            },
          }}
        >
          <ArrowUpward />
        </Box>
      </Fade>
    </Box>
  );
};

export default PageFooter;
