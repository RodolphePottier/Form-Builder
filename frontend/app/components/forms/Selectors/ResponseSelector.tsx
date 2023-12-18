import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { FormResponse } from '@/app/types/interfaces';
import styles from './ResponseSelector.module.css';

interface ResponseSelectorProps {
	selectedResponseIndex: number;
	responses: FormResponse[];
	handleResponseChange: (event: SelectChangeEvent<number>) => void;
}

const ResponseSelector: React.FC<ResponseSelectorProps> = ({ selectedResponseIndex, responses, handleResponseChange }) => {
	return (
		<div className={styles.test}>
			<FormControl fullWidth>
				<InputLabel id="response-selector-label">Select a Response</InputLabel>
				<Select
					labelId="response-selector-label"
					value={selectedResponseIndex}
					label="Select a Response"
					onChange={handleResponseChange}
				>
					{responses.map((response, index) => (
						<MenuItem key={response.id} value={index}>
							Response {index + 1}
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</div>
	);
};

export default ResponseSelector;
