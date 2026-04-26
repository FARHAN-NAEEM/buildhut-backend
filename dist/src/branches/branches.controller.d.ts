import { BranchesService } from './branches.service';
export declare class BranchesController {
    private readonly branchesService;
    constructor(branchesService: BranchesService);
    create(body: {
        name: string;
        slug: string;
        sortOrder?: number;
        status?: 'ACTIVE' | 'INACTIVE';
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
    update(id: string, body: {
        name?: string;
        slug?: string;
        sortOrder?: number;
        status?: 'ACTIVE' | 'INACTIVE';
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
}
