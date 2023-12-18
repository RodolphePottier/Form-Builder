'use client'
import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import styles from './SignIn.module.css';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { useSnackbar } from '../snackbar/snackbar';

const SignIn = () => {
	const { showAlert } = useSnackbar();
	const { signInContext } = useAuth();
	const router = useRouter();
	const [formData, setFormData] = useState({
		username: '',
		password: '',
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			const apiUrl = process.env.API_URL || 'http://localhost:3001';
			const response = await fetch(`${apiUrl}/auth/signin`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});

			if (response.ok) {
				const data = await response.json();

				const accessToken = data.access_token;
				if (accessToken) {
					signInContext(accessToken);
					router.push('/');
				}
			} else {
				showAlert('Login failed. Please try again.', 'error');
				console.error('Login failed');
			}
		} catch (error) {
			console.error('Error during login', error);
		}
	};
	return (
		<div className={styles.container}>
			<h2>Connexion</h2>
			<form onSubmit={handleSubmit}>
				<div className={styles.fields}>
					<div>
						<TextField
							fullWidth
							label="username"
							type="text"
							name="username"
							value={formData.username}
							onChange={handleChange}
							style={{ backgroundColor: 'white' }}
						/>
					</div>
					<div>
						<TextField
							fullWidth
							label="password"
							type="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							style={{ backgroundColor: 'white' }}
						/>
					</div>
					<Button type="submit" variant="contained" color="primary">
						Log in
					</Button>
				</div>
			</form>
		</div>
	);
}


export default SignIn;
