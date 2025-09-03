import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import FormLayout, { 
  singleColumnConfig, 
  cardBasedConfig, 
  compactConfig, 
  customConfig 
} from "./FormLayout";
import { type TripPlannerFormValues } from "../types";

// Layout options for the demo
const layoutOptions = [
  { name: "Progressive Disclosure (Default)", config: undefined },
  { name: "Single Column (Mobile-First)", config: singleColumnConfig },
  { name: "Card-Based (2x2 Grid)", config: cardBasedConfig },
  { name: "Compact (All in Row)", config: compactConfig },
  { name: "Custom (Duration + Group Size)", config: customConfig },
];

export default function FormLayoutDemo() {
  const [selectedLayout, setSelectedLayout] = useState(0);

  const defaultValues: TripPlannerFormValues = {
    query: "",
    when: "flexible",
    flexibleText: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    exactDates: { start: "", end: "" },
    durationValue: 7,
    durationUnit: "days",
    budget: 0,
    adults: 1,
    kids: 0,
  };

  const methods = useForm<TripPlannerFormValues>({ 
    defaultValues,
    mode: "onChange"
  });

  const onSubmit = (data: TripPlannerFormValues) => {
    console.log("Form submitted:", data);
    alert("Check console for form data!");
  };

  const currentConfig = layoutOptions[selectedLayout].config;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Flexible Form Layout Demo
      </h2>
      
      {/* Layout Selector */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-700 mb-3">Choose Layout:</h3>
        <div className="flex flex-wrap gap-2">
          {layoutOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => setSelectedLayout(index)}
              className={`px-3 py-2 text-sm rounded-full border-2 transition-all duration-200 ${
                selectedLayout === index
                  ? "bg-accent text-white border-accent shadow-sm"
                  : "bg-gray-50 border-gray-200 hover:border-gray-300 text-gray-700"
              }`}
            >
              {option.name}
            </button>
          ))}
        </div>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          <div className="p-6 border rounded-lg bg-white shadow-sm">
            <FormLayout config={currentConfig} />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              className="px-8 py-3 bg-accent text-white rounded-full hover:bg-accent/90 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              Search Trips
            </button>
          </div>
        </form>
      </FormProvider>

      {/* Current Layout Info */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-700 mb-2">Current Layout Configuration:</h3>
        <pre className="text-sm text-gray-600 overflow-x-auto">
          {JSON.stringify(currentConfig || "Using default configuration", null, 2)}
        </pre>
      </div>
    </div>
  );
}
