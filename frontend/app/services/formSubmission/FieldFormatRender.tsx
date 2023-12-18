import { FormField } from "@/app/types/interfaces";
import { Checkbox, FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Select, TextField } from "@mui/material";

interface FieldDetailsProps {
	field: FormField;
	onChange: (fieldId: number, value: string | number) => void;
	value: any;
}

export const renderTextField = ({
	field,
	onChange,
	value,
}: FieldDetailsProps) => (
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

export const renderDateField = ({
	field,
	onChange,
	value,
}: FieldDetailsProps) => (
	<TextField
		fullWidth
		type="date"
		label={field.fieldName}
		InputLabelProps={{ shrink: true }}
		required={field.fieldIsRequired}
		variant="standard"
		value={value}
		onChange={(e) => onChange(field.id, e.target.value)}
	/>
);

export const renderSelectionField = ({
	field,
	onChange,
	value,
}: FieldDetailsProps) => (
	<FormControl fullWidth>
		<InputLabel required={field.fieldIsRequired}>{field.fieldName}</InputLabel>
		<Select
			label={field.fieldName}
			required={field.fieldIsRequired}
			value={value}
			onChange={(e) => onChange(field.id, e.target.value)}
		>
			{field.fieldOptions.map((option) => (
				<MenuItem key={option.id} value={option.optionLabel}>
					{option.optionLabel}
				</MenuItem>
			))}
		</Select>
	</FormControl>
);

export const renderCheckboxField = ({
	field,
	onChange,
	value,
}: FieldDetailsProps) => (
	<FormControl component="fieldset" fullWidth>
		<FormLabel component="legend" required={field.fieldIsRequired}>
			{field.fieldName}
		</FormLabel>
		{field.fieldOptions.map((option) => (
			<FormControlLabel
				key={option.id}
				control={
					<Checkbox
						checked={value?.includes(option.optionLabel) || false}
						onChange={(e) =>
							onChange(
								field.id,
								e.target.checked
									? [...(value || []), option.optionLabel]
									: value.filter((label: string) => label !== option.optionLabel)
							)
						}
					/>
				}
				label={option.optionLabel}
			/>
		))}
	</FormControl>
);
