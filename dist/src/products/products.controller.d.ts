import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
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
            discountText: string | null;
            emiPrice: string | null;
            imageUrl: string | null;
            stockStatus: import("@prisma/client").$Enums.StockStatus;
            totalQuantity: number;
            isCompareEnabled: boolean;
            isWishlistEnabled: boolean;
            categoryId: string;
            brandId: string | null;
        };
    }>;
    findAll(search?: string, categoryId?: string, brandId?: string, stockStatus?: string, status?: string, minPrice?: string, maxPrice?: string): import("@prisma/client").Prisma.PrismaPromise<({
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
        discountText: string | null;
        emiPrice: string | null;
        imageUrl: string | null;
        stockStatus: import("@prisma/client").$Enums.StockStatus;
        totalQuantity: number;
        isCompareEnabled: boolean;
        isWishlistEnabled: boolean;
        categoryId: string;
        brandId: string | null;
    })[]>;
    exportProducts(format: "csv" | "xlsx" | undefined, res: any): Promise<any>;
    exportTemplate(format: "csv" | "xlsx" | undefined, res: any): Promise<any>;
    importProducts(file: Express.Multer.File): Promise<{
        created: number;
        updated: number;
        failed: number;
        errors: {
            row: number;
            message: string;
        }[];
        message: string;
    }>;
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
        discountText: string | null;
        emiPrice: string | null;
        imageUrl: string | null;
        stockStatus: import("@prisma/client").$Enums.StockStatus;
        totalQuantity: number;
        isCompareEnabled: boolean;
        isWishlistEnabled: boolean;
        categoryId: string;
        brandId: string | null;
    }>;
    bulkStatus(body: {
        ids: string[];
        status: string;
    }): import("@prisma/client").Prisma.PrismaPromise<import("@prisma/client").Prisma.BatchPayload>;
    bulkCategory(body: {
        ids: string[];
        categoryId: string;
    }): import("@prisma/client").Prisma.PrismaPromise<import("@prisma/client").Prisma.BatchPayload>;
    bulkStock(body: {
        ids: string[];
        stockStatus: string;
        totalQuantity?: number;
    }): import("@prisma/client").Prisma.PrismaPromise<import("@prisma/client").Prisma.BatchPayload>;
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
            discountText: string | null;
            emiPrice: string | null;
            imageUrl: string | null;
            stockStatus: import("@prisma/client").$Enums.StockStatus;
            totalQuantity: number;
            isCompareEnabled: boolean;
            isWishlistEnabled: boolean;
            categoryId: string;
            brandId: string | null;
        };
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
            discountText: string | null;
            emiPrice: string | null;
            imageUrl: string | null;
            stockStatus: import("@prisma/client").$Enums.StockStatus;
            totalQuantity: number;
            isCompareEnabled: boolean;
            isWishlistEnabled: boolean;
            categoryId: string;
            brandId: string | null;
        };
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
