import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { BuilderType, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type BuildItemInput = { componentType: string; productId: string };

@Injectable()
export class BuilderService {
  constructor(private readonly prisma: PrismaService) {}

  components(type: BuilderType) {
    return this.prisma.builderComponent.findMany({
      where: { builderType: type },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
  }

  products(type: BuilderType, componentType: string, search?: string) {
    const where: Prisma.ProductWhereInput = {
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

  async validate(type: BuilderType, items: BuildItemInput[]) {
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
    const totalPower = products.reduce((sum, product) => sum + (Number(meta[product.id]?.power_watt ?? 0) || 0), 0);

    return {
      valid: warnings.length === 0,
      warnings,
      totalPrice,
      totalPower,
      items,
    };
  }

  async save(type: BuilderType, items: BuildItemInput[], userId?: string) {
    const validation = await this.validate(type, items);
    if (!validation.valid) {
      throw new BadRequestException({ message: 'Build has compatibility issues.', warnings: validation.warnings });
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

  async share(type: BuilderType, shareCode: string) {
    const build = type === 'CC_CAMERA'
      ? await this.prisma.ccBuilderSession.findUnique({
        where: { shareCode },
        include: { items: { include: { product: { include: { images: true, specMeta: true } } } } },
      })
      : await this.prisma.buildSession.findUnique({
        where: { shareCode },
        include: { items: { include: { product: { include: { images: true, specMeta: true } } } } },
      });

    if (!build) throw new NotFoundException('Build not found.');
    return build;
  }

  private async loadProducts(items: BuildItemInput[]) {
    const ids = items.map((item) => item.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: ids } },
      include: { specMeta: true },
    });

    if (products.length !== ids.length) {
      throw new BadRequestException('One or more selected products were not found.');
    }

    return products;
  }

  private createMetaMap(products: Awaited<ReturnType<BuilderService['loadProducts']>>) {
    return Object.fromEntries(products.map((product) => [
      product.id,
      Object.fromEntries(product.specMeta.map((meta) => [meta.key, meta.value])),
    ])) as Record<string, Record<string, string>>;
  }

  private productId(items: BuildItemInput[], componentType: string) {
    return items.find((item) => item.componentType === componentType)?.productId;
  }

  private validatePc(items: BuildItemInput[], meta: Record<string, Record<string, string>>) {
    const warnings: string[] = [];
    const cpu = this.productId(items, 'cpu');
    const motherboard = this.productId(items, 'motherboard');
    const ram = this.productId(items, 'ram');
    const gpu = this.productId(items, 'graphics-card');
    const psu = this.productId(items, 'power-supply');
    const casing = this.productId(items, 'casing');

    if (cpu && motherboard) {
      const cpuSocket = meta[cpu]?.cpu_socket || meta[cpu]?.socket;
      const boardSocket = meta[motherboard]?.motherboard_socket || meta[motherboard]?.socket;
      if (cpuSocket && boardSocket && cpuSocket.toLowerCase() !== boardSocket.toLowerCase()) {
        warnings.push(`CPU socket (${cpuSocket}) does not match motherboard socket (${boardSocket}).`);
      }
    }

    if (ram && motherboard) {
      const ramType = meta[ram]?.ram_type || meta[ram]?.ddr_type;
      const boardRam = meta[motherboard]?.motherboard_ram_type || meta[motherboard]?.ram_type || meta[motherboard]?.ddr_type;
      if (ramType && boardRam && ramType.toLowerCase() !== boardRam.toLowerCase()) {
        warnings.push(`RAM type (${ramType}) does not match motherboard RAM support (${boardRam}).`);
      }
    }

    if (casing && motherboard) {
      const casingFactors = (meta[casing]?.form_factor || '').toLowerCase();
      const boardFactor = (meta[motherboard]?.form_factor || '').toLowerCase();
      if (casingFactors && boardFactor && !casingFactors.includes(boardFactor)) {
        warnings.push(`Casing form factor (${meta[casing]?.form_factor}) may not support motherboard (${meta[motherboard]?.form_factor}).`);
      }
    }

    const psuWatt = psu ? Number(meta[psu]?.psu_watt || meta[psu]?.power_watt || 0) : 0;
    const gpuWatt = gpu ? Number(meta[gpu]?.gpu_power_requirement || meta[gpu]?.power_watt || 0) : 0;
    const estimatedPower = items.reduce((sum, item) => sum + (Number(meta[item.productId]?.power_watt ?? 0) || 0), 0);
    const requiredPower = Math.max(gpuWatt, estimatedPower);
    if (psu && requiredPower && psuWatt < requiredPower) {
      warnings.push(`Power supply watt (${psuWatt}W) is lower than estimated requirement (${requiredPower}W).`);
    }

    return warnings;
  }

  private validateCcCamera(items: BuildItemInput[], meta: Record<string, Record<string, string>>) {
    const warnings: string[] = [];
    const camera = this.productId(items, 'camera');
    const recorder = this.productId(items, 'recorder');
    const storage = this.productId(items, 'storage');
    const cable = this.productId(items, 'cable');
    const power = this.productId(items, 'power-source');

    if (camera && recorder) {
      const cameraType = meta[camera]?.camera_type;
      const recorderType = meta[recorder]?.recorder_type || meta[recorder]?.camera_type;
      if (cameraType && recorderType && cameraType.toLowerCase() !== recorderType.toLowerCase()) {
        warnings.push(`Camera type (${cameraType}) does not match recorder type (${recorderType}).`);
      }
    }

    if (storage && recorder) {
      const storageInterface = meta[storage]?.storage_interface;
      const recorderStorage = meta[recorder]?.storage_support;
      if (storageInterface && recorderStorage && !recorderStorage.toLowerCase().includes(storageInterface.toLowerCase())) {
        warnings.push(`Storage (${storageInterface}) is not listed in recorder support (${recorderStorage}).`);
      }
    }

    if (camera && cable) {
      const cameraType = meta[camera]?.camera_type?.toLowerCase();
      const cableType = meta[cable]?.cable_type?.toLowerCase();
      if (cameraType && cableType && !cableType.includes(cameraType)) {
        warnings.push(`Cable type (${meta[cable]?.cable_type}) may not match camera type (${meta[camera]?.camera_type}).`);
      }
    }

    if (camera && power) {
      const cameraPower = meta[camera]?.power_type;
      const powerType = meta[power]?.power_type;
      if (cameraPower && powerType && cameraPower.toLowerCase() !== powerType.toLowerCase()) {
        warnings.push(`Power source (${powerType}) does not match camera power (${cameraPower}).`);
      }
    }

    return warnings;
  }
}
