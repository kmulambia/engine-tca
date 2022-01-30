import {Entity, model, property} from '@loopback/repository';

@model()
export class Admin2 extends Entity {
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
admin2Pcode: string;

@property({
  type: 'string'
})
admin2Name_en?: string;

@property({
  type: 'string'
})
admin2RefName?: string;

@property({
  type: 'string'
})
admin2AltName1_en?: string;

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






  constructor(data?: Partial<Admin2>) {
    super(data);
  }
}

export interface Admin2Relations {
  // describe navigational properties here
}

export type Admin2WithRelations = Admin2 & Admin2Relations;
