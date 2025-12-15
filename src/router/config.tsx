import type { RouteObject } from "react-router-dom";
import { lazy } from "react";
import Home from "../pages/home/page";
import Auth from "../pages/auth/page";
import Todos from "../pages/todos/page";
import Profile from "../pages/profile/page";
import Groups from "../pages/groups/page";
import Contact from "../pages/contact/page";
import NotFound from "../pages/NotFound";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/todos",
    element: <Todos />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/groups",
    element: <Groups />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
