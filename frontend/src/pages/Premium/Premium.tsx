import { useEffect, useState } from "react";
import usePremium from "@/hooks/usePremium/usePremium";
import { toast } from "react-toastify";
import {
  Box,
  Container,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import PremiumPlanSkeleton from "@/components/Premium/PremiumPlanCardSkeleton/PremiumPlanCardSkeleton";
import PremiumPlanCard from "@/components/Premium/PremiumPlanCard/PremiumPlanCard";
import { PremiumPlan } from "@/components/Premium/PremiumPlanCard/PremiumPlanCard.types";

const Premium = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { createPremiumOrder, verifyPremiumPayment, fetchPremiumOptions } =
    usePremium();

  const [plans, setPlans] = useState<PremiumPlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [plansLoading, setPlansLoading] = useState(true);

  useEffect(() => {
    setPlansLoading(true);
    fetchPremiumOptions()
      .then((res) => {
        if (res) {
          setPlans(res.data);
          setActivePlanId(res.data[0]?._id ?? null);
          setCurrentPlanId(res.userPlan);
        }
      })
      .finally(() => {
        setPlansLoading(false);
      });
  }, []);

  // Load Razorpay script once
  useEffect(() => {
    const loadScript = (src: string) =>
      new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    loadScript("https://checkout.razorpay.com/v1/checkout.js");
  }, []);

  const verifyPayment = async (
    paymentData: {
      razorpay_payment_id: string;
      razorpay_order_id: string;
      razorpay_signature: string;
    },
    planId: string
  ) => {
    if (!planId) {
      toast.error("No active plan selected.");
      return;
    }
    try {
      await verifyPremiumPayment(planId, paymentData);
    } catch (error) {
      console.error("Payment verification error:", error);
    }
  };

  const handlePayment = async (planId: string) => {
    const plan = plans.find((p) => p._id === planId);
    if (!plan) {
      toast.error("Invalid plan selected.");
      return;
    }

    try {
      setActivePlanId(planId);
      setIsLoading(true);

      // Call createPremiumOrder and await response
      const res = await createPremiumOrder(planId);

      if (!res) {
        // Error toast already shown in hook, just return gracefully
        return;
      }

      const { order } = res;

      if (!order || !order.id) {
        toast.error("Failed to retrieve order details. Please try again.");
        return;
      }

      // Configure Razorpay checkout options using the correct keys from order
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "ArogyaPath Premium",
        description: `Purchase of ${plan.name} plan`,
        handler: async (response: any) => {
          await verifyPayment(
            {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            },
            planId
          );
        },
        // prefill: {
        //   name: userProfile.fullName,
        //   email: userProfile.email,
        //   contact: userProfile.phone,
        // },
        theme: {
          color: "#16a34a",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", () => {
        toast.error("Payment failed. Please try again.");
      });

      rzp.open();
    } catch (error) {
      console.error("Payment initiation error:", error);
    } finally {
      setIsLoading(false);
      setActivePlanId(null);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        minWidth: "100vw",
        maxWidth: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 8,
        px: 2,
        background: "linear-gradient(135deg, #f5f7fa 0%, #e4f0f2 100%)",
      }}
    >
      <Container maxWidth="lg">
        <Box textAlign="center" mb={8}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: theme.palette.text.primary,
              [theme.breakpoints.down("sm")]: {
                fontSize: "2rem",
              },
            }}
          >
            Choose Your Premium Plan
          </Typography>
          <Typography
            variant="subtitle1"
            color="textSecondary"
            sx={{ maxWidth: 600, mx: "auto" }}
          >
            Flexible options to match your wellness journey
          </Typography>
        </Box>
        <Box
          display="flex"
          flexDirection={isMobile ? "column" : "row"}
          alignItems="stretch"
          justifyContent="center"
          gap={4}
          flexWrap="wrap"
        >
          {plansLoading
            ? [0, 1, 2].map((i) => <PremiumPlanSkeleton key={i} />)
            : plans.map((plan) => (
                <PremiumPlanCard
                  key={plan._id}
                  plan={plan}
                  isCurrent={plan._id === currentPlanId}
                  isLoading={isLoading && activePlanId === plan._id}
                  onChoose={handlePayment}
                  activePlanId={activePlanId}
                  currentPlanId={currentPlanId}
                />
              ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Premium;
