import { Migration } from '@mikro-orm/migrations';

export class Migration20240721180008 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "school" drop column "created_at", drop column "updated_at";');

    this.addSql('alter table "school" alter column "name" type varchar(255) using ("name"::varchar(255));');
    this.addSql('alter table "school" alter column "name" drop not null;');
    this.addSql('alter table "school" alter column "address" type varchar(255) using ("address"::varchar(255));');
    this.addSql('alter table "school" alter column "address" drop not null;');
    this.addSql('alter table "school" alter column "phone_number" type int using ("phone_number"::int);');
    this.addSql('alter table "school" alter column "phone_number" drop not null;');

    this.addSql('alter table "user" add column "refresh_token" varchar(255) null;');
    this.addSql('alter table "user" alter column "created_at" type timestamptz using ("created_at"::timestamptz);');
    this.addSql('alter table "user" alter column "created_at" drop not null;');
    this.addSql('alter table "user" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);');
    this.addSql('alter table "user" alter column "updated_at" drop not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "school" add column "created_at" timestamptz(6) not null, add column "updated_at" timestamptz(6) not null;');
    this.addSql('alter table "school" alter column "name" type varchar(255) using ("name"::varchar(255));');
    this.addSql('alter table "school" alter column "name" set not null;');
    this.addSql('alter table "school" alter column "address" type varchar(255) using ("address"::varchar(255));');
    this.addSql('alter table "school" alter column "address" set not null;');
    this.addSql('alter table "school" alter column "phone_number" type int4 using ("phone_number"::int4);');
    this.addSql('alter table "school" alter column "phone_number" set not null;');

    this.addSql('alter table "user" drop column "refresh_token";');

    this.addSql('alter table "user" alter column "created_at" type timestamptz(6) using ("created_at"::timestamptz(6));');
    this.addSql('alter table "user" alter column "created_at" set not null;');
    this.addSql('alter table "user" alter column "updated_at" type timestamptz(6) using ("updated_at"::timestamptz(6));');
    this.addSql('alter table "user" alter column "updated_at" set not null;');
  }

}
