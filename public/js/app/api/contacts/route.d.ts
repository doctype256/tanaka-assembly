import { NextRequest, NextResponse } from 'next/server';
export declare function OPTIONS(req: NextRequest): Promise<NextResponse<unknown>>;
export declare function GET(req: NextRequest): Promise<NextResponse<unknown>>;
export declare function POST(req: NextRequest): Promise<NextResponse<unknown>>;
export declare function DELETE(req: NextRequest): Promise<NextResponse<unknown>>;
