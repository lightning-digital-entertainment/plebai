import { NextRequest, NextResponse } from 'next/server';
import { requestApiAccess, requestInputSchema } from '~/modules/data/request.router';

export default async function handler(req: NextRequest) {

    try {
        const input = await req.json();
        console.log('inside agents');
        const { fingerPrint } = requestInputSchema.parse(input);
        const { headers, url } = requestApiAccess( `/v1/data/agents`);
        const response = await fetch(url, { headers, method: 'POST', body: JSON.stringify(input) })
        const body = await response.json()
    

        return new NextResponse(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json'} });


        
    } catch (error) {
        console.log('in Next error: %0', error)
        
        
    }


};

export const config = {
    runtime: 'edge',
  };