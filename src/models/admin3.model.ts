import {Entity, model, property} from '@loopback/repository';


@model()
export class Admin3 extends Entity {
 
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  admin3Pcode: string;

  @property({
    type: 'string'
  })
  admin3Name_en?: string;

  
  @property({
    type: 'string'
  })
  admin3RefName?: string;

  @property({
    type: 'string'
  })
  admin3AltName1_en?: string;

  @property({
    type: 'string'
  })
  admin3AltName2_en?: string;

  @property({
    type: 'string'
  })
  admin2Name_en?: string;

  @property({
    type: 'string'
  })
  admin2Pcode?: string;

  @property({
    type: 'string'
  })
  admin1Name_en?: string;

  @property({
    type: 'string'
  })
  admin1Pcode?: string;

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



  constructor(data?: Partial<Admin3>) {
    super(data);
  }
}

export interface Admin3Relations {
  // describe navigational properties here
}

export type Admin3WithRelations = Admin3 & Admin3Relations;
