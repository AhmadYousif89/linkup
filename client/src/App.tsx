import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";

import NotFound from "./pages/404";
import Home from "./pages/home/home";
import SignInPage from "./pages/auth/sign-in";
import SignUpPage from "./pages/auth/sign-up";
import Dashboard from "./pages/dashboard/dashboard";
import { useSocketStore } from "./lib/store";

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
  const { user } = useUser();
  const { initSocket } = useSocketStore();

  useEffect(() => {
    if (!user) return;
    initSocket();
    return () => useSocketStore.getState().disconnect();
  }, [user]);

  return <RouterProvider router={router} />;
}
