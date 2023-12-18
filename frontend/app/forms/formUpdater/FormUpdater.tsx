
'use client';
import React, { useState, useEffect } from 'react';
import { Button, TextField } from '@mui/material';
import { CreateForm, CreateFormField, Form } from '@/app/types/interfaces';
import { Severity, useSnackbar } from '@/app/components/snackbar/snackbar';
import styles from './FormUpdater.module.css';
import CreateFormFieldComponent from '../formCreator/CreateFormFieldComponent';
import ConfirmDialog from '@/app/components/ConfirmDialog';
import { validateFormDescription, validateFormName, validateFormFields } from '../formCreator/validateForm';
import { useRouter } from 'next/navigation';

interface FormUpdaterProps {
	formData: Form;
	onFormDelete: () => void;
}

const displayValidationErrors = (
	formNameError: string,
	formDescriptionError: string,
	invalidFieldIndices: Set<number>,
	showAlert: (message: string, severity: Severity) => void
) => {
	if (formNameError) {
		showAlert(`Form Name: ${formNameError}`, 'warning');
	}
	if (formDescriptionError) {
		showAlert(`Description: ${formDescriptionError}`, 'warning');
	}
	if (invalidFieldIndices.size > 0) {
		showAlert('Some fields have errors. Please correct them before submitting.', 'warning');
	}
};

const FormUpdater: React.FC<FormUpdaterProps> = ({ formData, onFormDelete }) => {
	const [formId, setFormId] = useState<number | null>(null);
	const [formName, setFormName] = useState<string>('');
	const [formDescription, setDescription] = useState<string>('');
	const [formFields, setFormFields] = useState<CreateFormField[]>([]);

	const [isFormNameValid, setIsFormNameValid] = useState(true);
	const [isDescriptionValid, setIsDescriptionValid] = useState(true);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	const [invalidFields, setInvalidFields] = useState<Set<number>>(new Set());

	const { showAlert } = useSnackbar();
	const router = useRouter();

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
		const newField = { ...formFields[index] };
		//if is a new field, we delete id to let database provide auto id to the field
		delete newField.id;

		setFormFields(formFields => [
			...formFields.slice(0, index + 1),
			newField,
			...formFields.slice(index + 1)
		]);
	};

	const removeFormField = (index: number) => {
		setFormFields(formFields => formFields.filter((_, idx) => idx !== index));
	};

	useEffect(() => {
		if (formData) {
			setFormId(formData.id);
			setFormName(formData.formName);
			setDescription(formData.description);
			setFormFields(formData.fields.map(field => ({
				...field,
				fieldType: field.fieldType as any
			})));
		}
	}, [formData]);

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

		if (formId === null) {
			console.error("Form ID is not set");
			return;
		}

		if (formFields.length === 0 || formNameError || formDescriptionError || invalidFieldIndices.size > 0) {
			displayValidationErrors(formNameError, formDescriptionError, invalidFields, showAlert);
			return;
		}

		const payload: CreateForm = {
			id: formId,
			formName,
			formDescription,
			fields: formFields
		};

		try {
			const apiUrl = process.env.API_URL || 'http://localhost:3001';
			const response = await fetch(`${apiUrl}/forms/update`, {
				credentials: "include",
				method: "POST",
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


	const handleDeleteButtonClick = () => {
		setIsDeleteDialogOpen(true);
	};

	const handleFormDelete = async () => {
		setIsDeleteDialogOpen(false);

		if (!formId) {
			showAlert('Form ID is not set', 'error');
			return;
		}

		const apiUrl = process.env.API_URL || 'http://localhost:3001';
		const response = await fetch(`${apiUrl}/forms/by-name/${formName}`, {
			credentials: "include",
			method: "DELETE"
		});

		if (response.ok) {
			showAlert('Form deleted successfully', 'success');
			onFormDelete();
		} else {
			showAlert('Failed to delete the form', 'error');
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
					helperText={!isFormNameValid && "Form name cannot be empty"}
				/>
				<TextField
					label="Description"
					value={formDescription}
					onChange={(e) => setDescription(e.target.value)}
					fullWidth
					error={!isDescriptionValid}
					helperText={!isDescriptionValid && "Description cannot be empty"}
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
				<Button variant="contained" color="primary" onClick={handleSubmit}>Submit Form</Button>
				<Button variant="contained" onClick={handleDeleteButtonClick} style={{ backgroundColor: 'red', color: 'white' }}>Delete Form</Button>
			</div>
			<ConfirmDialog
				open={isDeleteDialogOpen}
				onClose={() => setIsDeleteDialogOpen(false)}
				onConfirm={handleFormDelete}
				title="Confirm Delete"
				content="Are you sure you want to delete this form? This action is definitive."
			/>
		</div>
	);
};

export default FormUpdater;
