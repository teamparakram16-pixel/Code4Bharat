import { FC, useEffect, useState, useRef, ComponentType } from "react";
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  Divider,
  useScrollTrigger,
  Fade,
  styled,
  alpha,
  Container,
  useMediaQuery,
  useTheme,
  Grow,
  Zoom,
  CircularProgress,
  ButtonProps,
} from "@mui/material";
import {
  Person as UserIcon,
  Logout as LogOutIcon,
  Close as CloseIcon,
  Home as HomeIcon,
  Feed as FeedIcon,
  FitnessCenter as FitnessIcon,
  Star as StarIcon,
  Search as SearchIcon,
  AddCircle as AddIcon,
  Psychology as PsychologyIcon,
  Edit as EditIcon,
  Notifications as NotificationsIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";
import useApi from "@/hooks/useApi/useApi";
import { toast } from "react-toastify";
import { handleAxiosError } from "@/utils/handleAxiosError";
import { keyframes } from "@emotion/react";
import AyLogo from "@/assets/ay.svg";
import axios from "axios";
import ViewListIcon from '@mui/icons-material/ViewList';
import FavoriteIcon from '@mui/icons-material/Favorite';


// Custom animations
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
`;

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: alpha(theme.palette.background.paper, 0.85),
  backdropFilter: "blur(12px)",
  boxShadow: "0 2px 20px rgba(0, 0, 0, 0.08)",
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  "&.scrolled": {
    boxShadow: theme.shadows[6],
    background: alpha(theme.palette.background.paper, 0.95),
    height: "64px",
    backdropFilter: "blur(16px)",
  },
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 600,
  fontSize: "0.875rem",
  textTransform: "none",
  letterSpacing: "0.02em",
  padding: theme.spacing(1, 2),
  borderRadius: (theme.shape.borderRadius as any) * 2,
  position: "relative",
  overflow: "hidden",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    transform: "translateY(-2px)",
    "&:after": {
      width: "100%",
    },
  },
  "&:after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 0,
    height: 2,
    backgroundColor: theme.palette.primary.main,
    transition: "width 0.3s ease",
  },
  "&.active": {
    color: theme.palette.primary.main,
    "&:after": {
      width: "100%",
    },
  },
})) as any;

// const LogoBox = styled(Box)(() => ({
//   display: "flex",
//   alignItems: "center",
//   textDecoration: "none",
//   transition: "all 0.3s ease",
//   "&:hover": {
//     transform: "scale(1.03)",
//   },
// })) as typeof Box;

const AnimatedLogoIcon = styled("img")(({ theme }) => ({
  width: 44,
  height: 44,
  objectFit: "contain",
  marginRight: theme.spacing(1.5),
  borderRadius: 50,
  background: "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)",
  boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)",
  transition: "all 0.3s ease",
  animation: `${float} 4s ease-in-out infinite`,
  "&:hover": {
    animation: `${pulse} 1s ease infinite`,
    boxShadow: "0 6px 16px rgba(76, 175, 80, 0.4)",
  },
}));

const AnimatedLogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  background: "linear-gradient(45deg, #4CAF50 30%, #2E7D32 90%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  fontSize: "2.1rem",
  letterSpacing: "-0.5px",
  transition: "all 0.3s ease",
  animation: `${pulse} 2.5s infinite`,
  [theme.breakpoints.down("sm")]: {
    fontSize: "1.6rem",
  },
}));

const MobileMenuContainer = styled(Box)(({ theme }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: theme.zIndex.drawer,
  backgroundColor: alpha(theme.palette.background.paper, 0.98),
  backdropFilter: "blur(12px)",
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(2),
  paddingTop: theme.spacing(10),
  overflowY: "auto",
  transform: "translateX(-100%)",
  transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  "&.open": {
    transform: "translateX(0)",
  },
  [theme.breakpoints.up("md")]: {
    display: "none",
  },
}));

const MobileMenuHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingBottom: theme.spacing(2),
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  marginBottom: theme.spacing(2),
}));

type RouterButtonProps = ButtonProps & {
  component?: ComponentType<RouterLinkProps>;
  to: string;
};

const MobileMenuItem = styled(Button)<RouterButtonProps>(({ theme }) => ({
  justifyContent: "flex-start",
  padding: theme.spacing(1.5, 2),
  marginBottom: theme.spacing(1),
  borderRadius: (theme.shape.borderRadius as any) * 2,
  fontWeight: 600,
  fontSize: "1rem",
  textTransform: "none",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateX(5px)",
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
  "&.active": {
    color: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    "& .MuiButton-startIcon": {
      color: theme.palette.primary.main,
    },
  },
})) as any;

const MenuIconButton = styled(IconButton)(({ theme }) => ({
  position: "relative",
  "& .bar": {
    position: "absolute",
    height: 2,
    width: 24,
    background: theme.palette.text.primary,
    borderRadius: 2,
    transition: "all 0.3s ease",
    "&:nth-of-type(1)": {
      top: 10,
      width: 20,
      left: "50%",
      transform: "translateX(-50%)",
    },
    "&:nth-of-type(2)": {
      top: 16,
      width: 24,
      left: "50%",
      transform: "translateX(-50%)",
    },
    "&:nth-of-type(3)": {
      top: 22,
      width: 16,
      left: "50%",
      transform: "translateX(-50%)",
    },
  },
  "&.open": {
    "& .bar": {
      "&:nth-of-type(1)": {
        transform: "translateX(-50%) rotate(45deg)",
        top: 16,
        width: 24,
      },
      "&:nth-of-type(2)": {
        opacity: 0,
      },
      "&:nth-of-type(3)": {
        transform: "translateX(-50%) rotate(-45deg)",
        top: 16,
        width: 24,
      },
    },
  },
}));

const PageNavBar: FC = () => {
  const { get } = useApi();
  const [userName, setUserName] = useState<string | null>(null);
  const [expertName, setExpertName] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { role, isLoggedIn, setRole, setIsLoggedIn } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [_notificationsAnchorEl, setNotificationsAnchorEl] =
    useState<null | HTMLElement>(null);
  const [logOutLoad, setLogOutLoad] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const appBarRef = useRef<HTMLDivElement>(null);

  const user: any = "";

  const scrolled = useScrollTrigger({
    disableHysteresis: true,
    threshold: 10,
    target: window,
  });

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== hasScrolled) {
        setHasScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasScrolled]);

  useEffect(() => {
    if (!isLoggedIn || role !== "user") return;
    async function fetchUser() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/users/user-profile`, {
          withCredentials: true,
        });
        setUserName(res.data.user.profile.fullName);
      } catch (error) {
        console.error(error);
      }
    }
    fetchUser();
  }, [isLoggedIn, role]);

  useEffect(() => {
    if (!isLoggedIn || role !== "expert") return;
    async function fetchExpert() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/experts/expert-profile`, {
          withCredentials: true,
        });
        setExpertName(res.data.expert.profile.fullName);
      } catch (error) {
        console.error(error);
      }
    }
    fetchExpert();
  }, [isLoggedIn, role]);


  useEffect(() => {
    // Close mobile menu when route changes
    setMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    // Disable body scroll when mobile menu is open
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setNotificationsAnchorEl(null);
  };

  if (isLoggedIn === undefined) {
    return null;
  }

  const common = [
    { href: "/", label: "Home", icon: <HomeIcon fontSize="small" /> },
    {
      href: "/gposts",
      label: "Health Feed",
      icon: <FeedIcon fontSize="small" />,
    },
    {
      href: "/routines",
      label: "Routines",
      icon: <FitnessIcon fontSize="small" />,
    },
    {
      href: "/success-stories",
      label: "Success Stories",
      icon: <StarIcon fontSize="small" />,
    },
    {
      href: "/ai-query",
      label: "AI Query",
      icon: <SearchIcon fontSize="small" />,
    },
  ];

  const navLinks = {
    expert: [
      ...common,
      {
        href: "/expert/posts/create",
        label: "Create Post",
        icon: <AddIcon fontSize="small" />,
      },
    ],
    user: [
      ...common,
      {
        href: "/prakrithi/analysis",
        label: "Prakrithi",
        icon: <PsychologyIcon fontSize="small" />,
      },
      {
        href: "/user/success-stories/create",
        label: "Share Story",
        icon: <EditIcon fontSize="small" />,
      },
    ],
    noUser: [
      { href: "/", label: "Home", icon: <HomeIcon fontSize="small" /> },
      { href: "/auth", label: "Login", icon: <UserIcon fontSize="small" /> },
      {
        href: "/auth?signUpRedirect=true",
        label: "Sign Up",
        icon: <UserIcon fontSize="small" />,
      },
    ],
  };
  const currentLinks =
    navLinks[role !== undefined && isLoggedIn === true ? role : "noUser"];

  const logout = async () => {
    try {
      setLogOutLoad(true);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Add 2s delay
      const response = await get(
        `${import.meta.env.VITE_SERVER_URL}/api/auth/logout`
      );
      if (response.success) {
        toast.success("Logged out successfully");
      }
      setLogOutLoad(false);
      handleMenuClose();
      setRole(undefined);
      setIsLoggedIn(false);
      navigate("/");
    } catch (error) {
      handleAxiosError(error);
      setLogOutLoad(false);
    }
  };
  const isActive = (path: string) => {
    // Check for sign-up paths
    if (
      path === "/auth?signUpRedirect=true" &&
      location.search.includes("signUpRedirect=true")
    ) {
      return true;
    } // Check for regular paths
    if (path === "/auth") {
      return (
        location.pathname === "/auth" &&
        !location.search.includes("signUpRedirect")
      );
    }

    return location.pathname === path;
  };

  return (
    <>
      <StyledAppBar
        className={scrolled ? "scrolled" : ""}
        elevation={0}
        ref={appBarRef}
      >
        <Container maxWidth="xl">
          <Toolbar
            sx={{
              justifyContent: "space-between",
              px: { xs: 0, sm: 2 },
              py: scrolled ? 1 : 1.5,
              transition: "all 0.3s ease",
            }}
          >
            {/* Logo and App Name */}
            <Box
              component={RouterLink}
              to="/"
              sx={{ display: "flex", alignItems: "center", textDecoration: "none" }}
            >
              <AnimatedLogoIcon src={AyLogo} alt="ArogyaPath Icon" />
              <AnimatedLogoText variant="h6">ArogyaPath</AnimatedLogoText>
            </Box>

            {/* Desktop Navigation */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 1,
                ml: 4,
              }}
            >
              {currentLinks.map((link, index) => (
                <Grow in timeout={index * 100 + 300} key={link.href}>
                  <Box>
                    <NavButton
                      component={RouterLink}
                      to={link.href}
                      startIcon={link.icon}
                      className={isActive(link.href) ? "active" : ""}
                      sx={{
                        mx: 0.5,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {link.label}
                    </NavButton>
                  </Box>
                </Grow>
              ))}
            </Box>

            {/* User Controls */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {role && !isMobile && (
                <>
                  {/* Notifications can be added here if needed */}
                </>
              )}

              {role ? (
                <>
                  <Zoom in>
                    <IconButton
                      onClick={handleMenuOpen}
                      size="medium"
                      sx={{
                        ml: 1,
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        "&:hover": {
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.2
                          ),
                          transform: "scale(1.1)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "scale(1.1)",
                          },
                        }}
                        src={user?.avatar}
                      >
                        {user?.name?.[0]?.toUpperCase() || <UserIcon />}
                      </Avatar>
                    </IconButton>
                  </Zoom>
                  <Menu
                    id="profile-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                      elevation: 4,
                      sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 4px 24px rgba(0,0,0,0.16))",
                        mt: 1.5,
                        minWidth: 220,
                        borderRadius: 2,
                        "& .MuiAvatar-root": {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        "&:before": {
                          content: '""',
                          display: "block",
                          position: "absolute",
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: "background.paper",
                          transform: "translateY(-50%) rotate(45deg)",
                          zIndex: 0,
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                    TransitionComponent={Grow}
                  >
                    {role === "expert" ? (
                      <MenuItem
                        onClick={() => {
                          handleMenuClose();
                          navigate("/expert/profile");
                        }}
                        sx={{ py: 1.5 }}
                      >
                        <Avatar src={user?.avatar} />
                        <Box ml={1}>
                          <Typography variant="subtitle2">
                            {expertName || "Expert"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            View Expert Profile
                          </Typography>
                        </Box>
                      </MenuItem>
                    ) : (
                      <MenuItem
                        onClick={() => {
                          handleMenuClose();
                          navigate("/user/profile");
                        }}
                        sx={{ py: 1.5 }}
                      >
                        <Avatar src={user?.avatar} />
                        <Box ml={1}>
                          <Typography variant="subtitle2">
                            {userName || "User"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            View Profile
                          </Typography>
                        </Box>
                      </MenuItem>
                    )}

                    <Divider />
                    {role === "expert" ? (
                      <MenuItem
                        onClick={() => {
                          handleMenuClose();
                          navigate("/u/appointments");
                        }}
                        sx={{ py: 1.5 }}
                      >
                        <CalendarIcon
                          sx={{ mr: 1.5, color: "text.secondary" }}
                        />
                        <Typography variant="body2">My Appointments</Typography>
                      </MenuItem>
                    ) : (
                      <MenuItem
                        onClick={() => {
                          handleMenuClose();
                          navigate("/u/appointments");
                        }}
                        sx={{ py: 1.5 }}
                      >
                        <CalendarIcon
                          sx={{ mr: 1.5, color: "text.secondary" }}
                        />
                        <Typography variant="body2">My Appointments</Typography>
                      </MenuItem>
                    )}
                    <MenuItem
                      onClick={() => {
                        handleMenuClose();
                        navigate("/myposts");
                      }}
                      sx={{ py: 1.5 }}
                    >
                      <ViewListIcon
                        sx={{ mr: 1.5, color: "text.secondary" }}
                      />
                      <Typography variant="body2">View my posts</Typography>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleMenuClose();
                        navigate("/likedposts");
                      }}
                      sx={{ py: 1.5 }}
                    >
                      <FavoriteIcon color="error"
                        sx={{ mr: 1.5, color: "text.secondary" }}
                      />
                      <Typography variant="body2">Likes & Bookmarks</Typography>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleMenuClose();
                        navigate("/u/chat-requests/received");
                      }}
                      sx={{ py: 1.5 }}
                    >
                      <NotificationsIcon
                        sx={{ mr: 1.5, color: "text.secondary" }}
                      />
                      <Typography variant="body2">Received Requests</Typography>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleMenuClose();
                        navigate("/u/chat-requests/sent");
                      }}
                      sx={{ py: 1.5 }}
                    >
                      <NotificationsIcon
                        sx={{ mr: 1.5, color: "text.secondary" }}
                      />
                      <Typography variant="body2">Sent Requests</Typography>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleMenuClose();
                        navigate("/u/chats");
                      }}
                      sx={{ py: 1.5 }}
                    >
                      <UserIcon sx={{ mr: 1.5, color: "text.secondary" }} />
                      <Typography variant="body2">Your Chats</Typography>
                    </MenuItem>
                    <Divider />
                    <MenuItem
                      onClick={logout}
                      disabled={logOutLoad}
                      sx={{ py: 1.5 }}
                    >
                      {logOutLoad ? (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          <CircularProgress
                            size={16}
                            thickness={5}
                            sx={{ mr: 1.5 }}
                          />
                          <Typography variant="body2">
                            Logging out...
                          </Typography>
                        </Box>
                      ) : (
                        <>
                          <LogOutIcon
                            sx={{ mr: 1.5, color: "text.secondary" }}
                          />
                          <Typography variant="body2">Logout</Typography>
                        </>
                      )}
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                !isMobile && (
                  <>
                    <Grow in timeout={300}>
                      <Button
                        component={RouterLink}
                        to="/auth"
                        variant="text"
                        sx={{
                          fontWeight: 600,
                          ml: 1,
                          display: { xs: "none", sm: "flex" },
                          "&:hover": {
                            transform: "translateY(-2px)",
                          },
                          transition: "all 0.3s ease",
                        }}
                      >
                        Login
                      </Button>
                    </Grow>
                    <Grow in timeout={400}>
                      <Button
                        component={RouterLink}
                        to="/auth?signUpRedirect=true"
                        variant="contained"
                        color="primary"
                        sx={{
                          fontWeight: 600,
                          ml: 1,
                          boxShadow: "none",
                          "&:hover": {
                            boxShadow: "0 4px 16px rgba(76, 175, 80, 0.4)",
                            transform: "translateY(-2px)",
                          },
                          transition: "all 0.3s ease",
                          display: { xs: "none", sm: "flex" },
                        }}
                      >
                        Sign Up
                      </Button>
                    </Grow>
                  </>
                )
              )}

              {/* Mobile Menu Button */}
              <MenuIconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                className={mobileMenuOpen ? "open" : ""}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                sx={{
                  display: { md: "none" },
                  ml: 1,
                  backgroundColor: mobileMenuOpen
                    ? alpha(theme.palette.primary.main, 0.1)
                    : "transparent",
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                <span className="bar" />
                <span className="bar" />
                <span className="bar" />
              </MenuIconButton>
            </Box>
          </Toolbar>
        </Container>
      </StyledAppBar>

      {/* Mobile Menu */}
      <MobileMenuContainer className={mobileMenuOpen ? "open" : ""}>
        <MobileMenuHeader>
          <Box
            component={RouterLink}
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
          >
            <AnimatedLogoIcon src={AyLogo} alt="ArogyaPath Icon" />
            <AnimatedLogoText variant="h6">ArogyaPath</AnimatedLogoText>
          </Box>
          <IconButton onClick={() => setMobileMenuOpen(false)}>
            <CloseIcon />
          </IconButton>
        </MobileMenuHeader>

        {currentLinks.map((link, index) => (
          <Fade in timeout={index * 100 + 200} key={link.href}>
            <Box>
              <MobileMenuItem
                component={RouterLink}
                to={link.href}
                startIcon={link.icon}
                fullWidth
                className={isActive(link.href) ? "active" : ""}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </MobileMenuItem>
            </Box>
          </Fade>
        ))}

        {role && (
          <>
            <Fade in timeout={currentLinks.length * 100 + 300}>
              <Divider sx={{ my: 2 }} />
            </Fade>
            <Fade in timeout={currentLinks.length * 100 + 400}>
              <MobileMenuItem
                startIcon={<UserIcon />}
                component={RouterLink}
                fullWidth
                onClick={() => {
                  // navigate("/profile");
                  setMobileMenuOpen(false);
                }}
              >
                My Profile
              </MobileMenuItem>
            </Fade>
            <Fade in timeout={currentLinks.length * 100 + 401}>
              <MobileMenuItem
                startIcon={<NotificationsIcon />}
                component={RouterLink}
                to="/u/chat-requests/received"
                fullWidth
                onClick={() => setMobileMenuOpen(false)}
              >
                Received Requests
              </MobileMenuItem>
            </Fade>
            <Fade in timeout={currentLinks.length * 100 + 402}>
              <MobileMenuItem
                startIcon={<NotificationsIcon />}
                component={RouterLink}
                to="/u/chat-requests/sent"
                fullWidth
                onClick={() => setMobileMenuOpen(false)}
              >
                Sent Requests
              </MobileMenuItem>
            </Fade>
            <Fade in timeout={currentLinks.length * 100 + 403}>
              <MobileMenuItem
                startIcon={<UserIcon />}
                component={RouterLink}
                to="/u/chats"
                fullWidth
                onClick={() => setMobileMenuOpen(false)}
              >
                Your Chats
              </MobileMenuItem>
            </Fade>
            <Fade in timeout={currentLinks.length * 100 + 500}>
              <MobileMenuItem
                startIcon={
                  logOutLoad ? (
                    <CircularProgress size={16} thickness={5} />
                  ) : (
                    <LogOutIcon />
                  )
                }
                fullWidth
                onClick={async () => {
                  setMobileMenuOpen(true); // keep menu open
                  await logout(); // wait for logout to finish
                  setMobileMenuOpen(false); // close after logout
                }}
                disabled={logOutLoad}
                sx={{
                  color: logOutLoad ? "text.secondary" : "error.main",
                  position: "relative",
                }}
              >
                {logOutLoad ? (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      width: "100%",
                      justifyContent: "center",
                    }}
                  >
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      Logging out...
                    </Typography>
                  </Box>
                ) : (
                  "Logout"
                )}
              </MobileMenuItem>
            </Fade>
          </>
        )}

        {!role && (
          <>
            <Fade in timeout={currentLinks.length * 100 + 300}>
              <Divider sx={{ my: 2 }} />
            </Fade>
            <Fade in timeout={currentLinks.length * 100 + 400}>
              <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                <Button
                  component={RouterLink}
                  to="/auth"
                  variant="outlined"
                  fullWidth
                  sx={{
                    py: 1.5,
                    fontWeight: 600,
                    "&:hover": {
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Button>
                <Button
                  component={RouterLink}
                  to="/auth?signUpRedirect=true"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{
                    py: 1.5,
                    fontWeight: 600,
                    boxShadow: "none",
                    "&:hover": {
                      boxShadow: "0 4px 16px rgba(76, 175, 80, 0.4)",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Button>
              </Box>
            </Fade>
          </>
        )}
      </MobileMenuContainer>
    </>
  );
};

export default PageNavBar;