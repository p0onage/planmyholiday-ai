import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import { type TripPlannerFormValues } from "../../types";
import React from "react";

interface TripPlannerFormProps {
    defaultValues: TripPlannerFormValues;
    onSubmit: SubmitHandler<TripPlannerFormValues>;
    children: React.ReactNode;
}

export default function TripPlannerForm({
                                            defaultValues,
                                            onSubmit,
                                            children,
                                        }: TripPlannerFormProps) {
    const methods = useForm<TripPlannerFormValues>({ defaultValues });

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
                {children}
            </form>
        </FormProvider>
    );
}
