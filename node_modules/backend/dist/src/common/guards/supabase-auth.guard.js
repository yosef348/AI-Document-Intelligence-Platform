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
exports.SupabaseAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
let SupabaseAuthGuard = class SupabaseAuthGuard {
    config;
    supabase;
    constructor(config) {
        this.config = config;
        const url = this.config.get('supabase.url', { infer: true });
        const anonKey = this.config.get('supabase.anonKey', { infer: true });
        if (!url || !anonKey) {
            throw new Error('Supabase configuration is missing: SUPABASE_URL and/or SUPABASE_ANON_KEY');
        }
        this.supabase = (0, supabase_js_1.createClient)(url, anonKey, {
            auth: { persistSession: false, autoRefreshToken: false },
        });
    }
    async canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const authHeader = req.headers['authorization'] ??
            req.headers['Authorization'];
        const token = this.extractBearerToken(typeof authHeader === 'string'
            ? authHeader
            : Array.isArray(authHeader)
                ? authHeader[0]
                : undefined);
        if (!token) {
            throw new common_1.UnauthorizedException('Missing Bearer token');
        }
        try {
            const { data, error } = await this.supabase.auth.getUser(token);
            if (error || !data?.user) {
                throw new common_1.UnauthorizedException('Invalid or expired token');
            }
            req.user = data.user;
        }
        catch (e) {
            if (e instanceof common_1.UnauthorizedException) {
                throw e;
            }
            throw new common_1.ServiceUnavailableException('Authentication service unavailable');
        }
        return true;
    }
    extractBearerToken(header) {
        if (!header)
            return undefined;
        const [scheme, value] = header.split(' ');
        if (!scheme || scheme.toLowerCase() !== 'bearer' || !value)
            return undefined;
        return value.trim();
    }
};
exports.SupabaseAuthGuard = SupabaseAuthGuard;
exports.SupabaseAuthGuard = SupabaseAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SupabaseAuthGuard);
//# sourceMappingURL=supabase-auth.guard.js.map