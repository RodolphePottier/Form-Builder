import styles from './FormResponsesReview.module.css';
import { FieldResponse, Form, FormField, FormResponse } from '@/app/types/interfaces';

interface FormResponsesReviewProps {
	form: Form;
	responses: FormResponse[];
	selectedResponseIndex: number;
}

interface FormResponsesReviewProps {
	form: Form;
	responses: FormResponse[];
	selectedResponseIndex: number;
}

const FormResponsesReview: React.FC<FormResponsesReviewProps> = ({ form, responses, selectedResponseIndex }) => {
	const renderFieldElement = (field: FormField, responseForField: FieldResponse | undefined) => (
		<div key={field.id} className={styles.fieldElement}>
			<p><strong>{field.fieldName}:</strong></p>
			<p> {responseForField ? responseForField.responseValue : 'No response'}</p>
		</div>
	);

	const renderResponse = () => {
		const response = responses[selectedResponseIndex];

		return response ? (
			form.fields.map((field: FormField) => {
				const responseForField = response.fieldResponses.find(fr => fr.formField === field.id);
				return renderFieldElement(field, responseForField);
			})
		) : (
			<div className={styles.noResponse}>
				{responses.length === 0 ? "No responses available for this form." : "No response selected or available."}
			</div>
		);
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
