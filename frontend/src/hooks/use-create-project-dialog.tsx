import { parseAsBoolean, useQueryState } from "nuqs";
const useCreateProjectDialog = () => {
    const [open, setOpen] = useQueryState(
        "new-project",
        parseAsBoolean.withDefault(false)
    );
    const onOpen = () => setOpen(true)
    const onClose = () => setOpen(false)
    return {
        onOpen,
        onClose,
        open
    }
}

export default useCreateProjectDialog