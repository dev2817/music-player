import { Outlet } from "react-router-dom";
import { AppProvider } from "../utils/AppContext";
import "./AppLayout.css"

export default function AppLayout() {
    return (
        <div className="appLayout">
            <AppProvider>
                <Outlet />
            </AppProvider>
        </div>
    )
}
