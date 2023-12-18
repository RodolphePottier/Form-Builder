
import React, { useCallback, useState } from 'react';
import {
	Button
} from '@mui/material';
import styles from './FormSubmission.module.css';
import { Form, FormField } from '@/app/types/interfaces';
import { useSnackbar } from '@/app/components/snackbar/snackbar';
import { renderTextField, renderDateField, renderSelectionField, renderCheckboxField } from '../../services/formSubmission/FieldFormatRender';

interface FormSubmissionProps {
	form: Form;
}

const FormSubmission: React.FC<FormSubmissionProps> = ({ form }) => {
	const [formData, setFormData] = useState<Record<number, any>>({});
	const { showAlert } = useSnackbar();

	const handleFieldChange = useCallback((fieldId: number, value: any) => {
		setFormData((formData) => {
			// delete key if no option selected in checkbox
			if (Array.isArray(value) && value.length === 0) {
				const newData = { ...formData };
				delete newData[fieldId];
				return newData;
			}
			return { ...formData, [fieldId]: value };
		});
	}, []);


	const validateField = (field: FormField, value: any): boolean => {
		switch (field.fieldFormat) {
			case 'checkbox':
				return Array.isArray(value) && value.length > 0;
			case 'date':
				return value && value.trim() !== '';
			default:
				return value !== null && value !== undefined;
		}
	};

	const handleSubmit = async () => {
		let allRequiredFieldsFilled = true;

		for (const field of form.fields) {
			if (field.fieldIsRequired) {
				const value = formData[field.id];

				const isValidField = validateField(field, value);

				if (!isValidField) {
					allRequiredFieldsFilled = false;
					break;
				}
			}
		}


		if (!allRequiredFieldsFilled) {
			showAlert('Please fill in all required fields.', 'warning');
			return;
		}

		const requestPayload = {
			formId: form.id,
			fieldResponses: Object.entries(formData).map(([fieldId, responseValue]) => ({
				formFieldId: Number(fieldId),
				responseValue: Array.isArray(responseValue) ? responseValue.join(', ') : responseValue,
			})),
		};

		const apiUrl = process.env.API_URL || 'http://localhost:3001';
		const response = await fetch(`${apiUrl}/forms/submit`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(requestPayload),
		});
		if (response.ok) {
			showAlert('Form submitted successfully!', 'success');
		} else {
			showAlert('Failed to submit the form. Please try again.', 'error');
		}

		console.log('Soumission du formulaire:', JSON.stringify(requestPayload));
	};

	const renderField = useCallback((field: FormField) => {
		const fieldRenderers = {
			text: renderTextField,
			number: renderTextField,
			date: renderDateField,
			selection: renderSelectionField,
			checkbox: renderCheckboxField,
		};

		const FieldRenderer = fieldRenderers[field.fieldFormat];
		return FieldRenderer ? (
			<div className={`${styles.fieldElement} input-field`}>
				<FieldRenderer field={field} onChange={handleFieldChange} value={formData[field.id] || ''} />
			</div>
		) : null;
	}, [formData, handleFieldChange]);

	return (
		<div className={styles.container}>
			{form.fields.map(field => (
				<div key={field.id} className={styles.fieldContainer}>
					{renderField(field)}
				</div>
			))}
			<Button variant="contained" color="primary" onClick={handleSubmit}>
				Submit
			</Button>
		</div>
	);
};

export default FormSubmission;
