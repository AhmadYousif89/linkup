import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Home from "./pages/home/home";
import Dashboard from "./pages/dashboard/dashboard";
import SignInPage from "./pages/auth/signin";
import SignUpPage from "./pages/auth/signup";
import NotFound from "./pages/404";

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
