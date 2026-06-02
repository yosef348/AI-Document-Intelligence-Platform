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
exports.OrganizationsService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const database_service_1 = require("../../database/database.service");
const schema_1 = require("../../database/schema");
let OrganizationsService = class OrganizationsService {
    db;
    constructor(db) {
        this.db = db;
    }
    async create(userId, dto) {
        try {
            const created = await this.db.db.transaction(async (tx) => {
                const [org] = await tx
                    .insert(schema_1.organizations)
                    .values({ ...dto, createdBy: userId, updatedBy: userId })
                    .returning();
                await tx.insert(schema_1.memberships).values({
                    organizationId: org.id,
                    userId,
                    role: 'owner',
                    joinedAt: new Date(),
                });
                return org;
            });
            return created;
        }
        catch (err) {
            if (typeof err === 'object' &&
                err !== null &&
                'code' in err &&
                err.code === '23505') {
                throw new common_1.ConflictException('Organization with this slug already exists');
            }
            throw err;
        }
    }
    async findByUserId(userId) {
        const result = await this.db.db
            .select({ organization: schema_1.organizations })
            .from(schema_1.organizations)
            .innerJoin(schema_1.memberships, (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.memberships.organizationId, schema_1.organizations.id), (0, drizzle_orm_1.eq)(schema_1.memberships.userId, userId), (0, drizzle_orm_1.isNotNull)(schema_1.memberships.joinedAt)));
        return result.map((r) => r.organization);
    }
    async findById(id, userId) {
        const rows = await this.db.db
            .select({ organization: schema_1.organizations })
            .from(schema_1.organizations)
            .innerJoin(schema_1.memberships, (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.memberships.organizationId, schema_1.organizations.id), (0, drizzle_orm_1.eq)(schema_1.organizations.id, id), (0, drizzle_orm_1.eq)(schema_1.memberships.userId, userId), (0, drizzle_orm_1.isNotNull)(schema_1.memberships.joinedAt)));
        const org = rows.at(0)?.organization;
        if (!org) {
            throw new common_1.NotFoundException('Organization not found');
        }
        return org;
    }
    async getMembership(organizationId, userId) {
        const [member] = await this.db.db
            .select()
            .from(schema_1.memberships)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.memberships.organizationId, organizationId), (0, drizzle_orm_1.eq)(schema_1.memberships.userId, userId), (0, drizzle_orm_1.isNotNull)(schema_1.memberships.joinedAt)));
        if (!member) {
            throw new common_1.NotFoundException('Membership not found');
        }
        return member;
    }
    async update(id, userId, dto) {
        const membership = await this.getMembership(id, userId);
        if (!['owner', 'admin'].includes(membership.role)) {
            throw new common_1.ForbiddenException('Insufficient role');
        }
        try {
            const [updated] = await this.db.db
                .update(schema_1.organizations)
                .set({ ...dto, updatedBy: userId, updatedAt: new Date() })
                .where((0, drizzle_orm_1.eq)(schema_1.organizations.id, id))
                .returning();
            if (!updated) {
                throw new common_1.NotFoundException('Organization not found');
            }
            return updated;
        }
        catch (err) {
            if (typeof err === 'object' &&
                err !== null &&
                'code' in err &&
                err.code === '23505') {
                throw new common_1.ConflictException('Slug already exists');
            }
            throw err;
        }
    }
};
exports.OrganizationsService = OrganizationsService;
exports.OrganizationsService = OrganizationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], OrganizationsService);
//# sourceMappingURL=organizations.service.js.map