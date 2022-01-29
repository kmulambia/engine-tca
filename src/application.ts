import { AuthenticationComponent, registerAuthenticationStrategy } from '@loopback/authentication';
import { AuthorizationComponent } from '@loopback/authorization';
import { BootMixin } from '@loopback/boot';
import { ApplicationConfig, createBindingFromClass } from '@loopback/core';
import { RepositoryMixin, SchemaMigrationOptions } from '@loopback/repository';
import { OpenApiSpec, RestApplication } from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent
} from '@loopback/rest-explorer';
import { ServiceMixin } from '@loopback/service-proxy';
import * as dotenv from 'dotenv';
import { RateLimiterComponent, RateLimitSecurityBindings } from 'loopback4-ratelimiter';
import multer from 'multer';
import path from 'path';
import { JWTAuthenticationStrategy } from './authentication-strategies/jwt-strategy';
import { DbDataSource } from './datasources/db.datasource';
import { FILE_SERVICE, PasswordHasherBindings, STORAGE_DIRECTORY, TokenServiceBindings, TokenServiceConstants, UserServiceBindings } from './keys';
import { RoleRepository } from './repositories';
import { MySequence } from './sequence';
import { BcryptHasher, JWTService, MyUserService, PasswordHasher } from './services';
import { SECURITY_SCHEME_SPEC, SECURITY_SPEC } from './utils/security-spec';

export { ApplicationConfig };

export class EngineApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  public passwordHasher: PasswordHasher;
  constructor(options: ApplicationConfig = {}) {
    dotenv.config();
    super(options);
    //DATABASE CONFIGS
    this.bind('datasources.config.db').to({
      name: 'db',
      connector: process.env.DB_CONNECTOR,
      hostname: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      useNewUrlParser: process.env.DB_USE_NEW_URL_PARSER
    });
    this.bind('datasources.db').toClass(DbDataSource);
    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);
    //AUTHENTICATION
    this.component(AuthenticationComponent);
    this.component(AuthorizationComponent);

    this.add(createBindingFromClass(JWTAuthenticationStrategy));
    registerAuthenticationStrategy(this, JWTAuthenticationStrategy);
    //RATE-LIMITER
    this.component(RateLimiterComponent);
    this.bind(RateLimitSecurityBindings.CONFIG).to({
      name: 'memcache',
      type: 'MemcachedStore',
      max: process.env.RL_COUNT,
      windowMs: 60 * 60 * 1000, // 60 minutes
      message: "Too many requests created from this IP, please try again after an hour",
    });

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
    this.setUpBindings();
    const spec: OpenApiSpec = {
      openapi: '3.0.0',
      info: { title: 'pkg.name', version: 'pkg.version' },
      paths: {},
      components: { securitySchemes: SECURITY_SCHEME_SPEC },
      servers: [{ url: '/api' }],
      security: SECURITY_SPEC,
    };
    this.api(spec);
  }

  //MUTER FILE SERVICE 
  protected configureFileUpload(destination?: string) {
    // Upload files to `dist/.sandbox` by default
    destination = destination ?? path.join(__dirname, '../uploads');
    this.bind(STORAGE_DIRECTORY).to(destination);
    const multerOptions: multer.Options = {
      storage: multer.diskStorage({
        destination,
        // Use the original file name as is
        filename: (req, file, cb) => {
          let uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9)
          file.originalname=uniquePrefix+"-"+file.originalname
          cb(null, file.originalname);
        },
      }),
    };
    // Configure the file upload service with multer options
    this.configure(FILE_SERVICE).to(multerOptions);
  }

  private setUpBindings(): void {
    // Bind package.json to the application context
    // this.bind(PackageKey).to(pkg);
    this.bind(TokenServiceBindings.TOKEN_SECRET).to(
      TokenServiceConstants.TOKEN_SECRET_VALUE,
    );
    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(
      TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE,
    );
    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);
    // // Bind bcrypt hash services
    this.bind(PasswordHasherBindings.ROUNDS).to(10);
    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher);
    this.bind(UserServiceBindings.USER_SERVICE).toClass(MyUserService);
  }

  async migrateSchema(options?: SchemaMigrationOptions) {
    // CONNECTORS
    await super.migrateSchema(options);
    //SYSTEM//ROLES
    const roleRepository = await this.getRepository(RoleRepository);
    /// ADMIN
    const adminRole = await roleRepository.findOne({ where: { id: 'ADMIN1' } });
    if (!adminRole) {
      try {
        await roleRepository.create({ id: "ADMIN1", name: "admin", description: "system super administrators" });
      }
      catch (error) {
        throw error;
      }
    }
    /// MANAGER
    const managerRole = await roleRepository.findOne({ where: { id: 'ADMIN2' } });
    if (!managerRole) {
      try {
        await roleRepository.create({ id: "ADMIN2", name: "manager", description: "system managers" });
      }
      catch (error) {
        throw error;
      }
    }
    /// USER
    const userRole = await roleRepository.findOne({ where: { id: 'USER1' } });
    if (!userRole) {
      try {
        await roleRepository.create({ id: "USER1", name: "user", description: "system users" });
      }
      catch (error) {
        throw error;
      }
    }
  }
}
