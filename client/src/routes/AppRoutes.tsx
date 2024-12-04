import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import SignIn from "../pages/sign-in/SignIn";
import SignUp from "../pages/sign-up/SignUp";
import Dashboard from "../pages/dashboard/Dashboard";

export default function AppRoutes() {
    const router = createBrowserRouter([
        {
            path: "",
            element: <AppLayout />,
            children: [
                {
                    index: true,
                    element: <Navigate to="sign-in" replace />
                },
                {
                    path: "sign-in",
                    element: <SignIn />
                },
                {
                    path: "sign-up",
                    element: <SignUp />
                },
                {
                    path: "dashboard",
                    element: <Dashboard />
                }
            ]
        }
    ])
    return (
        <RouterProvider router={router} />
    )
}
