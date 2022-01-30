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
import {Admin2} from '../models';
import {Admin2Repository} from '../repositories';

export class Admin2Controller {
  constructor(
    @repository(Admin2Repository)
    public admin2Repository : Admin2Repository,
  ) {}

  @post('/admin-2')
  @response(200, {
    description: 'Admin2 model instance',
    content: {'application/json': {schema: getModelSchemaRef(Admin2)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Admin2, {
            title: 'NewAdmin2',
            exclude: ['id'],
          }),
        },
      },
    })
    admin2: Omit<Admin2, 'id'>,
  ): Promise<Admin2> {
    return this.admin2Repository.create(admin2);
  }

  @get('/admin-2/count')
  @response(200, {
    description: 'Admin2 model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Admin2) where?: Where<Admin2>,
  ): Promise<Count> {
    return this.admin2Repository.count(where);
  }

  @get('/admin-2')
  @response(200, {
    description: 'Array of Admin2 model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Admin2, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Admin2) filter?: Filter<Admin2>,
  ): Promise<Admin2[]> {
    return this.admin2Repository.find(filter);
  }

  @patch('/admin-2')
  @response(200, {
    description: 'Admin2 PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Admin2, {partial: true}),
        },
      },
    })
    admin2: Admin2,
    @param.where(Admin2) where?: Where<Admin2>,
  ): Promise<Count> {
    return this.admin2Repository.updateAll(admin2, where);
  }

  @get('/admin-2/{id}')
  @response(200, {
    description: 'Admin2 model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Admin2, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Admin2, {exclude: 'where'}) filter?: FilterExcludingWhere<Admin2>
  ): Promise<Admin2> {
    return this.admin2Repository.findById(id, filter);
  }

  @patch('/admin-2/{id}')
  @response(204, {
    description: 'Admin2 PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Admin2, {partial: true}),
        },
      },
    })
    admin2: Admin2,
  ): Promise<void> {
    await this.admin2Repository.updateById(id, admin2);
  }

  @put('/admin-2/{id}')
  @response(204, {
    description: 'Admin2 PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() admin2: Admin2,
  ): Promise<void> {
    await this.admin2Repository.replaceById(id, admin2);
  }

  @del('/admin-2/{id}')
  @response(204, {
    description: 'Admin2 DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.admin2Repository.deleteById(id);
  }
}
