import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: string,
    @Query('brandId') brandId?: string,
    @Query('stockStatus') stockStatus?: string,
    @Query('status') status?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
  ) {
    return this.productsService.findAll({
      search,
      categoryId,
      brandId,
      stockStatus,
      status,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    });
  }

  @Get('export')
  async exportProducts(@Query('format') format: 'csv' | 'xlsx' = 'csv', @Res() res: any) {
    const file = await this.productsService.exportProducts(format);
    res.setHeader('Content-Type', file.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
    return res.send(file.buffer);
  }

  @Get('template')
  async exportTemplate(@Query('format') format: 'csv' | 'xlsx' = 'csv', @Res() res: any) {
    const file = this.productsService.exportTemplate(format);
    res.setHeader('Content-Type', file.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
    return res.send(file.buffer);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  importProducts(@UploadedFile() file: Express.Multer.File) {
    return this.productsService.importProducts(file);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch('bulk/status')
  bulkStatus(@Body() body: { ids: string[]; status: string }) {
    return this.productsService.bulkStatus(body.ids, body.status);
  }

  @Patch('bulk/category')
  bulkCategory(@Body() body: { ids: string[]; categoryId: string }) {
    return this.productsService.bulkCategory(body.ids, body.categoryId);
  }

  @Patch('bulk/stock')
  bulkStock(@Body() body: { ids: string[]; stockStatus: string; totalQuantity?: number }) {
    return this.productsService.bulkStock(body.ids, body.stockStatus, body.totalQuantity);
  }

  @Post(':id/duplicate')
  duplicate(@Param('id') id: string) {
    return this.productsService.duplicate(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
