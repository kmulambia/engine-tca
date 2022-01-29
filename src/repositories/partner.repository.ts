import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Partner, PartnerRelations, PartnerType} from '../models';
import {PartnerTypeRepository} from './partner-type.repository';

export class PartnerRepository extends DefaultCrudRepository<
  Partner,
  typeof Partner.prototype.id,
  PartnerRelations
> {

  public readonly partnerType: BelongsToAccessor<PartnerType, typeof Partner.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('PartnerTypeRepository') protected partnerTypeRepositoryGetter: Getter<PartnerTypeRepository>,
  ) {
    super(Partner, dataSource);
    this.partnerType = this.createBelongsToAccessorFor('partnerType', partnerTypeRepositoryGetter,);
    this.registerInclusionResolver('partnerType', this.partnerType.inclusionResolver);
  }
}
