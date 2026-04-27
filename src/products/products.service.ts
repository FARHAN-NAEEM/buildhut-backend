import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { BranchAvailabilityStatus, Prisma, ProductStatus, StockStatus } from '@prisma/client';
import * as XLSX from 'xlsx';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

const productImportHeaders = [
  'Product Name',
  'SKU',
  'Slug',
  'Category Slug',
  'Brand Slug',
  'Badge',
  'Special Price',
  'Regular Price',
  'Offer Price',
  'Offer Enabled',
  'New Arrival',
  'Discount Text',
  'EMI Price',
  'Stock Status',
  'Quantity',
  'Status',
  'Featured',
  'Compare Enabled',
  'Wishlist Enabled',
  'Short Description',
  'Description',
  'Warranty',
  'SEO Title',
  'SEO Description',
  'Images',
  'Quick Overview',
  'Specifications',
  'Branch Availability',
  'Builder Tags',
  'Compatibility Meta',
];

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    await this.assertUnique(createProductDto.slug, createProductDto.sku);
    await this.assertCategory(createProductDto.categoryId);
    if (createProductDto.brandId) await this.assertCategory(createProductDto.brandId);

    const { images, overviews, specifications, branchStocks, componentMaps, specMeta, ...productData } = createProductDto;
    const primaryImage = this.resolvePrimaryImage(images);
    const price = this.resolveCurrentPrice(productData);

    const product = await this.prisma.product.create({
      data: {
        ...productData,
        price,
        imageUrl: primaryImage,
        images: this.createMany(images?.map((image, index) => ({
          imageUrl: image.imageUrl,
          sortOrder: image.sortOrder ?? index,
          isPrimary: image.isPrimary ?? index === 0,
        }))),
        overviews: this.createMany(overviews?.map((overview, index) => ({
          title: overview.title,
          value: overview.value,
          sortOrder: overview.sortOrder ?? index,
        }))),
        specifications: this.createMany(specifications?.map((spec, index) => ({
          groupName: spec.groupName,
          specKey: spec.specKey,
          specValue: spec.specValue,
          sortOrder: spec.sortOrder ?? index,
        }))),
        branchStocks: this.createMany(branchStocks?.map((stock) => ({
          branchId: stock.branchId,
          availabilityStatus: stock.availabilityStatus,
          quantity: stock.quantity,
          note: stock.note,
        }))),
        componentMaps: this.createMany(componentMaps?.map((map) => ({
          builderType: map.builderType,
          componentType: map.componentType,
        }))),
        specMeta: this.createMany(specMeta?.map((meta) => ({
          key: meta.key,
          value: meta.value,
        }))),
      },
      include: this.productInclude,
    });

    return { message: 'Product created successfully.', product };
  }

  findAll(filters: {
    search?: string;
    categoryId?: string;
    brandId?: string;
    stockStatus?: string;
    status?: string;
    minPrice?: number;
    maxPrice?: number;
    isOffer?: boolean;
    isNewArrival?: boolean;
  } = {}) {
    const where: Prisma.ProductWhereInput = {};

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { sku: { contains: filters.search, mode: 'insensitive' } },
        { category: { name: { contains: filters.search, mode: 'insensitive' } } },
      ];
    }
    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.brandId) where.brandId = filters.brandId;
    if (filters.stockStatus) where.stockStatus = filters.stockStatus as StockStatus;
    if (filters.status) where.status = filters.status as ProductStatus;
    if (filters.isOffer !== undefined) where.isOffer = filters.isOffer;
    if (filters.isNewArrival !== undefined) where.isNewArrival = filters.isNewArrival;
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {
        ...(filters.minPrice !== undefined ? { gte: filters.minPrice } : {}),
        ...(filters.maxPrice !== undefined ? { lte: filters.maxPrice } : {}),
      };
    }

    return this.prisma.product.findMany({
      where,
      include: this.productInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findFirst({
      where: { OR: [{ id }, { slug: id }, { sku: id }] },
      include: this.productInclude,
    });

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);

    if (updateProductDto.slug || updateProductDto.sku) {
      await this.assertUnique(updateProductDto.slug, updateProductDto.sku, product.id);
    }
    if (updateProductDto.categoryId) await this.assertCategory(updateProductDto.categoryId);
    if (updateProductDto.brandId) await this.assertCategory(updateProductDto.brandId);

    const { images, overviews, specifications, branchStocks, componentMaps, specMeta, ...productData } = updateProductDto;
    const price = this.resolveCurrentPrice(productData, product.price);
    const primaryImage = images ? this.resolvePrimaryImage(images) : product.imageUrl;

    const updated = await this.prisma.$transaction(async (tx) => {
      if (images) {
        await tx.productImage.deleteMany({ where: { productId: product.id } });
      }
      if (overviews) {
        await tx.productOverview.deleteMany({ where: { productId: product.id } });
      }
      if (specifications) {
        await tx.productSpecification.deleteMany({ where: { productId: product.id } });
      }
      if (branchStocks) {
        await tx.productBranchStock.deleteMany({ where: { productId: product.id } });
      }
      if (componentMaps) {
        await tx.productComponentMap.deleteMany({ where: { productId: product.id } });
      }
      if (specMeta) {
        await tx.productSpecMeta.deleteMany({ where: { productId: product.id } });
      }

      return tx.product.update({
        where: { id: product.id },
        data: {
          ...productData,
          price,
          imageUrl: primaryImage,
          ...(images ? {
            images: this.createMany(images.map((image, index) => ({
              imageUrl: image.imageUrl,
              sortOrder: image.sortOrder ?? index,
              isPrimary: image.isPrimary ?? index === 0,
            }))),
          } : {}),
          ...(overviews ? {
            overviews: this.createMany(overviews.map((overview, index) => ({
              title: overview.title,
              value: overview.value,
              sortOrder: overview.sortOrder ?? index,
            }))),
          } : {}),
          ...(specifications ? {
            specifications: this.createMany(specifications.map((spec, index) => ({
              groupName: spec.groupName,
              specKey: spec.specKey,
              specValue: spec.specValue,
              sortOrder: spec.sortOrder ?? index,
            }))),
          } : {}),
          ...(branchStocks ? {
            branchStocks: this.createMany(branchStocks.map((stock) => ({
              branchId: stock.branchId,
              availabilityStatus: stock.availabilityStatus,
              quantity: stock.quantity,
              note: stock.note,
            }))),
          } : {}),
          ...(componentMaps ? {
            componentMaps: this.createMany(componentMaps.map((map) => ({
              builderType: map.builderType,
              componentType: map.componentType,
            }))),
          } : {}),
          ...(specMeta ? {
            specMeta: this.createMany(specMeta.map((meta) => ({
              key: meta.key,
              value: meta.value,
            }))),
          } : {}),
        },
        include: this.productInclude,
      });
    });

    return { message: 'Product updated successfully.', product: updated };
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.prisma.product.delete({ where: { id: product.id } });
    return { message: 'Product deleted successfully.' };
  }

  async duplicate(id: string) {
    const product = await this.findOne(id);
    const copySku = `${product.sku}-COPY-${Date.now().toString().slice(-5)}`;
    const copySlug = `${product.slug}-copy-${Date.now().toString().slice(-5)}`;

    const duplicate = await this.prisma.product.create({
      data: {
        name: `${product.name} Copy`,
        slug: copySlug,
        sku: copySku,
        productBadge: product.productBadge,
        shortDescription: product.shortDescription,
        fullDescription: product.fullDescription,
        warranty: product.warranty,
        price: product.price,
        specialPrice: product.specialPrice,
        regularPrice: product.regularPrice,
        offerPrice: product.offerPrice,
        discountText: product.discountText,
        emiPrice: product.emiPrice,
        imageUrl: product.imageUrl,
        stockStatus: product.stockStatus,
        totalQuantity: product.totalQuantity,
        status: 'DRAFT',
        isFeatured: product.isFeatured,
        isOffer: product.isOffer,
        isNewArrival: product.isNewArrival,
        isCompareEnabled: product.isCompareEnabled,
        isWishlistEnabled: product.isWishlistEnabled,
        seoTitle: product.seoTitle,
        seoDescription: product.seoDescription,
        categoryId: product.categoryId,
        brandId: product.brandId,
        images: this.createMany(product.images.map((image) => ({
          imageUrl: image.imageUrl,
          sortOrder: image.sortOrder,
          isPrimary: image.isPrimary,
        }))),
        overviews: this.createMany(product.overviews.map((overview) => ({
          title: overview.title,
          value: overview.value,
          sortOrder: overview.sortOrder,
        }))),
        specifications: this.createMany(product.specifications.map((spec) => ({
          groupName: spec.groupName,
          specKey: spec.specKey,
          specValue: spec.specValue,
          sortOrder: spec.sortOrder,
        }))),
        branchStocks: this.createMany(product.branchStocks.map((stock) => ({
          branchId: stock.branchId,
          availabilityStatus: stock.availabilityStatus,
          quantity: stock.quantity,
          note: stock.note,
        }))),
        componentMaps: this.createMany(product.componentMaps.map((map) => ({
          builderType: map.builderType,
          componentType: map.componentType,
        }))),
        specMeta: this.createMany(product.specMeta.map((meta) => ({
          key: meta.key,
          value: meta.value,
        }))),
      },
      include: this.productInclude,
    });

    return { message: 'Product duplicated as draft.', product: duplicate };
  }

  bulkStatus(ids: string[], status: string) {
    return this.prisma.product.updateMany({
      where: { id: { in: ids } },
      data: { status: status as ProductStatus },
    });
  }

  bulkCategory(ids: string[], categoryId: string) {
    return this.prisma.product.updateMany({
      where: { id: { in: ids } },
      data: { categoryId },
    });
  }

  bulkStock(ids: string[], stockStatus: string, totalQuantity?: number) {
    return this.prisma.product.updateMany({
      where: { id: { in: ids } },
      data: {
        stockStatus: stockStatus as StockStatus,
        ...(totalQuantity !== undefined ? { totalQuantity } : {}),
      },
    });
  }

  bulkPromotions(ids: string[], data: { isOffer?: boolean; offerPrice?: number; isNewArrival?: boolean }) {
    return this.prisma.product.updateMany({
      where: { id: { in: ids } },
      data: {
        ...(data.isOffer !== undefined ? { isOffer: data.isOffer } : {}),
        ...(data.offerPrice !== undefined ? { offerPrice: data.offerPrice } : {}),
        ...(data.isOffer === true && data.offerPrice !== undefined ? { price: data.offerPrice } : {}),
        ...(data.isNewArrival !== undefined ? { isNewArrival: data.isNewArrival } : {}),
      },
    });
  }

  async exportProducts(format: 'csv' | 'xlsx' = 'csv') {
    const products = await this.prisma.product.findMany({
      include: this.productInclude,
      orderBy: { createdAt: 'desc' },
    });

    const rows = products.map((product) => ({
      'Product Name': product.name,
      SKU: product.sku,
      Slug: product.slug,
      'Category Slug': product.category?.slug ?? '',
      'Brand Slug': product.brand?.slug ?? '',
      Badge: product.productBadge ?? '',
      'Special Price': product.specialPrice ?? '',
      'Regular Price': product.regularPrice ?? '',
      'Offer Price': product.offerPrice ?? '',
      'Offer Enabled': product.isOffer ? 'yes' : 'no',
      'New Arrival': product.isNewArrival ? 'yes' : 'no',
      'Discount Text': product.discountText ?? '',
      'EMI Price': product.emiPrice ?? '',
      'Stock Status': product.stockStatus,
      Quantity: product.totalQuantity,
      Status: product.status,
      Featured: product.isFeatured ? 'yes' : 'no',
      'Compare Enabled': product.isCompareEnabled ? 'yes' : 'no',
      'Wishlist Enabled': product.isWishlistEnabled ? 'yes' : 'no',
      'Short Description': product.shortDescription ?? '',
      Description: product.fullDescription ?? '',
      Warranty: product.warranty ?? '',
      'SEO Title': product.seoTitle ?? '',
      'SEO Description': product.seoDescription ?? '',
      Images: product.images.map((image) => image.imageUrl).join('|'),
      'Quick Overview': product.overviews.map((item) => `${item.title}=${item.value}`).join(';'),
      Specifications: product.specifications.map((item) => `${item.groupName ?? 'General'}|${item.specKey}=${item.specValue}`).join(';'),
      'Branch Availability': product.branchStocks
        .map((stock) => `${stock.branch.name}=${stock.availabilityStatus}:${stock.quantity}${stock.note ? `:${stock.note}` : ''}`)
        .join(';'),
      'Builder Tags': product.componentMaps.map((map) => `${map.builderType}:${map.componentType}`).join(';'),
      'Compatibility Meta': product.specMeta.map((meta) => `${meta.key}=${meta.value}`).join(';'),
    }));

    return this.buildSpreadsheetFile(rows, format, 'buildhut-products');
  }

  exportTemplate(format: 'csv' | 'xlsx' = 'csv') {
    const rows = [{
      'Product Name': 'Acer Aspire 15 AS15-42 AMD Ryzen 3 7330U 8GB RAM 512GB SSD 15.6 Inch FHD Display Pure Silver Laptop',
      SKU: 'ACER-AS15-42-R3',
      Slug: 'acer-aspire-15-as15-42-ryzen-3',
      'Category Slug': 'laptop-acer',
      'Brand Slug': 'laptop-acer',
      Badge: 'New Arrival',
      'Special Price': 56500,
      'Regular Price': 61300,
      'Offer Price': 54500,
      'Offer Enabled': 'yes',
      'New Arrival': 'yes',
      'Discount Text': 'Save Extra Tk 1,000 on online order',
      'EMI Price': 'Tk 4,708/month',
      'Stock Status': 'IN_STOCK',
      Quantity: 35,
      Status: 'ACTIVE',
      Featured: 'yes',
      'Compare Enabled': 'yes',
      'Wishlist Enabled': 'yes',
      'Short Description': 'Ryzen 3, 8GB RAM, 512GB SSD, 15.6 Inch FHD',
      Description: 'Full product description here',
      Warranty: '2 years warranty',
      'SEO Title': 'Acer Aspire 15 AS15-42 Laptop',
      'SEO Description': 'Acer Aspire 15 Ryzen 3 laptop in Bangladesh',
      Images: 'https://example.com/image-1.jpg|https://example.com/image-2.jpg',
      'Quick Overview': 'Processor Type=Ryzen 3;RAM=8GB;Storage=512GB SSD;Display Size=15.6;Color=Pure Silver',
      Specifications: 'Processor|Processor Type=Ryzen 3;Memory|RAM=8GB;Storage|Storage=512GB SSD',
      'Branch Availability': 'Dhaka=AVAILABLE:10;Chattogram=AVAILABLE:5;Rajshahi=OUT_OF_STOCK:0;eCommerce - Ready Stock=READY_STOCK:20',
      'Builder Tags': 'PC:cpu',
      'Compatibility Meta': 'cpu_socket=AM5;power_watt=65',
    }];

    return this.buildSpreadsheetFile(rows, format, 'buildhut-product-import-template');
  }

  async importProducts(file?: Express.Multer.File) {
    if (!file) throw new BadRequestException('Please upload a CSV or Excel file.');

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) throw new BadRequestException('The uploaded file has no sheets.');

    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(workbook.Sheets[firstSheetName], { defval: '' });
    if (!rows.length) throw new BadRequestException('The uploaded file has no product rows.');

    const report = {
      created: 0,
      updated: 0,
      failed: 0,
      errors: [] as { row: number; message: string }[],
    };

    for (const [index, row] of rows.entries()) {
      try {
        const dto = await this.mapImportRow(row);
        const existing = await this.prisma.product.findUnique({ where: { sku: dto.sku } });

        if (existing) {
          await this.update(existing.id, dto);
          report.updated += 1;
        } else {
          await this.create(dto);
          report.created += 1;
        }
      } catch (error) {
        report.failed += 1;
        report.errors.push({
          row: index + 2,
          message: error instanceof Error ? error.message : 'Unknown import error',
        });
      }
    }

    return { message: 'Import completed.', ...report };
  }

  private async assertUnique(slug?: string, sku?: string, currentId?: string) {
    if (slug) {
      const slugOwner = await this.prisma.product.findUnique({ where: { slug } });
      if (slugOwner && slugOwner.id !== currentId) {
        throw new ConflictException('Product with this slug already exists.');
      }
    }

    if (sku) {
      const skuOwner = await this.prisma.product.findUnique({ where: { sku } });
      if (skuOwner && skuOwner.id !== currentId) {
        throw new ConflictException('Product with this SKU already exists.');
      }
    }
  }

  private async assertCategory(categoryId: string) {
    const category = await this.prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) throw new NotFoundException('Category not found.');
  }

  private resolvePrimaryImage(images?: { imageUrl: string; isPrimary?: boolean }[]) {
    if (!images?.length) return undefined;
    return images.find((image) => image.isPrimary)?.imageUrl ?? images[0].imageUrl;
  }

  private createMany<T>(items?: T[]) {
    if (!items?.length) return undefined;
    return { create: items };
  }

  private resolveCurrentPrice(
    productData: Pick<CreateProductDto, 'specialPrice' | 'regularPrice' | 'offerPrice' | 'isOffer'>,
    fallback = 0,
  ) {
    if (productData.isOffer && productData.offerPrice !== undefined) return productData.offerPrice;
    return productData.specialPrice ?? productData.regularPrice ?? fallback;
  }

  private buildSpreadsheetFile(rows: Record<string, unknown>[], format: 'csv' | 'xlsx', filename: string) {
    const worksheet = XLSX.utils.json_to_sheet(rows.length ? rows : [Object.fromEntries(productImportHeaders.map((header) => [header, '']))], {
      header: productImportHeaders,
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

    if (format === 'xlsx') {
      return {
        buffer: XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }) as Buffer,
        filename: `${filename}.xlsx`,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      };
    }

    return {
      buffer: Buffer.from(XLSX.utils.sheet_to_csv(worksheet), 'utf8'),
      filename: `${filename}.csv`,
      contentType: 'text/csv; charset=utf-8',
    };
  }

  private async mapImportRow(row: Record<string, unknown>): Promise<CreateProductDto> {
    const value = (...headers: string[]) => {
      const normalizedRow = Object.fromEntries(
        Object.entries(row).map(([key, item]) => [this.normalizeHeader(key), item]),
      );
      for (const header of headers) {
        const item = normalizedRow[this.normalizeHeader(header)];
        if (item !== undefined && item !== null && String(item).trim() !== '') return String(item).trim();
      }
      return '';
    };

    const name = value('Product Name', 'Name');
    const sku = value('SKU', 'Product ID', 'Product ID / SKU');
    const slug = value('Slug') || this.slugify(name);
    const categoryRef = value('Category Slug', 'Category ID', 'Category');

    if (!name) throw new BadRequestException('Product Name is required.');
    if (!sku) throw new BadRequestException('SKU is required.');
    if (!categoryRef) throw new BadRequestException('Category Slug or Category ID is required.');

    const category = await this.findCategoryByRef(categoryRef);
    const brandRef = value('Brand Slug', 'Brand ID', 'Brand', 'Type');
    const brand = brandRef ? await this.findCategoryByRef(brandRef) : null;

    return {
      name,
      sku,
      slug,
      categoryId: category.id,
      brandId: brand?.id,
      productBadge: value('Badge', 'Product Badge') || undefined,
      specialPrice: this.numberOrUndefined(value('Special Price')),
      regularPrice: this.numberOrUndefined(value('Regular Price')),
      offerPrice: this.numberOrUndefined(value('Offer Price', 'Offer/Discount Price')),
      isOffer: this.parseBoolean(value('Offer Enabled', 'Is Offer')),
      isNewArrival: this.parseBoolean(value('New Arrival', 'Is New Arrival')),
      discountText: value('Discount Text') || undefined,
      emiPrice: value('EMI Price', 'Monthly Installment') || undefined,
      stockStatus: this.parseStockStatus(value('Stock Status')) as StockStatus,
      totalQuantity: this.numberOrUndefined(value('Quantity')) ?? 0,
      status: this.parseProductStatus(value('Status', 'Product Status')) as ProductStatus,
      isFeatured: this.parseBoolean(value('Featured', 'Featured Product')),
      isCompareEnabled: this.parseBoolean(value('Compare Enabled'), true),
      isWishlistEnabled: this.parseBoolean(value('Wishlist Enabled'), true),
      shortDescription: value('Short Description') || undefined,
      fullDescription: value('Description', 'Full Description') || undefined,
      warranty: value('Warranty', 'Warranty Info') || undefined,
      seoTitle: value('SEO Title') || undefined,
      seoDescription: value('SEO Description') || undefined,
      images: this.parseImages(value('Images', 'Product Images')),
      overviews: this.parseOverviews(value('Quick Overview', 'Overview')),
      specifications: this.parseSpecifications(value('Specifications', 'Full Specification')),
      branchStocks: await this.parseBranchStocks(value('Branch Availability', 'Availability')),
      componentMaps: this.parseComponentMaps(value('Builder Tags', 'Component Tags')),
      specMeta: this.parseSpecMeta(value('Compatibility Meta', 'Product Spec Meta')),
    };
  }

  private normalizeHeader(header: string) {
    return header.toLowerCase().replace(/[^a-z0-9]+/g, '');
  }

  private slugify(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }

  private numberOrUndefined(value: string) {
    if (!value) return undefined;
    const number = Number(String(value).replace(/[^0-9.]/g, ''));
    return Number.isFinite(number) ? number : undefined;
  }

  private parseBoolean(value: string, fallback = false) {
    if (!value) return fallback;
    return ['1', 'true', 'yes', 'y', 'active', 'enabled'].includes(value.toLowerCase());
  }

  private parseStockStatus(value: string) {
    const normalized = value.toUpperCase().replace(/[\s-]+/g, '_');
    if (['IN_STOCK', 'OUT_OF_STOCK', 'UPCOMING', 'PRE_ORDER'].includes(normalized)) return normalized;
    return 'IN_STOCK';
  }

  private parseProductStatus(value: string) {
    const normalized = value.toUpperCase().replace(/[\s-]+/g, '_');
    if (['ACTIVE', 'INACTIVE', 'DRAFT', 'ARCHIVED'].includes(normalized)) return normalized;
    return 'DRAFT';
  }

  private parseImages(value: string) {
    return value
      .split('|')
      .map((imageUrl) => imageUrl.trim())
      .filter(Boolean)
      .map((imageUrl, index) => ({ imageUrl, sortOrder: index, isPrimary: index === 0 }));
  }

  private parseOverviews(value: string) {
    return value
      .split(';')
      .map((pair, index) => {
        const [title, ...rest] = pair.split('=');
        return { title: title?.trim(), value: rest.join('=').trim(), sortOrder: index };
      })
      .filter((item) => item.title && item.value);
  }

  private parseSpecifications(value: string) {
    return value
      .split(';')
      .map((pair, index) => {
        const [left, ...valueParts] = pair.split('=');
        const [groupName, specKey] = left.split('|');
        return {
          groupName: specKey ? groupName.trim() : 'General',
          specKey: (specKey ?? groupName)?.trim(),
          specValue: valueParts.join('=').trim(),
          sortOrder: index,
        };
      })
      .filter((item) => item.specKey && item.specValue);
  }

  private async parseBranchStocks(value: string) {
    const stocks = [];
    const branches = await this.prisma.branch.findMany();
    const branchMap = new Map<string, string>();

    branches.forEach((branch) => {
      branchMap.set(this.slugify(branch.name), branch.id);
      branchMap.set(branch.slug, branch.id);
      branchMap.set(branch.id, branch.id);
    });

    for (const item of value.split(';').map((part) => part.trim()).filter(Boolean)) {
      const [branchRef, rest] = item.split('=');
      const [statusRaw, quantityRaw, ...noteParts] = (rest ?? '').split(':');
      const branchId = branchMap.get(this.slugify(branchRef.trim())) ?? branchMap.get(branchRef.trim());
      if (!branchId) throw new BadRequestException(`Branch not found: ${branchRef}`);

      const availabilityStatus = this.parseBranchStatus(statusRaw ?? '') as BranchAvailabilityStatus;
      stocks.push({
        branchId,
        availabilityStatus,
        quantity: this.numberOrUndefined(quantityRaw ?? '') ?? 0,
        note: noteParts.join(':').trim() || undefined,
      });
    }

    return stocks;
  }

  private parseComponentMaps(value: string) {
    return value
      .split(';')
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => {
        const [builderTypeRaw, componentType] = item.split(':');
        const builderType = builderTypeRaw?.trim().toUpperCase() === 'CC_CAMERA' ? 'CC_CAMERA' : 'PC';
        return { builderType: builderType as 'PC' | 'CC_CAMERA', componentType: componentType?.trim() };
      })
      .filter((item) => item.componentType);
  }

  private parseSpecMeta(value: string) {
    return value
      .split(';')
      .map((pair) => {
        const [key, ...rest] = pair.split('=');
        return { key: key?.trim(), value: rest.join('=').trim() };
      })
      .filter((item) => item.key && item.value);
  }

  private parseBranchStatus(value: string) {
    const normalized = value.toUpperCase().replace(/[\s-]+/g, '_');
    if (['AVAILABLE', 'OUT_OF_STOCK', 'READY_STOCK', 'PRE_ORDER', 'UPCOMING'].includes(normalized)) return normalized;
    return 'OUT_OF_STOCK';
  }

  private async findCategoryByRef(ref: string) {
    const category = await this.prisma.category.findFirst({
      where: { OR: [{ id: ref }, { slug: ref }, { name: { equals: ref, mode: 'insensitive' } }] },
    });

    if (!category) throw new BadRequestException(`Category not found: ${ref}`);
    return category;
  }

  private readonly productInclude = {
    category: true,
    brand: true,
    images: { orderBy: { sortOrder: 'asc' as const } },
    overviews: { orderBy: { sortOrder: 'asc' as const } },
    specifications: { orderBy: { sortOrder: 'asc' as const } },
    branchStocks: {
      include: { branch: true },
      orderBy: { branch: { sortOrder: 'asc' as const } },
    },
    componentMaps: true,
    specMeta: true,
  };
}
