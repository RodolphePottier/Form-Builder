import { FormConstraints, FormErrorMessages, FormData } from "./auth.interface";

export const formConstraints: FormConstraints = {
	username: {
		min: 3,
		max: 20,
	},
	password: {
		min: 8,
		max: 100,
	},
};

export function validateForm(formData: FormData, formConstraints: FormConstraints) {
	let newFormErrors: FormErrorMessages = {};
	let isValid = true;

	if (formData.username.length < formConstraints.username.min || formData.username.length > formConstraints.username.max) {
		newFormErrors.username = `Le nom d'utilisateur doit contenir entre ${formConstraints.username.min} et ${formConstraints.username.max} caractères.`;
		isValid = false;
	}

	if (formData.password.length < formConstraints.password.min || formData.password.length > formConstraints.password.max) {
		newFormErrors.password = `Le mot de passe doit contenir entre ${formConstraints.password.min} et ${formConstraints.password.max} caractères.`;
		isValid = false;
	}

	if (formData.password !== formData.confirmPassword) {
		newFormErrors.confirmPassword = 'Les mots de passe ne correspondent pas.';
		isValid = false;
	}

	return { isValid, newFormErrors };
}
