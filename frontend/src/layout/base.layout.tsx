import { Outlet } from "react-router"

const BaseLayout = () => {
    return (
        <div className="flex flex-col h-auto  w-full">
            <div className="h-full w-full flex justify-center items-center">
                <div className="w-full mx-auto h-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default BaseLayout