import { ApiProperty } from '@nestjs/swagger';

export default class ListGroupedMetricsReportDto {
  @ApiProperty({
    description:
      'ID único da métrica. Caso não seja fornecido, retorna todas as métricas.',
    required: false,
    default: 20000,
  })
  metricId: number;

  @ApiProperty({
    description:
      'Data de início para o filtro. Deve estar no formato YYYY-MM-DD.',
    required: false,
    default: '2023-11-22',
  })
  startDate: Date;

  @ApiProperty({
    description:
      'Data de término para o filtro. Deve estar no formato YYYY-MM-DD.',
    required: false,
    default: '2024-11-22',
  })
  endDate: Date;
}
