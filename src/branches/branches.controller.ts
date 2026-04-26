import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { BranchesService } from './branches.service';

@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Post()
  create(@Body() body: { name: string; slug: string; sortOrder?: number; status?: 'ACTIVE' | 'INACTIVE' }) {
    return this.branchesService.create(body);
  }

  @Get()
  findAll() {
    return this.branchesService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: { name?: string; slug?: string; sortOrder?: number; status?: 'ACTIVE' | 'INACTIVE' }) {
    return this.branchesService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.branchesService.remove(id);
  }
}
