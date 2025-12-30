// pages/index.tsx - Updated for better typing
import ImageCard from "@/components/common/ImageCard";
import useFetchData from "@/hooks/useFetchData";
import { ImageProps } from "@/interfaces";
import React, { useEffect, useState } from "react";

const Home: React.FC = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const { isLoading, responseData, generatedImages, fetchData } = useFetchData();

  const handleGenerateImage = () => {
    if (!prompt.trim()) return;
    fetchData('/api/generate-image', { prompt });
  }

  useEffect(() => {
    if (!isLoading && responseData?.message) {
      setImageUrl(responseData.message);
    }
  }, [isLoading, responseData]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-2">Image Generation App</h1>
        <p className="text-lg text-gray-700 mb-4">
          Generate stunning images based on your prompts!
        </p>

        <div className="w-full max-w-md">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt here..."
            className="w-full p-3 border border-gray-300 rounded-lg mb-4"
          />
          <button
            onClick={handleGenerateImage}
            disabled={isLoading || !prompt.trim()}
            className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Loading..." : "Generate Image"}
          </button>
        </div>

        {imageUrl && (
          <div className="mt-6">
            <ImageCard 
              action={() => setImageUrl(imageUrl)} 
              imageUrl={imageUrl} 
              prompt={prompt} 
            />
          </div>
        )}
      </div>
      
      {generatedImages.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl text-center mb-4">Generated Images</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 border max-w-full md:max-w-[1100px] p-2 overflow-y-auto h-96">
            {generatedImages.map(
              ({ imageUrl, prompt }: ImageProps, index) => (
                <ImageCard
                  action={() => setImageUrl(imageUrl)}
                  imageUrl={imageUrl}
                  prompt={prompt}
                  key={index}
                  width="w-full"
                  height="h-40"
                />
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;