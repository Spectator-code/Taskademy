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

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Landing,
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
    path: "/dashboard",
    Component: Dashboard,
  },
  {
    path: "/browse",
    Component: BrowseTasks,
  },
  {
    path: "/post-task",
    Component: PostTask,
  },
  {
    path: "/task/:id",
    Component: TaskDetails,
  },
  {
    path: "/profile/:id",
    Component: Profile,
  },
  {
    path: "/messages",
    Component: Messages,
  },
  {
    path: "/admin",
    Component: Admin,
  },
]);
