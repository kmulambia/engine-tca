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
import { Report } from '../models';
import { ReportRepository } from '../repositories';

export class ReportController {
  constructor(
    @repository(ReportRepository)
    public reportRepository: ReportRepository,
  ) { }

  @post('/reports')
  @response(200, {
    description: 'Report model instance',
    content: { 'application/json': { schema: getModelSchemaRef(Report) } },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Report, {
            title: 'NewReport',
            exclude: ['id'],
          }),
        },
      },
    })
    report: Omit<Report, 'id'>,
  ): Promise<Report> {
    return this.reportRepository.create(report);
  }

  @get('/reports/count')
  @response(200, {
    description: 'Report model count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async count(
    @param.where(Report) where?: Where<Report>,
  ): Promise<Count> {
    return this.reportRepository.count(where);
  }

  @get('/reports')
  @response(200, {
    description: 'Array of Report model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Report, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.filter(Report) filter?: Filter<Report>,
  ): Promise<Report[]> {
    return this.reportRepository.find(filter);
  }

  @patch('/reports')
  @response(200, {
    description: 'Report PATCH success count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Report, { partial: true }),
        },
      },
    })
    report: Report,
    @param.where(Report) where?: Where<Report>,
  ): Promise<Count> {
    return this.reportRepository.updateAll(report, where);
  }

  @get('/reports/{id}')
  @response(200, {
    description: 'Report model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Report, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Report, { exclude: 'where' }) filter?: FilterExcludingWhere<Report>
  ): Promise<Report> {
    return this.reportRepository.findById(id, filter);
  }

  @patch('/reports/{id}')
  @response(204, {
    description: 'Report PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Report, { partial: true }),
        },
      },
    })
    report: Report,
  ): Promise<void> {
    await this.reportRepository.updateById(id, report);
  }

  @put('/reports/{id}')
  @response(204, {
    description: 'Report PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() report: Report,
  ): Promise<void> {
    await this.reportRepository.replaceById(id, report);
  }

  @del('/reports/{id}')
  @response(204, {
    description: 'Report DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.reportRepository.deleteById(id);
  }

  @get('/reports/complete')
  @response(200, {
    description: 'Array of Report model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Report, { includeRelations: true }),
        },
      },
    },
  })
  async latestReports(
    @param.filter(Report) filter?: Filter<Report>,
  ): Promise<Report[]> {
    const reportCollection = (this.reportRepository.dataSource.connector as any).collection("Report");
    return await reportCollection.aggregate([
      { $match: {} },
      {
        $sort: {
          "created": -1,
        }
      },
      {
        $group: {
          "_id": { admin2Pcode: "$admin2Pcode", admin3Pcode: "$admin3Pcode" },
          admin2Name_en: { $first: '$admin2Name_en' },
          admin2Pcode: { $first: '$admin2Pcode' },
          admin3Pcode: { $first: '$admin3Pcode' },
          admin3Name_en: { $first: '$admin3Name_en' },
          HH: { $first: '$HH' },
          deaths: { $first: '$deaths' },
          PG: { $first: '$PG' },
          LW: { $first: '$LW' },
          U5: { $first: '$U5' },
          camps: { $first: '$camps' },
          injuries: { $first: '$injuries' },
          created: { $first: '$created' },
          userId: { $first: '$userId' },
        }
      }
    ]).get();
  }
}
