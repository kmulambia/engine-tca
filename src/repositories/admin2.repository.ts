import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Admin2, Admin2Relations} from '../models';

export class Admin2Repository extends DefaultCrudRepository<
  Admin2,
  typeof Admin2.prototype.admin2Pcode,
  Admin2Relations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Admin2, dataSource);
  }
}
