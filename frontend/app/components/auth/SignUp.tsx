'use client'
import React, { useState } from 'react';

import styles from './SignUp.module.css';
import { useSnackbar } from '../snackbar/snackbar';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button, TextField } from '@mui/material';
import { FormConstraints, FormErrorMessages } from './auth.interface';


const formConstraints: FormConstraints = {
	username: {
		min: 3,
		max: 20,
	},
	password: {
		min: 8,
		max: 100,
	},
};

const SignUp = () => {
	const [formErrors, setFormErrors] = useState<FormErrorMessages>({});
	const { showAlert } = useSnackbar();
	const { signInContext } = useAuth();
	const router = useRouter();
	const [formData, setFormData] = useState({
		username: '',
		password: '',
		confirmPassword: '',
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const validateForm = () => {
		let newFormErrors: FormErrorMessages = {};
		let isValid = true;

		if (formData.username.length < formConstraints.username.min || formData.username.length > formConstraints.username.max) {
			newFormErrors.username = `Username must be between ${formConstraints.username.min} and ${formConstraints.username.max} characters.`;
			isValid = false;
		}

		if (formData.password.length < formConstraints.password.min || formData.password.length > formConstraints.password.max) {
			newFormErrors.password = `Password must be between ${formConstraints.password.min} and ${formConstraints.password.max} characters.`;
			isValid = false;
		}

		if (formData.password !== formData.confirmPassword) {
			newFormErrors.confirmPassword = 'Passwords do not match.';
			isValid = false;
		}

		setFormErrors(newFormErrors);
		return isValid;
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		try {
			const { confirmPassword, ...dataToSend } = formData;
			const apiUrl = process.env.API_URL || 'http://localhost:3001';
			const response = await fetch(`${apiUrl}/auth/signup`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(dataToSend),
			});

			if (response.ok) {
				const data = await response.json();

				const accessToken = data.access_token;
				if (accessToken) {

					showAlert('Registration successful and user logged in.', 'success');

					signInContext(accessToken);
					router.push('/');
				}
			} else if (response.status === 409) {
				const { message } = await response.json();
				showAlert(message, 'error');
			}
		} catch (error) {
			console.error('Error during registration', error);
			showAlert('An error occurred during registration. Please try again.', 'error');
		}
	};

	return (
		<div className={styles.container}>
			<h2>Sign Up</h2>
			<form onSubmit={handleSubmit}>
				<div className={styles.fields}>
					<div>
						<TextField
							fullWidth
							label="Username"
							type="text"
							name="username"
							value={formData.username}
							onChange={handleChange}
							className={styles.whiteBackground}
							helperText={formErrors.username}
							error={Boolean(formErrors.username)}
						/>
					</div>
					<div>
						<TextField
							fullWidth
							label="Password"
							type="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							className={styles.whiteBackground}
							helperText={formErrors.password}
							error={Boolean(formErrors.password)}
						/>
					</div>
					<div>
						<TextField
							fullWidth
							label="Confirm Password"
							type="password"
							name="confirmPassword"
							value={formData.confirmPassword}
							onChange={handleChange}
							className={styles.whiteBackground}
							helperText={formErrors.confirmPassword}
							error={Boolean(formErrors.confirmPassword)}
						/>
					</div>
					<Button type="submit" variant="contained" color="primary">
						Register
					</Button>
				</div>
			</form>
		</div>
	);
}

export default SignUp;
