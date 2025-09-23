import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LoginExpert from "./pages/auth/Expert/LoginExpert";
import RegisterExpert from "./pages/auth/Expert/RegisterExpert";
import LoginUser from "./pages/auth/User/LoginUser";
import RegisterUser from "./pages/auth/User/RegisterUser";
import RoleSelection from "./pages/RoleSelection/RoleSelection";
import CreatePost from "./pages/Expert/CreatePost/CreatePost";
import HomePage from "./pages/HomePage";
import CreateSuccessStory from "./pages/User/CreateSuccessStory/CreateSuccessStory";
import { PageNotFound } from "./pages/PageNotFound/PageNotFound";
import Premium from "./pages/Premium/Premium";
import MobileVerify from "./pages/auth/MobileVerify/MobileVerify";
import ExpertCompleteProfile from "./pages/Expert/ExpertCompleteProfile/ExpertCompleteProfile";
import UserCompleteProfile from "./pages/User/UserCompleteProfile/UserCompleteProfile";
import { GeneralPost } from "./pages/posts/PostPage/GeneralPost";
import { RoutinePost } from "./pages/posts/PostPage/RoutinePost";
import { SuccessStoryPost } from "./pages/posts/PostPage/SuccessStoryPost";
import AISearchPage from "./pages/AIquery/AIQuery";
import { ExpertTaggedPosts } from "./pages/Expert/TaggedView/ViewTagged";
import GuestProtectedRoute from "./pages/SecuredRoutes/GuestProtectedRoute";
import ProtectedRoute from "./pages/SecuredRoutes/ProtectedRoute";
import ExpertProtectedRoute from "./pages/SecuredRoutes/ExpertProtectedRoute";
import UserProtectedRoute from "./pages/SecuredRoutes/UserProtectedRoute";
import { AllGeneralPosts } from "./pages/posts/GeneralPosts";
import { AllRoutinePosts } from "./pages/posts/RoutinesPosts";
import { AllSuccessStoriesPosts } from "./pages/posts/SuccessStoryPosts";
import { VerifiedByVaidya } from "./pages/Expert/VerifiedSuccessStory/VerifiedSuccessStories";

import { ForgotPasswordPage } from "./pages/ForgotPasswordPage/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage/ResetPasswordPage";
import CopySnackbar from "./components/CopySnackBar/CopySnackBar";
import DoctorProfile from "./pages/DoctorProfile/DoctorProfile";

import PageFooter from "./components/PageFooter";
import PageNavBar from "./components/PageNavBar";
import PrakrithiAnalysis from "./pages/User/PrakrithiAnalysis/PrakritiAnalysis";
import ChatPage from "./pages/ChatPage/ChatPage";
import SentChatRequest from "./pages/SentChatRequest/SentChatRequest";
import ReceivedChatRequestPage from "./pages/ReceivedChatRequest/ReceivedChatRequest";
import YourChats from "./pages/YourChats/YourChats";
import EmailVerificationPage from "./pages/auth/EmailVerificationPage/EmailVerificationPage";
import VerifyingEmailPage from "./pages/auth/VerifyingEmailPage/VerifyingEmailPage";
import ExpertProfilePage from "./pages/Expert/ExpertProfilePage";
import UserProfilePage from "./pages/User/UserProfilePage/UserProfilePage";
import AboutUs from "./pages/AboutUs/AboutUs";
import ContactUs from "./pages/ContactUs/ContactUs";
import TermsNConditions from "./pages/TermsNConditions/TermsNConditions";
import Appointment from "./pages/Appointments/Appointment";
import RoutinesAppointment from "./pages/Appointments/RoutinesAppointment";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";

