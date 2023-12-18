'use client'

import React from 'react'
import FormCreator from './FormCreator'
import styles from './page.module.css';
import withAuthAccess from '@/app/components/auth/WithAuthAccess';

const page = () => {
	return (
		<div className={styles.centeredContainer}>
			<FormCreator />
		</div>
	)
}
export default withAuthAccess(page);