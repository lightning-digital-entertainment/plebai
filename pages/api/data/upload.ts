import { NextRequest, NextResponse } from 'next/server';
import { requestApiAccess, requestInputSchema } from '~/modules/data/request.router';

export default async function handler(req: NextRequest) {

    try {
        const { headers, url } = requestApiAccess( `/v1/data/upload`);
        console.log('headers: ', headers);
        console.log('url', url);

        const input = await req.json();
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