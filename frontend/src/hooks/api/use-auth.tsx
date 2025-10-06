import { getCurrentUserQueryFn } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"

const useAuth =()=>{
    const query = useQuery({
        queryKey:["auth"],
        queryFn:getCurrentUserQueryFn,
        staleTime:0,
        retry:2
    })
    return query
}

export default useAuth