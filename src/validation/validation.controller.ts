import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { ValidationService } from './validation.service.js';
import { TableRendererService } from './table-renderer.service.js';
import type { PatientTableData } from './table-renderer.service.js';

@Controller('validation')
export class ValidationController {
  constructor(
    private readonly validationService: ValidationService,
    private readonly tableRendererService: TableRendererService,
  ) {}

  /**
   * GET /validation/user/validate/:id
   * Valida el usuario con el ID hardcodeado H22.
   */
  @Get('/user/validate/:id')
  async validateUser(@Param('id') id: string) {
    if (id !== 'H22') {
      throw new HttpException(
        'Usuario no encontrado',
        HttpStatus.NOT_FOUND,
      );
    }
    return this.validationService.validateUser(id);
  }

  /**
   * POST /validation/user/table
   * Recibe los datos del paciente en el body y retorna un PNG
   * con la tabla clínica estilo Excel.
   */
  @Post('/user/table')
  async generateTable(
    @Body() data: PatientTableData,
    @Res() res: Response,
  ) {
    const pngBuffer = this.tableRendererService.renderTable(data);

    res.set({
      'Content-Type': 'image/png',
      'Content-Disposition': 'inline; filename="hoja-clinica.png"',
      'Content-Length': pngBuffer.length.toString(),
    });

    res.send(pngBuffer);
  }
}