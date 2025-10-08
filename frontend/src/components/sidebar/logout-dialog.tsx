import { useCallback } from "react"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { useNavigate } from "react-router"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { logOutMutationFn } from "@/lib/api"
import { toast } from "sonner"
import { Loader } from "lucide-react"

const LogoutDialog = (props: {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const { isOpen, setIsOpen } = props
    const navigate=useNavigate()

    const queryClient=useQueryClient()

    const {mutate,isPending} = useMutation({
        mutationFn:logOutMutationFn,
        onSuccess:()=>{
            queryClient.resetQueries({
                queryKey:["authUser"]
            })
            toast.success("Logged out successfully")
            navigate("/")
            setIsOpen(false)
        },
        onError:(error)=>{
            console.log(error)
            toast.error(error.message)
        }
    })

    const handleLogout=useCallback(()=>{
        if(isPending) return
        mutate()
    },[isPending,mutate])
    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Are you sure you want to log out?</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            This will end your current session and you will need to log in
                            again to access your account.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button disabled={isPending} type="button" onClick={handleLogout}>
                            {isPending && <Loader className="animate-spin"/>}
                            Sign Out
                        </Button>
                        <Button type="button" onClick={()=>setIsOpen(false)}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>

            </Dialog>

        </>

    )
}

export default LogoutDialog