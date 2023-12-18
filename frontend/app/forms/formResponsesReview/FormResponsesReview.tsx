import styles from './FormResponsesReview.module.css';
import { Form, FormResponse } from '@/app/types/interfaces';

interface FormResponsesReviewProps {
	form: Form;
	responses: FormResponse[];
	selectedResponseIndex: number;
}

const FormResponsesReview: React.FC<FormResponsesReviewProps> = ({ form, responses, selectedResponseIndex }) => {

	const renderResponse = () => {
		if (responses.length === 0) {
			return <div className={styles.noResponse}>No responses available for this form.</div>;
		}
		const response = responses[selectedResponseIndex];
		if (!response) {
			return <div className={styles.noResponse}>No response selected or available.</div>;
		}

		return form.fields.map(field => {
			const fieldResponse = response.fieldResponses.find(fr => fr.formField === field.id);
			const responseValue = fieldResponse ? fieldResponse.responseValue : 'No response';

			return (
				<div key={field.id} className={styles.fieldElement}>
					<p><strong>{field.fieldName}:</strong></p>
					<p> {responseValue}</p>
				</div>
			);
		});
	};

	return (
		<div className={styles.container}>
			<div className={styles.fieldContainer}>
				{renderResponse()}
			</div>
		</div>
	);
};

export default FormResponsesReview;