import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Table } from "@tanstack/react-table"

interface DataTablePaginationProps<TData> {
    table: Table<TData>
    pageNumber: number
    pageSize: number
    totalCount: number
    onPageChange?: (page: number) => void
    onPageSizeChange?: (pageSize: number) => void
}
export function DataTablePagination<TData>({
    table,
    pageNumber,
    pageSize,
    totalCount,
    onPageChange,
    onPageSizeChange
}: DataTablePaginationProps<TData>) {
    const pageIndex = table.getState().pagination.pageIndex

    const pageCount = Math.ceil(totalCount / pageSize)

    const handlePageSize = (size: number) => {
        table.setPageSize(size)
        onPageSizeChange?.(size)
    }

    const handlePageChange = (page: number) => {
        table.setPageIndex(page)
        onPageChange?.(page)
    }

    return (
        <div>
            <div>
                Showing {(pageNumber - 1) * pageSize + 1} - {Math.min(pageNumber * pageSize, totalCount)} of {totalCount}
            </div>
            <div>
                <div>
                    <p>Rows per page</p>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder={`${pageSize}`}/>
                        </SelectTrigger>
                        <SelectContent>
                            {[10, 20, 30, 40, 50].map((size) => (
                                <SelectItem
                                    key={size}
                                    value={`${size}`}
                                    >
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

        </div>
    )
}
