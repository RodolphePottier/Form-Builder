import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import styles from './FormSelector.module.css';

interface FormSelectorProps {
	formNames: string[];
	selectedFormName: string;
	onFormNameChange: (event: SelectChangeEvent<string>) => void;
}

const FormSelector: React.FC<FormSelectorProps> = ({ formNames, selectedFormName, onFormNameChange }) => {
	return (
		<div className={styles.test}>
			<FormControl fullWidth className={styles.container}>
				<InputLabel id="form-name-label" >Select a form</InputLabel>
				<Select
					labelId="form-name-label"
					value={selectedFormName}
					label="Select a form"
					onChange={onFormNameChange}
					className={styles.mySelectStyle}
				>
					{Array.isArray(formNames) && formNames.map(name => (
						<MenuItem key={name} value={name}>{name}</MenuItem>
					))}
				</Select>
			</FormControl>
		</div>
	);
};

export default FormSelector;
