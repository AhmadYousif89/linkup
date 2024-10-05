import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Home from "./pages/home/home";
import Dashboard from "./pages/dashboard/dashboard";

const router = createBrowserRouter(
  createRoutesFromElements([
    <Route path="/" element={<Home />}>
      <Route path="home" element={<Home />} />
    </Route>,
    <Route path="dashboard" element={<Dashboard />} />,
  ]),
);

export default function App() {
  return <RouterProvider router={router} />;
}
