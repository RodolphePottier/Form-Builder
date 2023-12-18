import { FormField } from "@/app/types/interfaces";
import { TextField } from "@mui/material";
import React from "react";

interface TextFieldComponentProps {
	field: FormField;
	onChange: (fieldId: number, value: string | number) => void;
	value: string | number;
}

const TextFieldComponent: React.FC<TextFieldComponentProps> = ({ field, onChange, value }) => (
	<TextField
		fullWidth
		label={field.fieldName}
		required={field.fieldIsRequired}
		type={field.fieldFormat === 'number' ? 'number' : 'text'}
		variant="standard"
		value={value}
		onChange={(e) => onChange(field.id, e.target.value)}
	/>
);

export default TextFieldComponent;
