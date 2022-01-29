import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Admin1, Admin1Relations} from '../models';

export class Admin1Repository extends DefaultCrudRepository<
  Admin1,
  typeof Admin1.prototype.admin1Pcode,
  Admin1Relations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Admin1, dataSource);
  }
}
