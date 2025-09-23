import AuthLayoutUser from "@/components/AuthLayoutUser/AuthLayoutUser";
import { UserRegisterForm } from "@/components/Forms/User/UserRegisterForm/UserRegisterForm";

export function RegisterUser() {
  return (
    <AuthLayoutUser
      title="Create an Account, User"
      subtitle="Join our community and make a difference."
    >
      <UserRegisterForm />
    </AuthLayoutUser>
  );
}

export default RegisterUser;