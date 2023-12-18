'use client'
import React, { useEffect, useState } from "react";
import { SelectChangeEvent } from "@mui/material";
import { Form } from "@/app/types/interfaces";
import styles from './page.module.css';
import FormSelector from "@/app/components/forms/Selectors/FormSelector";
import FormSubmission from "./FormSubmission";

const FormPage = () => {
	const [formNames, setFormNames] = useState<string[]>([]);
	const [selectedFormName, setSelectedFormName] = useState<string>("");
	const [form, setForm] = useState<Form | null>(null);

	// load form names
	useEffect(() => {
		fetch('http://localhost:3001/forms/names')
			.then(response => response.json())
			.then(setFormNames)
			.catch(console.error);
	}, []);

	// load form details
	useEffect(() => {
		if (selectedFormName) {
			const url = `http://localhost:3001/forms/by-name/${encodeURIComponent(selectedFormName)}`;
			fetch(url)
				.then(response => response.json())
				.then(setForm)
				.catch(console.error);
		}
	}, [selectedFormName]);

	const handleFormNameChange = (event: SelectChangeEvent<string>) => {
		setSelectedFormName(event.target.value);
	};

	return (
		<div className={styles.centeredContainer}>
			<div className={styles.container}>
				<FormSelector
					formNames={formNames}
					selectedFormName={selectedFormName}
					onFormNameChange={handleFormNameChange}
				/>

				{form && <FormSubmission form={form} />}
			</div>
		</div>
	);
};

export default FormPage;