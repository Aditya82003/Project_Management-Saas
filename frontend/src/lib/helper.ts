export const getAvatarFallbackText = (name: string) => {
    if (!name) return "NA"
    const initials = name.split(" ")
        .map((word) => word.charAt(0).toUpperCase())
        .join("")
        .slice(0, 2)
    return initials || "NA"
}

export const getAvatarColor = (initials: string): string => {
    const colors = [
        "bg-red-500 text-white",
        "bg-blue-500 text-white",
        "bg-green-500 text-white",
        "bg-yellow-500 text-black",
        "bg-purple-500 text-white",
        "bg-pink-500 text-white",
        "bg-teal-500 text-white",
        "bg-orange-500 text-black",
        "bg-gray-500 text-white",
    ];
    const hash = initials
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);

    return colors[hash % colors.length];
}

export const  transformOptions=(option:string[],iconMap?:Record<string,React.ComponentType<{className?:string}>>)=>
    option.map((value)=>({
        label:value.replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase()),
        value:value,
        iconMap:iconMap ? iconMap[value] : undefined
    }))

export const transformStatusEnum =(status:string)=>{
    return status.replace(/_/g, " ")
}