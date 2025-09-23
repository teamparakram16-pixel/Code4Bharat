import React, { useEffect } from "react";
import { ShieldCheck } from "lucide-react";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { useNavigate } from "react-router-dom";
import {
  useMediaQuery,
  useTheme,
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  // Button,
  ListItemIcon,
  Divider,
  Link,
  Container,
} from "@mui/material";
import { FiberManualRecord as BulletPointIcon } from "@mui/icons-material";
import { motion } from "framer-motion";
import useCheckAuth from "@/hooks/auth/useCheckAuth/useCheckAuth";
import Loader from "@/components/Loader";

const PrivacyPolicy: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { checkAuthStatus, loading } = useCheckAuth();
  const sectionVariants = {
    offscreen: {
      y: 20,
      opacity: 0,
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8,
      },
    },
  };

  useEffect(() => {
    const check = async () => {
      await checkAuthStatus();
    };
    check();
  }, []);

  if (loading) return <Loader />;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        minWidth: "100vw",
        maxWidth: "100vw",
        background: theme.palette.background.default,
        color: theme.palette.text.primary,
        position: "relative",
        overflowX: "hidden",
        pt: 8,
        pb: 10,
      }}
    >
      {/* Floating Back Button */}
      {/* <Fade in={trigger}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/")}
          variant="contained"
          color="primary"
          sx={{
            textTransform: "none",
            fontWeight: 700,
            borderRadius: 3,
            px: 3,
            py: 1.5,
            fontSize: "0.9375rem",
            boxShadow: theme.shadows[4],
            transition: "all 0.3s ease",
            position: "fixed",
            top: 20,
            left: 20,
            zIndex: 1000,
            "&:hover": {
              bgcolor: "primary.dark",
              transform: "scale(1.03)",
              boxShadow: theme.shadows[8],
            },
            display: isMobile ? "none" : "flex",
          }}
        >
          Back to Home
        </Button>
      </Fade> */}

      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            mb: 6,
            position: "relative",
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Box
              sx={{
                bgcolor: "primary.main",
                p: 2.5,
                borderRadius: "50%",
                color: "common.white",
                boxShadow: `0 8px 32px rgba(0, 123, 255, 0.3)`,
                mb: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 80,
                height: 80,
              }}
            >
              <ShieldCheck size={36} strokeWidth={2} />
            </Box>
          </motion.div>

          <Typography
            variant={isMobile ? "h3" : "h2"}
            sx={{
              fontWeight: 800,
              color: "primary.main",
              mb: 1,
              lineHeight: 1.2,
              letterSpacing: "-0.5px",
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Privacy Policy
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: "text.secondary",
              letterSpacing: 0.5,
              maxWidth: 600,
              lineHeight: 1.6,
            }}
          >
            Last updated: July 2025 • Protecting your data is our top priority
          </Typography>
        </Box>

        {/* Main Content */}
        <Paper
          elevation={isMobile ? 1 : 3}
          sx={{
            borderRadius: 4,
            p: { xs: 3, sm: 4, md: 6 },
            bgcolor: "background.paper",
            border: `1px solid ${theme.palette.divider}`,
            overflow: "hidden",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 6,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            },
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {/* Introduction */}
            <motion.div
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.2 }}
              variants={sectionVariants}
            >
              <Box>
                <Typography
                  variant={isMobile ? "h5" : "h4"}
                  sx={{
                    fontWeight: 700,
                    color: "text.primary",
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      bgcolor: "primary.main",
                      borderRadius: "50%",
                    }}
                  />
                  Introduction
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Typography
                  variant="body1"
                  sx={{ lineHeight: 1.8, fontSize: "1.05rem" }}
                >
                  At <strong>Arogyapath</strong>, your privacy matters. This
                  policy describes how we collect, use, and protect your data
                  when you use our services. We're committed to maintaining the
                  trust and confidence of our users.
                </Typography>
              </Box>
            </motion.div>

            {/* What We Collect */}
            <motion.div
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.2 }}
              variants={sectionVariants}
            >
              <Box>
                <Typography
                  variant={isMobile ? "h5" : "h4"}
                  sx={{
                    fontWeight: 700,
                    color: "text.primary",
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      bgcolor: "primary.main",
                      borderRadius: "50%",
                    }}
                  />
                  1. What We Collect
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <List
                  dense
                  sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                >
                  {[
                    "Name, email, and contact details",
                    "Health-related data you choose to provide",
                    "Device, browser, and usage information",
                    "Cookies and similar tracking technologies",
                    "Location data (if enabled)",
                  ].map((item, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        px: 0,
                        py: 0.5,
                        alignItems: "flex-start",
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 32, mt: "4px" }}>
                        <BulletPointIcon
                          fontSize="small"
                          sx={{ color: "primary.main" }}
                        />
                      </ListItemIcon>
                      <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                        {item}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </motion.div>

            {/* How We Use It */}
            <motion.div
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.2 }}
              variants={sectionVariants}
            >
              <Box>
                <Typography
                  variant={isMobile ? "h5" : "h4"}
                  sx={{
                    fontWeight: 700,
                    color: "text.primary",
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      bgcolor: "primary.main",
                      borderRadius: "50%",
                    }}
                  />
                  2. How We Use It
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <List
                  dense
                  sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                >
                  {[
                    "To personalize your experience and health suggestions",
                    "To improve service performance and reliability",
                    "To send important updates and health information",
                    "For security and fraud prevention",
                    "To comply with legal obligations",
                  ].map((item, index) => (
                    <ListItem
                      key={index}
                      sx={{ px: 0, py: 0.5, alignItems: "flex-start" }}
                    >
                      <ListItemIcon sx={{ minWidth: 32, mt: "4px" }}>
                        <BulletPointIcon
                          fontSize="small"
                          sx={{ color: "primary.main" }}
                        />
                      </ListItemIcon>
                      <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                        {item}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </motion.div>

            {/* Data Protection */}
            <motion.div
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.2 }}
              variants={sectionVariants}
            >
              <Box>
                <Typography
                  variant={isMobile ? "h5" : "h4"}
                  sx={{
                    fontWeight: 700,
                    color: "text.primary",
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      bgcolor: "primary.main",
                      borderRadius: "50%",
                    }}
                  />
                  3. Data Protection
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Typography
                  variant="body1"
                  sx={{ lineHeight: 1.8, fontSize: "1.05rem", mb: 2 }}
                >
                  We implement industry-standard security measures to protect
                  your data, including:
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 2,
                    mb: 3,
                  }}
                >
                  {[
                    "SSL/TLS encryption",
                    "Regular security audits",
                    "Access controls",
                    "Data anonymization",
                  ].map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        bgcolor: "action.hover",
                        borderRadius: 2,
                        p: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          bgcolor: "primary.light",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "primary.main",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                        }}
                      >
                        ✓
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {item}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                <Typography
                  variant="body1"
                  sx={{ lineHeight: 1.8, fontSize: "1.05rem" }}
                >
                  While we use secure practices to protect your data, please
                  note that no method of transmission over the Internet is 100%
                  secure.
                </Typography>
              </Box>
            </motion.div>

            {/* Sharing Policy */}
            <motion.div
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.2 }}
              variants={sectionVariants}
            >
              <Box>
                <Typography
                  variant={isMobile ? "h5" : "h4"}
                  sx={{
                    fontWeight: 700,
                    color: "text.primary",
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      bgcolor: "primary.main",
                      borderRadius: "50%",
                    }}
                  />
                  4. Sharing Policy
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Typography
                  variant="body1"
                  sx={{ lineHeight: 1.8, fontSize: "1.05rem" }}
                >
                  We do not sell your personal data. Limited data may be shared
                  with:
                </Typography>
                <Box
                  sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, my: 2 }}
                >
                  {[
                    "Trusted service providers",
                    "Healthcare professionals (with consent)",
                    "Legal authorities when required",
                  ].map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        bgcolor: "primary.light",
                        color: "primary.contrastText",
                        px: 2,
                        py: 1,
                        borderRadius: 20,
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                      }}
                    >
                      {item}
                    </Box>
                  ))}
                </Box>
              </Box>
            </motion.div>

            {/* Your Rights */}
            <motion.div
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.2 }}
              variants={sectionVariants}
            >
              <Box>
                <Typography
                  variant={isMobile ? "h5" : "h4"}
                  sx={{
                    fontWeight: 700,
                    color: "text.primary",
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      bgcolor: "primary.main",
                      borderRadius: "50%",
                    }}
                  />
                  5. Your Rights
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Typography
                  variant="body1"
                  sx={{ lineHeight: 1.8, fontSize: "1.05rem", mb: 2 }}
                >
                  You have the right to:
                </Typography>
                <List dense sx={{ mb: 3 }}>
                  {[
                    "Access your personal data",
                    "Request correction of inaccurate data",
                    "Request deletion of your data",
                    "Object to processing of your data",
                    "Request data portability",
                  ].map((item, index) => (
                    <ListItem
                      key={index}
                      sx={{ px: 0, py: 0.5, alignItems: "flex-start" }}
                    >
                      <ListItemIcon sx={{ minWidth: 32, mt: "4px" }}>
                        <BulletPointIcon
                          fontSize="small"
                          sx={{ color: "primary.main" }}
                        />
                      </ListItemIcon>
                      <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                        {item}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
                <Typography
                  variant="body1"
                  sx={{ lineHeight: 1.8, fontSize: "1.05rem" }}
                >
                  To exercise these rights, please contact us at{" "}
                  <Link
                    href="mailto:teamparakram16@gmail.com"
                    color="primary"
                    underline="hover"
                    sx={{ fontWeight: 600 }}
                  >
                    teamparakram16@gmail.com
                  </Link>
                  . We respond to all requests within 30 days.
                </Typography>
              </Box>
            </motion.div>

            {/* Policy Updates */}
            <motion.div
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.2 }}
              variants={sectionVariants}
            >
              <Box>
                <Typography
                  variant={isMobile ? "h5" : "h4"}
                  sx={{
                    fontWeight: 700,
                    color: "text.primary",
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      bgcolor: "primary.main",
                      borderRadius: "50%",
                    }}
                  />
                  6. Policy Updates
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Typography
                  variant="body1"
                  sx={{ lineHeight: 1.8, fontSize: "1.05rem" }}
                >
                  We may occasionally update this policy to reflect changes in
                  our practices or for other operational, legal, or regulatory
                  reasons. We will notify you of any material changes by posting
                  the new policy on our website with a new "Last updated" date.
                  Your continued use of our services after any changes
                  constitutes your acceptance of the updated policy.
                </Typography>
              </Box>
            </motion.div>
          </Box>
        </Paper>

        {/* Mobile Back Button */}
        {/* {isMobile && (
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/")}
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 3,
              py: 1.5,
              mt: 4,
              boxShadow: theme.shadows[4],
              "&:hover": {
                bgcolor: "primary.dark",
              },
            }}
          >
            Back to Home
          </Button>
        )} */}
      </Container>
    </Box>
  );
};

export default PrivacyPolicy;
