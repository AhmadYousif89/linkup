import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Home from "./pages/home/home";
import SignInPage from "./pages/auth/sign-in";
import SignUpPage from "./pages/auth/sign-up";
import Dashboard from "./pages/dashboard/dashboard";

import NotFound from "./pages/404";
import ErrorPage from "./pages/error";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "home", element: <Home /> },
  { path: "sign-in", element: <SignInPage /> },
  { path: "sign-up", element: <SignUpPage /> },
  { path: "dashboard", element: <Dashboard />, errorElement: <ErrorPage /> },
  { path: "*", element: <NotFound /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
