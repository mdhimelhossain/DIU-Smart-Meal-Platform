import { createBrowserRouter } from "react-router";
import { HomePage } from "./pages/HomePage";
import { HotelsPage } from "./pages/HotelsPage";
import { HotelProfilePage } from "./pages/HotelProfilePage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { StudentDashboard } from "./pages/StudentDashboard";
import { HotelOwnerDashboard } from "./pages/HotelOwnerDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/hotels",
    Component: HotelsPage,
  },
  {
    path: "/hotel/:id",
    Component: HotelProfilePage,
  },
  {
    path: "/about",
    Component: AboutPage,
  },
  {
    path: "/contact",
    Component: ContactPage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/register",
    Component: RegisterPage,
  },
  {
    path: "/student/dashboard",
    Component: StudentDashboard,
  },
  {
    path: "/hotel-owner/dashboard",
    Component: HotelOwnerDashboard,
  },
]);
