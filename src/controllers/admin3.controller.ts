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
import {Admin3} from '../models';
import {Admin3Repository} from '../repositories';

export class Admin3Controller {
  constructor(
    @repository(Admin3Repository)
    public admin3Repository : Admin3Repository,
  ) {}

  @post('/admin-3')
  @response(200, {
    description: 'Admin3 model instance',
    content: {'application/json': {schema: getModelSchemaRef(Admin3)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Admin3, {
            title: 'NewAdmin3',
            exclude: ['id'],
          }),
        },
      },
    })
    admin3: Omit<Admin3, 'id'>,
  ): Promise<Admin3> {
    return this.admin3Repository.create(admin3);
  }

  @get('/admin-3/count')
  @response(200, {
    description: 'Admin3 model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Admin3) where?: Where<Admin3>,
  ): Promise<Count> {
    return this.admin3Repository.count(where);
  }

  @get('/admin-3')
  @response(200, {
    description: 'Array of Admin3 model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Admin3, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Admin3) filter?: Filter<Admin3>,
  ): Promise<Admin3[]> {
    return this.admin3Repository.find(filter);
  }

  @patch('/admin-3')
  @response(200, {
    description: 'Admin3 PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Admin3, {partial: true}),
        },
      },
    })
    admin3: Admin3,
    @param.where(Admin3) where?: Where<Admin3>,
  ): Promise<Count> {
    return this.admin3Repository.updateAll(admin3, where);
  }

  @get('/admin-3/{id}')
  @response(200, {
    description: 'Admin3 model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Admin3, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Admin3, {exclude: 'where'}) filter?: FilterExcludingWhere<Admin3>
  ): Promise<Admin3> {
    return this.admin3Repository.findById(id, filter);
  }

  @patch('/admin-3/{id}')
  @response(204, {
    description: 'Admin3 PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Admin3, {partial: true}),
        },
      },
    })
    admin3: Admin3,
  ): Promise<void> {
    await this.admin3Repository.updateById(id, admin3);
  }

  @put('/admin-3/{id}')
  @response(204, {
    description: 'Admin3 PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() admin3: Admin3,
  ): Promise<void> {
    await this.admin3Repository.replaceById(id, admin3);
  }

  @del('/admin-3/{id}')
  @response(204, {
    description: 'Admin3 DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.admin3Repository.deleteById(id);
  }
}
