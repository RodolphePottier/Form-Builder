'use client';
import React from 'react';
import { TextField, Select, MenuItem, FormControlLabel, Switch, Button, IconButton } from '@mui/material';
import styles from './CreateFormFieldComponent.module.css';
import { CreateFormField, CreateFieldOption, FieldFormat } from '@/app/types/interfaces';
import CancelIcon from '@mui/icons-material/Cancel';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

interface CreateFormFieldComponentProps {
	fieldDetails: CreateFormField;
	updateField: (updatedField: CreateFormField) => void;
	duplicateField: () => void;
	removeField: () => void;
	isInvalid: boolean;
}

const CreateFormFieldComponent: React.FC<CreateFormFieldComponentProps> = ({
	fieldDetails,
	updateField,
	duplicateField,
	removeField,
	isInvalid
}) => {

	const handleFieldDetailChange = (key: keyof CreateFormField, value: any) => {
		const updatedDetails = { ...fieldDetails, [key]: value };
		updateField(updatedDetails);
	};

	const addFieldOption = () => {
		const newOption: CreateFieldOption = { optionLabel: '' };
		const updatedDetails = {
			...fieldDetails,
			fieldOptions: [...fieldDetails.fieldOptions, newOption]
		};
		updateField(updatedDetails);
	};

	const updateFieldOption = (index: number, optionLabel: string) => {
		const updatedOptions = fieldDetails.fieldOptions.map((option, idx) =>
			idx === index ? { ...option, optionLabel: optionLabel } : option
		);
		updateField({ ...fieldDetails, fieldOptions: updatedOptions });
	};


	const removeFieldOption = (index: number) => {
		const updatedOptions = fieldDetails.fieldOptions.filter((_, idx) => idx !== index);
		updateField({ ...fieldDetails, fieldOptions: updatedOptions });
	};

	const renderFieldOptions = () => {
		return fieldDetails.fieldOptions.map((option, index) => (
			<div key={index} className={styles.optionRow}>
				<TextField
					label="Option Label"
					variant="standard"
					value={option.optionLabel}
					onChange={(e) => updateFieldOption(index, e.target.value)}
					fullWidth
					required
				/>
				<IconButton onClick={() => removeFieldOption(index)} color="primary">
					<CancelIcon />
				</IconButton>
			</div>
		));
	};

	return (
		<div className={`${styles.container} ${isInvalid ? styles.invalid : ''}`}>
			<div className={styles.topRow}>
				<TextField
					label="Field Name"
					variant="standard"
					value={fieldDetails.fieldName}
					onChange={(e) => handleFieldDetailChange('fieldName', e.target.value)}
					fullWidth
					required
				/>
				<FormControlLabel
					control={
						<Switch
							checked={fieldDetails.fieldIsRequired}
							onChange={(e) => handleFieldDetailChange('fieldIsRequired', e.target.checked)}
						/>
					}
					label="Required"
				/>
			</div>
			<div className={styles.fieldFormat}>
				<Select
					value={fieldDetails.fieldFormat}
					onChange={(e) => handleFieldDetailChange('fieldFormat', e.target.value as FieldFormat)}
					fullWidth
				>
					<MenuItem value="text">Text</MenuItem>
					<MenuItem value="number">Number</MenuItem>
					<MenuItem value="date">Date</MenuItem>
					<MenuItem value="selection">Dropdown list</MenuItem>
					<MenuItem value="checkbox">Checkbox</MenuItem>
				</Select>
			</div>
			{(fieldDetails.fieldFormat === 'selection' || fieldDetails.fieldFormat === 'checkbox') && (
				<>
					{renderFieldOptions()}
					<Button onClick={addFieldOption}>Add Option</Button>
				</>
			)}
			<div className={styles.actionButtons}>
				<IconButton onClick={duplicateField} color="primary">
					<ContentCopyIcon />
				</IconButton>
				<IconButton onClick={removeField} >
					<DeleteOutlineIcon color="primary" />
				</IconButton>
			</div>
		</div>
	);
};

export default CreateFormFieldComponent;
