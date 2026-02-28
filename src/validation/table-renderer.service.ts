import { Injectable } from '@nestjs/common';
import { createCanvas } from 'canvas';

/**
 * Datos del paciente que se reciben en el body del POST.
 * Mapea 1:1 con la hoja clínica de pase de turno.
 */
export interface PatientTableData {
  // I. IDENTIFICACIÓN
  pacienteCama?: string;
  edadSexo?: string;
  diagnosticoPrincipal?: string;
  diasInternacion?: string;

  // II. SEGURIDAD
  triageGravedad?: string;
  alergias?: string;
  riesgoCaidasEscaras?: string;

  // III. CONSTANTES
  frecuenciaCardiaca?: string;
  presionArterial?: string;
  saturacionO2?: string;
  temperaturaFR?: string;

  // IV. ESTADO ACTUAL
  concienciaGlasgow?: string;
  viaAccesoVenoso?: string;
  oxigenoterapia?: string;

  // V. BALANCE (ml)
  ingresosEgresos?: string;
  balanceTurno?: string;

  // VI. PLAN Y PENDIENTES
  proximaMedicacion?: string;
  estudiosPendientes?: string;

  // VII. EVOLUCIÓN
  novedadesRelevantes?: string;
}

/** Definición de una fila en la tabla */
interface TableRow {
  category: string;
  field: string;
  value: string;
  isHeader: boolean;
}

@Injectable()
export class TableRendererService {
  /**
   * Genera un Buffer PNG con la tabla clínica del paciente.
   */
  renderTable(data: PatientTableData): Buffer {
    const rows = this.buildRows(data);

    // ── Dimensiones ──
    const colWidths = [220, 280, 320];
    const totalWidth = colWidths.reduce((a, b) => a + b, 0);
    const rowHeight = 34;
    const headerHeight = 48;
    const titleHeight = 60;
    const totalHeight = titleHeight + headerHeight + rows.length * rowHeight + 20;

    const canvas = createCanvas(totalWidth + 2, totalHeight);
    const ctx = canvas.getContext('2d');

    // ── Fondo ──
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ── Título ──
    ctx.fillStyle = '#1B4F72';
    ctx.fillRect(0, 0, totalWidth + 2, titleHeight);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 22px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('HOJA CLÍNICA — PASE DE TURNO', totalWidth / 2 + 1, 38);

    // ── Encabezado de columnas ──
    const headerY = titleHeight;
    ctx.fillStyle = '#2E86C1';
    ctx.fillRect(0, headerY, totalWidth + 2, headerHeight);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 15px Arial, sans-serif';
    ctx.textAlign = 'center';

    const headers = ['Categoría', 'Campo de Información', 'Espacio para Llenado'];
    let xPos = 0;
    for (let i = 0; i < headers.length; i++) {
      ctx.fillText(headers[i], xPos + colWidths[i] / 2, headerY + 30);
      xPos += colWidths[i];
    }

    // Líneas del header
    ctx.strokeStyle = '#1A5276';
    ctx.lineWidth = 1;
    xPos = 0;
    for (let i = 0; i < colWidths.length - 1; i++) {
      xPos += colWidths[i];
      ctx.beginPath();
      ctx.moveTo(xPos, headerY);
      ctx.lineTo(xPos, headerY + headerHeight);
      ctx.stroke();
    }

    // ── Filas ──
    const dataStartY = headerY + headerHeight;

    // Colores por sección
    const sectionColors: Record<string, string> = {
      'I. IDENTIFICACIÓN': '#D4E6F1',
      'II. SEGURIDAD': '#F9E79F',
      'III. CONSTANTES': '#D5F5E3',
      'IV. ESTADO ACTUAL': '#FADBD8',
      'V. BALANCE (ml)': '#E8DAEF',
      'VI. PLAN Y PENDIENTES': '#FCF3CF',
      'VII. EVOLUCIÓN': '#D6EAF8',
    };

    let currentSection = '';

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const y = dataStartY + i * rowHeight;

      // Determinar color de fondo
      if (row.category) {
        currentSection = row.category;
      }

      if (row.isHeader) {
        ctx.fillStyle = sectionColors[row.category] || '#EBF5FB';
      } else {
        ctx.fillStyle = i % 2 === 0 ? '#FAFAFA' : '#FFFFFF';
      }

      ctx.fillRect(0, y, totalWidth + 2, rowHeight);

      // Bordes
      ctx.strokeStyle = '#BDC3C7';
      ctx.lineWidth = 0.5;
      ctx.strokeRect(0, y, totalWidth + 2, rowHeight);

      // Líneas verticales
      xPos = 0;
      for (let j = 0; j < colWidths.length - 1; j++) {
        xPos += colWidths[j];
        ctx.beginPath();
        ctx.moveTo(xPos, y);
        ctx.lineTo(xPos, y + rowHeight);
        ctx.stroke();
      }

      // Texto — Categoría
      if (row.category) {
        ctx.fillStyle = '#1B4F72';
        ctx.font = 'bold 13px Arial, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(row.category, 10, y + 22);
      }

      // Texto — Campo
      ctx.fillStyle = '#2C3E50';
      ctx.font = row.isHeader ? 'bold 13px Arial, sans-serif' : '13px Arial, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(row.field, colWidths[0] + 10, y + 22);

      // Texto — Valor
      ctx.fillStyle = '#17202A';
      ctx.font = '13px Arial, sans-serif';
      ctx.textAlign = 'left';
      const maxValueWidth = colWidths[2] - 20;
      const valueText = this.truncateText(ctx, row.value, maxValueWidth);
      ctx.fillText(valueText, colWidths[0] + colWidths[1] + 10, y + 22);
    }

