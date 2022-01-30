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
import {Admin1} from '../models';
import {Admin1Repository} from '../repositories';

export class Admin1Controller {
  constructor(
    @repository(Admin1Repository)
    public admin1Repository : Admin1Repository,
  ) {}

  @post('/admin-1')
  @response(200, {
    description: 'Admin1 model instance',
    content: {'application/json': {schema: getModelSchemaRef(Admin1)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Admin1, {
            title: 'NewAdmin1',
            exclude: ['id'],
          }),
        },
      },
    })
    admin1: Omit<Admin1, 'id'>,
  ): Promise<Admin1> {
    return this.admin1Repository.create(admin1);
  }

  @get('/admin-1/count')
  @response(200, {
    description: 'Admin1 model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Admin1) where?: Where<Admin1>,
  ): Promise<Count> {
    return this.admin1Repository.count(where);
  }

  @get('/admin-1')
  @response(200, {
    description: 'Array of Admin1 model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Admin1, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Admin1) filter?: Filter<Admin1>,
  ): Promise<Admin1[]> {
    return this.admin1Repository.find(filter);
  }

  @patch('/admin-1')
  @response(200, {
    description: 'Admin1 PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Admin1, {partial: true}),
        },
      },
    })
    admin1: Admin1,
    @param.where(Admin1) where?: Where<Admin1>,
  ): Promise<Count> {
    return this.admin1Repository.updateAll(admin1, where);
  }

  @get('/admin-1/{id}')
  @response(200, {
    description: 'Admin1 model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Admin1, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Admin1, {exclude: 'where'}) filter?: FilterExcludingWhere<Admin1>
  ): Promise<Admin1> {
    return this.admin1Repository.findById(id, filter);
  }

  @patch('/admin-1/{id}')
  @response(204, {
    description: 'Admin1 PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Admin1, {partial: true}),
        },
      },
    })
    admin1: Admin1,
  ): Promise<void> {
    await this.admin1Repository.updateById(id, admin1);
  }

  @put('/admin-1/{id}')
  @response(204, {
    description: 'Admin1 PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() admin1: Admin1,
  ): Promise<void> {
    await this.admin1Repository.replaceById(id, admin1);
  }

  @del('/admin-1/{id}')
  @response(204, {
    description: 'Admin1 DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.admin1Repository.deleteById(id);
  }
}
