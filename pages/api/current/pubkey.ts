import { NextRequest, NextResponse } from 'next/server';

export default async function handler(req: NextRequest) {

    try {
        const input = await req.json();

        console.log(input);
  
        const url = 'https://' + input.domain + '/.well-known/nostr.json?name=' + input.user;
 
        console.log(url);

        const response = await fetch(url, { headers: { 'Content-Type': 'application/json'} , method: 'GET' })
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