'use client'
import React, { useEffect, useState } from "react";
import { SelectChangeEvent } from "@mui/material";
import { Form } from "@/app/types/interfaces";
import styles from './page.module.css';
import FormUpdater from "./FormUpdater";
import FormSelector from "@/app/components/forms/Selectors/FormSelector";
import withAuthAccess from "@/app/components/auth/WithAuthAccess";

const FormPage = () => {
	const [formNames, setFormNames] = useState<string[]>([]);
	const [selectedFormName, setSelectedFormName] = useState<string>("");
	const [form, setForm] = useState<Form | null>(null);
	const [isFormDeleted, setIsFormDeleted] = useState(false);

	// load form names
	useEffect(() => {
		fetch('http://localhost:3001/forms/names')
			.then(response => response.json())
			.then(setFormNames)
			.catch(console.error);
	}, [isFormDeleted]);

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


	const handleFormDelete = () => {
		setIsFormDeleted(true);
		setForm(null);
	};


	const handleFormNameChange = (event: SelectChangeEvent<string>) => {
		setSelectedFormName(event.target.value);
	};

	return (
		<div className={styles.centeredContainer}>
			<div className={styles.container}>
				<div className={styles.warning}>
					<p>Warning: Modifying or deleting existing fields will erase all associated responses for consistency.</p>
				</div>
				<FormSelector
					formNames={formNames}
					selectedFormName={selectedFormName}
					onFormNameChange={handleFormNameChange}
				/>

				{form && <FormUpdater formData={form} onFormDelete={handleFormDelete} />
				}
			</div>
		</div>
	);
};

export default withAuthAccess(FormPage);