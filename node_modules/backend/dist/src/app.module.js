"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const path_1 = require("path");
const configuration_1 = __importDefault(require("./config/configuration"));
const organizations_module_1 = require("./modules/organizations/organizations.module");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const database_module_1 = require("./database/database.module");
const auth_module_1 = require("./modules/auth/auth.module");
const memberships_module_1 = require("./modules/memberships/memberships.module");
const documents_module_1 = require("./modules/documents/documents.module");
const ingestion_module_1 = require("./modules/ingestion/ingestion.module");
const embeddings_module_1 = require("./modules/embeddings/embeddings.module");
const agent_module_1 = require("./modules/agent/agent.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: [
                    (0, path_1.resolve)(process.cwd(), '.env'),
                    (0, path_1.resolve)(process.cwd(), '../.env'),
                ],
                load: [configuration_1.default],
            }),
            organizations_module_1.OrganizationsModule,
            database_module_1.DatabaseModule,
            auth_module_1.AuthModule,
            memberships_module_1.MembershipsModule,
            documents_module_1.DocumentsModule,
            ingestion_module_1.IngestionModule,
            embeddings_module_1.EmbeddingsModule,
            agent_module_1.AgentModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map