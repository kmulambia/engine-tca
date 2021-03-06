export const UserProfileSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: {type: 'any'},
    email: {type: 'string'},
    name: {type: 'string'},
  },
};

const CredentialsSchema = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 6,
    },
  },
};

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};
