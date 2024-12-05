import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import SignIn from "../pages/sign-in/SignIn";
import SignUp from "../pages/sign-up/SignUp";
import Dashboard from "../pages/dashboard/Dashboard";
import Playlist from "../pages/playlist/Playlist";

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
                },
                {
                    path: "playlist/:playListId",
                    element: <Playlist />
                }
            ]
        }
    ])
    return (
        <RouterProvider router={router} />
    )
}
