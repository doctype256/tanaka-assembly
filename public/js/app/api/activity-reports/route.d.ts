import { NextResponse } from "next/server";
export declare function createTables(): Promise<void>;
export declare function GET(req: Request): Promise<NextResponse<unknown>>;
export declare function POST(req: Request): Promise<NextResponse<unknown>>;
export declare function DELETE(req: Request): Promise<NextResponse<unknown>>;
