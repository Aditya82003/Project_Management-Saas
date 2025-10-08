// "use client"

// import type { ToasterProps, } from "sonner"

// type ToasterToast = ToasterProps & {
//     id: string,
//     title?: React.ReactNode,
//     description?: React.ReactNode,
// }

// const actionTypes = {
//     ADD_TOAST: "ADD_TOAST",
//     UPDATE_TOAST: "UPDATE_TOAST",
//     DISMISS_TOAST: "DISMISS_TOAST",
//     REMOVE_TOAST: "REMOVE_TOAST",
// }

// let count = 0

// function genId() {
//     count = (count + 1) % Number.MAX_SAFE_INTEGER
//     return count.toString()
// }

// type ActionType = typeof actionTypes

// type Action = | {
//     type: ActionType["ADD_TOAST"],
//     toast: ToasterToast,
// }
//     | {
//         type: ActionType["UPDATE_TOAST"]
//         toast: Partial<ToasterToast>
//     }
//     | {
//         type: ActionType["DISMISS_TOAST"]
//         toastId?: ToasterToast["id"]
//     }
//     | {
//         type: ActionType["REMOVE_TOAST"]
//         toastId?: ToasterToast["id"]
//     }

//     interface State{
//         toasts: ToasterToast[]
//     }

