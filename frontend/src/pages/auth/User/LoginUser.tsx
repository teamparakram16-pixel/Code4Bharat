import AuthLayoutUser from "@/components/AuthLayoutUser/AuthLayoutUser";
import UserLoginForm from "@/components/Forms/User/UserLoginForm/UserLoginForm";

export function LoginUser() {
  return (
    <AuthLayoutUser
      title="Welcome Back"
      subtitle="Log in to access Ayurvedic wellness insights tailored for you."
    >
      <UserLoginForm />
      
    </AuthLayoutUser>
  );
}

export default LoginUser;
