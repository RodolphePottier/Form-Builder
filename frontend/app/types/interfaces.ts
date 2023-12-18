export type FieldFormat = 'text' | 'number' | 'date' | 'selection' | 'checkbox';

export interface Form {
	id: number;
	formName: string;
	description: string;
	fields: FormField[];
}

export interface FormField {
	id: number;
	fieldName: string;
	fieldType: string;
	fieldFormat: FieldFormat;
	fieldIsRequired: boolean;
	form: number;
	fieldOptions: FieldOption[];
}

export interface FieldOption {
	id: number;
	optionLabel: string;
	formField: number;
}

export interface CreateForm {
	id?:number;
	formName: string;
	formDescription: string;
	fields: CreateFormField[];
}

export interface CreateFormField {
	id?:number;
	fieldName: string;
	fieldType: string;
	fieldFormat: FieldFormat;
	fieldIsRequired: boolean;
	fieldOptions: CreateFieldOption[];
}

export interface CreateFieldOption {
	optionLabel: string;
}

export interface FormResponse {
    id: number;
    form: number;
    fieldResponses: FieldResponse[];
}

export interface FieldResponse {
    id: number;
    responseValue: string;
    formField: number;
    formResponse: number;
}
