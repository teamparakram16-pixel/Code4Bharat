import React, { useState, useEffect } from "react";
import {
  Box,
  useTheme,
  useMediaQuery,
  Typography,
  Container,
  Divider,
  Paper,
  IconButton,
} from "@mui/material";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import MenuIcon from "@mui/icons-material/Menu";
import ScrollTopButton from "../../components/TermsNConditions/ScrollTopButton";
import TableOfContents from "../../components/TermsNConditions/TableOfContents.tsx";
import TermsHeader from "../../components/TermsNConditions/TermsHeader.tsx";
import TermsSections from "../../components/TermsNConditions/TermsSections.tsx";
import AcceptanceSection from "../../components/TermsNConditions/AcceptanceSection.tsx";
import useCheckAuth from "@/hooks/auth/useCheckAuth/useCheckAuth.tsx";
import Loader from "@/components/Loader/Loader.tsx";

const TermsNConditions: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showMobileToc, setShowMobileToc] = useState(false);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.95]);
  const scale = useTransform(scrollYProgress, [0, 0.1], [1, 0.99]);

  const sections = [
    { id: "eligibility", title: "Eligibility" },
    { id: "services", title: "Our Services" },
    { id: "user-data", title: "User Data and Privacy" },
    { id: "responsibilities", title: "User Responsibilities" },
    { id: "community", title: "Community Guidelines" },
    { id: "disclaimer", title: "Medical Disclaimer" },
    { id: "third-party", title: "Third-Party Links" },
    { id: "ip", title: "Intellectual Property" },
    { id: "termination", title: "Account Termination" },
    { id: "modifications", title: "Modifications" },
    { id: "governing-law", title: "Governing Law" },
    { id: "contact", title: "Contact Us" },
  ];

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const { checkAuthStatus, loading } = useCheckAuth();

  useEffect(() => {
    const check = async () => {
      await checkAuthStatus();
    };
    check();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5, rootMargin: "-100px 0px -50% 0px" }
    );

    document.querySelectorAll("section[id]").forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: "smooth",
      });
      setShowMobileToc(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        minWidth: "100vw",
        maxWidth: "100vw",
        bgcolor: "background.default",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      {/* Floating Back to Top Button */}
      <AnimatePresence>
        {showScrollTop && <ScrollTopButton onClick={scrollToTop} />}
      </AnimatePresence>

      {/* Sidebar TOC (Desktop only) - Stable Position */}
      {!isMobile && (
        <Box
          sx={{
            width: 280,
            flexShrink: 0,
            position: "sticky",
            top: 0,
            height: "100vh",
            overflowY: "auto",
            borderRight: `1px solid ${theme.palette.divider}`,
            bgcolor: "background.paper",
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                fontWeight: 600,
                color: "primary.main",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box component="span" sx={{ fontSize: "1.25rem" }}>
                📋
              </Box>
              Table of Contents
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <TableOfContents
              sections={sections}
              activeSection={activeSection}
              scrollToSection={scrollToSection}
            />
          </Paper>
        </Box>
      )}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flex: 1,
          maxWidth: "100%",
          px: { xs: 2.5, sm: 4, md: 6, lg: 8 },
          py: { xs: 3, md: 5 },
          mx: "auto",
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        {/* Mobile TOC Toggle Button */}
        {isMobile && (
          <IconButton
            onClick={() => setShowMobileToc(!showMobileToc)}
            sx={{
              position: "fixed",
              bottom: 16,
              right: 16,
              zIndex: 1100,
              bgcolor: "primary.main",
              color: "primary.contrastText",
              "&:hover": {
                bgcolor: "primary.dark",
              },
              boxShadow: 3,
            }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Container
          maxWidth="md"
          sx={{
            px: { xs: 0, sm: 2 },
            position: "relative",
          }}
        >
          <TermsHeader />

          <motion.div style={{ opacity, scale }}>
            <Paper
              elevation={0}
              sx={{
                mt: 4,
                p: { xs: 2.5, sm: 4 },
                borderRadius: 2,
                bgcolor: "background.paper",
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <TermsSections />
            </Paper>

            <Paper
              elevation={0}
              sx={{
                mt: 4,
                p: { xs: 2.5, sm: 4 },
                borderRadius: 2,
                bgcolor: "background.paper",
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <AcceptanceSection />
            </Paper>
          </motion.div>
        </Container>

        {/* Mobile TOC (Drawer) */}
        {isMobile && (
          <AnimatePresence>
            {showMobileToc && (
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25 }}
                style={{
                  position: "fixed",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  zIndex: 1000,
                }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                    p: 2,
                    bgcolor: "background.paper",
                    display: "flex",
                    flexDirection: "column",
                    maxHeight: "60vh",
                    overflow: "auto",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        color: "primary.main",
                      }}
                    >
                      Jump to Section
                    </Typography>
                    <IconButton
                      onClick={() => setShowMobileToc(false)}
                      size="small"
                    >
                      <Box component="span" sx={{ fontSize: "1rem" }}>
                        ✕
                      </Box>
                    </IconButton>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(120px, 1fr))",
                      gap: 1,
                      pb: 2,
                    }}
                  >
                    {sections.map((section) => (
                      <Box
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        sx={{
                          px: 1.5,
                          py: 1,
                          borderRadius: 1,
                          bgcolor:
                            activeSection === section.id
                              ? "primary.light"
                              : "action.hover",
                          color:
                            activeSection === section.id
                              ? "primary.main"
                              : "text.secondary",
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          textAlign: "center",
                          "&:hover": {
                            bgcolor: "primary.light",
                            color: "primary.main",
                          },
                        }}
                      >
                        {section.title}
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </Box>
    </Box>
  );
};

export default TermsNConditions;
