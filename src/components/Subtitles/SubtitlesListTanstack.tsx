"use client"
import React, { useEffect, useRef } from "react";
import {
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
import { TableVirtuoso, TableVirtuosoHandle } from "react-virtuoso";
import { cn } from "@/lib/utils";
import { columns } from './columns'
import { useSelector } from "react-redux";


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

const TableRowComponent = <TData,>(rows: Row<TData>[], currentIndex: number, autoScrollEnabled: boolean) =>
    function getTableRow(props: HTMLAttributes<HTMLTableRowElement>) {
        // @ts-expect-error data-index is a valid attribute
        const index = props["data-index"];
        const row = rows[index];
        const isActive = index === currentIndex;


        if (!row) return null;
        if (autoScrollEnabled) {
            return (
                <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={cn(isActive
                        ? "bg-blue-100 dark:bg-blue-900 dark:text-white hover:bg-blue-200 dark:hover:bg-blue-800 "
                        : "hover:bg-gray-100 dark:hover:bg-gray-700",
                        "transition-colors duration-300")}
                    {...props}
                >
                    {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                    ))}
                </TableRow>
            );
        } else {
            return (
                <TableRow
                    key={row.id}
                    className={cn("hover:bg-gray-100 dark:hover:bg-gray-700", "transition-colors duration-300")}
                    {...props}
                >
                    {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                    ))}
                </TableRow>
            );
        }

    };

function SortingIndicator({ isSorted }: { isSorted: SortDirection | false }) {
    if (!isSorted) return null;
    return (
        <div>
            {{ asc: "↑", desc: "↓", }[isSorted]}
        </div>
    );
}

export function DataTable<TData, TValue>({ captions, height }: { captions: Caption[], height: string }) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const playedSeconds = useSelector((state: any) => state.subtitle.playedSeconds);
    const autoScrollEnabled = useSelector((state: any) => state.subtitle.autoScrollEnabled);
    const tableRef = useRef<TableVirtuosoHandle>(null);
    const table = useReactTable({
        data: captions,
        columns: columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const { rows } = table.getRowModel()

    useEffect(() => {
        if (rows.length > 0) {
            let newIndex = -1;

            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                const startTime = row.original.start ?? 0;
                const nextStartTime = rows[i + 1]?.original.start ?? Infinity;
                if (playedSeconds >= startTime && playedSeconds < nextStartTime) {
                    newIndex = i;
                    break;
                }
            }

            if (newIndex === -1) {
                newIndex = 0;
            }

            setCurrentIndex(newIndex);

            if (autoScrollEnabled && tableRef.current && newIndex !== -1) {
                tableRef.current.scrollToIndex({
                    index: newIndex,
                    align: "center",
                    behavior: "smooth",
                });
            }
        }
    }, [playedSeconds, rows, autoScrollEnabled]);

    return (
        <div className="rounded-md border ">
            <TableVirtuoso
                ref={tableRef}
                style={{ height }}
                totalCount={rows.length}
                components={{
                    Table: TableComponent,
                    TableRow: TableRowComponent(rows, currentIndex, autoScrollEnabled),
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