import { ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { Collection, EntityManager, UniqueConstraintViolationException } from '@mikro-orm/core';
import { CreateFormDTO, FieldOptionDto, CreateFieldDto, CreateResponseDto } from './form.dto';
import { FieldOption, FieldResponse, Form, FormField, FormResponse } from 'src/entities/reskue.entity';

@Injectable()
export class FormService {

	private logger = new Logger(FormService.name);
	constructor(private readonly em: EntityManager) {
	}

	async getFormByName(formName: string): Promise<Form> {
		const form = await this.em.findOne(Form, { formName }, { populate: ['fields', 'fields.fieldOptions'] });

		if (!form) {
			throw new NotFoundException(`Form with name ${formName} not found`);
		}
		return form;
	}

	async getAllForms(): Promise<Form[]> {
		const forms = await this.em.find(Form, {}, { populate: ['fields', 'fields.fieldOptions'] });
		return forms;
	}

	async getAllFormNames(): Promise<string[]> {
		const forms = await this.em.find(Form, {}, { fields: ['formName'] });
		return forms.map(form => form.formName);
	}

	async createForm(createFormDto: CreateFormDTO): Promise<Form> {
		const existingForm = await this.em.findOne(Form, { formName: createFormDto.formName });

		if (existingForm) {
			throw new ConflictException(`A form with name '${createFormDto.formName}' already exists.`);
		}
		if (createFormDto.fields.length === 0) {
			throw new HttpException('At least one field is required for the form.', HttpStatus.BAD_REQUEST);
		}

		const form = new Form();
		form.formName = createFormDto.formName;
		form.description = createFormDto.formDescription;

		// obtain id
		await this.em.persistAndFlush(form);

		// init collection fields with parent
		form.fields = new Collection<FormField>(form);

		// Add formFields tocollection
		const formFields = await this.createFormFields(createFormDto.fields);
		formFields.forEach((formField) => {
			form.fields.add(formField);
		});

		// Persist to save change in the collection
		await this.em.persistAndFlush(form);

		return form;
	}

	private async createFormFields(fieldDataArray: CreateFieldDto[]): Promise<FormField[]> {
		const formFields: FormField[] = [];

		for (const fieldData of fieldDataArray) {

			const formField = new FormField();
			formField.fieldName = fieldData.fieldName;
			formField.fieldType = fieldData.fieldType;
			formField.fieldFormat = fieldData.fieldFormat;
			formField.fieldIsRequired = fieldData.fieldIsRequired;

			const optionsArray = fieldData.fieldOptions && Array.isArray(fieldData.fieldOptions) ? fieldData.fieldOptions : [];

			// init collection Options
			formField.fieldOptions = new Collection<FieldOption>(formField);

			// Add options to the collection
			const options = await this.createFieldOptions(optionsArray);
			options.forEach((option) => {
				formField.fieldOptions.add(option);
			});

			formFields.push(formField);
		}
		return formFields;
	}


	private async createFieldOptions(optionDataArray: FieldOptionDto[]): Promise<FieldOption[]> {
		const fieldOptions: FieldOption[] = [];

		if (Array.isArray(optionDataArray) && optionDataArray.length > 0) {
			for (const optionData of optionDataArray) {
				if (optionData && optionData.optionLabel) {
					const fieldOption = new FieldOption();
					fieldOption.optionLabel = optionData.optionLabel;
					fieldOptions.push(fieldOption);
				}
			}
		}
		return fieldOptions;
	}


	//hasFieldsChanged checks if the fields in a form have been changed during an update.
	private hasFieldsChanged(form: Form, updatedFields: CreateFieldDto[]): boolean {
		const existingFieldIds = form.fields.getItems().map(field => field.id);
		const updatedFieldIds = updatedFields.map(field => field.id);

		// Check if fields have been deleted
		if (existingFieldIds.some(id => !updatedFieldIds.includes(id))) {
			return true;
		}

		// check uopdated fields
		for (const updatedField of updatedFields) {
			const existingField = form.fields.getItems().find(field => field.id === updatedField.id);
			if (existingField && (
				existingField.fieldName !== updatedField.fieldName ||
				existingField.fieldType !== updatedField.fieldType ||
				existingField.fieldFormat !== updatedField.fieldFormat ||
				existingField.fieldIsRequired !== updatedField.fieldIsRequired

			)) {
				return true;
			}
		}

		return false;
	}

	async updateForm(updatedForm: CreateFormDTO): Promise<Form> {
		const form = await this.em.findOne(Form, { id: updatedForm.id }, { populate: ['fields', 'fields.fieldOptions', 'fields.fieldResponses'] });

		if (!form) {
			throw new NotFoundException(`Form with id '${updatedForm.id}' not found`);
		}

		if (updatedForm.fields.length === 0) {
			throw new HttpException('At least one field is required for the form.', HttpStatus.BAD_REQUEST);
		}

		if (updatedForm.formName && updatedForm.formName !== form.formName) {
			const existingForm = await this.em.findOne(Form, { formName: updatedForm.formName });
			if (existingForm && existingForm.id !== form.id) {
				throw new ConflictException(`A form with name '${updatedForm.formName}' already exists.`);
			}
		}

		const fieldsChanged = this.hasFieldsChanged(form, updatedForm.fields);

		if (fieldsChanged) {
			await this.deleteAllResponsesByFormId(updatedForm.id);
		}

		await this.updateFormFields(form, updatedForm.fields);

		form.formName = updatedForm.formName ?? form.formName;
		form.description = updatedForm.formDescription ?? form.description;

		await this.em.persistAndFlush(form);
		return form;
	}


	private async updateFormFields(form: Form, updatedFields: CreateFieldDto[]): Promise<void> {
		for (const updatedFieldData of updatedFields) {
			const formField = this.findOrCreateFormField(form, updatedFieldData);
			this.updateFormField(formField, updatedFieldData);
			await this.updateFieldOptions(formField, updatedFieldData.fieldOptions);
		}
		this.removeUnincludedFields(form, updatedFields);
	}

	private findOrCreateFormField(form: Form, updatedFieldData: CreateFieldDto): FormField {
		if (updatedFieldData.id) {
			const existingField = form.fields.getItems().find(field => field.id === updatedFieldData.id);
			if (existingField) {
				return existingField;
			}
		}
		const newField = new FormField();
		form.fields.add(newField);
		newField.form = form;
		return newField;
	}

	private updateFormField(formField: FormField, updatedFieldData: CreateFieldDto): void {
		formField.fieldName = updatedFieldData.fieldName;
		formField.fieldType = updatedFieldData.fieldType;
		formField.fieldFormat = updatedFieldData.fieldFormat;
		formField.fieldIsRequired = updatedFieldData.fieldIsRequired;
		if (!formField.fieldOptions) {
			formField.fieldOptions = new Collection<FieldOption>(formField);
		}
	}

	// removeUnincludedFields is responsible for removing fields from the form object that are no longer included in the updatedFields data.
	private removeUnincludedFields(form: Form, updatedFields: CreateFieldDto[]): void {
		const updatedFieldIds = updatedFields.map(field => field.id);
		form.fields.getItems().forEach(field => {
			if (!updatedFieldIds.includes(field.id)) {
				form.fields.remove(field);
			}
		});
	}

	private async updateFieldOptions(formField: FormField, optionDataArray: FieldOptionDto[]): Promise<FieldOption[]> {
		const existingOptionIds = formField.fieldOptions.getItems().map(option => option.id);
		const updatedOptions = [];

		for (const optionData of optionDataArray) {
			let fieldOption: FieldOption;

			if (optionData.id && existingOptionIds.includes(optionData.id)) {
				fieldOption = formField.fieldOptions.getItems().find(option => option.id === optionData.id);
			} else if (!optionData.id) {

				fieldOption = new FieldOption();
				formField.fieldOptions.add(fieldOption);
				fieldOption.formField = formField;
			}

			if (fieldOption) {
				fieldOption.optionLabel = optionData.optionLabel;
			}
		}

		const updatedOptionIds = optionDataArray.map(option => option.id);
		formField.fieldOptions.getItems().forEach(option => {
			if (!updatedOptionIds.includes(option.id)) {
				formField.fieldOptions.remove(option);
			}
		});

		return updatedOptions;
	}

	async deleteForm(formId: number): Promise<void> {
		const form = await this.em.findOne(Form, formId, {
			populate: ['fields', 'fields.fieldOptions', 'fields.fieldResponses', 'formResponses', 'formResponses.fieldResponses']
		});
		if (!form) {
			throw new NotFoundException(`Form with id ${formId} not found`);
		}

		await this.em.removeAndFlush(form);
	}

	async deleteFormByName(formName: string): Promise<void> {
		const form = await this.em.findOne(Form, { formName }, {
			populate: ['fields', 'fields.fieldOptions', 'fields.fieldResponses', 'formResponses', 'formResponses.fieldResponses']
		});
		if (!form) {
			throw new NotFoundException(`Form with name '${formName}' not found`);
		}

		await this.em.removeAndFlush(form);
	}

	async submitForm(createResponseDto: CreateResponseDto): Promise<FormResponse> {
		const form = await this.em.findOne(Form, { id: createResponseDto.formId });
		if (!form) {
			throw new NotFoundException(`Form with id '${createResponseDto.formId}' not found`);
		}

		const formResponse = new FormResponse();
		formResponse.form = form;
		formResponse.fieldResponses = new Collection<FieldResponse>(formResponse);

		for (const fieldResponseDto of createResponseDto.fieldResponses) {
			const formField = await this.em.findOne(FormField, { id: fieldResponseDto.formFieldId });
			if (!formField) {
				throw new NotFoundException(`FormField with id '${fieldResponseDto.formFieldId}' not found`);
			}

			const fieldResponse = new FieldResponse();
			fieldResponse.formField = formField;
			fieldResponse.responseValue = fieldResponseDto.responseValue;
			formResponse.fieldResponses.add(fieldResponse);
		}

		await this.em.persistAndFlush(formResponse);
		return formResponse;
	}

	async deleteResponse(responseId: number): Promise<void> {
		const response = await this.em.findOne(FormResponse, { id: responseId }, { populate: ['fieldResponses'] });
		if (!response) {
			throw new NotFoundException(`Response with id '${responseId}' not found`);
		}
		await this.em.removeAndFlush(response);
	}

	async deleteAllResponsesByFormId(formId: number): Promise<void> {
		const form = await this.em.findOne(Form, { id: formId });
		if (!form) {
			throw new NotFoundException(`Form with id '${formId}' not found`);
		}
		const responses = await this.em.find(FormResponse, { form }, { populate: ['fieldResponses'] });
		await this.em.removeAndFlush(responses);
	}

	async getFormResponses(formId: number): Promise<FormResponse[]> {
		const formResponses = await this.em.find(FormResponse, { form: formId }, { populate: ['fieldResponses'] });

		if (!formResponses || formResponses.length === 0) {
			throw new HttpException(`No responses found for form with id ${formId}`, HttpStatus.NOT_FOUND);
		}

		return formResponses;
	}
}