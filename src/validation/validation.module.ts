import { Module } from '@nestjs/common';
import { ValidationController } from './validation.controller';
import { ValidationService } from './validation.service';
import { TableRendererService } from './table-renderer.service';

@Module({
  controllers: [ValidationController],
  providers: [ValidationService, TableRendererService],
})
export class ValidationModule {}