import { Migration } from '@mikro-orm/migrations';

export class Migration20240717121459 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "school" add column "phone_number" int not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "school" drop column "phone_number";');
  }

}
