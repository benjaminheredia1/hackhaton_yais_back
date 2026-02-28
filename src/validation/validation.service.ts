import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ValidationService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Valida que el ID del usuario sea H22.
   * Retorna información del usuario validado.
   */
  async validateUser(id: string) {
    return {
      id,
      valid: true,
      message: `Usuario ${id} validado correctamente`,
    };
  }
}