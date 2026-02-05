import { NextRequest, NextResponse } from "next/server";
export declare function OPTIONS(req: NextRequest): Promise<NextResponse<{}>>;
export declare function POST(req: NextRequest): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    success: boolean;
    url: any;
    public_id: any;
    filename: FormDataEntryValue;
    uploaded_at: string;
}>>;
