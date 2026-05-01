import { createBrowserRouter, Outlet, useLocation } from "react-router";
import { AnimatePresence } from "motion/react";
import PageTransition from "./components/ui/PageTransition";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import BrowseTasks from "./pages/BrowseTasks";
import TaskDetails from "./pages/TaskDetails";
import Profile from "./pages/Profile";
import Messages from "./pages/Messages";
import Admin from "./pages/Admin";
import PostTask from "./pages/PostTask";
import Settings from "./pages/Settings";
import SavedStudents from "./pages/SavedStudents";
import DraftTasks from "./pages/DraftTasks";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import AboutUs from "./pages/AboutUs";
import HelpCenter from "./pages/HelpCenter";
import Safety from "./pages/Safety";
import Contact from "./pages/Contact";
import Careers from "./pages/Careers";
import Blog from "./pages/Blog";
import CookiesPolicy from "./pages/CookiesPolicy";
import Suspended from "./pages/Suspended";
import MyTasks from "./pages/MyTasks";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";

function RootLayout() {
  const location = useLocation();
  return (
    <Outlet />
  );
}



export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <Landing />,
      },
      {
        path: "/about",
        element: <AboutUs />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/privacy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/terms",
        element: <TermsOfService />,
      },
      {
        path: "/suspended",
        element: <Suspended />,
      },
      {
        path: "/cookies",
        element: <CookiesPolicy />,
      },
      {
        path: "/help",
        element: <HelpCenter />,
      },
      {
        path: "/safety",
        element: <Safety />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/careers",
        element: <Careers />,
      },
      {
        path: "/blog",
        element: <Blog />,
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/my-tasks",
        element: (
          <ProtectedRoute>
            <MyTasks />
          </ProtectedRoute>
        ),
      },
      {
        path: "/browse",
        element: (
          <ProtectedRoute>
            <BrowseTasks />
          </ProtectedRoute>
        ),
      },
      {
        path: "/post-task",
        element: (
          <ProtectedRoute allowedRoles={["client", "admin"]}>
            <PostTask />
          </ProtectedRoute>
        ),
      },
      {
        path: "/task/:id",
        element: (
          <ProtectedRoute>
            <TaskDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile/:id",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/messages",
        element: (
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        ),
      },
      {
        path: "/settings",
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },
      {
        path: "/saved-students",
        element: (
          <ProtectedRoute>
            <SavedStudents />
          </ProtectedRoute>
        ),
      },
      {
        path: "/draft-tasks",
        element: (
          <ProtectedRoute allowedRoles={["client", "admin"]}>
            <DraftTasks />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <Admin />
          </ProtectedRoute>
        ),
      },
    ]
  }
]);
