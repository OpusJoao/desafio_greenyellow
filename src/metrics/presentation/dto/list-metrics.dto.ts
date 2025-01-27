import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../../shared/presentation/dtos/pagination.dto';

export default class ListMetricsDto extends PaginationDto {
  @ApiProperty({
    description:
      'ID único da métrica. Caso não seja fornecido, retorna todas as métricas.',
    required: false,
    default: 20000,
  })
  metricId?: number;

  @ApiProperty({
    description:
      'Data de início para o filtro. Deve estar no formato YYYY-MM-DD.',
    required: false,
    default: '2023-11-22',
  })
  startDate?: Date;

  @ApiProperty({
    description:
      'Data de término para o filtro. Deve estar no formato YYYY-MM-DD.',
    required: false,
    default: '2024-11-22',
  })
  endDate?: Date;

  @ApiProperty({
    description:
      'Valor booleano da métrica (true ou false). Caso não seja fornecido, retorna todas as métricas.',
    required: false,
    default: true,
  })
  value?: boolean;

  @ApiProperty({
    description:
      'Ordenação dos resultados. Exemplo: "metricId:asc" ou "metricId:desc".',
    required: false,
    default: 'metricId:asc',
  })
  orderBy?: string;
}
