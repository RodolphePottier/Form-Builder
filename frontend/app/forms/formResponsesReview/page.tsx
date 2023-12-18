'use client'
import React, { useState, useEffect } from 'react';
import { SelectChangeEvent } from '@mui/material';
import { Form, FormResponse } from '@/app/types/interfaces';
import styles from './page.module.css';
import FormSelector from '@/app/components/forms/Selectors/FormSelector';
import ResponseSelector from '@/app/components/forms/Selectors/ResponseSelector';
import FormResponsesReview from './FormResponsesReview';

const FormResponsePage = () => {
	const [formNames, setFormNames] = useState<string[]>([]);
	const [selectedFormName, setSelectedFormName] = useState<string>("");
	const [form, setForm] = useState<Form | null>(null);
	const [responses, setResponses] = useState<FormResponse[]>([]);
	const [selectedResponseIndex, setSelectedResponseIndex] = useState<number>(0);

	useEffect(() => {
		fetch('http://localhost:3001/forms/names')
			.then(response => response.json())
			.then(setFormNames)
			.catch(console.error);
	}, []);

	useEffect(() => {
		if (selectedFormName) {
			const url = `http://localhost:3001/forms/by-name/${encodeURIComponent(selectedFormName)}`;
			fetch(url)
				.then(response => response.json())
				.then(form => {
					setForm(form);
					setResponses([]);
				})
				.catch(console.error);
		}
	}, [selectedFormName]);

	useEffect(() => {
		if (form?.id) {
			fetch(`http://localhost:3001/forms/response/${form.id}`)
				.then(res => res.json())
				.then(data => {
					setResponses(Array.isArray(data.responses) ? data.responses : []);
				})
				.catch(console.error);
		}
	}, [form?.id]);


	const handleFormNameChange = (event: SelectChangeEvent<string>) => {
		setSelectedFormName(event.target.value);
	};

	const handleResponseChange = (event: SelectChangeEvent<number>) => {
		setSelectedResponseIndex(event.target.value as number);
	};

	return (
		<div className={styles.centeredContainer}>
			<div className={styles.container}>
				<div className={styles.selectors}>
					<FormSelector
						formNames={formNames}
						selectedFormName={selectedFormName}
						onFormNameChange={handleFormNameChange}
					/>

					{form && responses && responses.length > 0 && (
						<ResponseSelector
							selectedResponseIndex={selectedResponseIndex}
							responses={responses}
							handleResponseChange={handleResponseChange}
						/>
					)}
				</div>
				{form && (
					<FormResponsesReview
						form={form}
						responses={responses}
						selectedResponseIndex={selectedResponseIndex}
					/>
				)}
			</div>
		</div>
	);
};

export default FormResponsePage;
