
export interface CreatePremiumOrderResponse {
  success: boolean;
  order: any; // Razorpay order object
  premium: {
    id: string;
    name: string;
    price: number;
    durationDays: number;
    features: string[];
  };
}

export interface VerifyPremiumPaymentPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface VerifyPremiumPaymentResponse {
  success: boolean;
  message: string;
  premium: any;
}
