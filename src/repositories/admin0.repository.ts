import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Admin0, Admin0Relations} from '../models';

export class Admin0Repository extends DefaultCrudRepository<
  Admin0,
  typeof Admin0.prototype.admin0Pcode,
  Admin0Relations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Admin0, dataSource);
  }
}
