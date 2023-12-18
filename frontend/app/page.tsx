import Link from 'next/link'
import styles from './page.module.css'

export default function Home() {
	return (
		<main className={styles.mainContainer}>
			<h1 className={styles.title}>Welcome to Our Form Management Application</h1>
			<div className={styles.cardContainer}>
				<Link href="/forms/formCreator">
					<div className={styles.card}>
						<h2 className={styles.cardTitle}>Create a new form</h2>
						<p className={styles.cardDescription}>Start creating your own forms with ease.</p>
					</div>
				</Link>
				<Link href="/forms/formUpdater">
					<div className={styles.card}>
						<h2 className={styles.cardTitle}>Edit an existing form</h2>
						<p className={styles.cardDescription}>Modify your existing forms to meet your needs.</p>
					</div>
				</Link>
				<Link href="/forms/formSubmission">
					<div className={styles.card}>
						<h2 className={styles.cardTitle}>Respond to various forms</h2>
						<p className={styles.cardDescription}>Participate in different forms created by others.</p>
					</div>
				</Link>
				<Link href="/forms/formResponsesReview">
					<div className={styles.card}>
						<h2 className={styles.cardTitle}>View responses associated with different forms</h2>
						<p className={styles.cardDescription}>Review the responses submitted to your forms.</p>
					</div>
				</Link>
			</div>
		</main>
	)
}
