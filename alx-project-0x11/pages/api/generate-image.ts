// pages/api/generate-image.ts
import { HEIGHT, WIDTH } from "@/constants";
import { RequestProps } from "@/interfaces";
import { NextApiRequest, NextApiResponse } from "next";
import https from 'https';

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  const gptApiKey = process.env.NEXT_PUBLIC_GPT_API_KEY || '69451df23cmsh874fc98e6773999p1ea16ejsnf45c918374d1';

  if (!gptApiKey) {
    return response.status(500).json({ error: "API key is missing" });
  }

  try {
    const { prompt }: RequestProps = request.body;

    // Using your https module approach
    const options = {
      method: 'POST',
      hostname: 'chatgpt-42.p.rapidapi.com',
      port: null,
      path: '/texttoimage',
      headers: {
        'x-rapidapi-key': gptApiKey,
        'x-rapidapi-host': 'chatgpt-42.p.rapidapi.com',
        'Content-Type': 'application/json'
      }
    };

    // Wrap the https request in a Promise
    const apiResponse = await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        const chunks: Buffer[] = [];

        res.on('data', (chunk) => {
          chunks.push(chunk);
        });

        res.on('end', () => {
          const body = Buffer.concat(chunks);
          try {
            const parsedBody = JSON.parse(body.toString());
            resolve(parsedBody);
          } catch (error) {
            reject(new Error('Failed to parse response'));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.write(JSON.stringify({
        text: prompt,
        width: WIDTH,
        height: HEIGHT
      }));
      
      req.end();
    });

    // Extract image URL from response
    const data = apiResponse as any;
    const imageUrl = data?.generated_image || data?.url || 
                    `https://via.placeholder.com/${WIDTH}x${HEIGHT}?text=${encodeURIComponent(prompt)}`;

    return response.status(200).json({
      message: imageUrl,
    });
  } catch (error: any) {
    console.error("Error in API route:", error);
    
    // Fallback placeholder if API fails
    const { prompt }: RequestProps = request.body;
    const placeholderUrl = `https://via.placeholder.com/${WIDTH}x${HEIGHT}?text=${encodeURIComponent(prompt || 'Generated+Image')}`;
    
    return response.status(200).json({
      message: placeholderUrl,
      error: error.message
    });
  }
}

export default handler;