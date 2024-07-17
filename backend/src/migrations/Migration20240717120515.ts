import { Migration } from '@mikro-orm/migrations';

export class Migration20240717120515 extends Migration {

  async up(): Promise<void> {
    this.addSql('create type "user_role" as enum (\'superadmin\', \'school\');');
    this.addSql('create table "school" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "address" varchar(255) not null, constraint "school_pkey" primary key ("id"));');

    this.addSql('create table "user" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz not null, "updated_at" timestamptz not null, "email" varchar(255) not null, "password" varchar(255) not null, "role" "user_role" not null default \'school\', "school_id" uuid null, constraint "user_pkey" primary key ("id"));');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');
    this.addSql('alter table "user" add constraint "user_school_id_unique" unique ("school_id");');

    this.addSql('alter table "user" add constraint "user_school_id_foreign" foreign key ("school_id") references "school" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop constraint "user_school_id_foreign";');

    this.addSql('drop table if exists "school" cascade;');

    this.addSql('drop table if exists "user" cascade;');

    this.addSql('drop type "user_role";');
  }

}
