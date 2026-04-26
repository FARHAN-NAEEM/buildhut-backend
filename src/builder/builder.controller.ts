import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { BuilderType } from '@prisma/client';
import { BuilderService } from './builder.service';

@Controller('builder')
export class BuilderController {
  constructor(private readonly builderService: BuilderService) {}

  @Get('components')
  components(@Query('type') type: BuilderType = 'PC') {
    return this.builderService.components(type);
  }

  @Get('products/:componentType')
  products(
    @Param('componentType') componentType: string,
    @Query('type') type: BuilderType = 'PC',
    @Query('search') search?: string,
  ) {
    return this.builderService.products(type, componentType, search);
  }

  @Post('validate')
  validate(@Body() body: { type: BuilderType; items: { componentType: string; productId: string }[] }) {
    return this.builderService.validate(body.type ?? 'PC', body.items ?? []);
  }

  @Post('save')
  save(@Body() body: { type: BuilderType; userId?: string; items: { componentType: string; productId: string }[] }) {
    return this.builderService.save(body.type ?? 'PC', body.items ?? [], body.userId);
  }

  @Get('share/:shareCode')
  share(@Param('shareCode') shareCode: string, @Query('type') type: BuilderType = 'PC') {
    return this.builderService.share(type, shareCode);
  }
}
