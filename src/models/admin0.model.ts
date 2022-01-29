import {Entity, model, property}  from '@loopback/repository';

@model()
export class Admin0 extends Entity {

  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  admin0Pcode: string;


  @property({
    type: 'string',
  })
  admin0Name_en?: string;

  @property({
    type: 'string',
  })
  admin0RefName?: string;

  @property({
    type: 'string',
  })
  admin0AltName1_en?: string;

  @property({
    type: 'string',
  })
  admin0AltName2_en?: string;

  //generic data

  @property({
    type: 'string',
  })
  Shape?: string;


  @property({
    type: 'string',
  })
  date?: string;

  @property({
    type: 'string',
  })
  validOn?: string;

  @property({
    type: 'string',
  })
  validTo?: string;

  @property({
    type: 'string',
  })
  Shape_Length?: string;

  @property({
    type: 'string',
  })
  Shape_Area?: string;



  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Admin0>) {
    super(data);
  }
}

export interface Admin0Relations {
  // describe navigational properties here
}

export type Admin0WithRelations = Admin0 & Admin0Relations;
