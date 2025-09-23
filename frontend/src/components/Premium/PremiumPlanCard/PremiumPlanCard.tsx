// PremiumPlanCard.tsx
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  Button,
  CircularProgress,
  Badge,
  useTheme,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import StarIcon from "@mui/icons-material/Star";
import { PremiumPlanCardProps } from "./PremiumPlanCard.types";

// Map plan number to MUI button color
const premiumNoToColor: Record<number, "primary" | "secondary" | "warning"> = {
  1: "warning",
  2: "secondary",
  3: "primary",
};

const PremiumPlanCard: React.FC<PremiumPlanCardProps> = ({
  plan,
  isCurrent,
  isLoading,
  onChoose,
  activePlanId,
  currentPlanId,
}) => {
  const theme = useTheme();

  // Apply bigger size if isCurrent
  const cardWidth = isCurrent
    ? { xs: "100%", sm: 360 }
    : { xs: "100%", sm: 320 };
  const cardHeight = isCurrent ? { xs: 520, sm: 520 } : { xs: 500, sm: 500 };

  return (
    <Box
      sx={{
        width: cardWidth,
        height: cardHeight,
        position: "relative",
        boxShadow: isCurrent
          ? `0 0 0 3px ${theme.palette.primary.light}, 0 8px 20px -5px rgba(0,0,0,0.10)`
          : "0 6px 16px -5px rgba(0,0,0,0.04)",
        background: isCurrent
          ? `linear-gradient(130deg, ${theme.palette.primary.light}22 0%, #fff 100%)`
          : "#fff",
        borderRadius: 3,
        border: isCurrent
          ? `2px solid ${theme.palette.primary.main}`
          : `1px solid ${theme.palette.divider}`,
        transition: "transform 0.3s, box-shadow 0.3s, border 0.2s",
        mb: { xs: 3, sm: 0 },
        "&:hover": {
          transform: isCurrent ? "scale(1.01)" : "translateY(-7px)",
        },
      }}
    >
      {plan.popular && (
        <Badge
          badgeContent={
            <Box display="flex" alignItems="center">
              <StarIcon fontSize="small" />
              <Typography variant="caption" sx={{ ml: 0.5 }}>
                Popular
              </Typography>
            </Box>
          }
          color="secondary"
          sx={{
            position: "absolute",
            top: -10,
            right: 20,
            "& .MuiBadge-badge": {
              borderRadius: 2,
              px: 1.5,
              py: 0.5,
              height: 28,
            },
          }}
        />
      )}
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          boxShadow: "none",
          background: "transparent",
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography
            variant="h5"
            component="h3"
            gutterBottom
            sx={{ fontWeight: 700, color: theme.palette.primary.main }}
          >
            {plan.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {plan.description}
          </Typography>
          <Divider sx={{ my: 3 }} />
          <List disablePadding>
            {plan.features.map((feature, idx) => (
              <ListItem key={idx} disableGutters sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CheckCircleIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <Typography variant="body2">{feature}</Typography>
              </ListItem>
            ))}
          </List>
        </CardContent>
        <Box sx={{ p: 3, pt: 0 }}>
          <Typography
            variant="h4"
            component="div"
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            ₹{(plan.price / 100).toFixed(2)}
            <Typography
              component="span"
              variant="body2"
              color="textSecondary"
              sx={{ ml: 1 }}
            >
              / {plan.durationDays} days
            </Typography>
          </Typography>
          <Button
            fullWidth
            variant={isCurrent ? "outlined" : "contained"}
            color={
              isCurrent
                ? "primary"
                : premiumNoToColor[plan.premiumNo] || "primary"
            }
            size="large"
            disabled={isCurrent || isLoading || currentPlanId != null}
            onClick={() => !isCurrent && onChoose(plan._id)}
            startIcon={
              isLoading && activePlanId === plan._id ? (
                <CircularProgress size={20} color="inherit" />
              ) : null
            }
            sx={{
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: "none",
              fontSize: "1rem",
              background: isCurrent ? "rgba(20,144,232,0.06)" : undefined,
              borderColor: isCurrent ? theme.palette.primary.main : undefined,
              "&:hover": {
                boxShadow: "none",
                transform: isCurrent ? "scale(1.01)" : "translateY(-2px)",
              },
              transition: "all 0.2s ease",
            }}
          >
            {isCurrent
              ? "Your Current Plan"
              : isLoading && activePlanId === plan._id
              ? "Processing..."
              : `Choose ${plan.name}`}
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default PremiumPlanCard;
