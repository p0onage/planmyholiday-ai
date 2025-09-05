// Layout configuration types for form inputs
export interface FormInputLayout {
  span?: 1 | 2; // How many columns this input should span (1 or 2)
  fullWidth?: boolean; // Whether to take full width regardless of grid
}

export interface FormInputProps {
  layout?: FormInputLayout;
}
