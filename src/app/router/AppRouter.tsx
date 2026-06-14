import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import { backOfficeRoutes } from "./backOfficeRoutes";
import { frontOfficeRoutes } from "./frontOfficeRoutes";

const router = createBrowserRouter([
  backOfficeRoutes,
  frontOfficeRoutes,
  {
    path: "/tickets",
    element: <Navigate to="/admin/tickets" replace />,
  },
  {
    path: "/parcs",
    element: <Navigate to="/admin/parcs" replace />,
  },
  {
    path: "/knowledge-base",
    element: <Navigate to="/admin/knowledge-base" replace />,
  },
  {
    path: "/users",
    element: <Navigate to="/admin/users" replace />,
  },
  {
    path: "/import-data",
    element: <Navigate to="/admin/import-data" replace />,
  },
  {
    path: "/reset-data",
    element: <Navigate to="/admin/reset-data" replace />,
  },
  {
    path: "/user-test",
    element: <Navigate to="/admin/user-test" replace />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
