import { Outlet } from "react-router-dom";
import { AppProvider } from "../utils/AppContext";

export default function AppLayout() {
    return (
        <div>
            <AppProvider>
                <Outlet />
            </AppProvider>
        </div>
    )
}
