import React, { useContext, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { saveData } from "../lib/saveData";
import { getData } from "../lib/getData";
import { SearchContext } from "../context/SearchContext";

const AvatarMenu = () => {
  const { GeminiApiKey, setGeminiApiKey, model } = useContext(SearchContext);
  const [open, setOpen] = useState(false);
  const handleSave = async (e) => {
    e.preventDefault();
    await saveData("gemini-api-key", GeminiApiKey, setGeminiApiKey);
    setOpen(false);
  };

  return (
    <Popover open={model == 'gemini' && (GeminiApiKey == null || open)} onOpenChange={() => setOpen(prev => !prev)}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-gray-800 text-white">
        <form onSubmit={handleSave}>
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Gemini API Key</h4>
              <p className="text-sm text-gray-400">
                Enter your Gemini API key to use the service.
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="gemini-api-key" className="text-gray-300">
                API Key
              </Label>
              <Input
                id="gemini-api-key"
                type="password"
                placeholder="Enter your Gemini API key"
                value={GeminiApiKey}
                onChange={(e) => {
                  setGeminiApiKey(e.target.value)
                  setOpen(true);
                }}
                className="bg-gray-700 text-white outline-none my-2 focus:ring-gray-500 focus:border-gray-500"
              />
            </div>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              Save API Key
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default AvatarMenu;
