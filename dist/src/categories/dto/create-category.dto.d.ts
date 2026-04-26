import { CategoryStatus } from '@prisma/client';
export declare class CreateCategoryDto {
    name: string;
    slug: string;
    iconUrl?: string;
    image?: string;
    parentId?: string;
    sortOrder?: number;
    status?: CategoryStatus;
    isFeatured?: boolean;
    seoTitle?: string;
    seoDescription?: string;
}
