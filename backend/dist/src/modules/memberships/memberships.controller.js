"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipsController = void 0;
const common_1 = require("@nestjs/common");
const supabase_auth_guard_1 = require("../../common/guards/supabase-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const memberships_service_1 = require("./memberships.service");
const create_membership_dto_1 = require("./dto/create-membership.dto");
const update_membership_role_dto_1 = require("./dto/update-membership-role.dto");
let MembershipsController = class MembershipsController {
    membershipsService;
    constructor(membershipsService) {
        this.membershipsService = membershipsService;
    }
    async findByUserId(user) {
        return this.membershipsService.findByUserId(user.id);
    }
    async invite(orgId, user, dto) {
        await this.membershipsService.invite(orgId, user.id, dto);
        return this.membershipsService.acceptInvitation(dto.userId, orgId);
    }
    async listByOrganization(orgId, user) {
        return this.membershipsService.listByOrganization(orgId, user.id);
    }
    async updateRole(orgId, userId, user, body) {
        return this.membershipsService.updateRole(orgId, userId, user.id, body.role);
    }
};
exports.MembershipsController = MembershipsController;
__decorate([
    (0, common_1.Get)('user'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MembershipsController.prototype, "findByUserId", null);
__decorate([
    (0, common_1.Post)(':orgId/invite'),
    __param(0, (0, common_1.Param)('orgId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, create_membership_dto_1.CreateMembershipDto]),
    __metadata("design:returntype", Promise)
], MembershipsController.prototype, "invite", null);
__decorate([
    (0, common_1.Get)(':orgId'),
    __param(0, (0, common_1.Param)('orgId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MembershipsController.prototype, "listByOrganization", null);
__decorate([
    (0, common_1.Patch)(':orgId/:userId'),
    __param(0, (0, common_1.Param)('orgId')),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __param(3, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, update_membership_role_dto_1.UpdateMembershipRoleDto]),
    __metadata("design:returntype", Promise)
], MembershipsController.prototype, "updateRole", null);
exports.MembershipsController = MembershipsController = __decorate([
    (0, common_1.Controller)('memberships'),
    (0, common_1.UseGuards)(supabase_auth_guard_1.SupabaseAuthGuard),
    __metadata("design:paramtypes", [memberships_service_1.MembershipsService])
], MembershipsController);
//# sourceMappingURL=memberships.controller.js.map