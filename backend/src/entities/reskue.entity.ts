import { Entity, PrimaryKey, Property, OneToMany, ManyToOne, Collection, Unique, Cascade } from '@mikro-orm/core';

@Entity()
export class Form {

	@PrimaryKey()
	id!: number;

	@Property()
	@Unique()
	formName!: string;

	@Property()
	description!: string;

	@OneToMany(() => FormField, formField => formField.form, { cascade: [Cascade.PERSIST, Cascade.REMOVE], orphanRemoval: true })
	fields = new Collection<FormField>(this);

	@OneToMany(() => FormResponse, formResponse => formResponse.form, { cascade: [Cascade.PERSIST, Cascade.REMOVE], orphanRemoval: true })
	formResponses = new Collection<FormResponse>(this);
}
@Entity()
export class FormField {

	@PrimaryKey()
	id!: number;

	@Property()
	fieldName!: string;

	@Property()
	fieldType!: string;

	@Property()
	fieldFormat!: string;

	@Property()
	fieldIsRequired!: boolean;

	@ManyToOne(() => Form, { fieldName: 'form_id' })
	form!: Form;

	@OneToMany(() => FieldOption, fieldOption => fieldOption.formField, { cascade: [Cascade.PERSIST, Cascade.REMOVE], orphanRemoval: true })
	fieldOptions = new Collection<FieldOption>(this);

	@OneToMany(() => FieldResponse, fieldResponse => fieldResponse.formField, { cascade: [Cascade.PERSIST, Cascade.REMOVE], orphanRemoval: true })
	fieldResponses = new Collection<FieldResponse>(this);
}

@Entity()
export class FieldOption {

	@PrimaryKey()
	id!: number;

	@Property()
	optionLabel!: string;

	@ManyToOne(() => FormField, { fieldName: 'formField_id' })
	formField!: FormField;

}

@Entity()
export class FormResponse {

	@PrimaryKey()
	id!: number;

	@ManyToOne(() => Form)
	form!: Form;

	@OneToMany(() => FieldResponse, fieldResponse => fieldResponse.formResponse, { cascade: [Cascade.PERSIST, Cascade.REMOVE], orphanRemoval: true })
	fieldResponses = new Collection<FieldResponse>(this);
}

@Entity()
export class FieldResponse {

	@PrimaryKey()
	id!: number;

	@Property()
	responseValue!: string;

	@ManyToOne(() => FormField)
	formField!: FormField;

	@ManyToOne(() => FormResponse)
	formResponse!: FormResponse;
}

@Entity()
export class User {
	@PrimaryKey()
	id: number;

	@Property()
	username: string;

	@Property()
	password: string;
}