"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const XLSX = __importStar(require("xlsx"));
const prisma_service_1 = require("../prisma/prisma.service");
const productImportHeaders = [
    'Product Name',
    'SKU',
    'Slug',
    'Category Slug',
    'Brand Slug',
    'Badge',
    'Special Price',
    'Regular Price',
    'Offer Price',
    'Offer Enabled',
    'New Arrival',
    'Discount Text',
    'EMI Price',
    'Stock Status',
    'Quantity',
    'Status',
    'Featured',
    'Compare Enabled',
    'Wishlist Enabled',
    'Short Description',
    'Description',
    'Warranty',
    'SEO Title',
    'SEO Description',
    'Images',
    'Quick Overview',
    'Specifications',
    'Branch Availability',
    'Builder Tags',
    'Compatibility Meta',
];
let ProductsService = class ProductsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.productInclude = {
            category: true,
            brand: true,
            images: { orderBy: { sortOrder: 'asc' } },
            overviews: { orderBy: { sortOrder: 'asc' } },
            specifications: { orderBy: { sortOrder: 'asc' } },
            branchStocks: {
                include: { branch: true },
                orderBy: { branch: { sortOrder: 'asc' } },
            },
            componentMaps: true,
            specMeta: true,
        };
    }
    async create(createProductDto) {
        await this.assertUnique(createProductDto.slug, createProductDto.sku);
        await this.assertCategory(createProductDto.categoryId);
        if (createProductDto.brandId)
            await this.assertCategory(createProductDto.brandId);
        const { images, overviews, specifications, branchStocks, componentMaps, specMeta } = createProductDto, productData = __rest(createProductDto, ["images", "overviews", "specifications", "branchStocks", "componentMaps", "specMeta"]);
        const primaryImage = this.resolvePrimaryImage(images);
        const price = this.resolveCurrentPrice(productData);
        const product = await this.prisma.product.create({
            data: Object.assign(Object.assign({}, productData), { price, imageUrl: primaryImage, images: this.createMany(images === null || images === void 0 ? void 0 : images.map((image, index) => {
                    var _a, _b;
                    return ({
                        imageUrl: image.imageUrl,
                        sortOrder: (_a = image.sortOrder) !== null && _a !== void 0 ? _a : index,
                        isPrimary: (_b = image.isPrimary) !== null && _b !== void 0 ? _b : index === 0,
                    });
                })), overviews: this.createMany(overviews === null || overviews === void 0 ? void 0 : overviews.map((overview, index) => {
                    var _a;
                    return ({
                        title: overview.title,
                        value: overview.value,
                        sortOrder: (_a = overview.sortOrder) !== null && _a !== void 0 ? _a : index,
                    });
                })), specifications: this.createMany(specifications === null || specifications === void 0 ? void 0 : specifications.map((spec, index) => {
                    var _a;
                    return ({
                        groupName: spec.groupName,
                        specKey: spec.specKey,
                        specValue: spec.specValue,
                        sortOrder: (_a = spec.sortOrder) !== null && _a !== void 0 ? _a : index,
                    });
                })), branchStocks: this.createMany(branchStocks === null || branchStocks === void 0 ? void 0 : branchStocks.map((stock) => ({
                    branchId: stock.branchId,
                    availabilityStatus: stock.availabilityStatus,
                    quantity: stock.quantity,
                    note: stock.note,
                }))), componentMaps: this.createMany(componentMaps === null || componentMaps === void 0 ? void 0 : componentMaps.map((map) => ({
                    builderType: map.builderType,
                    componentType: map.componentType,
                }))), specMeta: this.createMany(specMeta === null || specMeta === void 0 ? void 0 : specMeta.map((meta) => ({
                    key: meta.key,
                    value: meta.value,
                }))) }),
            include: this.productInclude,
        });
        return { message: 'Product created successfully.', product };
    }
    findAll(filters = {}) {
        const where = {};
        if (filters.search) {
            where.OR = [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { sku: { contains: filters.search, mode: 'insensitive' } },
                { category: { name: { contains: filters.search, mode: 'insensitive' } } },
            ];
        }
        if (filters.categoryId)
            where.categoryId = filters.categoryId;
        if (filters.brandId)
            where.brandId = filters.brandId;
        if (filters.stockStatus)
            where.stockStatus = filters.stockStatus;
        if (filters.status)
            where.status = filters.status;
        if (filters.isOffer !== undefined)
            where.isOffer = filters.isOffer;
        if (filters.isNewArrival !== undefined)
            where.isNewArrival = filters.isNewArrival;
        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
            where.price = Object.assign(Object.assign({}, (filters.minPrice !== undefined ? { gte: filters.minPrice } : {})), (filters.maxPrice !== undefined ? { lte: filters.maxPrice } : {}));
        }
        return this.prisma.product.findMany({
            where,
            include: this.productInclude,
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const product = await this.prisma.product.findFirst({
            where: { OR: [{ id }, { slug: id }, { sku: id }] },
            include: this.productInclude,
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found.');
        }
        return product;
    }
    async update(id, updateProductDto) {
        const product = await this.findOne(id);
        if (updateProductDto.slug || updateProductDto.sku) {
            await this.assertUnique(updateProductDto.slug, updateProductDto.sku, product.id);
        }
        if (updateProductDto.categoryId)
            await this.assertCategory(updateProductDto.categoryId);
        if (updateProductDto.brandId)
            await this.assertCategory(updateProductDto.brandId);
        const { images, overviews, specifications, branchStocks, componentMaps, specMeta } = updateProductDto, productData = __rest(updateProductDto, ["images", "overviews", "specifications", "branchStocks", "componentMaps", "specMeta"]);
        const price = this.resolveCurrentPrice(productData, product.price);
        const primaryImage = images ? this.resolvePrimaryImage(images) : product.imageUrl;
        const updated = await this.prisma.$transaction(async (tx) => {
            if (images) {
                await tx.productImage.deleteMany({ where: { productId: product.id } });
            }
            if (overviews) {
                await tx.productOverview.deleteMany({ where: { productId: product.id } });
            }
            if (specifications) {
                await tx.productSpecification.deleteMany({ where: { productId: product.id } });
            }
            if (branchStocks) {
                await tx.productBranchStock.deleteMany({ where: { productId: product.id } });
            }
            if (componentMaps) {
                await tx.productComponentMap.deleteMany({ where: { productId: product.id } });
            }
            if (specMeta) {
                await tx.productSpecMeta.deleteMany({ where: { productId: product.id } });
            }
            return tx.product.update({
                where: { id: product.id },
                data: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, productData), { price, imageUrl: primaryImage }), (images ? {
                    images: this.createMany(images.map((image, index) => {
                        var _a, _b;
                        return ({
                            imageUrl: image.imageUrl,
                            sortOrder: (_a = image.sortOrder) !== null && _a !== void 0 ? _a : index,
                            isPrimary: (_b = image.isPrimary) !== null && _b !== void 0 ? _b : index === 0,
                        });
                    })),
                } : {})), (overviews ? {
                    overviews: this.createMany(overviews.map((overview, index) => {
                        var _a;
                        return ({
                            title: overview.title,
                            value: overview.value,
                            sortOrder: (_a = overview.sortOrder) !== null && _a !== void 0 ? _a : index,
                        });
                    })),
                } : {})), (specifications ? {
                    specifications: this.createMany(specifications.map((spec, index) => {
                        var _a;
                        return ({
                            groupName: spec.groupName,
                            specKey: spec.specKey,
                            specValue: spec.specValue,
                            sortOrder: (_a = spec.sortOrder) !== null && _a !== void 0 ? _a : index,
                        });
                    })),
                } : {})), (branchStocks ? {
                    branchStocks: this.createMany(branchStocks.map((stock) => ({
                        branchId: stock.branchId,
                        availabilityStatus: stock.availabilityStatus,
                        quantity: stock.quantity,
                        note: stock.note,
                    }))),
                } : {})), (componentMaps ? {
                    componentMaps: this.createMany(componentMaps.map((map) => ({
                        builderType: map.builderType,
                        componentType: map.componentType,
                    }))),
                } : {})), (specMeta ? {
                    specMeta: this.createMany(specMeta.map((meta) => ({
                        key: meta.key,
                        value: meta.value,
                    }))),
                } : {})),
                include: this.productInclude,
            });
        });
        return { message: 'Product updated successfully.', product: updated };
    }
    async remove(id) {
        const product = await this.findOne(id);
        await this.prisma.product.delete({ where: { id: product.id } });
        return { message: 'Product deleted successfully.' };
    }
    async duplicate(id) {
        const product = await this.findOne(id);
        const copySku = `${product.sku}-COPY-${Date.now().toString().slice(-5)}`;
        const copySlug = `${product.slug}-copy-${Date.now().toString().slice(-5)}`;
        const duplicate = await this.prisma.product.create({
            data: {
                name: `${product.name} Copy`,
                slug: copySlug,
                sku: copySku,
                productBadge: product.productBadge,
                shortDescription: product.shortDescription,
                fullDescription: product.fullDescription,
                warranty: product.warranty,
                price: product.price,
                specialPrice: product.specialPrice,
                regularPrice: product.regularPrice,
                offerPrice: product.offerPrice,
                discountText: product.discountText,
                emiPrice: product.emiPrice,
                imageUrl: product.imageUrl,
                stockStatus: product.stockStatus,
                totalQuantity: product.totalQuantity,
                status: 'DRAFT',
                isFeatured: product.isFeatured,
                isOffer: product.isOffer,
                isNewArrival: product.isNewArrival,
                isCompareEnabled: product.isCompareEnabled,
                isWishlistEnabled: product.isWishlistEnabled,
                seoTitle: product.seoTitle,
                seoDescription: product.seoDescription,
                categoryId: product.categoryId,
                brandId: product.brandId,
                images: this.createMany(product.images.map((image) => ({
                    imageUrl: image.imageUrl,
                    sortOrder: image.sortOrder,
                    isPrimary: image.isPrimary,
                }))),
                overviews: this.createMany(product.overviews.map((overview) => ({
                    title: overview.title,
                    value: overview.value,
                    sortOrder: overview.sortOrder,
                }))),
                specifications: this.createMany(product.specifications.map((spec) => ({
                    groupName: spec.groupName,
                    specKey: spec.specKey,
                    specValue: spec.specValue,
                    sortOrder: spec.sortOrder,
                }))),
                branchStocks: this.createMany(product.branchStocks.map((stock) => ({
                    branchId: stock.branchId,
                    availabilityStatus: stock.availabilityStatus,
                    quantity: stock.quantity,
                    note: stock.note,
                }))),
                componentMaps: this.createMany(product.componentMaps.map((map) => ({
                    builderType: map.builderType,
                    componentType: map.componentType,
                }))),
                specMeta: this.createMany(product.specMeta.map((meta) => ({
                    key: meta.key,
                    value: meta.value,
                }))),
            },
            include: this.productInclude,
        });
        return { message: 'Product duplicated as draft.', product: duplicate };
    }
    bulkStatus(ids, status) {
        return this.prisma.product.updateMany({
            where: { id: { in: ids } },
            data: { status: status },
        });
    }
    bulkCategory(ids, categoryId) {
        return this.prisma.product.updateMany({
            where: { id: { in: ids } },
            data: { categoryId },
        });
    }
    bulkStock(ids, stockStatus, totalQuantity) {
        return this.prisma.product.updateMany({
            where: { id: { in: ids } },
            data: Object.assign({ stockStatus: stockStatus }, (totalQuantity !== undefined ? { totalQuantity } : {})),
        });
    }
    bulkPromotions(ids, data) {
        return this.prisma.product.updateMany({
            where: { id: { in: ids } },
            data: Object.assign(Object.assign(Object.assign(Object.assign({}, (data.isOffer !== undefined ? { isOffer: data.isOffer } : {})), (data.offerPrice !== undefined ? { offerPrice: data.offerPrice } : {})), (data.isOffer === true && data.offerPrice !== undefined ? { price: data.offerPrice } : {})), (data.isNewArrival !== undefined ? { isNewArrival: data.isNewArrival } : {})),
        });
    }
    async exportProducts(format = 'csv') {
        const products = await this.prisma.product.findMany({
            include: this.productInclude,
            orderBy: { createdAt: 'desc' },
        });
        const rows = products.map((product) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
            return ({
                'Product Name': product.name,
                SKU: product.sku,
                Slug: product.slug,
                'Category Slug': (_b = (_a = product.category) === null || _a === void 0 ? void 0 : _a.slug) !== null && _b !== void 0 ? _b : '',
                'Brand Slug': (_d = (_c = product.brand) === null || _c === void 0 ? void 0 : _c.slug) !== null && _d !== void 0 ? _d : '',
                Badge: (_e = product.productBadge) !== null && _e !== void 0 ? _e : '',
                'Special Price': (_f = product.specialPrice) !== null && _f !== void 0 ? _f : '',
                'Regular Price': (_g = product.regularPrice) !== null && _g !== void 0 ? _g : '',
                'Offer Price': (_h = product.offerPrice) !== null && _h !== void 0 ? _h : '',
                'Offer Enabled': product.isOffer ? 'yes' : 'no',
                'New Arrival': product.isNewArrival ? 'yes' : 'no',
                'Discount Text': (_j = product.discountText) !== null && _j !== void 0 ? _j : '',
                'EMI Price': (_k = product.emiPrice) !== null && _k !== void 0 ? _k : '',
                'Stock Status': product.stockStatus,
                Quantity: product.totalQuantity,
                Status: product.status,
                Featured: product.isFeatured ? 'yes' : 'no',
                'Compare Enabled': product.isCompareEnabled ? 'yes' : 'no',
                'Wishlist Enabled': product.isWishlistEnabled ? 'yes' : 'no',
                'Short Description': (_l = product.shortDescription) !== null && _l !== void 0 ? _l : '',
                Description: (_m = product.fullDescription) !== null && _m !== void 0 ? _m : '',
                Warranty: (_o = product.warranty) !== null && _o !== void 0 ? _o : '',
                'SEO Title': (_p = product.seoTitle) !== null && _p !== void 0 ? _p : '',
                'SEO Description': (_q = product.seoDescription) !== null && _q !== void 0 ? _q : '',
                Images: product.images.map((image) => image.imageUrl).join('|'),
                'Quick Overview': product.overviews.map((item) => `${item.title}=${item.value}`).join(';'),
                Specifications: product.specifications.map((item) => { var _a; return `${(_a = item.groupName) !== null && _a !== void 0 ? _a : 'General'}|${item.specKey}=${item.specValue}`; }).join(';'),
                'Branch Availability': product.branchStocks
                    .map((stock) => `${stock.branch.name}=${stock.availabilityStatus}:${stock.quantity}${stock.note ? `:${stock.note}` : ''}`)
                    .join(';'),
                'Builder Tags': product.componentMaps.map((map) => `${map.builderType}:${map.componentType}`).join(';'),
                'Compatibility Meta': product.specMeta.map((meta) => `${meta.key}=${meta.value}`).join(';'),
            });
        });
        return this.buildSpreadsheetFile(rows, format, 'buildhut-products');
    }
    exportTemplate(format = 'csv') {
        const rows = [{
                'Product Name': 'Acer Aspire 15 AS15-42 AMD Ryzen 3 7330U 8GB RAM 512GB SSD 15.6 Inch FHD Display Pure Silver Laptop',
                SKU: 'ACER-AS15-42-R3',
                Slug: 'acer-aspire-15-as15-42-ryzen-3',
                'Category Slug': 'laptop-acer',
                'Brand Slug': 'laptop-acer',
                Badge: 'New Arrival',
                'Special Price': 56500,
                'Regular Price': 61300,
                'Offer Price': 54500,
                'Offer Enabled': 'yes',
                'New Arrival': 'yes',
                'Discount Text': 'Save Extra Tk 1,000 on online order',
                'EMI Price': 'Tk 4,708/month',
                'Stock Status': 'IN_STOCK',
                Quantity: 35,
                Status: 'ACTIVE',
                Featured: 'yes',
                'Compare Enabled': 'yes',
                'Wishlist Enabled': 'yes',
                'Short Description': 'Ryzen 3, 8GB RAM, 512GB SSD, 15.6 Inch FHD',
                Description: 'Full product description here',
                Warranty: '2 years warranty',
                'SEO Title': 'Acer Aspire 15 AS15-42 Laptop',
                'SEO Description': 'Acer Aspire 15 Ryzen 3 laptop in Bangladesh',
                Images: 'https://example.com/image-1.jpg|https://example.com/image-2.jpg',
                'Quick Overview': 'Processor Type=Ryzen 3;RAM=8GB;Storage=512GB SSD;Display Size=15.6;Color=Pure Silver',
                Specifications: 'Processor|Processor Type=Ryzen 3;Memory|RAM=8GB;Storage|Storage=512GB SSD',
                'Branch Availability': 'Dhaka=AVAILABLE:10;Chattogram=AVAILABLE:5;Rajshahi=OUT_OF_STOCK:0;eCommerce - Ready Stock=READY_STOCK:20',
                'Builder Tags': 'PC:cpu',
                'Compatibility Meta': 'cpu_socket=AM5;power_watt=65',
            }];
        return this.buildSpreadsheetFile(rows, format, 'buildhut-product-import-template');
    }
    async importProducts(file) {
        if (!file)
            throw new common_1.BadRequestException('Please upload a CSV or Excel file.');
        const workbook = XLSX.read(file.buffer, { type: 'buffer' });
        const firstSheetName = workbook.SheetNames[0];
        if (!firstSheetName)
            throw new common_1.BadRequestException('The uploaded file has no sheets.');
        const rows = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName], { defval: '' });
        if (!rows.length)
            throw new common_1.BadRequestException('The uploaded file has no product rows.');
        const report = {
            created: 0,
            updated: 0,
            failed: 0,
            errors: [],
        };
        for (const [index, row] of rows.entries()) {
            try {
                const dto = await this.mapImportRow(row);
                const existing = await this.prisma.product.findUnique({ where: { sku: dto.sku } });
                if (existing) {
                    await this.update(existing.id, dto);
                    report.updated += 1;
                }
                else {
                    await this.create(dto);
                    report.created += 1;
                }
            }
            catch (error) {
                report.failed += 1;
                report.errors.push({
                    row: index + 2,
                    message: error instanceof Error ? error.message : 'Unknown import error',
                });
            }
        }
        return Object.assign({ message: 'Import completed.' }, report);
    }
    async assertUnique(slug, sku, currentId) {
        if (slug) {
            const slugOwner = await this.prisma.product.findUnique({ where: { slug } });
            if (slugOwner && slugOwner.id !== currentId) {
                throw new common_1.ConflictException('Product with this slug already exists.');
            }
        }
        if (sku) {
            const skuOwner = await this.prisma.product.findUnique({ where: { sku } });
            if (skuOwner && skuOwner.id !== currentId) {
                throw new common_1.ConflictException('Product with this SKU already exists.');
            }
        }
    }
    async assertCategory(categoryId) {
        const category = await this.prisma.category.findUnique({ where: { id: categoryId } });
        if (!category)
            throw new common_1.NotFoundException('Category not found.');
    }
    resolvePrimaryImage(images) {
        var _a, _b;
        if (!(images === null || images === void 0 ? void 0 : images.length))
            return undefined;
        return (_b = (_a = images.find((image) => image.isPrimary)) === null || _a === void 0 ? void 0 : _a.imageUrl) !== null && _b !== void 0 ? _b : images[0].imageUrl;
    }
    createMany(items) {
        if (!(items === null || items === void 0 ? void 0 : items.length))
            return undefined;
        return { create: items };
    }
    resolveCurrentPrice(productData, fallback = 0) {
        var _a, _b;
        if (productData.isOffer && productData.offerPrice !== undefined)
            return productData.offerPrice;
        return (_b = (_a = productData.specialPrice) !== null && _a !== void 0 ? _a : productData.regularPrice) !== null && _b !== void 0 ? _b : fallback;
    }
    buildSpreadsheetFile(rows, format, filename) {
        const worksheet = XLSX.utils.json_to_sheet(rows.length ? rows : [Object.fromEntries(productImportHeaders.map((header) => [header, '']))], {
            header: productImportHeaders,
        });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
        if (format === 'xlsx') {
            return {
                buffer: XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }),
                filename: `${filename}.xlsx`,
                contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            };
        }
        return {
            buffer: Buffer.from(XLSX.utils.sheet_to_csv(worksheet), 'utf8'),
            filename: `${filename}.csv`,
            contentType: 'text/csv; charset=utf-8',
        };
    }
    async mapImportRow(row) {
        var _a;
        const value = (...headers) => {
            const normalizedRow = Object.fromEntries(Object.entries(row).map(([key, item]) => [this.normalizeHeader(key), item]));
            for (const header of headers) {
                const item = normalizedRow[this.normalizeHeader(header)];
                if (item !== undefined && item !== null && String(item).trim() !== '')
                    return String(item).trim();
            }
            return '';
        };
        const name = value('Product Name', 'Name');
        const sku = value('SKU', 'Product ID', 'Product ID / SKU');
        const slug = value('Slug') || this.slugify(name);
        const categoryRef = value('Category Slug', 'Category ID', 'Category');
        if (!name)
            throw new common_1.BadRequestException('Product Name is required.');
        if (!sku)
            throw new common_1.BadRequestException('SKU is required.');
        if (!categoryRef)
            throw new common_1.BadRequestException('Category Slug or Category ID is required.');
        const category = await this.findCategoryByRef(categoryRef);
        const brandRef = value('Brand Slug', 'Brand ID', 'Brand', 'Type');
        const brand = brandRef ? await this.findCategoryByRef(brandRef) : null;
        return {
            name,
            sku,
            slug,
            categoryId: category.id,
            brandId: brand === null || brand === void 0 ? void 0 : brand.id,
            productBadge: value('Badge', 'Product Badge') || undefined,
            specialPrice: this.numberOrUndefined(value('Special Price')),
            regularPrice: this.numberOrUndefined(value('Regular Price')),
            offerPrice: this.numberOrUndefined(value('Offer Price', 'Offer/Discount Price')),
            isOffer: this.parseBoolean(value('Offer Enabled', 'Is Offer')),
            isNewArrival: this.parseBoolean(value('New Arrival', 'Is New Arrival')),
            discountText: value('Discount Text') || undefined,
            emiPrice: value('EMI Price', 'Monthly Installment') || undefined,
            stockStatus: this.parseStockStatus(value('Stock Status')),
            totalQuantity: (_a = this.numberOrUndefined(value('Quantity'))) !== null && _a !== void 0 ? _a : 0,
            status: this.parseProductStatus(value('Status', 'Product Status')),
            isFeatured: this.parseBoolean(value('Featured', 'Featured Product')),
            isCompareEnabled: this.parseBoolean(value('Compare Enabled'), true),
            isWishlistEnabled: this.parseBoolean(value('Wishlist Enabled'), true),
            shortDescription: value('Short Description') || undefined,
            fullDescription: value('Description', 'Full Description') || undefined,
            warranty: value('Warranty', 'Warranty Info') || undefined,
            seoTitle: value('SEO Title') || undefined,
            seoDescription: value('SEO Description') || undefined,
            images: this.parseImages(value('Images', 'Product Images')),
            overviews: this.parseOverviews(value('Quick Overview', 'Overview')),
            specifications: this.parseSpecifications(value('Specifications', 'Full Specification')),
            branchStocks: await this.parseBranchStocks(value('Branch Availability', 'Availability')),
            componentMaps: this.parseComponentMaps(value('Builder Tags', 'Component Tags')),
            specMeta: this.parseSpecMeta(value('Compatibility Meta', 'Product Spec Meta')),
        };
    }
    normalizeHeader(header) {
        return header.toLowerCase().replace(/[^a-z0-9]+/g, '');
    }
    slugify(value) {
        return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    numberOrUndefined(value) {
        if (!value)
            return undefined;
        const number = Number(String(value).replace(/[^0-9.]/g, ''));
        return Number.isFinite(number) ? number : undefined;
    }
    parseBoolean(value, fallback = false) {
        if (!value)
            return fallback;
        return ['1', 'true', 'yes', 'y', 'active', 'enabled'].includes(value.toLowerCase());
    }
    parseStockStatus(value) {
        const normalized = value.toUpperCase().replace(/[\s-]+/g, '_');
        if (['IN_STOCK', 'OUT_OF_STOCK', 'UPCOMING', 'PRE_ORDER'].includes(normalized))
            return normalized;
        return 'IN_STOCK';
    }
    parseProductStatus(value) {
        const normalized = value.toUpperCase().replace(/[\s-]+/g, '_');
        if (['ACTIVE', 'INACTIVE', 'DRAFT', 'ARCHIVED'].includes(normalized))
            return normalized;
        return 'DRAFT';
    }
    parseImages(value) {
        return value
            .split('|')
            .map((imageUrl) => imageUrl.trim())
            .filter(Boolean)
            .map((imageUrl, index) => ({ imageUrl, sortOrder: index, isPrimary: index === 0 }));
    }
    parseOverviews(value) {
        return value
            .split(';')
            .map((pair, index) => {
            const [title, ...rest] = pair.split('=');
            return { title: title === null || title === void 0 ? void 0 : title.trim(), value: rest.join('=').trim(), sortOrder: index };
        })
            .filter((item) => item.title && item.value);
    }
    parseSpecifications(value) {
        return value
            .split(';')
            .map((pair, index) => {
            var _a;
            const [left, ...valueParts] = pair.split('=');
            const [groupName, specKey] = left.split('|');
            return {
                groupName: specKey ? groupName.trim() : 'General',
                specKey: (_a = (specKey !== null && specKey !== void 0 ? specKey : groupName)) === null || _a === void 0 ? void 0 : _a.trim(),
                specValue: valueParts.join('=').trim(),
                sortOrder: index,
            };
        })
            .filter((item) => item.specKey && item.specValue);
    }
    async parseBranchStocks(value) {
        var _a, _b;
        const stocks = [];
        const branches = await this.prisma.branch.findMany();
        const branchMap = new Map();
        branches.forEach((branch) => {
            branchMap.set(this.slugify(branch.name), branch.id);
            branchMap.set(branch.slug, branch.id);
            branchMap.set(branch.id, branch.id);
        });
        for (const item of value.split(';').map((part) => part.trim()).filter(Boolean)) {
            const [branchRef, rest] = item.split('=');
            const [statusRaw, quantityRaw, ...noteParts] = (rest !== null && rest !== void 0 ? rest : '').split(':');
            const branchId = (_a = branchMap.get(this.slugify(branchRef.trim()))) !== null && _a !== void 0 ? _a : branchMap.get(branchRef.trim());
            if (!branchId)
                throw new common_1.BadRequestException(`Branch not found: ${branchRef}`);
            const availabilityStatus = this.parseBranchStatus(statusRaw !== null && statusRaw !== void 0 ? statusRaw : '');
            stocks.push({
                branchId,
                availabilityStatus,
                quantity: (_b = this.numberOrUndefined(quantityRaw !== null && quantityRaw !== void 0 ? quantityRaw : '')) !== null && _b !== void 0 ? _b : 0,
                note: noteParts.join(':').trim() || undefined,
            });
        }
        return stocks;
    }
    parseComponentMaps(value) {
        return value
            .split(';')
            .map((item) => item.trim())
            .filter(Boolean)
            .map((item) => {
            const [builderTypeRaw, componentType] = item.split(':');
            const builderType = (builderTypeRaw === null || builderTypeRaw === void 0 ? void 0 : builderTypeRaw.trim().toUpperCase()) === 'CC_CAMERA' ? 'CC_CAMERA' : 'PC';
            return { builderType: builderType, componentType: componentType === null || componentType === void 0 ? void 0 : componentType.trim() };
        })
            .filter((item) => item.componentType);
    }
    parseSpecMeta(value) {
        return value
            .split(';')
            .map((pair) => {
            const [key, ...rest] = pair.split('=');
            return { key: key === null || key === void 0 ? void 0 : key.trim(), value: rest.join('=').trim() };
        })
            .filter((item) => item.key && item.value);
    }
    parseBranchStatus(value) {
        const normalized = value.toUpperCase().replace(/[\s-]+/g, '_');
        if (['AVAILABLE', 'OUT_OF_STOCK', 'READY_STOCK', 'PRE_ORDER', 'UPCOMING'].includes(normalized))
            return normalized;
        return 'OUT_OF_STOCK';
    }
    async findCategoryByRef(ref) {
        const category = await this.prisma.category.findFirst({
            where: { OR: [{ id: ref }, { slug: ref }, { name: { equals: ref, mode: 'insensitive' } }] },
        });
        if (!category)
            throw new common_1.BadRequestException(`Category not found: ${ref}`);
        return category;
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map