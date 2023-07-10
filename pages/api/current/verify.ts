import { NextRequest, NextResponse } from 'next/server';
import { verifyApiAccess, verifyInputSchema } from '~/modules/current/verify.router';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default async function handler(req: NextRequest) {

    try {
        const input = await req.json();
        const { verifyUrl } = verifyInputSchema.parse(input);
   
        const { headers, url } = verifyApiAccess( verifyUrl);
        console.log('verify Url: %o', url)
        await sleep(500);
        const response = await fetch(url, { headers, method: 'GET' })
        const body = await response.json()
    
        console.log('verify body: %o', body)
        return new NextResponse(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json'} });
        
    } catch (error) {
        console.log('in Next error: %0', error)
        
        
    }


};

export const config = {
    runtime: 'edge',
  };