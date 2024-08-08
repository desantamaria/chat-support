import { NextResponse } from 'next/server'
import OpenAI from 'openai';
export async function POST(req) {
    const openai = new OpenAI
    const data = await req.json()

    const completion = await openai.chat.completions.create({
        messages: [
            {
                "role": "system", 
                "content": "You are a helpful assistant."},
            {"role": "user", "content": "Who won the world series in 2020?"},
            {"role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020."},
            {"role": "user", "content": "Where was it played?"}],
        model: "gpt-4o-mini",
        stream: true
      });
    
      const stream = new ReadableStream({
        async start(controller){
            const encoder = new TextEncoder()
            try {
                for await (const chunk of completion) {
                    const content = chunk.choices[0].delta.content
                    if (content) {
                        const text = encoder.encode(content)
                        controller.enqueue(text)
                    }
                }
            }catch(error) {
                controller.error(error)
            } finally {
                controller.close()
            }
        }
      })


   /*  console.log(completion.choices[0].message.content)

    return NextResponse.json({message: 'Hello from the server!'}) */
}