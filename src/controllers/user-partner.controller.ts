import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  User,
  Partner,
} from '../models';
import {UserRepository} from '../repositories';

export class UserPartnerController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) { }

  @get('/users/{id}/partner', {
    responses: {
      '200': {
        description: 'Partner belonging to User',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Partner)},
          },
        },
      },
    },
  })
  async getPartner(
    @param.path.string('id') id: typeof User.prototype.id,
  ): Promise<Partner> {
    return this.userRepository.partner(id);
  }
}
