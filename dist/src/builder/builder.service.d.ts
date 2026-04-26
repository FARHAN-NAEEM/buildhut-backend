import { BuilderType, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
type BuildItemInput = {
    componentType: string;
    productId: string;
};
export declare class BuilderService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    components(type: BuilderType): Prisma.PrismaPromise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        sortOrder: number;
        builderType: import("@prisma/client").$Enums.BuilderType;
        isRequired: boolean;
        allowMultiple: boolean;
    }[]>;
    products(type: BuilderType, componentType: string, search?: string): Prisma.PrismaPromise<({
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
        images: {
            id: string;
            sortOrder: number;
            imageUrl: string;
            productId: string;
            isPrimary: boolean;
        }[];
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
    validate(type: BuilderType, items: BuildItemInput[]): Promise<{
        valid: boolean;
        warnings: string[];
        totalPrice: number;
        totalPower: number;
        items: BuildItemInput[];
    }>;
    save(type: BuilderType, items: BuildItemInput[], userId?: string): Promise<{
        items: ({
            product: {
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
        } & {
            id: string;
            productId: string;
            componentType: string;
            buildId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        totalPrice: number;
        totalPower: number;
        shareCode: string;
    }>;
    share(type: BuilderType, shareCode: string): Promise<{
        items: ({
            product: {
                images: {
                    id: string;
                    sortOrder: number;
                    imageUrl: string;
                    productId: string;
                    isPrimary: boolean;
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
        } & {
            id: string;
            productId: string;
            componentType: string;
            buildId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        totalPrice: number;
        totalPower: number;
        shareCode: string;
    }>;
    private loadProducts;
    private createMetaMap;
    private productId;
    private validatePc;
    private validateCcCamera;
}
export {};
