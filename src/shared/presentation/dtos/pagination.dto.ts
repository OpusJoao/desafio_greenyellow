import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty({
    description: 'Número da página solicitada',
    type: Number,
    example: 1,
    required: false,
  })
  page?: number;

  @ApiProperty({
    description: 'Número de itens por página',
    type: Number,
    example: 10,
    required: false,
  })
  pageSize?: number;
}
