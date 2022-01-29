import { authenticate } from '@loopback/authentication';
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
import { Log } from '../models';
import { LogRepository } from '../repositories';

export class LogController {
  constructor(
    @repository(LogRepository)
    public logRepository: LogRepository,
  ) { }



  @get('/logs/count')
  /**guards**/
  @authenticate('jwt')
  /****/
  @response(200, {
    description: 'Log model count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async count(
    @param.where(Log) where?: Where<Log>,
  ): Promise<Count> {
    return this.logRepository.count(where);
  }

  @get('/logs')
  /**guards**/
  @authenticate('jwt')
  /****/
  @response(200, {
    description: 'Array of Log model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Log, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.filter(Log) filter?: Filter<Log>,
  ): Promise<Log[]> {
    return this.logRepository.find(filter);
  }


  @get('/logs/{id}')
  /**guards**/
  @authenticate('jwt')
  /****/
  @response(200, {
    description: 'Log model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Log, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Log, { exclude: 'where' }) filter?: FilterExcludingWhere<Log>
  ): Promise<Log> {
    return this.logRepository.findById(id, filter);
  }
}
