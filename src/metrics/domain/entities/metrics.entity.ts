import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Metric {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'metric_id' })
  metricId: number;

  @Column({ name: 'date_time', type: 'timestamp' })
  datetime: Date;

  @Column()
  value: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
