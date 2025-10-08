import type { FC } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Loader } from "lucide-react";

interface ConfirmDialogProps {
    isOpen: boolean;
    isLoading: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    children?: React.ReactNode;
}
export const ConfirmDialog:FC<ConfirmDialogProps> = ({
    isOpen,
    isLoading,
    onClose,
    onConfirm,
    title="Confirm Action",
    description="Are your sure you want to perform this action?",
    confirmText="Confirm",
    cancelText="Cancel",
    children
}) => {
    const handleClose = () => {
        if(isLoading) return
        onClose()
    }
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>
                {children && <div className="py-4">{children}</div>}
                <DialogFooter>
                    <Button variant={"outline"} className="bg-red-500 text-white" onClick={handleClose}>{cancelText}</Button>
                    <Button onClick={onConfirm} disabled={isLoading}>{isLoading && <Loader className="w-4 h-4 animate-spin"/>}{confirmText}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}