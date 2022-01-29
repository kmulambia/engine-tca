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
import {Admin0} from '../models';
import {Admin0Repository} from '../repositories';

export class Admin0Controller {
  constructor(
    @repository(Admin0Repository)
    public admin0Repository : Admin0Repository,
  ) {}

  @post('/admin-0')
  @response(200, {
    description: 'Admin0 model instance',
    content: {'application/json': {schema: getModelSchemaRef(Admin0)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Admin0, {
            title: 'NewAdmin0',
            exclude: ['admin0Pcode'],
          }),
        },
      },
    })
    admin0: Omit<Admin0, 'admin0Pcode'>,
  ): Promise<Admin0> {
    return this.admin0Repository.create(admin0);
  }

  @get('/admin-0/count')
  @response(200, {
    description: 'Admin0 model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Admin0) where?: Where<Admin0>,
  ): Promise<Count> {
    return this.admin0Repository.count(where);
  }

  @get('/admin-0')
  @response(200, {
    description: 'Array of Admin0 model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Admin0, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Admin0) filter?: Filter<Admin0>,
  ): Promise<Admin0[]> {
    return this.admin0Repository.find(filter);
  }

  @patch('/admin-0')
  @response(200, {
    description: 'Admin0 PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Admin0, {partial: true}),
        },
      },
    })
    admin0: Admin0,
    @param.where(Admin0) where?: Where<Admin0>,
  ): Promise<Count> {
    return this.admin0Repository.updateAll(admin0, where);
  }

  @get('/admin-0/{id}')
  @response(200, {
    description: 'Admin0 model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Admin0, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Admin0, {exclude: 'where'}) filter?: FilterExcludingWhere<Admin0>
  ): Promise<Admin0> {
    return this.admin0Repository.findById(id, filter);
  }

  @patch('/admin-0/{id}')
  @response(204, {
    description: 'Admin0 PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Admin0, {partial: true}),
        },
      },
    })
    admin0: Admin0,
  ): Promise<void> {
    await this.admin0Repository.updateById(id, admin0);
  }

  @put('/admin-0/{id}')
  @response(204, {
    description: 'Admin0 PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() admin0: Admin0,
  ): Promise<void> {
    await this.admin0Repository.replaceById(id, admin0);
  }

  @del('/admin-0/{id}')
  @response(204, {
    description: 'Admin0 DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.admin0Repository.deleteById(id);
  }
}
