import { Entity, model, property } from '@loopback/repository';

@model()
export class Log extends Entity {
  @property({
    type: 'any',
    id: true,
    generated: true,
  })
  id?: any;

  @property({
    type: 'string',
    required: true,
  })
  action: string;

  @property({
    type: 'any',
  })
  user?: any;

   @property({
    type: 'boolean',
  })
  status: boolean;

  @property({
    type: 'any',
  })
  metadata?: any;

  @property({
    type: 'date',
    dataType: 'timestamp',
    defaultFn: 'now'
  })
  created?: string;

  constructor(data?: Partial<Log>) {
    super(data);
  }
}

export interface LogRelations {
  // describe navigational properties here
}

export type LogWithRelations = Log & LogRelations;
