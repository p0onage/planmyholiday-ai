import { WhenToGo, DurationPicker, BudgetInput, GroupSizeInput, type FormInputLayout } from "./TripPlannerFormInputs";

// Layout configuration for the entire form
export interface FormLayoutConfig {
  whenToGo?: FormInputLayout;
  duration?: FormInputLayout;
  budget?: FormInputLayout;
  groupSize?: FormInputLayout;
}

interface FormLayoutProps {
  config?: FormLayoutConfig;
  className?: string;
}

// Default layout configuration (Layout Option 2: Progressive Disclosure)
const defaultConfig: FormLayoutConfig = {
  whenToGo: { fullWidth: true }, // Full width for most important field
  duration: { span: 1 }, // Half width
  budget: { span: 1 }, // Half width  
  groupSize: { fullWidth: true }, // Full width
};

export default function FormLayout({ config = defaultConfig, className = "" }: FormLayoutProps) {
  const layoutConfig = { ...defaultConfig, ...config };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Row 1: When to Go (Full Width) */}
      <div className="w-full">
        <WhenToGo layout={layoutConfig.whenToGo} />
      </div>

      {/* Row 2: Duration and Budget (Side by Side) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DurationPicker layout={layoutConfig.duration} />
        <BudgetInput layout={layoutConfig.budget} />
      </div>

      {/* Row 3: Group Size (Full Width) */}
      <div className="w-full">
        <GroupSizeInput layout={layoutConfig.groupSize} />
      </div>
    </div>
  );
}

// Alternative layout configurations you can use:

// Layout Option 1: Single Column (Mobile-First)
export const singleColumnConfig: FormLayoutConfig = {
  whenToGo: { fullWidth: true },
  duration: { fullWidth: true },
  budget: { fullWidth: true },
  groupSize: { fullWidth: true },
};

// Layout Option 3: Card-Based (2x2 Grid)
export const cardBasedConfig: FormLayoutConfig = {
  whenToGo: { span: 2 }, // Spans both columns
  duration: { span: 1 },
  budget: { span: 1 },
  groupSize: { span: 2 }, // Spans both columns
};

// Layout Option 4: Compact (All in one row)
export const compactConfig: FormLayoutConfig = {
  whenToGo: { span: 1 },
  duration: { span: 1 },
  budget: { span: 1 },
  groupSize: { span: 1 },
};

// Layout Option 5: Custom (Duration and Group Size share row)
export const customConfig: FormLayoutConfig = {
  whenToGo: { fullWidth: true },
  duration: { span: 1 },
  budget: { fullWidth: true },
  groupSize: { span: 1 },
};

