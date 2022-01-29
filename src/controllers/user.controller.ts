import { authenticate, TokenService, UserService } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { inject } from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  model,
  property,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, HttpErrors, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import { SecurityBindings, securityId, UserProfile } from '@loopback/security';
import _ from 'lodash';
import { PasswordHasherBindings, TokenServiceBindings, UserServiceBindings } from '../keys';
import { basicAuthorization } from '../middlewares/auth.midd';
import { User, Otp } from '../models';
import { Credentials, LogRepository, OtpRepository, UserRepository } from '../repositories';
import { PasswordHasher, validateCredentials } from '../services';
import { welcomeEmail, passwordResetEmail, accountRecoveryEmail } from '../utils/mailer-spec';

const moment = require('moment');

@model()
export class NewUserRequest extends User {
  @property({
    type: 'string',
    required: true,
  })
  password: string;
}


export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<User, Credentials>,
    @repository(OtpRepository) public resetRepository: OtpRepository,
    @repository(LogRepository) public logRepository: LogRepository,
  ) { }

  ///PING
  @get('/users/ping', {
    responses: {
      '200': {
        description: 'The current user profile',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User, { partial: true }),
          },
        },
      },
    },
  })
  /**guards**/
  @authenticate('jwt')
  /****/
  async printCurrentUser(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<User> {
    const userId = currentUserProfile[securityId];
    var user = this.userRepository.findById(userId, {
      include: ['role']
    });
    return user;
  }
  ///SIGN-IN
  @post('/users/sign-in', {
    responses: {
      '200': {
        description: 'user details',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              description: 'The input of login function',
              required: true,
              properties: {
                email: {
                  type: 'string',
                },
                password: {
                  type: 'string',
                  minLength: 6,
                },
              },
            },
          },
        },
      },
    },
  })
  async signin(
    @requestBody() credentials: Credentials,
  ): Promise<{ user: object, token: object }> {
    const foundUser = await this.userService.verifyCredentials(credentials);
    //DISABLED//USERS
    if (foundUser.status == false) {
      /*LOGS*/
      this.logRepository.create({ action: "LOGIN", status: false, user: { id: foundUser.id, name: foundUser.name, email: foundUser.email }, metadata: { message: 'LOGIN_FAILED', details: 'user is disabled' } });
      /****/
      throw new HttpErrors[403]('This User is disabled')
    }
    //INCLUDE//USER-DETAILS
    var user = await this.userRepository.findById(foundUser.id, {
      include: ['role']
    });
    const userProfile = this.userService.convertToUserProfile(foundUser);
    const token = await this.jwtService.generateToken(userProfile);
    /*LOGS*/
    this.logRepository.create({ action: "LOGIN", status: true, user: { id: foundUser.id, name: foundUser.name, email: foundUser.email }, metadata: { message: 'LOGIN_SUCCESS', details: { id: token, expire: 3600 } } });
    /****/
    return { user: user, token: { id: token, expire: 3600 } };
  }
  ///SIGN-UP
  @post('/users/sign-up', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async signup(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewUserRequest, {
            title: 'NewUser',
          }),
        },
      },
    })
    newUserRequest: NewUserRequest,
  ): Promise<User> {
    validateCredentials(_.pick(newUserRequest, ['email', 'password']));
    const password = await this.passwordHasher.hashPassword(
      newUserRequest.password,
    );
    /*make first sign up admin user*/
    if ((await this.userRepository.find()).length == 0) {
      newUserRequest.roleId = "ADMIN1";
    } else {
      newUserRequest.status = false;
      newUserRequest.roleId = "USER1";
    }
    /***/
    try {
      const savedUser = await this.userRepository.create(
        _.omit(newUserRequest, 'password'),
      );
      await this.userRepository
        .userCredentials(savedUser.id)
        .create({ password }).then(() => {
          /*send email*/
          welcomeEmail(newUserRequest);
          /***/
        });
      return savedUser;
    } catch (error) {
      if (error.code === 11000 && error.errmsg.includes('index: uniqueEmail')) {
        throw new HttpErrors.Conflict('This Email is already taken');
      } else {
        throw error;
      }
    }
  }

  ///REGISTER
  @post('/users', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  /**guards**/
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['ADMIN1', 'ADMIN2'],
    voters: [basicAuthorization],
  })
  /****/
  async register(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewUserRequest, {
            title: 'NewUser',
          }),
        },
      },
    })
    newUserRequest: NewUserRequest,
  ): Promise<User> {
    validateCredentials(_.pick(newUserRequest, ['email', 'password']));

    const currentUserId = currentUserProfile[securityId];
    var currentUser = await this.userRepository.findById(currentUserId);

    const password = await this.passwordHasher.hashPassword(
      newUserRequest.password,
    );

    try {
      const savedUser = await this.userRepository.create(
        _.omit(newUserRequest, 'password'),
      );
      await this.userRepository
        .userCredentials(savedUser.id)
        .create({ password }).then(() => {
          /*LOGS*/
          this.logRepository.create({ action: "REGISTER_USER", status: true, user: { id: currentUser.id, name: currentUser.name, email: currentUser.email }, metadata: { message: 'REGISTER_USER_SUCCESS', details: { id: savedUser.id, name: savedUser.name, email: savedUser.email } } });
          /****/
          /*send email*/
          welcomeEmail(newUserRequest);
          /***/
        });

      return savedUser;
    } catch (error) {
      if (error.code === 11000 && error.errmsg.includes('index: uniqueEmail')) {
        /*LOGS*/
        this.logRepository.create({ action: "REGISTER_USER", status: false, user: { id: currentUser.id, name: currentUser.name, email: currentUser.email }, metadata: { message: 'REGISTER_USER_FAILED', details: ' Email ' + newUserRequest.email + ' value is already taken' } });
        /****/
        throw new HttpErrors.Conflict('Email value is already taken');
      } else {
        throw error;
      }
    }
  }
  ///COUNT
  @get('/users/count')
  @response(200, {
    description: 'User model count',
    content: { 'application/json': { schema: CountSchema } },
  })
  /**guards**/
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['ADMIN1', 'ADMIN2'],
    voters: [basicAuthorization],
  })
  /****/
  async count(
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.count(where);
  }

  ///GET USERS
  @get('/users')
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User, { includeRelations: true }),
        },
      },
    },
  })
  /**guards**/
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['ADMIN1', 'ADMIN2'],
    voters: [basicAuthorization],
  })
  /****/
  async find(
    @param.filter(User) filter?: Filter<User>,
  ): Promise<User[]> {
    return this.userRepository.find(filter);
  }
  ///PATCH USERS
  @patch('/users')
  @response(200, {
    description: 'User PATCH success count',
    content: { 'application/json': { schema: CountSchema } },
  })
  /**guards**/
  @authenticate('jwt')
  /****/
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, { partial: true }),
        },
      },
    })
    user: User,
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.updateAll(user, where);
  }
  ///GET ONE USER
  @get('/users/{id}')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, { includeRelations: true }),
      },
    },
  })
  /**guards**/
  @authenticate('jwt')
  /****/
  async findById(
    @param.path.string('id') id: string,
    @param.filter(User, { exclude: 'where' }) filter?: FilterExcludingWhere<User>
  ): Promise<User> {
    return this.userRepository.findById(id, filter);
  }
  ///PATCH ONE USER
  @patch('/users/{id}')
  @response(204, {
    description: 'User PATCH success',
  })
  /**guards**/
  @authenticate('jwt')
  /****/
  async updateById(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, { partial: true }),
        },
      },
    })
    user: User,
  ): Promise<void> {
    const currentUserId = currentUserProfile[securityId];
    var currentUser = await this.userRepository.findById(currentUserId);
    /*LOGS*/
    this.logRepository.create({ action: "UPDATE_USER", status: true, user: { id: currentUser.id, name: currentUser.name, email: currentUser.email }, metadata: { message: 'UPDATE_USER_SUCCESS', details: { id: user.id, name: user.name, email: user.email } } });
    /****/
    await this.userRepository.updateById(id, user);
  }
  ///PUT ONE USER
  @put('/users/{id}')
  @response(204, {
    description: 'User PUT success',
  })
  /**guards**/
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['ADMIN1', 'ADMIN2'],
    voters: [basicAuthorization],
  })
  /****/
  async replaceById(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @param.path.string('id') id: string,
    @requestBody() user: User,
  ): Promise<void> {
    const currentUserId = currentUserProfile[securityId];
    var currentUser = await this.userRepository.findById(currentUserId);
    /*LOGS*/
    this.logRepository.create({ action: "UPDATE_USER", status: true, user: { id: currentUser.id, name: currentUser.name, email: currentUser.email }, metadata: { message: 'UPDATE_USER_SUCCESS', details: { id: user.id, name: user.name, email: user.email } } });
    /****/
    await this.userRepository.replaceById(id, user);
  }
  ///DELETE USER
  @del('/users/{id}')
  @response(204, {
    description: 'User DELETE success',
  })
  /**guards**/
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['ADMIN1', 'ADMIN2'],
    voters: [basicAuthorization],
  })
  /****/
  async deleteById(@inject(SecurityBindings.USER)
  currentUserProfile: UserProfile, @param.path.string('id') id: string): Promise<void> {
    const currentUserId = currentUserProfile[securityId];
    var currentUser = await this.userRepository.findById(currentUserId);
    var user = await this.userRepository.findById(id);
    if (user != null) {
      /*LOGS*/
      this.logRepository.create({ action: "DELETE_USER", status: true, user: { id: currentUser.id, name: currentUser.name, email: currentUser.email }, metadata: { message: 'DELETE_USER_SUCCESS', details: { id: user.id, name: user.name, email: user.email } } });
      /****/
    }

    await this.userRepository.deleteById(id);
  }
  ///CHANGE PASSWORD
  @patch('/users/change-password', {
    responses: {
      '200': {
        description: 'successfully changed password',
      },
    },
  })
  /**guards**/
  @authenticate('jwt')
  /****/
  async updatePassword(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @requestBody(NewUserRequest)
    newUserRequest: Credentials,
  ): Promise<string> {
    const currentUserId = currentUserProfile[securityId];
    if (!currentUserId) {
      throw new HttpErrors.NotFound(
        'you have to log in first to change your password',
      );
    }
    let currentUser = await this.userRepository.findById(currentUserId);
    const passwordHash = await this.passwordHasher.hashPassword(
      newUserRequest.password,
    );
    try {
      await this.userRepository
        .userCredentials(currentUserId)
        .patch({ password: passwordHash });

      /*LOGS*/
      this.logRepository.create({ action: "CHANGE_USER_PASSWORD", status: true, user: { id: currentUser.id, name: currentUser.name, email: currentUser.email }, metadata: { message: 'CHANGE_USER_PASSWORD_SUCCESS', details: null } });
      /****/
    } catch (e) {
      return e;
    }
    return 'Password change successful';
  }
  ///FORGOT PASSWORD (CHANGE PASSWORD REQUEST)
  @post('/users/forgot-password', {
    responses: {
      '200': {
        description: 'password reset token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              description: 'Password reset email address',
              required: true,
              properties: {
                email: {
                  type: 'string',
                }
              },
            },
          },
        },
      },
    },
  })
  async forgotPassword(
    @requestBody(NewUserRequest) request: { email: string }
  ): Promise<string> {
    const foundUser = await this.userRepository.findOne({
      where: { email: request.email }
    });
    if (!foundUser) {
      throw new HttpErrors.Unauthorized('email does not exist');
    }
    else if (foundUser) {
      var token = Math.floor(Math.random() * (999999 - 100000) + 999999).toString();
      var reset = new Otp({ code: token, created: moment().format('LLLL'), expire: 900, userId: foundUser.id, used: false });
      // save session
      await this.resetRepository.create(reset).then(() => {
        /*LOGS*/
        this.logRepository.create({ action: "CHANGE_USER_PASSWORD_REQUEST", status: true, user: { id: foundUser.id, name: foundUser.name, email: foundUser.email }, metadata: { message: 'CHANGE_USER_REQUEST_PASSWORD_SUCCESS', details: null } });
        /****/
        /*send email*/
        passwordResetEmail
          ({ email: foundUser.email, name: foundUser.name, token: token });
        /***/
      });
    }
    // return
    return "password reset email sent";
  }
  ///RESET PASSWORD (CHANGE PASSWORD FINISH)
  @post('/users/reset-password', {
    responses: {
      '200': {
        description: 'password recovery token and email',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              description: 'password reset token and email',
              required: true,
              properties: {
                email: {
                  type: 'string',
                },
                token: {
                  type: 'string',
                }
              },
            },
          },
        },
      },
    },
  })
  async passwordReset(
    @requestBody(NewUserRequest) request: { token: string, password: string }
  ): Promise<String> {
    const foundCode = await this.resetRepository.findOne({
      where: { code: request.token }
    });
    if (!foundCode) {
      throw new HttpErrors.NotFound('invalid password reset token');
    }
    else if (foundCode) {
      if (moment() < moment(foundCode.created).add(foundCode.expire, 'seconds') && foundCode.used == false) {
        //let user = this.userRepository.findById(userId);
        const passwordHash = await this.passwordHasher.hashPassword(
          request.password,
        );
        try {
          foundCode.used = true;
          let updatedCode = await this.resetRepository.updateById(foundCode.id, foundCode);

          let currentUser = await this.userRepository.findById(foundCode.userId);
          /*LOGS*/
          this.logRepository.create({ action: "CHANGE_USER_PASSWORD", status: true, user: { id: currentUser.id, name: currentUser.name, email: currentUser.email }, metadata: { message: 'CHANGE_USER_PASSWORD_SUCCESS', details: foundCode } });
          /****/

          await this.userRepository
            .userCredentials(foundCode.userId)
            .patch({ password: passwordHash });

        } catch (e) {
          return e;
        }
      } else {
        
      console.log(foundCode)
        throw new HttpErrors.Unauthorized('expired password reset token');
      }
    }
    // return
    return 'successfully recovered password';
  }
  ///ACCOUNT RECOVERY
  @post('/users/recovery/{id}', {
    responses: {
      '200': {
        description: 'password reset user id',
        content: {
          'application/json': {
          },
        },
      },
    },
  })
  /**guards**/
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['ADMIN1'],
    voters: [basicAuthorization],
  })
  /****/
  async accountRecovery(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @param.path.string('id') id: string,
    @param.filter(User, { exclude: 'where' }) filter?: FilterExcludingWhere<User>
  ): Promise<void> {
    var foundUser = await this.userRepository.findById(id, filter);
    if (!foundUser) {
      throw new HttpErrors.NotFound('invalid user');
    }
    else if (foundUser) {
      try {

        const currentUserId = currentUserProfile[securityId];
        var currentUser = await this.userRepository.findById(currentUserId);

        var length = 8,
          charset =
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789",
          retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
          retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        const passwordHash = await this.passwordHasher.hashPassword(
          retVal,
        );
        await this.userRepository
          .userCredentials(foundUser.id)
          .patch({ password: passwordHash }).then(() => {
            /*LOGS*/
            this.logRepository.create({ action: "RECOVER_USER_PASSWORD", status: true, user: { id: currentUser.id, name: currentUser.name, email: currentUser.email }, metadata: { message: 'RECOVER_USER_PASSWORD_SUCCESS', details: { id: foundUser.id, name: foundUser.name, email: foundUser.email } } });
            /****/

            /*send email*/
            accountRecoveryEmail
              ({ email: foundUser.email, name: foundUser.name, password: retVal });
            /***/
          });
      } catch (e) {
        return e;
      }
    }
  }
}
