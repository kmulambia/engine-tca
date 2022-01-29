import {Entity, model, property, belongsTo} from '@loopback/repository';
import {PartnerType} from './partner-type.model';

@model()
export class Partner extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'string',
  })
  name_short?: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'date',
    dataType: 'timestamp',
    defaultFn: 'now'
  })
  created?: string;

  @property({
    type: 'boolean',
  })
  status: boolean;

  @belongsTo(() => PartnerType)
  partnerTypeId: string;

  constructor(data?: Partial<Partner>) {
    super(data);
  }
}

export interface PartnerRelations {
  // describe navigational properties here
}

export type PartnerWithRelations = Partner & PartnerRelations;
