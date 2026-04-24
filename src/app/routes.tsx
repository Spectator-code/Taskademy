import { createBrowserRouter } from "react-router";
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
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import AboutUs from "./pages/AboutUs";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  // --- Public Routes ---
  {
    path: "/",
    Component: Landing,
  },
  {
    path: "/about",
    Component: AboutUs,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/privacy",
    Component: PrivacyPolicy,
  },
  {
    path: "/terms",
    Component: TermsOfService,
  },

  // --- Protected Routes ---
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
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
      <ProtectedRoute requiredRole="client">
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
    path: "/admin",
    element: (
      <ProtectedRoute requiredRole="admin">
        <Admin />
      </ProtectedRoute>
    ),
  },
]);
