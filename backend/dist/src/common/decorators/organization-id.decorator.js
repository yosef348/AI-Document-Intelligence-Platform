"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationId = void 0;
const common_1 = require("@nestjs/common");
exports.OrganizationId = (0, common_1.createParamDecorator)((_data, ctx) => {
    const req = ctx.switchToHttp().getRequest();
    const headerName = 'x-organization-id';
    const valueRaw = req.headers[headerName] ??
        req.headers[headerName];
    const value = typeof valueRaw === 'string'
        ? valueRaw
        : Array.isArray(valueRaw)
            ? valueRaw[0]
            : undefined;
    if (!value || value.trim() === '') {
        throw new common_1.BadRequestException('Missing x-organization-id header');
    }
    return value.trim();
});
//# sourceMappingURL=organization-id.decorator.js.map