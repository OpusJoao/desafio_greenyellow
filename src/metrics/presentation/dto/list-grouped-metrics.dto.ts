import { ApiProperty } from '@nestjs/swagger';
import { GroupMetricTypeEnum } from '../../domain/contracts/group-metric-type.enum';

export default class ListGroupedMetricsDto {
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
      'Tipo de agrupamento da resposta, podendo ser DAY, MONTH e YEAR. Valor padrão é DAY.',
    required: false,
    default: GroupMetricTypeEnum.DAY,
    enum: GroupMetricTypeEnum,
  })
  groupType?: GroupMetricTypeEnum;
}