    // Borde exterior
    ctx.strokeStyle = '#1B4F72';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, titleHeight, totalWidth + 2, totalHeight - titleHeight);

    return canvas.toBuffer('image/png');
  }

  private truncateText(
    ctx: ReturnType<ReturnType<typeof createCanvas>['getContext']>,
    text: string,
    maxWidth: number,
  ): string {
    if (!text) return '';
    const measured = ctx.measureText(text);
    if (measured.width <= maxWidth) return text;
    let truncated = text;
    while (ctx.measureText(truncated + '…').width > maxWidth && truncated.length > 0) {
      truncated = truncated.slice(0, -1);
    }
    return truncated + '…';
  }

  private buildRows(data: PatientTableData): TableRow[] {
    return [
      { category: 'I. IDENTIFICACIÓN', field: 'Paciente / Cama', value: data.pacienteCama || '', isHeader: true },
      { category: '', field: 'Edad / Sexo', value: data.edadSexo || '', isHeader: false },
      { category: '', field: 'Diagnóstico Principal', value: data.diagnosticoPrincipal || '', isHeader: false },
      { category: '', field: 'Días de Internación', value: data.diasInternacion || '', isHeader: false },

      { category: 'II. SEGURIDAD', field: 'Triage / Gravedad', value: data.triageGravedad || '', isHeader: true },
      { category: '', field: 'Alergias', value: data.alergias || '', isHeader: false },
      { category: '', field: 'Riesgo de Caídas/Escaras', value: data.riesgoCaidasEscaras || '', isHeader: false },

      { category: 'III. CONSTANTES', field: 'Frecuencia Cardíaca (FC)', value: data.frecuenciaCardiaca || '', isHeader: true },
      { category: '', field: 'Presión Arterial (PA)', value: data.presionArterial || '', isHeader: false },
      { category: '', field: 'Saturación O2 (SatO2)', value: data.saturacionO2 || '', isHeader: false },
      { category: '', field: 'Temperatura / FR', value: data.temperaturaFR || '', isHeader: false },

      { category: 'IV. ESTADO ACTUAL', field: 'Conciencia / Glasgow', value: data.concienciaGlasgow || '', isHeader: true },
      { category: '', field: 'Vía y Acceso Venoso', value: data.viaAccesoVenoso || '', isHeader: false },
      { category: '', field: 'Oxigenoterapia', value: data.oxigenoterapia || '', isHeader: false },

      { category: 'V. BALANCE (ml)', field: 'Ingresos / Egresos', value: data.ingresosEgresos || '', isHeader: true },
      { category: '', field: 'Balance del Turno', value: data.balanceTurno || '', isHeader: false },

      { category: 'VI. PLAN Y PENDIENTES', field: 'Próxima Medicación', value: data.proximaMedicacion || '', isHeader: true },
      { category: '', field: 'Estudios Pendientes', value: data.estudiosPendientes || '', isHeader: false },

      { category: 'VII. EVOLUCIÓN', field: 'Novedades Relevantes', value: data.novedadesRelevantes || '', isHeader: true },
    ];
  }
}
