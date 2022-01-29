import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Admin3, Admin3Relations} from '../models';

export class Admin3Repository extends DefaultCrudRepository<
  Admin3,
  typeof Admin3.prototype.admin3Pcode,
  Admin3Relations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Admin3, dataSource);
  }
}
