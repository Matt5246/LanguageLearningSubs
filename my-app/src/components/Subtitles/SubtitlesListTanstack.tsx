"use client"
import {
    ColumnDef,
    Row,
    SortDirection,
    SortingState,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { TableCell, TableHead, TableRow } from "@/components/ui/table";
import { HTMLAttributes, forwardRef, useState } from "react";
import { TableVirtuoso } from "react-virtuoso";
import { cn } from "@/lib/utils";
import { columns } from './columns'

const TableComponent = forwardRef<
    HTMLTableElement,
    React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
    <table
        ref={ref}
        className={cn("w-full caption-bottom text-sm", className)}

        {...props}
    />
));
TableComponent.displayName = "TableComponent";

const TableRowComponent = <TData,>(rows: Row<TData>[]) =>
    function getTableRow(props: HTMLAttributes<HTMLTableRowElement>) {
        // @ts-expect-error data-index is a valid attribute
        const index = props["data-index"];
        const row = rows[index];
        if (!row) return null;

        return (
            <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                {...props}
            >
                {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                ))}
            </TableRow>
        );
    };

function SortingIndicator({ isSorted }: { isSorted: SortDirection | false }) {
    if (!isSorted) return null;
    return (
        <div>
            {
                {
                    asc: "↑",
                    desc: "↓",
                }[isSorted]
            }
        </div>
    );
}



export function DataTable<TData, TValue>({ captions, height }: { captions: Caption[], height: string }) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const tableData = captions;

    const table = useReactTable({
        data: tableData,
        columns: columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const { rows } = table.getRowModel();

    return (
        <div className="rounded-md border ">
            <TableVirtuoso
                style={{ height }}
                totalCount={rows.length}
                components={{
                    Table: TableComponent,
                    TableRow: TableRowComponent(rows),
                }}
                fixedHeaderContent={() =>
                    table.getHeaderGroups().map((headerGroup) => (
                        <TableRow className="bg-card hover:bg-muted" key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                    colSpan={header.colSpan}
                                    style={{ width: header.getSize() }}
                                >
                                    {header.isPlaceholder ? null : (
                                        <div
                                            className="flex items-center"
                                            style={header.column.getCanSort() ? { cursor: "pointer", userSelect: "none" } : {}}
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            <SortingIndicator isSorted={header.column.getIsSorted()} />
                                        </div>
                                    )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))
                }
            />
        </div>
    );
}