import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Divider,
  Link,
  useTheme,
  useMediaQuery,
  Paper,
  Container,
  Chip,
} from "@mui/material";
import { motion } from "framer-motion";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CookieIcon from "@mui/icons-material/Cookie";
import useCheckAuth from "@/hooks/auth/useCheckAuth/useCheckAuth";
import Loader from "@/components/Loader";

const CookiePolicy: React.FC = () => {
  const { checkAuthStatus, loading } = useCheckAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const cookieTypes = [
    {
      type: "Essential",
      color: "success",
      description: "Necessary for basic operations of the site",
    },
    {
      type: "Performance",
      color: "info",
      description: "Help us understand how visitors use the site",
    },
    {
      type: "Functional",
      color: "secondary",
      description: "Remember your preferences and choices",
    },
    {
      type: "Advertising",
      color: "warning",
      description: "Track activity to provide personalized ads",
    },
  ];

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
        position: "relative",
        overflowX: "hidden",
        pt: 8,
        pb: 10,
      }}
    >
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
                p: 3,
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
              <CookieIcon fontSize="large" />
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
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Cookie Policy
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
            Last updated: June 2025 • We value your privacy
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
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
                  About Cookies
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Typography
                  variant="body1"
                  sx={{ lineHeight: 1.8, fontSize: "1.05rem" }}
                >
                  Cookies are small text files stored on your device when you
                  visit websites. They help websites remember information about
                  your visit, which can make it easier to visit the site again
                  and make the site more useful to you.
                </Typography>
              </Box>
            </motion.div>

            {/* How We Use Cookies */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.1 }}
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
                  How We Use Cookies
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Typography
                  variant="body1"
                  sx={{ lineHeight: 1.8, fontSize: "1.05rem", mb: 3 }}
                >
                  Our website uses cookies to:
                </Typography>
                <ListWithIcons
                  items={[
                    "Enable core functionality like session management and security",
                    "Analyze site usage and performance to improve our services",
                    "Personalize content and remember your preferences",
                    "Deliver targeted advertisements based on your interests",
                  ]}
                />
              </Box>
            </motion.div>

            {/* Types of Cookies */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.2 }}
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
                  Types of Cookies We Use
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    "& > *": {
                      width: { xs: "100%", sm: "calc(50% - 16px)" },
                      minWidth: 0,
                    },
                  }}
                >
                  {cookieTypes.map((cookie, index) => {
                    // Helper to safely get palette color
                    let paletteColor = theme.palette.primary;
                    if (cookie.color === "success" && theme.palette.success)
                      paletteColor = theme.palette.success;
                    if (cookie.color === "info" && theme.palette.info)
                      paletteColor = theme.palette.info;
                    if (cookie.color === "secondary" && theme.palette.secondary)
                      paletteColor = theme.palette.secondary;
                    if (cookie.color === "warning" && theme.palette.warning)
                      paletteColor = theme.palette.warning;
                    const mainColor =
                      paletteColor && "main" in paletteColor
                        ? paletteColor.main
                        : theme.palette.primary.main;
                    const lightColor =
                      paletteColor && "light" in paletteColor
                        ? paletteColor.light
                        : mainColor;
                    return (
                      <Paper
                        key={index}
                        elevation={0}
                        sx={{
                          p: 3,
                          height: "100%",
                          borderLeft: `4px solid ${mainColor}`,
                          bgcolor:
                            theme.palette.mode === "light"
                              ? `${lightColor}20`
                              : theme.palette.background.paper,
                          borderRadius: 2,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: 1.5,
                          }}
                        >
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              bgcolor: `${mainColor}20`,
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              mr: 2,
                            }}
                          >
                            <CookieIcon sx={{ color: mainColor }} />
                          </Box>
                          <Typography
                            variant="h6"
                            fontWeight={600}
                            sx={{ color: mainColor }}
                          >
                            {cookie.type}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
                          {cookie.description}
                        </Typography>
                      </Paper>
                    );
                  })}
                </Box>
              </Box>
            </motion.div>

            {/* Third-Party Cookies */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.3 }}
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
                  Third-Party Cookies
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Typography
                  variant="body1"
                  sx={{ lineHeight: 1.8, fontSize: "1.05rem", mb: 2 }}
                >
                  We may use services from trusted partners that place cookies
                  on your device:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
                  {[
                    "Google Analytics",
                    "Facebook Pixel",
                    "Hotjar",
                    "LinkedIn Insight",
                  ].map((service, i) => (
                    <Chip
                      key={i}
                      label={service}
                      size="small"
                      sx={{
                        bgcolor: "action.hover",
                        color: "text.primary",
                        fontWeight: 500,
                      }}
                    />
                  ))}
                </Box>
                <Typography
                  variant="body1"
                  sx={{ lineHeight: 1.8, fontSize: "1.05rem" }}
                >
                  These cookies are governed by the respective privacy policies
                  of these third parties.
                </Typography>
              </Box>
            </motion.div>

            {/* Cookie Management */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.4 }}
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
                  Managing Your Cookie Preferences
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Typography
                  variant="body1"
                  sx={{ lineHeight: 1.8, fontSize: "1.05rem", mb: 3 }}
                >
                  You have control over cookies. Here's how to manage them:
                </Typography>
                <Box
                  sx={{
                    bgcolor: "action.hover",
                    borderRadius: 2,
                    p: 3,
                    mb: 3,
                  }}
                >
                  <ListWithIcons
                    items={[
                      "Browser Settings: Most browsers allow you to refuse or delete cookies",
                      "Opt-Out Tools: For advertising cookies, use tools like YourAdChoices",
                      "Essential Cookies: Cannot be disabled as they are required for site operation",
                    ]}
                  />
                </Box>
                <Typography
                  variant="body1"
                  sx={{ lineHeight: 1.8, fontSize: "1.05rem" }}
                >
                  For detailed instructions on managing cookies, visit{" "}
                  <Link
                    href="https://www.aboutcookies.org/how-to-control-cookies/"
                    target="_blank"
                    rel="noopener noreferrer"
                    color="secondary"
                    underline="hover"
                    sx={{
                      fontWeight: 600,
                      "&:hover": {
                        color: "secondary.dark",
                      },
                    }}
                  >
                    AboutCookies.org
                  </Link>
                  .
                </Typography>
              </Box>
            </motion.div>

            {/* Policy Updates */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.5 }}
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
                  Policy Updates
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Typography
                  variant="body1"
                  sx={{ lineHeight: 1.8, fontSize: "1.05rem" }}
                >
                  We may update this Cookie Policy periodically. When we do,
                  we'll revise the "last updated" date at the top of this page.
                  We encourage you to review this policy regularly to stay
                  informed about how we use cookies.
                </Typography>
              </Box>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.6 }}
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
                  Contact Us
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Typography
                  variant="body1"
                  sx={{ lineHeight: 1.8, fontSize: "1.05rem" }}
                >
                  If you have any questions about our use of cookies, please
                  contact us at{" "}
                  <Link
                    href="mailto:teamparakram16@gmail.com"
                    color="secondary"
                    underline="hover"
                    sx={{
                      fontWeight: 600,
                      "&:hover": {
                        color: "secondary.dark",
                      },
                    }}
                  >
                    teamparakram16@gmail.com
                  </Link>
                  .
                </Typography>
              </Box>
            </motion.div>
          </Box>
        </Paper>
      </Container>
      {/* Cookie Declaration Embed */}
      <Box sx={{ mt: 6 }}>
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
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Box>
          {/* Only load CookieDeclaration in production */}
          {window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' && (
            <div
              dangerouslySetInnerHTML={{
                __html: `<script id="CookieDeclaration" src="https://consent.cookiebot.com/${
                  import.meta.env.VITE_COOKIEBOT_ID
                }/cd.js" type="text/javascript" async></script>`,
              }}
            />
          )}
          {(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && (
            <div style={{ padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
              <p><strong>Development Mode:</strong> Cookie policy declaration is disabled in development environment.</p>
              <p>This will be enabled automatically in production.</p>
            </div>
          )}
        </Box>
      </Box>
    </Box>
  );
};

interface ListWithIconsProps {
  items: string[];
}

const ListWithIcons: React.FC<ListWithIconsProps> = ({ items }) => {
  // const theme = useTheme();

  return (
    <Box
      component="ul"
      sx={{
        pl: 0,
        mb: 0,
        listStyleType: "none",
      }}
    >
      {items.map((item, i) => (
        <Box
          component="li"
          key={i}
          sx={{
            display: "flex",
            alignItems: "flex-start",
            mb: 2,
            "&:last-child": {
              mb: 0,
            },
          }}
        >
          <CheckCircleOutlineIcon
            fontSize="small"
            sx={{
              color: "primary.main",
              mt: "4px",
              mr: 2,
              flexShrink: 0,
            }}
          />
          <Typography
            variant="body1"
            sx={{
              lineHeight: 1.7,
              color: "text.primary",
            }}
          >
            {item}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default CookiePolicy;
