import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

type CategoryNode = Prisma.CategoryGetPayload<{
  include: { parent: true };
}> & { children: CategoryNode[] };
type CategoryRow = Prisma.CategoryGetPayload<{
  include: { children: true; parent: true };
}>;

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const existingCategory = await this.prisma.category.findUnique({
      where: { slug: createCategoryDto.slug },
    });

    if (existingCategory) {
      throw new ConflictException('Category with this slug already exists.');
    }

    const level = await this.resolveLevel(createCategoryDto.parentId);
    const category = await this.prisma.category.create({
      data: { ...createCategoryDto, level },
    });

    return { message: 'Category created successfully.', category };
  }

  async findAll(options: { tree?: boolean; search?: string } = {}) {
    const where: Prisma.CategoryWhereInput = options.search
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

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: { orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] },
        products: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found.');
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id);

    if (updateCategoryDto.slug) {
      const slugOwner = await this.prisma.category.findUnique({
        where: { slug: updateCategoryDto.slug },
      });
      if (slugOwner && slugOwner.id !== id) {
        throw new ConflictException('Category with this slug already exists.');
      }
    }

    const level = updateCategoryDto.parentId !== undefined
      ? await this.resolveLevel(updateCategoryDto.parentId)
      : undefined;

    const category = await this.prisma.category.update({
      where: { id },
      data: { ...updateCategoryDto, ...(level !== undefined ? { level } : {}) },
    });

    if (level !== undefined) {
      await this.recalculateDescendantLevels(id);
    }

    return { message: 'Category updated successfully.', category };
  }

  async remove(id: string) {
    const category = await this.findOne(id);

    if (category.children.length > 0) {
      throw new ConflictException('Delete child categories before deleting this category.');
    }

    const productCount = await this.prisma.product.count({ where: { categoryId: id } });
    if (productCount > 0) {
      throw new ConflictException('This category has products. Move them before deleting.');
    }

    await this.prisma.category.delete({ where: { id } });
    return { message: 'Category deleted successfully.' };
  }

  private async resolveLevel(parentId?: string) {
    if (!parentId) return 0;

    const parent = await this.prisma.category.findUnique({ where: { id: parentId } });
    if (!parent) {
      throw new NotFoundException('Parent category not found.');
    }

    return parent.level + 1;
  }

  private buildTree(categories: CategoryRow[]) {
    const map = new Map<string, CategoryNode>();
    const roots: CategoryNode[] = [];

    categories.forEach((category) => {
      map.set(category.id, { ...category, children: [] });
    });

    map.forEach((category) => {
      if (category.parentId && map.has(category.parentId)) {
        map.get(category.parentId)!.children.push(category);
      } else {
        roots.push(category);
      }
    });

    return roots;
  }

  private async recalculateDescendantLevels(categoryId: string) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
      include: { children: true },
    });

    if (!category) return;

    for (const child of category.children) {
      await this.prisma.category.update({
        where: { id: child.id },
        data: { level: category.level + 1 },
      });
      await this.recalculateDescendantLevels(child.id);
    }
  }
}
