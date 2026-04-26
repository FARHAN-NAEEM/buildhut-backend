import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CategoryStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BranchesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { name: string; slug: string; sortOrder?: number; status?: CategoryStatus }) {
    const existing = await this.prisma.branch.findUnique({ where: { slug: data.slug } });
    if (existing) throw new ConflictException('Branch/zone with this slug already exists.');

    const branch = await this.prisma.branch.create({ data });
    return { message: 'Branch/zone created successfully.', branch };
  }

  findAll() {
    return this.prisma.branch.findMany({
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
  }

  async update(id: string, data: { name?: string; slug?: string; sortOrder?: number; status?: CategoryStatus }) {
    await this.findOne(id);

    if (data.slug) {
      const owner = await this.prisma.branch.findUnique({ where: { slug: data.slug } });
      if (owner && owner.id !== id) throw new ConflictException('Branch/zone with this slug already exists.');
    }

    const branch = await this.prisma.branch.update({ where: { id }, data });
    return { message: 'Branch/zone updated successfully.', branch };
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.branch.delete({ where: { id } });
    return { message: 'Branch/zone deleted successfully.' };
  }

  private async findOne(id: string) {
    const branch = await this.prisma.branch.findUnique({ where: { id } });
    if (!branch) throw new NotFoundException('Branch/zone not found.');
    return branch;
  }
}
