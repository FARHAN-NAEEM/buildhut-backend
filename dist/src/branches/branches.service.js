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
exports.BranchesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BranchesService = class BranchesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const existing = await this.prisma.branch.findUnique({ where: { slug: data.slug } });
        if (existing)
            throw new common_1.ConflictException('Branch/zone with this slug already exists.');
        const branch = await this.prisma.branch.create({ data });
        return { message: 'Branch/zone created successfully.', branch };
    }
    findAll() {
        return this.prisma.branch.findMany({
            orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        });
    }
    async update(id, data) {
        await this.findOne(id);
        if (data.slug) {
            const owner = await this.prisma.branch.findUnique({ where: { slug: data.slug } });
            if (owner && owner.id !== id)
                throw new common_1.ConflictException('Branch/zone with this slug already exists.');
        }
        const branch = await this.prisma.branch.update({ where: { id }, data });
        return { message: 'Branch/zone updated successfully.', branch };
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.branch.delete({ where: { id } });
        return { message: 'Branch/zone deleted successfully.' };
    }
    async findOne(id) {
        const branch = await this.prisma.branch.findUnique({ where: { id } });
        if (!branch)
            throw new common_1.NotFoundException('Branch/zone not found.');
        return branch;
    }
};
exports.BranchesService = BranchesService;
exports.BranchesService = BranchesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BranchesService);
//# sourceMappingURL=branches.service.js.map