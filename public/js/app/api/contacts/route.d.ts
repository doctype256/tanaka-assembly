import { NextRequest, NextResponse } from 'next/server';
export declare function OPTIONS(req: NextRequest): Promise<NextResponse<{}>>;
export declare function GET(req: NextRequest): Promise<NextResponse<any>>;
export declare function POST(req: NextRequest): Promise<NextResponse<{
    success: boolean;
    message: string;
}> | NextResponse<{
    error: any;
}>>;
export declare function DELETE(req: NextRequest): Promise<NextResponse<{
    success: boolean;
    message: string;
}> | NextResponse<{
    error: any;
}>>;
