import { NextRequest, NextResponse } from 'next/server';



export default async function handler(req: NextRequest) {

    try {
        const input = await req.json();
       

        const headers = {
            'Content-Type': 'application/json',
        }

        const url: string | any = process.env.GPT4ALL_API_HOST + '/v1/data/models';
    
        const response = await fetch(url,  { headers, method: 'GET' } )
        const body = await response.json()
        console.log('received body: %o', body)
        return new NextResponse(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json'} });
        
    } catch (error) {
        console.log('in Next error: %0', error)
        
        
    }


};

export const config = {
    runtime: 'edge',
  };