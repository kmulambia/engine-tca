import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {PartnerType} from '../models';
import {PartnerTypeRepository} from '../repositories';

export class PartnerTypeController {
  constructor(
    @repository(PartnerTypeRepository)
    public partnerTypeRepository : PartnerTypeRepository,
  ) {}

  @post('/partner-types')
  @response(200, {
    description: 'PartnerType model instance',
    content: {'application/json': {schema: getModelSchemaRef(PartnerType)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PartnerType, {
            title: 'NewPartnerType',
            exclude: ['id'],
          }),
        },
      },
    })
    partnerType: Omit<PartnerType, 'id'>,
  ): Promise<PartnerType> {
    return this.partnerTypeRepository.create(partnerType);
  }

  @get('/partner-types/count')
  @response(200, {
    description: 'PartnerType model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(PartnerType) where?: Where<PartnerType>,
  ): Promise<Count> {
    return this.partnerTypeRepository.count(where);
  }

  @get('/partner-types')
  @response(200, {
    description: 'Array of PartnerType model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(PartnerType, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(PartnerType) filter?: Filter<PartnerType>,
  ): Promise<PartnerType[]> {
    return this.partnerTypeRepository.find(filter);
  }

  @patch('/partner-types')
  @response(200, {
    description: 'PartnerType PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PartnerType, {partial: true}),
        },
      },
    })
    partnerType: PartnerType,
    @param.where(PartnerType) where?: Where<PartnerType>,
  ): Promise<Count> {
    return this.partnerTypeRepository.updateAll(partnerType, where);
  }

  @get('/partner-types/{id}')
  @response(200, {
    description: 'PartnerType model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(PartnerType, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(PartnerType, {exclude: 'where'}) filter?: FilterExcludingWhere<PartnerType>
  ): Promise<PartnerType> {
    return this.partnerTypeRepository.findById(id, filter);
  }

  @patch('/partner-types/{id}')
  @response(204, {
    description: 'PartnerType PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PartnerType, {partial: true}),
        },
      },
    })
    partnerType: PartnerType,
  ): Promise<void> {
    await this.partnerTypeRepository.updateById(id, partnerType);
  }

  @put('/partner-types/{id}')
  @response(204, {
    description: 'PartnerType PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() partnerType: PartnerType,
  ): Promise<void> {
    await this.partnerTypeRepository.replaceById(id, partnerType);
  }

  @del('/partner-types/{id}')
  @response(204, {
    description: 'PartnerType DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.partnerTypeRepository.deleteById(id);
  }
}
