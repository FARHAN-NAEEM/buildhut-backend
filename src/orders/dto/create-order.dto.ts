import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsNotEmpty()
  @IsString()
  productId!: string;

  @IsNotEmpty()
  @IsNumber()
  quantity!: number;

  @IsNotEmpty()
  @IsNumber()
  price!: number;
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];
}