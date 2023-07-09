import { NextRequest, NextResponse } from 'next/server';
import { requestApiAccess, requestInputSchema } from '~/modules/current/request.router';

export default async function handler(req: NextRequest) {

    try {
        const input = await req.json();
        const { amtinsats } = requestInputSchema.parse(input);
        console.log('sats amount: %o',  amtinsats);
        const { headers, url } = requestApiAccess( `/process-static-charges/plebai?amount=${amtinsats}`);
        const response = await fetch(url, { headers, method: 'GET' })
        const body = await response.json()
    

        return new NextResponse(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json'} });


        
    } catch (error) {
        console.log('in Next error: %0', error)
        
        
    }


};

export const config = {
    runtime: 'edge',
  };