import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Partner,
  PartnerType,
} from '../models';
import {PartnerRepository} from '../repositories';

export class PartnerPartnerTypeController {
  constructor(
    @repository(PartnerRepository)
    public partnerRepository: PartnerRepository,
  ) { }

  @get('/partners/{id}/partner-type', {
    responses: {
      '200': {
        description: 'PartnerType belonging to Partner',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(PartnerType)},
          },
        },
      },
    },
  })
  async getPartnerType(
    @param.path.string('id') id: typeof Partner.prototype.id,
  ): Promise<PartnerType> {
    return this.partnerRepository.partnerType(id);
  }
}
