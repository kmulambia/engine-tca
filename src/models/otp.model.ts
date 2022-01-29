import {Entity, model, property, belongsTo} from '@loopback/repository';
import {User} from './user.model';

@model()
export class Otp extends Entity {

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
  })
  code?: string;

  @property({
    type: 'number',
  })
  expire?: number;

  @property({
    type: 'date',
  })
  created?: string;

  @property({
    type: 'boolean',
  })
  used: boolean;

  @belongsTo(() => User)
  userId: string;

  constructor(data?: Partial<Otp>) {
    super(data);
  }
}

export interface OtpRelations {
  // describe navigational properties here
}

export type OtpWithRelations = Otp & OtpRelations;
