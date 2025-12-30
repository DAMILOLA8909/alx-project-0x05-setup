// pages/api/generate-image.ts - DALL-E VERSION
import { HEIGHT, WIDTH } from "@/constants";
import { RequestProps } from "@/interfaces";
import { NextApiRequest, NextApiResponse } from "next"

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  const openaiApiKey = process.env.OPENAI_API_KEY; // Note: NOT prefixed with NEXT_PUBLIC_
  const { prompt }: RequestProps = request.body;

  if (!openaiApiKey) {
    // Fallback to mock if no API key
    const placeholderUrl = `https://placehold.co/${WIDTH}x${HEIGHT}/1e40af/ffffff?text=${encodeURIComponent(prompt)}`;
    return response.status(200).json({ message: placeholderUrl });
  }

  try {
    const openaiResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        prompt: prompt,
        n: 1,
        size: `${WIDTH}x${HEIGHT}`,
        response_format: 'url'
      })
    });

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.status}`);
    }

    const data = await openaiResponse.json();
    const imageUrl = data.data[0]?.url;
    
    return response.status(200).json({
      message: imageUrl || `https://placehold.co/${WIDTH}x${HEIGHT}/1e40af/ffffff?text=${encodeURIComponent(prompt)}`
    });
    
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    const placeholderUrl = `https://placehold.co/${WIDTH}x${HEIGHT}/dc2626/ffffff?text=API+Error`;
    return response.status(200).json({ message: placeholderUrl });
  }
}

export default handler