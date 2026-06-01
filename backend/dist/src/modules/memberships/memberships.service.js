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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipsService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const database_service_1 = require("../../database/database.service");
const memberships_1 = require("../../database/schema/memberships");
const create_membership_dto_1 = require("./dto/create-membership.dto");
let MembershipsService = class MembershipsService {
    db;
    constructor(db) {
        this.db = db;
    }
    async ensureOwnerOrAdmin(userId, organizationId) {
        const [membership] = await this.db.db
            .select()
            .from(memberships_1.memberships)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(memberships_1.memberships.organizationId, organizationId), (0, drizzle_orm_1.eq)(memberships_1.memberships.userId, userId), (0, drizzle_orm_1.isNotNull)(memberships_1.memberships.joinedAt)));
        if (!membership ||
            !['owner', 'admin'].includes(membership.role)) {
            throw new common_1.ForbiddenException('Insufficient role');
        }
        return membership;
    }
    async invite(organizationId, invitedBy, dto) {
        await this.ensureOwnerOrAdmin(invitedBy, organizationId);
        const [existing] = await this.db.db
            .select()
            .from(memberships_1.memberships)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(memberships_1.memberships.organizationId, organizationId), (0, drizzle_orm_1.eq)(memberships_1.memberships.userId, dto.userId)));
        if (existing) {
            throw new common_1.ConflictException('User is already a member of this organization');
        }
        const [created] = await this.db.db
            .insert(memberships_1.memberships)
            .values({
            organizationId,
            userId: dto.userId,
            role: dto.role,
            invitedBy,
            joinedAt: null,
        })
            .returning();
        return created;
    }
    async acceptInvitation(userId, organizationId) {
        const [updated] = await this.db.db
            .update(memberships_1.memberships)
            .set({ joinedAt: new Date() })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(memberships_1.memberships.organizationId, organizationId), (0, drizzle_orm_1.eq)(memberships_1.memberships.userId, userId), (0, drizzle_orm_1.isNull)(memberships_1.memberships.joinedAt)))
            .returning();
        if (!updated) {
            throw new common_1.NotFoundException('Pending invitation not found');
        }
        return updated;
    }
    async listByOrganization(organizationId, requesterId) {
        await this.ensureOwnerOrAdmin(requesterId, organizationId);
        const result = await this.db.db
            .select()
            .from(memberships_1.memberships)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(memberships_1.memberships.organizationId, organizationId), (0, drizzle_orm_1.isNotNull)(memberships_1.memberships.joinedAt)));
        return result;
    }
    async findByUserId(userId) {
        const result = await this.db.db
            .select()
            .from(memberships_1.memberships)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(memberships_1.memberships.userId, userId), (0, drizzle_orm_1.isNotNull)(memberships_1.memberships.joinedAt)));
        return result;
    }
    async updateRole(organizationId, userId, updatedBy, role) {
        if (!create_membership_dto_1.ALLOWED_ROLES.includes(role)) {
            throw new common_1.BadRequestException(`Invalid role. Must be one of: ${create_membership_dto_1.ALLOWED_ROLES.join(', ')}`);
        }
        if (updatedBy === userId) {
            throw new common_1.ForbiddenException('Cannot modify your own role');
        }
        await this.ensureOwnerOrAdmin(updatedBy, organizationId);
        return await this.db.db.transaction(async (tx) => {
            const [targetMembership] = await tx
                .select()
                .from(memberships_1.memberships)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(memberships_1.memberships.organizationId, organizationId), (0, drizzle_orm_1.eq)(memberships_1.memberships.userId, userId), (0, drizzle_orm_1.isNotNull)(memberships_1.memberships.joinedAt)));
            if (!targetMembership) {
                throw new common_1.NotFoundException('Membership not found');
            }
            const [updated] = await tx
                .update(memberships_1.memberships)
                .set({ role })
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(memberships_1.memberships.organizationId, organizationId), (0, drizzle_orm_1.eq)(memberships_1.memberships.userId, userId), (0, drizzle_orm_1.isNotNull)(memberships_1.memberships.joinedAt)))
                .returning();
            return updated;
        });
    }
};
exports.MembershipsService = MembershipsService;
exports.MembershipsService = MembershipsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], MembershipsService);
//# sourceMappingURL=memberships.service.js.map