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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CategoriesService = class CategoriesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createCategoryDto) {
        const existingCategory = await this.prisma.category.findUnique({
            where: { slug: createCategoryDto.slug },
        });
        if (existingCategory) {
            throw new common_1.ConflictException('Category with this slug already exists.');
        }
        const level = await this.resolveLevel(createCategoryDto.parentId);
        const category = await this.prisma.category.create({
            data: Object.assign(Object.assign({}, createCategoryDto), { level }),
        });
        return { message: 'Category created successfully.', category };
    }
    async findAll(options = {}) {
        const where = options.search
            ? { name: { contains: options.search, mode: 'insensitive' } }
            : {};
        const categories = await this.prisma.category.findMany({
            where,
            include: { children: true, parent: true },
            orderBy: [{ level: 'asc' }, { sortOrder: 'asc' }, { name: 'asc' }],
        });
        if (!options.tree || options.search) {
            return categories;
        }
        return this.buildTree(categories);
    }
    async findOne(id) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: {
                parent: true,
                children: { orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] },
                products: true,
            },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found.');
        }
        return category;
    }
    async update(id, updateCategoryDto) {
        await this.findOne(id);
        if (updateCategoryDto.slug) {
            const slugOwner = await this.prisma.category.findUnique({
                where: { slug: updateCategoryDto.slug },
            });
            if (slugOwner && slugOwner.id !== id) {
                throw new common_1.ConflictException('Category with this slug already exists.');
            }
        }
        const level = updateCategoryDto.parentId !== undefined
            ? await this.resolveLevel(updateCategoryDto.parentId)
            : undefined;
        const category = await this.prisma.category.update({
            where: { id },
            data: Object.assign(Object.assign({}, updateCategoryDto), (level !== undefined ? { level } : {})),
        });
        if (level !== undefined) {
            await this.recalculateDescendantLevels(id);
        }
        return { message: 'Category updated successfully.', category };
    }
    async remove(id) {
        const category = await this.findOne(id);
        if (category.children.length > 0) {
            throw new common_1.ConflictException('Delete child categories before deleting this category.');
        }
        const productCount = await this.prisma.product.count({ where: { categoryId: id } });
        if (productCount > 0) {
            throw new common_1.ConflictException('This category has products. Move them before deleting.');
        }
        await this.prisma.category.delete({ where: { id } });
        return { message: 'Category deleted successfully.' };
    }
    async resolveLevel(parentId) {
        if (!parentId)
            return 0;
        const parent = await this.prisma.category.findUnique({ where: { id: parentId } });
        if (!parent) {
            throw new common_1.NotFoundException('Parent category not found.');
        }
        return parent.level + 1;
    }
    buildTree(categories) {
        const map = new Map();
        const roots = [];
        categories.forEach((category) => {
            map.set(category.id, Object.assign(Object.assign({}, category), { children: [] }));
        });
        map.forEach((category) => {
            if (category.parentId && map.has(category.parentId)) {
                map.get(category.parentId).children.push(category);
            }
            else {
                roots.push(category);
            }
        });
        return roots;
    }
    async recalculateDescendantLevels(categoryId) {
        const category = await this.prisma.category.findUnique({
            where: { id: categoryId },
            include: { children: true },
        });
        if (!category)
            return;
        for (const child of category.children) {
            await this.prisma.category.update({
                where: { id: child.id },
                data: { level: category.level + 1 },
            });
            await this.recalculateDescendantLevels(child.id);
        }
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map