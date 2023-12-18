import { FormField } from "@/app/types/interfaces";
import { Checkbox, FormControl, FormControlLabel, FormLabel } from "@mui/material";

interface CheckboxFieldComponentProps {
	field: FormField;
	onChange: (fieldId: number, value: string[]) => void;
	value: string[];
}

const CheckboxFieldComponent: React.FC<CheckboxFieldComponentProps> = ({ field, onChange, value }) => (
	<FormControl component="fieldset" fullWidth>
		<FormLabel component="legend" required={field.fieldIsRequired}>{field.fieldName}</FormLabel>
		{field.fieldOptions?.map(option => (
			<FormControlLabel
				key={option.id}
				control={
					<Checkbox
						checked={value.includes(option.optionLabel)}
						onChange={(e) => {
							const newValue = e.target.checked
								? [...value, option.optionLabel]
								: value.filter(val => val !== option.optionLabel);
							onChange(field.id, newValue);
						}}
					/>
				}
				label={option.optionLabel}
			/>
		))}
	</FormControl>
);

export default CheckboxFieldComponent;
