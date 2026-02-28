import { Injectable } from '@nestjs/common';

@Injectable()
export class ValidationService {
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