import  { useState } from "react";
import { useForm } from "react-hook-form";
import { ChevronRight, ChevronDown } from "lucide-react";
import { type HeroProps } from "../types";

type FormValues = {
    prompt: string;
};

export default function Hero({ onPlan }: HeroProps) {
    const { register, handleSubmit, reset } = useForm<FormValues>({
        defaultValues: { prompt: "" },
    });

    const [showMore, setShowMore] = useState(false);

    const onSubmit = (data: FormValues): void => {
        onPlan(data.prompt);
        reset();
    };

    return (
        <section className="py-12 bg-white text-center">
            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-bold mb-8 text-gray-900">
                Let's plan your perfect trip
            </h1>

            {/* Form container with fixed max width */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="
                  grid gap-4 justify-center
                  grid-cols-1
                  md:grid-cols-3 md:auto-rows-auto md:gap-x-4
                  max-w-xl mx-auto
                "
            >
                {/* Input: spans 2 cols on desktop */}
                <input
                    type="text"
                    className="w-4/5 md:w-full mx-auto px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent md:col-span-2"
                    placeholder='e.g. "Help me plan a surf vacation in August"'
                    {...register("prompt", { required: true })}
                />

                {/* Button: col 3, row 1 */}
                <button
                    type="submit"
                    className="order-2 md:order-none
                    w-2/5 md:w-full mx-auto
                    bg-accent
                    text-white px-6 py-3 rounded-full
                    font-semibold shadow hover:bg-blue-700
                    transition md:col-start-3 md:row-start-1"
                >
                    Plan my trip
                </button>

                {/* More options: col 3, row 2 */}
                <div
                    className="order-1 md:order-none
                    text-accent
                    font-medium flex items-center justify-center
                    cursor-pointer select-none md:col-start-3 md:row-start-2"
                    onClick={() => setShowMore(!showMore)}
                >
                    <span>More options</span>
                    {showMore ? (
                        <ChevronDown className="ml-2 h-5 w-5" />
                    ) : (
                        <ChevronRight className="ml-2 h-5 w-5" />
                    )}
                </div>
            </form>

            {/* Sub box */}
            {showMore && (
                <div className="mt-4 mx-auto w-full max-w-md bg-blue-50 rounded-xl p-4 shadow">
                    <p className="text-sm text-gray-700">Extra filters or inputs go here.</p>
                </div>
            )}
        </section>
    );
}