import LearnMore from "./pages/Learn More/learnMore";
import LiveStreaming from "./pages/LiveStreaming/LiveStreaming";
import SearchDoctor from "./pages/DoctorSearchPage/DoctorSearch";
import UserSuccessStoriesPage from "./pages/UserPosts/userposts";
import { UserPostsPage } from "./pages/LikedPages/likePages";
import PrivacyPolicy from "./pages/PrivacyPolicy/privacyPolicy";
import CookiePolicy from "./pages/Cookies/cookiePolicy";
import UpdateSuccessStory from "./components/Forms/User/UpdateSuccessStory/UpdateSuccessStory"
import ExpertChangePassword from "./pages/ChangePassword/ExpertChangePassword/ExpertChangePassword";
import UserChangePassword from "./pages/ChangePassword/UserChangePassword/UserChangePassword";
import  UpdatePostForm from "./components/Forms/Expert/UpdatePostForm/UpdatePostForm"
import UpdateRoutineForm from "./components/Forms/Expert/UpdateRoutineForm/UpdateRoutineForm";
import DoctorAppointments from "./pages/Expert/DoctorAppointments/DoctorAppointments";
// import ConsultationDetails from "./pages/Expert/ConsultationDetails/ConsultationDetails";
// import RoutinesConsultationDetails from "./pages/Expert/RoutinesConsultationDetails/RoutinesConsultationDetails";
import MeetingManagement from "./pages/MeetingManagement/MeetingManagement";
import UserAppointmentsPage from "./pages/User/UserAppointments/UserAppointmentsPage";
const App = () => {
  const { isLoggedIn } = useAuth();

  return (
    <>
      <ScrollToTop />
      <PageNavBar />

      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ marginTop: "5rem" }}
      />
      <div className="main-container">
        {/* <div
        style={{
          // marginTop: "4rem",
          width: "100%",
          flex: 1,
        }}
      > */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/terms-and-conditions" element={<TermsNConditions />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />

          <Route path="/learn-more" element={<LearnMore />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />

          <Route element={<GuestProtectedRoute />}>
            <Route path="/expert/login" element={<LoginExpert />} />
            <Route path="/expert/register" element={<RegisterExpert />} />
            <Route path="/user/login" element={<LoginUser />} />
            <Route path="/user/register" element={<RegisterUser />} />
            <Route path="/auth" element={<RoleSelection />} />
            <Route
              path="/:role/forgot-password"
              element={<ForgotPasswordPage />}
            />
            <Route
              path="/:role/reset-password/:token"
              element={<ResetPasswordPage />}
            />
            <Route path="/email/verify" element={<EmailVerificationPage />} />
            <Route
              path="/email/verify/:userId/:token"
              element={<VerifyingEmailPage />}
            />
          </Route>

          <Route element={<UserProtectedRoute />}>
            <Route
              path="/complete-profile/user"
              element={<UserCompleteProfile />}
            />
            <Route path="/prakrithi/analysis" element={<PrakrithiAnalysis />} />
            <Route
              path="/user/success-stories/create"
              element={<CreateSuccessStory />}
            />
            <Route path="/user/profile" element={<UserProfilePage />} />
            <Route path="/search/doctor" element={<SearchDoctor />} />
            <Route path="/doctor-profile/:id" element={<DoctorProfile />} />
            <Route path="/myposts" element={<UserSuccessStoriesPage />} />
            <Route path="/likedposts" element={<UserPostsPage />} />
            {/* change password */}
            <Route path="/user/change-password" element={<UserChangePassword />} />
            {/* Appointment Routes */}
            <Route path="/doctor-profile/:id/appointments/consultation" element={<Appointment />} />
            <Route path="/doctor-profile/:id/appointments/routines" element={<RoutinesAppointment />} />
            {/* User Appointments Page */}
            <Route path="/user/appointments" element={<UserAppointmentsPage />} />
          </Route>
           <Route path="/live-streaming" element={<LiveStreaming />} />
           <Route path="/livestreaming/:id" element={<LiveStreaming />} />
          <Route element={<ExpertProtectedRoute />}>
            <Route
              path="/complete-profile/expert"
              element={<ExpertCompleteProfile />}
            />
            <Route
              path="/verified/success-stories"
              element={<VerifiedByVaidya />}
            />
            <Route path="/expert/posts/create" element={<CreatePost />} />
            <Route path="/expert/tagged" element={<ExpertTaggedPosts />} />
            <Route path="/expert/profile" element={<ExpertProfilePage />} />
            <Route path="/posts/create" element={<CreatePost />} />
            {/* change password */}
            <Route path="/expert/change-password" element={<ExpertChangePassword />} />
            {/* Doctor Appointment Routes */}
            <Route path="/u/appointments" element={<DoctorAppointments />} />
            {/* <Route path="/appointments/consultation/:id" element={<ConsultationDetails />} />
            <Route path="/appointments/routines/:id" element={<RoutinesConsultationDetails />} /> */}
            {/* Meeting Management Route */}
            <Route path="/meetings" element={<MeetingManagement />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/success-stories/:id" element={<SuccessStoryPost />} />
            <Route path="/gposts/:id" element={<GeneralPost />} />
            <Route path="/routines/:id" element={<RoutinePost />} />
            <Route path="/chats/:id" element={<ChatPage />} />
            <Route path="/ai-query" element={<AISearchPage />} />
            {/* <Route path="/posts" element={<PostsPage />} /> */}
            <Route path="/gposts" element={<AllGeneralPosts />} />
            <Route path="/routines" element={<AllRoutinePosts />} />
            <Route
              path="/success-stories"
              element={<AllSuccessStoriesPosts />}
            />
            <Route
              path="/u/chat-requests/received"
              element={<ReceivedChatRequestPage />}
            />
            <Route path="/premium" element={<Premium />} />
            <Route path="/u/chat-requests/sent" element={<SentChatRequest />} />
            <Route path="/u/chats" element={<YourChats />} />
            <Route path="/verify-mobile" element={<MobileVerify />} />

            <Route
              path="/successstory/update/:id"
              element={<UpdateSuccessStory />}
            />
            <Route
              path="/routines/update/:id"
              element={<UpdateRoutineForm />}
            />
             <Route
              path="/gposts/update/:id"
              element={<UpdatePostForm />}
            />
          </Route>

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
      <CopySnackbar />
      {isLoggedIn !== undefined && <PageFooter />}
    </>
  );
};

export default App;
