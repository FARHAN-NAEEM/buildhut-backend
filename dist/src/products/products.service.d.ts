import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createProductDto: CreateProductDto): Promise<{
        message: string;
        product: {
            category: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
                iconUrl: string | null;
                image: string | null;
                level: number;
                sortOrder: number;
                status: import("@prisma/client").$Enums.CategoryStatus;
                isFeatured: boolean;
                seoTitle: string | null;
                seoDescription: string | null;
                parentId: string | null;
            };
            brand: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
                iconUrl: string | null;
                image: string | null;
                level: number;
                sortOrder: number;
                status: import("@prisma/client").$Enums.CategoryStatus;
                isFeatured: boolean;
                seoTitle: string | null;
                seoDescription: string | null;
                parentId: string | null;
            } | null;
            images: {
                id: string;
                sortOrder: number;
                imageUrl: string;
                productId: string;
                isPrimary: boolean;
            }[];
            overviews: {
                id: string;
                sortOrder: number;
                productId: string;
                title: string;
                value: string;
            }[];
            specifications: {
                id: string;
                sortOrder: number;
                productId: string;
                groupName: string | null;
                specKey: string;
                specValue: string;
            }[];
            branchStocks: ({
                branch: {
                    name: string;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    slug: string;
                    sortOrder: number;
                    status: import("@prisma/client").$Enums.CategoryStatus;
                };
            } & {
                id: string;
                productId: string;
                branchId: string;
                availabilityStatus: import("@prisma/client").$Enums.BranchAvailabilityStatus;
                quantity: number;
                note: string | null;
            })[];
            componentMaps: {
                id: string;
                productId: string;
                builderType: import("@prisma/client").$Enums.BuilderType;
                componentType: string;
            }[];
            specMeta: {
                id: string;
                productId: string;
                value: string;
                key: string;
            }[];
        } & {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            status: import("@prisma/client").$Enums.ProductStatus;
            isFeatured: boolean;
            seoTitle: string | null;
            seoDescription: string | null;
            sku: string;
            productBadge: string | null;
            shortDescription: string | null;
            fullDescription: string | null;
            warranty: string | null;
            price: number;
            specialPrice: number | null;
            regularPrice: number | null;
            offerPrice: number | null;
            discountText: string | null;
            emiPrice: string | null;
            imageUrl: string | null;
            stockStatus: import("@prisma/client").$Enums.StockStatus;
            totalQuantity: number;
            isOffer: boolean;
            isNewArrival: boolean;
            isCompareEnabled: boolean;
            isWishlistEnabled: boolean;
            categoryId: string;
            brandId: string | null;
        };
    }>;
    findAll(filters?: {
        search?: string;
        categoryId?: string;
        brandId?: string;
        stockStatus?: string;
        status?: string;
        minPrice?: number;
        maxPrice?: number;
        isOffer?: boolean;
        isNewArrival?: boolean;
    }): Prisma.PrismaPromise<({
        category: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            iconUrl: string | null;
            image: string | null;
            level: number;
            sortOrder: number;
            status: import("@prisma/client").$Enums.CategoryStatus;
            isFeatured: boolean;
            seoTitle: string | null;
            seoDescription: string | null;
            parentId: string | null;
        };
        brand: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            iconUrl: string | null;
            image: string | null;
            level: number;
            sortOrder: number;
            status: import("@prisma/client").$Enums.CategoryStatus;
            isFeatured: boolean;
            seoTitle: string | null;
            seoDescription: string | null;
            parentId: string | null;
        } | null;
        images: {
            id: string;
            sortOrder: number;
            imageUrl: string;
            productId: string;
            isPrimary: boolean;
        }[];
        overviews: {
            id: string;
            sortOrder: number;
            productId: string;
            title: string;
            value: string;
        }[];
        specifications: {
            id: string;
            sortOrder: number;
            productId: string;
            groupName: string | null;
            specKey: string;
            specValue: string;
        }[];
        branchStocks: ({
            branch: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
                sortOrder: number;
                status: import("@prisma/client").$Enums.CategoryStatus;
            };
        } & {
            id: string;
            productId: string;
            branchId: string;
            availabilityStatus: import("@prisma/client").$Enums.BranchAvailabilityStatus;
            quantity: number;
            note: string | null;
        })[];
        componentMaps: {
            id: string;
            productId: string;
            builderType: import("@prisma/client").$Enums.BuilderType;
            componentType: string;
        }[];
        specMeta: {
            id: string;
            productId: string;
            value: string;
            key: string;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        status: import("@prisma/client").$Enums.ProductStatus;
        isFeatured: boolean;
        seoTitle: string | null;
        seoDescription: string | null;
        sku: string;
        productBadge: string | null;
        shortDescription: string | null;
        fullDescription: string | null;
        warranty: string | null;
        price: number;
        specialPrice: number | null;
        regularPrice: number | null;
        offerPrice: number | null;
        discountText: string | null;
        emiPrice: string | null;
        imageUrl: string | null;
        stockStatus: import("@prisma/client").$Enums.StockStatus;
        totalQuantity: number;
        isOffer: boolean;
        isNewArrival: boolean;
        isCompareEnabled: boolean;
        isWishlistEnabled: boolean;
        categoryId: string;
        brandId: string | null;
    })[]>;
    findOne(id: string): Promise<{
        category: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            iconUrl: string | null;
            image: string | null;
            level: number;
            sortOrder: number;
            status: import("@prisma/client").$Enums.CategoryStatus;
            isFeatured: boolean;
            seoTitle: string | null;
            seoDescription: string | null;
            parentId: string | null;
        };
        brand: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            iconUrl: string | null;
            image: string | null;
            level: number;
            sortOrder: number;
            status: import("@prisma/client").$Enums.CategoryStatus;
            isFeatured: boolean;
            seoTitle: string | null;
            seoDescription: string | null;
            parentId: string | null;
        } | null;
        images: {
            id: string;
            sortOrder: number;
            imageUrl: string;
            productId: string;
            isPrimary: boolean;
        }[];
        overviews: {
            id: string;
            sortOrder: number;
            productId: string;
            title: string;
            value: string;
        }[];
        specifications: {
            id: string;
            sortOrder: number;
            productId: string;
            groupName: string | null;
            specKey: string;
            specValue: string;
        }[];
        branchStocks: ({
            branch: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
                sortOrder: number;
                status: import("@prisma/client").$Enums.CategoryStatus;
            };
        } & {
            id: string;
            productId: string;
            branchId: string;
            availabilityStatus: import("@prisma/client").$Enums.BranchAvailabilityStatus;
            quantity: number;
            note: string | null;
        })[];
        componentMaps: {
            id: string;
            productId: string;
            builderType: import("@prisma/client").$Enums.BuilderType;
            componentType: string;
        }[];
        specMeta: {
            id: string;
            productId: string;
            value: string;
            key: string;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        status: import("@prisma/client").$Enums.ProductStatus;
        isFeatured: boolean;
        seoTitle: string | null;
        seoDescription: string | null;
        sku: string;
        productBadge: string | null;
        shortDescription: string | null;
        fullDescription: string | null;
        warranty: string | null;
        price: number;
        specialPrice: number | null;
        regularPrice: number | null;
        offerPrice: number | null;
        discountText: string | null;
        emiPrice: string | null;
        imageUrl: string | null;
        stockStatus: import("@prisma/client").$Enums.StockStatus;
        totalQuantity: number;
        isOffer: boolean;
        isNewArrival: boolean;
        isCompareEnabled: boolean;
        isWishlistEnabled: boolean;
        categoryId: string;
        brandId: string | null;
    }>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<{
        message: string;
        product: {
            category: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
                iconUrl: string | null;
                image: string | null;
                level: number;
                sortOrder: number;
                status: import("@prisma/client").$Enums.CategoryStatus;
                isFeatured: boolean;
                seoTitle: string | null;
                seoDescription: string | null;
                parentId: string | null;
            };
            brand: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
                iconUrl: string | null;
                image: string | null;
                level: number;
                sortOrder: number;
                status: import("@prisma/client").$Enums.CategoryStatus;
                isFeatured: boolean;
                seoTitle: string | null;
                seoDescription: string | null;
                parentId: string | null;
            } | null;
            images: {
                id: string;
                sortOrder: number;
                imageUrl: string;
                productId: string;
                isPrimary: boolean;
            }[];
            overviews: {
                id: string;
                sortOrder: number;
                productId: string;
                title: string;
                value: string;
            }[];
            specifications: {
                id: string;
                sortOrder: number;
                productId: string;
                groupName: string | null;
                specKey: string;
                specValue: string;
            }[];
            branchStocks: ({
                branch: {
                    name: string;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    slug: string;
                    sortOrder: number;
                    status: import("@prisma/client").$Enums.CategoryStatus;
                };
            } & {
                id: string;
                productId: string;
                branchId: string;
                availabilityStatus: import("@prisma/client").$Enums.BranchAvailabilityStatus;
                quantity: number;
                note: string | null;
            })[];
            componentMaps: {
                id: string;
                productId: string;
                builderType: import("@prisma/client").$Enums.BuilderType;
                componentType: string;
            }[];
            specMeta: {
                id: string;
                productId: string;
                value: string;
                key: string;
            }[];
        } & {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            status: import("@prisma/client").$Enums.ProductStatus;
            isFeatured: boolean;
            seoTitle: string | null;
            seoDescription: string | null;
            sku: string;
            productBadge: string | null;
            shortDescription: string | null;
            fullDescription: string | null;
            warranty: string | null;
            price: number;
            specialPrice: number | null;
            regularPrice: number | null;
            offerPrice: number | null;
            discountText: string | null;
            emiPrice: string | null;
            imageUrl: string | null;
            stockStatus: import("@prisma/client").$Enums.StockStatus;
            totalQuantity: number;
            isOffer: boolean;
            isNewArrival: boolean;
            isCompareEnabled: boolean;
            isWishlistEnabled: boolean;
            categoryId: string;
            brandId: string | null;
        };
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    duplicate(id: string): Promise<{
        message: string;
        product: {
            category: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
                iconUrl: string | null;
                image: string | null;
                level: number;
                sortOrder: number;
                status: import("@prisma/client").$Enums.CategoryStatus;
                isFeatured: boolean;
                seoTitle: string | null;
                seoDescription: string | null;
                parentId: string | null;
            };
            brand: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
                iconUrl: string | null;
                image: string | null;
                level: number;
                sortOrder: number;
                status: import("@prisma/client").$Enums.CategoryStatus;
                isFeatured: boolean;
                seoTitle: string | null;
                seoDescription: string | null;
                parentId: string | null;
            } | null;
            images: {
                id: string;
                sortOrder: number;
                imageUrl: string;
                productId: string;
                isPrimary: boolean;
            }[];
            overviews: {
                id: string;
                sortOrder: number;
                productId: string;
                title: string;
                value: string;
            }[];
            specifications: {
                id: string;
                sortOrder: number;
                productId: string;
                groupName: string | null;
                specKey: string;
                specValue: string;
            }[];
            branchStocks: ({
                branch: {
                    name: string;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    slug: string;
                    sortOrder: number;
                    status: import("@prisma/client").$Enums.CategoryStatus;
                };
            } & {
                id: string;
                productId: string;
                branchId: string;
                availabilityStatus: import("@prisma/client").$Enums.BranchAvailabilityStatus;
                quantity: number;
                note: string | null;
            })[];
            componentMaps: {
                id: string;
                productId: string;
                builderType: import("@prisma/client").$Enums.BuilderType;
                componentType: string;
            }[];
            specMeta: {
                id: string;
                productId: string;
                value: string;
                key: string;
            }[];
        } & {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            status: import("@prisma/client").$Enums.ProductStatus;
            isFeatured: boolean;
            seoTitle: string | null;
            seoDescription: string | null;
            sku: string;
            productBadge: string | null;
            shortDescription: string | null;
            fullDescription: string | null;
            warranty: string | null;
            price: number;
            specialPrice: number | null;
            regularPrice: number | null;
            offerPrice: number | null;
            discountText: string | null;
            emiPrice: string | null;
            imageUrl: string | null;
            stockStatus: import("@prisma/client").$Enums.StockStatus;
            totalQuantity: number;
            isOffer: boolean;
            isNewArrival: boolean;
            isCompareEnabled: boolean;
            isWishlistEnabled: boolean;
            categoryId: string;
            brandId: string | null;
        };
    }>;
    bulkStatus(ids: string[], status: string): Prisma.PrismaPromise<Prisma.BatchPayload>;
    bulkCategory(ids: string[], categoryId: string): Prisma.PrismaPromise<Prisma.BatchPayload>;
    bulkStock(ids: string[], stockStatus: string, totalQuantity?: number): Prisma.PrismaPromise<Prisma.BatchPayload>;
    bulkPromotions(ids: string[], data: {
        isOffer?: boolean;
        offerPrice?: number;
        isNewArrival?: boolean;
    }): Prisma.PrismaPromise<Prisma.BatchPayload>;
    exportProducts(format?: 'csv' | 'xlsx'): Promise<{
        buffer: Buffer;
        filename: string;
        contentType: string;
    }>;
    exportTemplate(format?: 'csv' | 'xlsx'): {
        buffer: Buffer;
        filename: string;
        contentType: string;
    };
    importProducts(file?: Express.Multer.File): Promise<{
        created: number;
        updated: number;
        failed: number;
        errors: {
            row: number;
            message: string;
        }[];
        message: string;
    }>;
    private assertUnique;
    private assertCategory;
    private resolvePrimaryImage;
    private createMany;
    private resolveCurrentPrice;
    private buildSpreadsheetFile;
    private mapImportRow;
    private normalizeHeader;
    private slugify;
    private numberOrUndefined;
    private parseBoolean;
    private parseStockStatus;
    private parseProductStatus;
    private parseImages;
    private parseOverviews;
    private parseSpecifications;
    private parseBranchStocks;
    private parseComponentMaps;
    private parseSpecMeta;
    private parseBranchStatus;
    private findCategoryByRef;
    private readonly productInclude;
}
