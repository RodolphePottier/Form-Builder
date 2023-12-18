'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Header.module.css';
import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@mui/material';
import { useSnackbar } from '../snackbar/snackbar';
const Header = () => {

	const { isAuthenticated, signOut } = useAuth();
	const { showAlert } = useSnackbar();
	const handleSignOut = () => {
		signOut();
		showAlert('Sign Out successful!', 'success');
	};
	return (
		<header className={styles.header}>
			<nav>
				<ul className={styles.navList}>
					<li><Link href="/">Home</Link></li>
					<li><Link href="/forms/formSubmission">Submission</Link></li>
					<li><Link href="/forms/formResponsesReview">Responses Review</Link></li>
					<li><Link href="/forms/formCreator">Forms Creator</Link></li>
					<li><Link href="/forms/formUpdater">Forms Updater</Link></li>
					{!isAuthenticated ? (
						<li>  <Link href="/auth">
							<Button variant="contained" color="primary">
								Sign In / Sign Up
							</Button>
						</Link></li>
					) : (
						<li><Button
							variant="contained" color="primary" onClick={handleSignOut}>
							Sign Out
						</Button></li>
					)}
				</ul>
			</nav>
		</header>
	);
};

export default Header;
