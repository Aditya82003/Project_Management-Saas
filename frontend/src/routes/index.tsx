import BaseLayout from "@/layout/base.layout"
import { BrowserRouter, Route, Routes } from "react-router"
import { authenicationRoutePaths, baseRoutePaths, protectedRoutePaths } from "./common/route"
import AppLayout from "@/layout/app.layout"
import ProtectedRoute from "@/routes/protected.route"
import AuthRoute from "./auth.route"

function AppRoutes() {
    return (<>
        <BrowserRouter>
            <Routes>
                
                <Route element={<BaseLayout/>}>
                    {baseRoutePaths.map((route) => (
                        <Route
                            key={route.path}
                            path={route.path}
                            element={route.element} />
                    ))}
                </Route>

                <Route path="/" element={<AuthRoute/>}>
                    <Route element={<BaseLayout />} >
                        {authenicationRoutePaths.map((route) => (
                            <Route
                                key={route.path}
                                path={route.path}
                                element={route.element} />
                        ))}
                    </Route>
                </Route>

                <Route path="/" element={<ProtectedRoute/>} >
                    <Route element={<AppLayout/>}>
                        {protectedRoutePaths.map((route) => (
                            <Route
                                key={route.path}
                                path={route.path}
                                element={route.element} />
                        ))}
                    </Route>
                </Route>

                <Route path="*" element={<h1>404</h1>}/>

            </Routes>
        </BrowserRouter>
    </>)
}

export default AppRoutes