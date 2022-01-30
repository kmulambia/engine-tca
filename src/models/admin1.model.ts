import {Entity, model, property} from '@loopback/repository';

@model()


export class Admin1 extends Entity {
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
  admin1Pcode: string;

  @property({
    type: 'string'
  })
  admin1Name_en?: string;

  @property({
    type: 'string'
  })
  admin1RefName?: string;

  
  @property({
    type: 'string'
  })
  admin1AltName1_en?: string;

  @property({
    type: 'string'
  })
  admin1AltName2_en?: string;

  
  @property({
    type: 'string'
  })
  admin0Name_en?: string;

  @property({
    type: 'string'
  })
  admin0Pcode?: string;

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


 




  constructor(data?: Partial<Admin1>) {
    super(data);
  }
}

export interface Admin1Relations {
  // describe navigational properties here
}

export type Admin1WithRelations = Admin1 & Admin1Relations;
