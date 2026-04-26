import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<{
        message: string;
        user: {
            name: string;
            id: string;
            email: string;
            phone: string | null;
            role: import("@prisma/client").$Enums.Role;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    getProfile(req: any): {
        message: string;
        user: any;
    };
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
    }[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__UserClient<{
        name: string;
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, updateUserDto: UpdateUserDto): string;
    remove(id: string): string;
}
