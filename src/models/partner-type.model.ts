import {Entity, model, property, hasMany} from '@loopback/repository';
import {Partner} from './partner.model';

@model()
export class PartnerType extends Entity {
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
    type: 'any',
  })
  scope?: any;

  @property({
    type: 'string',
  })
  x_reliefweb_term_is?: string;

  @hasMany(() => Partner)
  partners: Partner[];

  constructor(data?: Partial<PartnerType>) {
    super(data);
  }
}

export interface PartnerTypeRelations {
  // describe navigational properties here
}

export type PartnerTypeWithRelations = PartnerType & PartnerTypeRelations;
