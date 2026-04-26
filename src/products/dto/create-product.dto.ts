import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ProductStatus, StockStatus, BranchAvailabilityStatus, BuilderType } from '@prisma/client';

export class ProductImageDto {
  @IsNotEmpty()
  @IsString()
  imageUrl!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}

export class ProductOverviewDto {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsNotEmpty()
  @IsString()
  value!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}

export class ProductSpecificationDto {
  @IsOptional()
  @IsString()
  groupName?: string;

  @IsNotEmpty()
  @IsString()
  specKey!: string;

  @IsNotEmpty()
  @IsString()
  specValue!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}

export class ProductBranchStockDto {
  @IsNotEmpty()
  @IsString()
  branchId!: string;

  @IsEnum(BranchAvailabilityStatus)
  availabilityStatus!: BranchAvailabilityStatus;

  @IsInt()
  @Min(0)
  quantity!: number;

  @IsOptional()
  @IsString()
  note?: string;
}

export class ProductComponentMapDto {
  @IsEnum(BuilderType)
  builderType!: BuilderType;

  @IsNotEmpty()
  @IsString()
  componentType!: string;
}

export class ProductSpecMetaDto {
  @IsNotEmpty()
  @IsString()
  key!: string;

  @IsNotEmpty()
  @IsString()
  value!: string;
}

export class CreateProductDto {
  @IsNotEmpty({ message: 'Product name is required' })
  @IsString()
  name!: string;

  @IsNotEmpty({ message: 'Slug is required' })
  @IsString()
  slug!: string;

  @IsNotEmpty({ message: 'SKU/Product ID is required' })
  @IsString()
  sku!: string;

  @IsNotEmpty({ message: 'Category ID is required' })
  @IsString()
  categoryId!: string;

  @IsOptional()
  @IsString()
  brandId?: string;

  @IsOptional()
  @IsString()
  productBadge?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  specialPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  regularPrice?: number;

  @IsOptional()
  @IsString()
  discountText?: string;

  @IsOptional()
  @IsString()
  emiPrice?: string;

  @IsOptional()
  @IsString()
  shortDescription?: string;

  @IsOptional()
  @IsString()
  fullDescription?: string;

  @IsOptional()
  @IsString()
  warranty?: string;

  @IsOptional()
  @IsEnum(StockStatus)
  stockStatus?: StockStatus;

  @IsOptional()
  @IsInt()
  @Min(0)
  totalQuantity?: number;

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsBoolean()
  isCompareEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  isWishlistEnabled?: boolean;

  @IsOptional()
  @IsString()
  seoTitle?: string;

  @IsOptional()
  @IsString()
  seoDescription?: string;

  @IsOptional()
  @IsArray()
  images?: ProductImageDto[];

  @IsOptional()
  @IsArray()
  overviews?: ProductOverviewDto[];

  @IsOptional()
  @IsArray()
  specifications?: ProductSpecificationDto[];

  @IsOptional()
  @IsArray()
  branchStocks?: ProductBranchStockDto[];

  @IsOptional()
  @IsArray()
  componentMaps?: ProductComponentMapDto[];

  @IsOptional()
  @IsArray()
  specMeta?: ProductSpecMetaDto[];
}
