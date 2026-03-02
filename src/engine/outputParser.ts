/** Parse console output from each level mechanic to drive animations. */

export function parseSorterResult(
  output: string[]
): 'DESPACHO' | 'REPARACION' | 'RESIDUOS' | null {
  for (const line of output) {
    if (line.includes('APROBADO') || line.includes('Despacho')) return 'DESPACHO';
    if (line.includes('RETRABAJAR') || line.includes('Reparación')) return 'REPARACION';
    if (line.includes('DESCARTE') || line.includes('Residuos')) return 'RESIDUOS';
  }
  return null;
}

export function parseEnergySteps(
  output: string[]
): Array<{ energia: number; pieza: number }> {
  return output
    .map((line) => {
      const m = line.match(/Energ[ií]a:\s*(\d+)\s*\|\s*Pieza\s*#(\d+)/);
      if (m) return { energia: parseInt(m[1]), pieza: parseInt(m[2]) };
      return null;
    })
    .filter(Boolean) as Array<{ energia: number; pieza: number }>;
}

export function parseGridSteps(
  output: string[]
): Array<{ estacion: number; fila: number; col: number }> {
  return output
    .map((line) => {
      const m = line.match(/Estaci[oó]n\s*(\d+)\s*→\s*fila\s*(\d+),\s*col\s*(\d+)/);
      if (m) return { estacion: parseInt(m[1]), fila: parseInt(m[2]), col: parseInt(m[3]) };
      return null;
    })
    .filter(Boolean) as Array<{ estacion: number; fila: number; col: number }>;
}

export function parsePanelStates(output: string[]): string[] {
  const states: string[] = [];
  for (const line of output) {
    if (line.includes('produciendo')) { states.push('ACTIVA'); continue; }
    if (line.includes('técnico') || line.includes('tecnico')) { states.push('ERROR'); continue; }
    const m = line.match(/Estado:\s*([A-Z]+)/);
    if (m) states.push(m[1]);
  }
  return states;
}

export function parseDetectorResults(
  output: string[]
): Array<'null' | 'number' | 'string'> {
  return output
    .map((line) => {
      if (line.includes('vacío') || line.includes('vacio')) return 'null' as const;
      if (line.includes('ID:')) return 'number' as const;
      if (line.includes('nombre:') || line.includes('Pieza por nombre')) return 'string' as const;
      return null;
    })
    .filter(Boolean) as Array<'null' | 'number' | 'string'>;
}
