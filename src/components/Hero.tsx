import React, { useState } from "react";
import { HeroProps } from "../types";

export default function Hero({ onPlan }: HeroProps) {
  const [prompt, setPrompt] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    onPlan(prompt);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPrompt(e.target.value);
  };

  return (
    <section className="text-center py-12 bg-white">
      <h1 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
        Let's plan your perfect trip
      </h1>
      <form
        className="flex flex-col md:flex-row justify-center items-center gap-4"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          className="w-72 md:w-96 px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder='e.g. "Help me plan a surf vacation in August"'
          value={prompt}
          onChange={handleInputChange}
        />
        <button
          type="submit"
          className="bg-accent text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-blue-700 transition"
        >
          Plan my trip
        </button>
      </form>
    </section>
  );
}
