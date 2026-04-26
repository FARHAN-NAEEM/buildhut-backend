import { CategoryStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
export declare class BranchesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: {
        name: string;
        slug: string;
        sortOrder?: number;
        status?: CategoryStatus;
    }): Promise<{
        message: string;
        branch: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            sortOrder: number;
            status: import("@prisma/client").$Enums.CategoryStatus;
        };
    }>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        sortOrder: number;
        status: import("@prisma/client").$Enums.CategoryStatus;
    }[]>;
    update(id: string, data: {
        name?: string;
        slug?: string;
        sortOrder?: number;
        status?: CategoryStatus;
    }): Promise<{
        message: string;
        branch: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            sortOrder: number;
            status: import("@prisma/client").$Enums.CategoryStatus;
        };
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    private findOne;
}
