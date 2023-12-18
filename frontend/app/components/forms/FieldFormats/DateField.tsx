import { FormField } from "@/app/types/interfaces";
import { TextField } from "@mui/material";

interface DateFieldComponentProps {
	field: FormField;
	onChange: (fieldId: number, value: string) => void;
	value: string;
}

const DateFieldComponent: React.FC<DateFieldComponentProps> = ({ field, onChange, value }) => (
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

export default DateFieldComponent;
