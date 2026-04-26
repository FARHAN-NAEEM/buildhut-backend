"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuilderService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BuilderService = class BuilderService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    components(type) {
        return this.prisma.builderComponent.findMany({
            where: { builderType: type },
            orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        });
    }
    products(type, componentType, search) {
        const where = {
            status: 'ACTIVE',
            componentMaps: {
                some: { builderType: type, componentType },
            },
        };
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { sku: { contains: search, mode: 'insensitive' } },
            ];
        }
        return this.prisma.product.findMany({
            where,
            include: {
                category: true,
                images: { orderBy: { sortOrder: 'asc' } },
                componentMaps: true,
                specMeta: true,
            },
            orderBy: { name: 'asc' },
        });
    }
    async validate(type, items) {
        const products = await this.loadProducts(items);
        const meta = this.createMetaMap(products);
        const warnings = type === 'CC_CAMERA'
            ? this.validateCcCamera(items, meta)
            : this.validatePc(items, meta);
        const componentRules = await this.components(type);
        const selectedComponents = new Set(items.map((item) => item.componentType));
        componentRules
            .filter((component) => component.isRequired && !selectedComponents.has(component.slug))
            .forEach((component) => warnings.push(`${component.name} is required.`));
        const totalPrice = products.reduce((sum, product) => sum + product.price, 0);
        const totalPower = products.reduce((sum, product) => { var _a, _b; return sum + (Number((_b = (_a = meta[product.id]) === null || _a === void 0 ? void 0 : _a.power_watt) !== null && _b !== void 0 ? _b : 0) || 0); }, 0);
        return {
            valid: warnings.length === 0,
            warnings,
            totalPrice,
            totalPower,
            items,
        };
    }
    async save(type, items, userId) {
        const validation = await this.validate(type, items);
        if (!validation.valid) {
            throw new common_1.BadRequestException({ message: 'Build has compatibility issues.', warnings: validation.warnings });
        }
        if (type === 'CC_CAMERA') {
            return this.prisma.ccBuilderSession.create({
                data: {
                    userId,
                    totalPrice: validation.totalPrice,
                    totalPower: validation.totalPower,
                    items: {
                        create: items.map((item) => ({
                            componentType: item.componentType,
                            productId: item.productId,
                        })),
                    },
                },
                include: { items: { include: { product: true } } },
            });
        }
        return this.prisma.buildSession.create({
            data: {
                userId,
                totalPrice: validation.totalPrice,
                totalPower: validation.totalPower,
                items: {
                    create: items.map((item) => ({
                        componentType: item.componentType,
                        productId: item.productId,
                    })),
                },
            },
            include: { items: { include: { product: true } } },
        });
    }
    async share(type, shareCode) {
        const build = type === 'CC_CAMERA'
            ? await this.prisma.ccBuilderSession.findUnique({
                where: { shareCode },
                include: { items: { include: { product: { include: { images: true, specMeta: true } } } } },
            })
            : await this.prisma.buildSession.findUnique({
                where: { shareCode },
                include: { items: { include: { product: { include: { images: true, specMeta: true } } } } },
            });
        if (!build)
            throw new common_1.NotFoundException('Build not found.');
        return build;
    }
    async loadProducts(items) {
        const ids = items.map((item) => item.productId);
        const products = await this.prisma.product.findMany({
            where: { id: { in: ids } },
            include: { specMeta: true },
        });
        if (products.length !== ids.length) {
            throw new common_1.BadRequestException('One or more selected products were not found.');
        }
        return products;
    }
    createMetaMap(products) {
        return Object.fromEntries(products.map((product) => [
            product.id,
            Object.fromEntries(product.specMeta.map((meta) => [meta.key, meta.value])),
        ]));
    }
    productId(items, componentType) {
        var _a;
        return (_a = items.find((item) => item.componentType === componentType)) === null || _a === void 0 ? void 0 : _a.productId;
    }
    validatePc(items, meta) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
        const warnings = [];
        const cpu = this.productId(items, 'cpu');
        const motherboard = this.productId(items, 'motherboard');
        const ram = this.productId(items, 'ram');
        const gpu = this.productId(items, 'graphics-card');
        const psu = this.productId(items, 'power-supply');
        const casing = this.productId(items, 'casing');
        if (cpu && motherboard) {
            const cpuSocket = ((_a = meta[cpu]) === null || _a === void 0 ? void 0 : _a.cpu_socket) || ((_b = meta[cpu]) === null || _b === void 0 ? void 0 : _b.socket);
            const boardSocket = ((_c = meta[motherboard]) === null || _c === void 0 ? void 0 : _c.motherboard_socket) || ((_d = meta[motherboard]) === null || _d === void 0 ? void 0 : _d.socket);
            if (cpuSocket && boardSocket && cpuSocket.toLowerCase() !== boardSocket.toLowerCase()) {
                warnings.push(`CPU socket (${cpuSocket}) does not match motherboard socket (${boardSocket}).`);
            }
        }
        if (ram && motherboard) {
            const ramType = ((_e = meta[ram]) === null || _e === void 0 ? void 0 : _e.ram_type) || ((_f = meta[ram]) === null || _f === void 0 ? void 0 : _f.ddr_type);
            const boardRam = ((_g = meta[motherboard]) === null || _g === void 0 ? void 0 : _g.motherboard_ram_type) || ((_h = meta[motherboard]) === null || _h === void 0 ? void 0 : _h.ram_type) || ((_j = meta[motherboard]) === null || _j === void 0 ? void 0 : _j.ddr_type);
            if (ramType && boardRam && ramType.toLowerCase() !== boardRam.toLowerCase()) {
                warnings.push(`RAM type (${ramType}) does not match motherboard RAM support (${boardRam}).`);
            }
        }
        if (casing && motherboard) {
            const casingFactors = (((_k = meta[casing]) === null || _k === void 0 ? void 0 : _k.form_factor) || '').toLowerCase();
            const boardFactor = (((_l = meta[motherboard]) === null || _l === void 0 ? void 0 : _l.form_factor) || '').toLowerCase();
            if (casingFactors && boardFactor && !casingFactors.includes(boardFactor)) {
                warnings.push(`Casing form factor (${(_m = meta[casing]) === null || _m === void 0 ? void 0 : _m.form_factor}) may not support motherboard (${(_o = meta[motherboard]) === null || _o === void 0 ? void 0 : _o.form_factor}).`);
            }
        }
        const psuWatt = psu ? Number(((_p = meta[psu]) === null || _p === void 0 ? void 0 : _p.psu_watt) || ((_q = meta[psu]) === null || _q === void 0 ? void 0 : _q.power_watt) || 0) : 0;
        const gpuWatt = gpu ? Number(((_r = meta[gpu]) === null || _r === void 0 ? void 0 : _r.gpu_power_requirement) || ((_s = meta[gpu]) === null || _s === void 0 ? void 0 : _s.power_watt) || 0) : 0;
        const estimatedPower = items.reduce((sum, item) => { var _a, _b; return sum + (Number((_b = (_a = meta[item.productId]) === null || _a === void 0 ? void 0 : _a.power_watt) !== null && _b !== void 0 ? _b : 0) || 0); }, 0);
        const requiredPower = Math.max(gpuWatt, estimatedPower);
        if (psu && requiredPower && psuWatt < requiredPower) {
            warnings.push(`Power supply watt (${psuWatt}W) is lower than estimated requirement (${requiredPower}W).`);
        }
        return warnings;
    }
    validateCcCamera(items, meta) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        const warnings = [];
        const camera = this.productId(items, 'camera');
        const recorder = this.productId(items, 'recorder');
        const storage = this.productId(items, 'storage');
        const cable = this.productId(items, 'cable');
        const power = this.productId(items, 'power-source');
        if (camera && recorder) {
            const cameraType = (_a = meta[camera]) === null || _a === void 0 ? void 0 : _a.camera_type;
            const recorderType = ((_b = meta[recorder]) === null || _b === void 0 ? void 0 : _b.recorder_type) || ((_c = meta[recorder]) === null || _c === void 0 ? void 0 : _c.camera_type);
            if (cameraType && recorderType && cameraType.toLowerCase() !== recorderType.toLowerCase()) {
                warnings.push(`Camera type (${cameraType}) does not match recorder type (${recorderType}).`);
            }
        }
        if (storage && recorder) {
            const storageInterface = (_d = meta[storage]) === null || _d === void 0 ? void 0 : _d.storage_interface;
            const recorderStorage = (_e = meta[recorder]) === null || _e === void 0 ? void 0 : _e.storage_support;
            if (storageInterface && recorderStorage && !recorderStorage.toLowerCase().includes(storageInterface.toLowerCase())) {
                warnings.push(`Storage (${storageInterface}) is not listed in recorder support (${recorderStorage}).`);
            }
        }
        if (camera && cable) {
            const cameraType = (_g = (_f = meta[camera]) === null || _f === void 0 ? void 0 : _f.camera_type) === null || _g === void 0 ? void 0 : _g.toLowerCase();
            const cableType = (_j = (_h = meta[cable]) === null || _h === void 0 ? void 0 : _h.cable_type) === null || _j === void 0 ? void 0 : _j.toLowerCase();
            if (cameraType && cableType && !cableType.includes(cameraType)) {
                warnings.push(`Cable type (${(_k = meta[cable]) === null || _k === void 0 ? void 0 : _k.cable_type}) may not match camera type (${(_l = meta[camera]) === null || _l === void 0 ? void 0 : _l.camera_type}).`);
            }
        }
        if (camera && power) {
            const cameraPower = (_m = meta[camera]) === null || _m === void 0 ? void 0 : _m.power_type;
            const powerType = (_o = meta[power]) === null || _o === void 0 ? void 0 : _o.power_type;
            if (cameraPower && powerType && cameraPower.toLowerCase() !== powerType.toLowerCase()) {
                warnings.push(`Power source (${powerType}) does not match camera power (${cameraPower}).`);
            }
        }
        return warnings;
    }
};
exports.BuilderService = BuilderService;
exports.BuilderService = BuilderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BuilderService);
//# sourceMappingURL=builder.service.js.map