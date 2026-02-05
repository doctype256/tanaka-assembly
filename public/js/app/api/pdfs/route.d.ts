import { NextResponse } from "next/server";
export declare function GET(): Promise<NextResponse<import("@libsql/core/api").Row[]> | NextResponse<{
    error: string;
}>>;
export declare function POST(request: Request): Promise<NextResponse<{
    success: boolean;
}> | NextResponse<{
    error: string;
}>>;
export declare function DELETE(request: Request): Promise<NextResponse<{
    success: boolean;
}> | NextResponse<{
    error: string;
}>>;
