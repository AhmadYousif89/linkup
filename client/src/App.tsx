import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import NotFound from "./pages/404";
import Home from "./pages/home/home";
import SignInPage from "./pages/auth/sign-in";
import SignUpPage from "./pages/auth/sign-up";
import Dashboard from "./pages/dashboard/dashboard";

const router = createBrowserRouter(
  createRoutesFromElements([
    <Route path="/" element={<Home />}>
      <Route path="home" element={<Home />} />
    </Route>,
    <Route path="/dashboard" element={<Dashboard />} />,
    <Route path="/sign-in" element={<SignInPage />} />,
    <Route path="/sign-up" element={<SignUpPage />} />,
    <Route path="*" element={<NotFound />} />,
  ]),
);

export default function App() {
  return <RouterProvider router={router} />;
}
