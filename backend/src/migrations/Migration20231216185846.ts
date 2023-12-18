import { Migration } from '@mikro-orm/migrations';

export class Migration20231216185846 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "form" ("id" serial primary key, "form_name" varchar(255) not null, "description" varchar(255) not null);');
    this.addSql('alter table "form" add constraint "form_form_name_unique" unique ("form_name");');

    this.addSql('create table "form_field" ("id" serial primary key, "field_name" varchar(255) not null, "field_type" varchar(255) not null, "field_format" varchar(255) not null, "field_is_required" boolean not null, "form_id" int not null);');

    this.addSql('create table "field_option" ("id" serial primary key, "option_label" varchar(255) not null, "formField_id" int not null);');

    this.addSql('create table "form_response" ("id" serial primary key, "form_id" int not null);');

    this.addSql('create table "field_response" ("id" serial primary key, "response_value" varchar(255) not null, "form_field_id" int not null, "form_response_id" int not null);');

    this.addSql('alter table "form_field" add constraint "form_field_form_id_foreign" foreign key ("form_id") references "form" ("id") on update cascade;');

    this.addSql('alter table "field_option" add constraint "field_option_formField_id_foreign" foreign key ("formField_id") references "form_field" ("id") on update cascade;');

    this.addSql('alter table "form_response" add constraint "form_response_form_id_foreign" foreign key ("form_id") references "form" ("id") on update cascade;');

    this.addSql('alter table "field_response" add constraint "field_response_form_field_id_foreign" foreign key ("form_field_id") references "form_field" ("id") on update cascade;');
    this.addSql('alter table "field_response" add constraint "field_response_form_response_id_foreign" foreign key ("form_response_id") references "form_response" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "form_field" drop constraint "form_field_form_id_foreign";');

    this.addSql('alter table "form_response" drop constraint "form_response_form_id_foreign";');

    this.addSql('alter table "field_option" drop constraint "field_option_formField_id_foreign";');

    this.addSql('alter table "field_response" drop constraint "field_response_form_field_id_foreign";');

    this.addSql('alter table "field_response" drop constraint "field_response_form_response_id_foreign";');

    this.addSql('drop table if exists "form" cascade;');

    this.addSql('drop table if exists "form_field" cascade;');

    this.addSql('drop table if exists "field_option" cascade;');

    this.addSql('drop table if exists "form_response" cascade;');

    this.addSql('drop table if exists "field_response" cascade;');
  }

}
