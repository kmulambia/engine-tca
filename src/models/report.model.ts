import {Entity, model, property, belongsTo} from '@loopback/repository';
import {User} from './user.model';

@model()
export class Report extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
  })
  admin2Pcode?: string;

  @property({
    type: 'string',
  })
  admin2Name_en?: string;

  @property({
    type: 'string',
  })
  admin3Pcode?: string;

  @property({
    type: 'string',
  })
  admin3Name_en?: string;

  @property({
    type: 'number',
  })
  HH?: number;

  @property({
    type: 'array',
    itemType: 'string',
  })
  camps?: string[];

  @property({
    type: 'number',
  })
  deaths?: number;

  @property({
    type: 'number',
  })
  injuries?: number;

  @property({
    type: 'number',
  })
  LW?: number;

  @property({
    type: 'number',
  })
  PG?: number;

  @property({
    type: 'number',
  })
  U5?: number;

  @property({
    type: 'date',
    dataType: 'timestamp',
    defaultFn: 'now'
  })
  created?: string;

  @belongsTo(() => User)
  userId: string;

  constructor(data?: Partial<Report>) {
    super(data);
  }
}

export interface ReportRelations {
  // describe navigational properties here
}

export type ReportWithRelations = Report & ReportRelations;
