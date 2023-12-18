import { FormField } from "@/app/types/interfaces";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

interface SelectionFieldComponentProps {
	field: FormField;
	onChange: (fieldId: number, value: string) => void;
	value: string;
}

const SelectionFieldComponent: React.FC<SelectionFieldComponentProps> = ({ field, onChange, value }) => (
	<FormControl fullWidth>
		<InputLabel required={field.fieldIsRequired}>{field.fieldName}</InputLabel>
		<Select
			label={field.fieldName}
			required={field.fieldIsRequired}
			value={value}
			onChange={(e) => onChange(field.id, e.target.value)}
		>
			{field.fieldOptions?.map(option => (
				<MenuItem key={option.id} value={option.optionLabel}>
					{option.optionLabel}
				</MenuItem>
			))}
		</Select>
	</FormControl>
);

export default SelectionFieldComponent;
