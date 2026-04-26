import { ProductStatus, StockStatus, BranchAvailabilityStatus, BuilderType } from '@prisma/client';
export declare class ProductImageDto {
    imageUrl: string;
    sortOrder?: number;
    isPrimary?: boolean;
}
export declare class ProductOverviewDto {
    title: string;
    value: string;
    sortOrder?: number;
}
export declare class ProductSpecificationDto {
    groupName?: string;
    specKey: string;
    specValue: string;
    sortOrder?: number;
}
export declare class ProductBranchStockDto {
    branchId: string;
    availabilityStatus: BranchAvailabilityStatus;
    quantity: number;
    note?: string;
}
export declare class ProductComponentMapDto {
    builderType: BuilderType;
    componentType: string;
}
export declare class ProductSpecMetaDto {
    key: string;
    value: string;
}
export declare class CreateProductDto {
    name: string;
    slug: string;
    sku: string;
    categoryId: string;
    brandId?: string;
    productBadge?: string;
    specialPrice?: number;
    regularPrice?: number;
    discountText?: string;
    emiPrice?: string;
    shortDescription?: string;
    fullDescription?: string;
    warranty?: string;
    stockStatus?: StockStatus;
    totalQuantity?: number;
    status?: ProductStatus;
    isFeatured?: boolean;
    isCompareEnabled?: boolean;
    isWishlistEnabled?: boolean;
    seoTitle?: string;
    seoDescription?: string;
    images?: ProductImageDto[];
    overviews?: ProductOverviewDto[];
    specifications?: ProductSpecificationDto[];
    branchStocks?: ProductBranchStockDto[];
    componentMaps?: ProductComponentMapDto[];
    specMeta?: ProductSpecMetaDto[];
}
