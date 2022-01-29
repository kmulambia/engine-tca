import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {PartnerType, PartnerTypeRelations} from '../models';

export class PartnerTypeRepository extends DefaultCrudRepository<
  PartnerType,
  typeof PartnerType.prototype.id,
  PartnerTypeRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(PartnerType, dataSource);
  }
}
