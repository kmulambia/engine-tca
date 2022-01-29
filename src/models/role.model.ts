import {Entity, model, property, hasMany} from '@loopback/repository';
import {User} from './user.model';

@model()
export class Role extends Entity {

  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  name?: string;

  @property({
    type: 'string',
  })
  description?: string;

  @hasMany(() => User)
  users: User[];

  constructor(data?: Partial<Role>) {
    super(data);
  }
}

export interface RoleRelations {
  // describe navigational properties here
}

export type RoleWithRelations = Role & RoleRelations;
