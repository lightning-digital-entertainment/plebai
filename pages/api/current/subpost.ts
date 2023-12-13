import { NextRequest, NextResponse } from 'next/server';
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default async function handler(req: NextRequest) {

    try {
        const input = await req.json();
        console.log('inside rev cat update');
        console.log(input);

        const baseURL = process.env.CURRENT_API_HOST ? process.env.CURRENT_API_HOST : '';
        const url = baseURL + `/v2/revcat`;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': process.env.SUB_AUTH?process.env.SUB_AUTH:''
        }

        const response = await fetch(url, { headers, method: 'POST', body: JSON.stringify(input) })
        const body = await response.json()
    
        await sleep(1000);
        return new NextResponse(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json'} });


        
    } catch (error) {
        console.log('in Next error: %0', error)
        
        
    }


};

export const config = {
    runtime: 'edge',
  };