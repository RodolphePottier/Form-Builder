import { Controller, Get, Post, Body, HttpCode, ValidationPipe, UsePipes, Param, Delete, Put, Logger, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CreateFormDTO, CreateResponseDto } from './form.dto';
import { FormService } from './form.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('forms')
export class FormController {

	private logger = new Logger(FormController.name);
	constructor(private readonly formService: FormService) { }

	@Get()
	@HttpCode(200)
	async getAllForms() {
		const forms = await this.formService.getAllForms();
		return forms;
	}

	@Get('/names')
	@HttpCode(200)
	async getAllFormNames(): Promise<string[]> {
		return this.formService.getAllFormNames();
	}

	@Get('/by-name/:formName')
	@HttpCode(200)
	async getFormByName(
		@Param('formName') formName: string) {
		const form = await this.formService.getFormByName(formName);
		return form;
	}

	@Post()
	@HttpCode(201)
	@UseGuards(JwtAuthGuard)
	@UsePipes(new ValidationPipe({ whitelist: true }))
	async createForm(@Body() createFormDto: CreateFormDTO) {
		this.logger.log("CREATE");
		const createdForm = await this.formService.createForm(createFormDto);
		return createdForm;
	}

	@Post('/update')
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	async updateForm(@Body() updatedFormDto: CreateFormDTO) {
		this.logger.log("UPDATE");
		const updatedForm = await this.formService.updateForm(updatedFormDto);
		return updatedFormDto;
	}

	@Post('/submit')
	@HttpCode(201)
	async submitForm(@Body() createResponseDto: CreateResponseDto) {
		this.logger.log("SUBMIT");
		this.logger.log(JSON.stringify(createResponseDto));
		const createdResponseForm = await this.formService.submitForm(createResponseDto);
		return { message: 'Form response submitted successfully', data: createdResponseForm };
	}

	@Get('/response/:formId')
	@HttpCode(200)
	async getResponse(@Param('formId', ParseIntPipe) formId: number) {
		this.logger.log("GET RESPONSE");
		const responses = await this.formService.getFormResponses(formId);
		return { responses };
	}

	@Delete('/response/:responseId')
	@UseGuards(JwtAuthGuard)
	@HttpCode(204)
	async deleteResponse(@Param('responseId', ParseIntPipe) responseId: number) {
		this.logger.log("DELETE RESPONSE");
		await this.formService.deleteResponse(responseId);
		return { message: 'Response deleted successfully' };
	}

	@Delete('/:formId/responses')
	@UseGuards(JwtAuthGuard)
	@HttpCode(204)
	async deleteAllResponsesByFormId(@Param('formId', ParseIntPipe) formId: number) {
		this.logger.log("DELETE ALL RESPONSES");
		await this.formService.deleteAllResponsesByFormId(formId);
		return { message: 'All responses for the form deleted successfully' };
	}

	@Delete('/by-name/:formName')
	@UseGuards(JwtAuthGuard)
	@HttpCode(204)
	async deleteForm(
		@Param('formName') formName: string) {
		await this.formService.deleteFormByName(formName);
	}
}
