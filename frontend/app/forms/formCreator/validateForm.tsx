import { CreateFormField } from "@/app/types/interfaces";

export const validateFormName = (name: string) => {
	if (!name.trim()) {
		return "Form name cannot be empty";
	} else if (name.length > 50) {
		return "Form name cannot exceed 50 characters";
	}
	return "";
};

export const validateFormDescription = (description: string) => {
	if (!description.trim()) {
		return "Description cannot be empty";
	} else if (description.length > 1000) {
		return "Description cannot exceed 1000 characters";
	}
	return "";
};

export const validateFormFields = (fields: CreateFormField[]): Set<number> => {
	const newInvalidFields = new Set<number>();

	if (fields.length === 0) {
		return newInvalidFields;
	}

	fields.forEach((field, index) => {
		// validation for empty field name
		if (!field.fieldName.trim()) {
			newInvalidFields.add(index);
		}
		if (['selection', 'checkbox'].includes(field.fieldFormat)) {
			if (field.fieldOptions.length === 0 || field.fieldOptions.some(option => !option.optionLabel.trim())) {
				newInvalidFields.add(index);
			}
		}
	});

	return newInvalidFields;
};
