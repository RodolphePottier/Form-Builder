'use client'
import React from 'react'
import styles from './page.module.css';
import SignIn from '../components/auth/SignIn';
import SignUp from '../components/auth/SignUp';
import withUnauthenticatedAccess from '../components/auth/withUnauthenticatedAccess';

const page = () => {
	return (
		<div className={styles.centeredContainer}>
			<div className={styles.container}>
				<SignIn />
				<SignUp />
			</div>
		</div>

	)
}

export default withUnauthenticatedAccess(page);