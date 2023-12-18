import { IsNotEmpty, IsIn, IsOptional, IsArray, ValidateNested, IsString, IsBoolean, IsNumber, ValidateIf, MaxLength, Length } from 'class-validator';
import { Type } from 'class-transformer';
import { Optional } from '@nestjs/common';

enum FieldType {
	Text = 'string',
	Number = 'number',
}

enum FieldFormat {
	Text = 'text',
	Number = 'number',
	Date = 'date',
	Selection = 'selection',
	Checkbox = 'checkbox',
}

export class FieldOptionDto {
	@IsOptional()
	@IsNumber()
	id?: number;

	@IsString()
	@IsNotEmpty()
	@MaxLength(100)
	optionLabel: string;
}

export class CreateFieldDto {
	@IsOptional()
	@IsNumber()
	id?: number;

	@IsString()
	@IsNotEmpty()
	@Length(1, 50)
	fieldName: string;

	@IsNotEmpty()
	@IsIn(Object.values(FieldType))
	fieldType: FieldType;

	@IsString()
	@IsNotEmpty()
	@IsIn(Object.values(FieldFormat))
	fieldFormat: FieldFormat;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => FieldOptionDto)
	fieldOptions?: FieldOptionDto[];

	@IsNotEmpty()
	@IsBoolean()
	fieldIsRequired?: boolean;
}

export class CreateFormDTO {
	@IsOptional()
	@IsNumber()
	id?: number;

	@IsString()
	@IsNotEmpty()
	@Length(1, 50, { message: 'Form name must be less than or equal to 50 characters.' })
	formName: string;

	@IsString()
	@IsNotEmpty()
	@Length(1, 1000)
	formDescription: string;

	@IsArray()
	@IsNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => CreateFieldDto)
	fields: CreateFieldDto[];
}


export class CreateResponseDto {
	@IsNumber()
	@IsNotEmpty()
	formId: number;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => FieldResponseDto)
	fieldResponses: FieldResponseDto[];
}

export class FieldResponseDto {
	@IsNumber()
	@IsNotEmpty()
	formFieldId: number;

	@IsNotEmpty()
	@IsString()
	@Length(1, 1000)
	responseValue: string;
}