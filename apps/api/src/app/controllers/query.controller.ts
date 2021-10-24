import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { QueryResult } from '@angular-nest-example/api-interfaces';
import { DatabaseService } from '../services/database.service';

const fs = require('fs')

@Controller()
export class QueryController {
  constructor(
    private readonly db: DatabaseService,
  ) {}


  @Get('query')
  async getQuery(
    @Query() query: any,
  ): Promise<QueryResult> {
    try {
      console.log('getQuery(' + JSON.stringify(query) + ')');
      console.log('sql:' + query.sql);
      console.log('values:' + query.values);

      const sql = fs.readFileSync('./apps/api/src/assets/sqls/' + query.sql, 'utf-8');
      console.log(sql);

      // SQL実行
      const values = JSON.parse(query.values + '');
      const data = await this.query(sql, values, false);

      console.log('db.get() end');
      console.log('data:' + JSON.stringify(data.rows));
      return { rows: data.rows, message: null };
    } catch (e) {
      console.error(e.stack);
      return { rows: null, message: e.message };
    }
  }

  @Post('query')
  async postQuery(
    @Body() body: any,
  ): Promise<QueryResult> {
    try {
      console.log('postQuery(' + JSON.stringify(body) + ')');
      console.log('sql:' + body.sql);
      console.log('values:' + body.values);

      const sql = fs.readFileSync('./apps/api/src/assets/sqls/' + body.sql, 'utf-8');
      console.log(sql);

      // SQL実行
      const data = await this.query(sql, body.values, true);

      console.log('db.post() end');
      console.log('data:' + JSON.stringify(data.rows));
      return { rows: data.rows, message: null };
    } catch (e) {
      console.error(e.stack);
      return { rows: null, message: e.message };
    }


  }

  async query(sql: string, values: any[], trans: boolean) {
    try {
      console.log('db.query() start');
      console.log('sql:' + sql);
      console.log('values:' + JSON.stringify(values));

      // DB接続
      await this.db.connect();

      // SQL実行
      if (trans) { await this.db.begin(); }
      const data = await this.db.query(sql, values);
      if (trans) { await this.db.commit(); }

      console.log('db.query() end');
      console.log('data:' + JSON.stringify(data.rows));
      return data;
    } catch (e) {
      if (trans) { await this.db.rollback(); }
      throw e;
    } finally {
      await this.db.release();
    }
  }
}
