export interface FormConstraints {
	username: {
		min: number;
		max: number;
	};
	password: {
		min: number;
		max: number;
	};
}

export interface FormErrorMessages {
	username?: string;
	password?: string;
	confirmPassword?: string;
}

export interface FormData {
	username: string;
	password: string;
	confirmPassword: string;
}