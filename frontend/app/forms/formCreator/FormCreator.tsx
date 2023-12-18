'use client';
import React, { useState } from 'react';
import CreateFormFieldComponent from './CreateFormFieldComponent';
import { Button, TextField } from '@mui/material';
import { CreateFormField } from '@/app/types/interfaces';

import styles from './FormCreator.module.css';
import { Severity, useSnackbar } from '@/app/components/snackbar/snackbar';
import { validateFormDescription, validateFormFields, validateFormName } from './validateForm';

const displayValidationErrors = (
	formNameError: string,
	formDescriptionError: string,
	invalidFieldIndices: Set<number>,
	formFields: CreateFormField[],
	showAlert: (message: string, severity: Severity) => void
) => {
	if (formNameError) {
		showAlert(`Form Name: ${formNameError}`, 'warning');
	}
	if (formDescriptionError) {
		showAlert(`Description: ${formDescriptionError}`, 'warning');
	}
	if (formFields.length === 0) {
		showAlert('You must add at least one field to the form.', 'warning');
	}
	if (invalidFieldIndices.size > 0) {
		showAlert('Some fields have errors. Please correct them before submitting.', 'warning');
	}
};

const FormCreator = () => {
	const [formName, setFormName] = useState<string>('');
	const [formDescription, setDescription] = useState<string>('');
	const [formFields, setFormFields] = useState<CreateFormField[]>([]);

	const [isFormNameValid, setIsFormNameValid] = useState(true);
	const [isDescriptionValid, setIsDescriptionValid] = useState(true);

	const [invalidFields, setInvalidFields] = useState<Set<number>>(new Set());

	const { showAlert } = useSnackbar();

	const addFormField = () => {
		setFormFields(formFields => [...formFields, {
			fieldName: '',
			fieldType: 'string',
			fieldFormat: 'text',
			fieldIsRequired: false,
			fieldOptions: []
		}]);
	};

	const duplicateFormField = (index: number) => {
		setFormFields(formFields => [
			...formFields.slice(0, index + 1),
			{ ...formFields[index] },
			...formFields.slice(index + 1)
		]);
	};

	const removeFormField = (index: number) => {
		setFormFields(formFields =>
			formFields.filter((_, idx) => idx !== index)
		);
	};
	const handleFieldUpdate = (index: number, updatedField: CreateFormField) => {
		setFormFields(formFields =>
			formFields.map((field, idx) => idx === index ? updatedField : field)
		);
	};

	const handleSubmit = async () => {
		const formNameError = validateFormName(formName);
		const formDescriptionError = validateFormDescription(formDescription);
		const invalidFieldIndices = validateFormFields(formFields);

		setIsFormNameValid(!formNameError);
		setIsDescriptionValid(!formDescriptionError);
		setInvalidFields(invalidFieldIndices);

		if (formFields.length === 0 || formNameError || formDescriptionError || invalidFieldIndices.size > 0) {
			displayValidationErrors(formNameError, formDescriptionError, invalidFields, formFields, showAlert);

			return;
		}
		console.log("formNameError");
		console.log(formNameError);
		displayValidationErrors(formNameError, formDescriptionError, invalidFields, formFields, showAlert);


		const payload = { formName, formDescription, fields: formFields };

		try {
			const apiUrl = process.env.API_URL || 'http://localhost:3001';
			const response = await fetch(`${apiUrl}/forms`, {
				method: "POST",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload)
			});

			if (response.ok) {
				showAlert('Form submitted successfully!', 'success');
			} else {
				const errorData = await response.json();
				showAlert(errorData.message || 'Failed to submit the form. Please try again.', 'error');
			}
		} catch (error) {
			console.error('Error submitting form:', error);
			showAlert('An error occurred while submitting the form.', 'error');
		}
	};

	return (
		<div className={styles.formCreator}>
			<div className={styles.formHeader}>
				<TextField
					label="Form Name"
					value={formName}
					onChange={(e) => setFormName(e.target.value)}
					fullWidth
					error={!isFormNameValid}
				/>
				<TextField
					label="Description"
					value={formDescription}
					onChange={(e) => setDescription(e.target.value)}
					fullWidth
					error={!isDescriptionValid}
				/>
			</div>
			{formFields.map((field, index) => (
				<div key={index}>
					<CreateFormFieldComponent
						fieldDetails={field}
						updateField={(updatedField) => handleFieldUpdate(index, updatedField)}
						duplicateField={() => duplicateFormField(index)}
						removeField={() => removeFormField(index)}
						isInvalid={invalidFields.has(index)}
					/>
				</div>
			))}
			<div className={styles.buttons}>
				<Button variant="contained" color="primary" onClick={addFormField}>Add Field</Button>
				<Button variant="contained" color="primary" onClick={handleSubmit}>Submit All Fields</Button>
			</div>
		</div>
	);
};

export default FormCreator;

