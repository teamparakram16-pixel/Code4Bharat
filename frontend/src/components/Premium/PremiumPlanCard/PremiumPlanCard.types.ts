export interface PremiumPlan {
  _id: string;
  premiumNo: number;
  name: string;
  description?: string;
  price: number;
  features: string[];
  durationDays: number;
  displayOrder?: number;
  popular?: boolean;
}

export interface PremiumPlanCardProps {
  plan: PremiumPlan;
  isCurrent: boolean;
  isLoading: boolean;
  onChoose: (planId: string) => void;
  activePlanId: string | null;
  currentPlanId:string | null;
}
