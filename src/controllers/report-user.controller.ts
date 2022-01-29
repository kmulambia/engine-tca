import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Report,
  User,
} from '../models';
import {ReportRepository} from '../repositories';

export class ReportUserController {
  constructor(
    @repository(ReportRepository)
    public reportRepository: ReportRepository,
  ) { }

  @get('/reports/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Report',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof Report.prototype.id,
  ): Promise<User> {
    return this.reportRepository.user(id);
  }
}
