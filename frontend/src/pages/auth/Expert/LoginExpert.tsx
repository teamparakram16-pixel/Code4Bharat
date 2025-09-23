// LoginExpert.tsx (no changes needed here)
import AuthLayoutExpert from "@/components/AuthLayoutExpert/AuthLayoutExpert";
import ExpertLoginForm from "@/components/Forms/Expert/ExpertLoginForm/ExpertLoginForm";

const LoginExpert = () => {
  return (
    <AuthLayoutExpert
      title="Welcome Back Vaidya!"
      subtitle="Sign in to continue your healing journey with ArogyaPath"
    >
      <ExpertLoginForm />
    </AuthLayoutExpert>
  );
};

export default LoginExpert;