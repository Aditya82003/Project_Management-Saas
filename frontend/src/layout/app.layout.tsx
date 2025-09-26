import { Outlet } from "react-router"

const AppLayout = ()=>{
    return(
        <div className="w-full">
            <h1>Header</h1>
            <div className="px-3 lg:px-20 py-3">
                <Outlet/>
            </div>
        </div>
    )

}

export default AppLayout