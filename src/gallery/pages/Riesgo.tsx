// ...existing code...
import React, { Fragment, useMemo, useState, useRef } from 'react';
import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import AddOutlined from '@mui/icons-material/AddOutlined';
import WarningAmberOutlined from '@mui/icons-material/WarningAmberOutlined';
import { GalleryLayout } from '../layout/GalleryLayout';

type Prob = 'Bajo' | 'Medio' | 'Alto';
type Impacto = 'Baja' | 'Media' | 'Alta';
type Estado = 'Identificado' | 'Mitigado' | 'Resuelto' | 'Ocurrido';

export interface Risk {
  id: string;
  titulo: string;
  probabilidad: Prob;
  impacto: Impacto;
  estado: Estado;
}

const mock: Risk[] = [
  { id: 'R-001', titulo: 'Caida de CDN', probabilidad: 'Medio', impacto: 'Alta', estado: 'Identificado' },
  { id: 'R-002', titulo: 'Demora de proveedor', probabilidad: 'Bajo', impacto: 'Media', estado: 'Mitigado' },
  { id: 'R-003', titulo: 'Rotacion del equipo', probabilidad: 'Alto', impacto: 'Media', estado: 'Identificado' },
];

const COLORS = {
  screenBlue: '#1B1E4B',
  matrix: {
    Bajo:  'rgba(5, 150, 105, 0.35)',
    Medio: 'rgba(2, 132, 199, 0.35)',
    Alto:  'rgba(79, 70, 229, 0.35)',
    text:  '#E5E7EB',
    ring: {
      Bajo:  'rgba(16, 185, 129, 0.6)',
      Medio: 'rgba(56, 189, 248, 0.6)',
      Alto:  'rgba(129, 140, 248, 0.6)',
    },
  },
};

function useResumen(riesgos: Risk[]) {
  return useMemo(() => {
    const c = { Identificado: 0, Mitigado: 0, Resuelto: 0, Ocurrido: 0 } as Record<Estado, number>;
    riesgos.forEach((r) => { c[r.estado] = (c[r.estado] ?? 0) + 1; });
    return c;
  }, [riesgos]);
}

function useMatriz(riesgos: Risk[]) {
  return useMemo(() => {
    const grid: Record<Impacto, Record<Prob, Risk[]>> = {
      Alta:  { Bajo: [], Medio: [], Alto: [] },
      Media: { Bajo: [], Medio: [], Alto: [] },
      Baja:  { Bajo: [], Medio: [], Alto: [] },
    };
    riesgos.forEach((r) => grid[r.impacto][r.probabilidad].push(r));
    return grid;
  }, [riesgos]);
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ color: '#475569', mb: 1 }}>
        <WarningAmberOutlined fontSize="small" />
        <Typography variant="body2">{label}</Typography>
      </Stack>
      <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a' }}>{value}</Typography>
    </Paper>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Box sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: color }} />
      <Typography variant="caption" sx={{ color: '#475569' }}>{label}</Typography>
    </Stack>
  );
}

function MatrizCell({ riesgos, level }: { riesgos: Risk[]; level: Prob }) {
  const bg = COLORS.matrix[level];
  const ring = COLORS.matrix.ring[level];
  return (
    <Box
      sx={{
        minHeight: 96,
        p: 1.5,
        borderRadius: 2,
        bgcolor: bg,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: ring,
        ':hover': { outline: '2px solid', outlineColor: ring, outlineOffset: 0 },
      }}
    >
      <Typography sx={{ color: COLORS.matrix.text, fontSize: 13 }}>
        {riesgos.length} riesgos
      </Typography>
      {riesgos.length > 0 && (
        <Stack spacing={0.5} sx={{ mt: 0.5 }}>
          {riesgos.slice(0, 2).map((r) => (
            <Typography key={r.id} sx={{ color: COLORS.matrix.text, fontSize: 12 }} noWrap>
              • {r.titulo}
            </Typography>
          ))}
          {riesgos.length > 2 && (
            <Typography sx={{ color: COLORS.matrix.text, fontSize: 12, opacity: 0.85 }}>
              +{riesgos.length - 2} mas...
            </Typography>
          )}
        </Stack>
      )}
    </Box>
  );
}

const RiesgoInner: React.FC = () => {
  const [riesgos, setRiesgos] = useState<Risk[]>(mock);
  const resumen = useResumen(riesgos);
  const matriz  = useMatriz(riesgos);

  // dialog state
  const [open, setOpen] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [probabilidad, setProbabilidad] = useState<Prob>('Bajo');
  const [impacto, setImpacto] = useState<Impacto>('Baja');
  const [estado, setEstado] = useState<Estado>('Identificado');

  // simple id counter
  const counterRef = useRef<number>(riesgos.length + 1);

  function openDialog() {
    setTitulo('');
    setProbabilidad('Bajo');
    setImpacto('Baja');
    setEstado('Identificado');
    setOpen(true);
  }

  function closeDialog() {
    setOpen(false);
  }

  function handleSave() {
    const newId = `R-${String(counterRef.current).padStart(3, '0')}`;
    counterRef.current += 1;
    const nuevo: Risk = {
      id: newId,
      titulo: titulo || 'Riesgo sin titulo',
      probabilidad,
      impacto,
      estado,
    };
    setRiesgos(prev => [nuevo, ...prev]);
    setOpen(false);
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: COLORS.screenBlue, px: 3, py: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ color: '#ffffff', fontWeight: 700 }}>Riesgos</Typography>
          <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
            Identifica y gestiona los riesgos de los proyectos
          </Typography>
        </Box>
        <Button variant="contained" color="error" startIcon={<AddOutlined />} sx={{ borderRadius: 2 }} onClick={openDialog}>
          Nuevo Riesgo
        </Button>
      </Box>

      {/* Tarjeta blanca */}
      <Paper elevation={3} sx={{ borderRadius: 3, p: 3 }}>
        {/* KPIs */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <StatCard label="Identificados" value={resumen.Identificado} />
          <StatCard label="Mitigados" value={resumen.Mitigado} />
          <StatCard label="Resueltos" value={resumen.Resuelto} />
          <StatCard label="Ocurridos" value={resumen.Ocurrido} />
        </Stack>

        {/* Matriz */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0f172a', mb: 1 }}>
            Matriz de Riesgos
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
            Visualizacion de riesgos activos por probabilidad e impacto
          </Typography>

          {/* Cabeceras columnas */}
          <Stack direction="row" spacing={1.5} sx={{ mb: 1 }}>
            <Box sx={{ width: 100 }} />
            {(['Bajo', 'Medio', 'Alto'] as Prob[]).map((p) => (
              <Box key={'hdr-' + p} sx={{ flex: 1, textAlign: 'center' }}>
                <Typography sx={{ color: '#CBD5E1', fontSize: 14 }}>{p}</Typography>
              </Box>
            ))}
          </Stack>

          {/* Filas */}
          {(['Alta', 'Media', 'Baja'] as Impacto[]).map((impactoRow) => (
            <Fragment key={'row-' + impactoRow}>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'stretch', mb: 1.5 }}>
                <Box sx={{ width: 100 }}>
                  <Typography sx={{ color: '#CBD5E1', fontSize: 14 }}>{impactoRow}</Typography>
                </Box>

                {(['Bajo', 'Medio', 'Alto'] as Prob[]).map((prob) => (
                  <Box key={impactoRow + '-' + prob} sx={{ flex: 1 }}>
                    <MatrizCell riesgos={matriz[impactoRow][prob]} level={prob} />
                  </Box>
                ))}
              </Stack>
            </Fragment>
          ))}

          {/* Leyenda */}
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Legend color="#10B981" label="Bajo" />
            <Legend color="#38BDF8" label="Medio" />
            <Legend color="#818CF8" label="Alto" />
          </Stack>
        </Box>
      </Paper>

      {/* Dialog Nuevo Riesgo */}
      <Dialog open={open} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>Nuevo Riesgo</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Título"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel id="prob-label">Probabilidad</InputLabel>
              <Select
                labelId="prob-label"
                value={probabilidad}
                label="Probabilidad"
                onChange={(e) => setProbabilidad(e.target.value as Prob)}
              >
                <MenuItem value="Bajo">Bajo</MenuItem>
                <MenuItem value="Medio">Medio</MenuItem>
                <MenuItem value="Alto">Alto</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="impacto-label">Impacto</InputLabel>
              <Select
                labelId="impacto-label"
                value={impacto}
                label="Impacto"
                onChange={(e) => setImpacto(e.target.value as Impacto)}
              >
                <MenuItem value="Baja">Baja</MenuItem>
                <MenuItem value="Media">Media</MenuItem>
                <MenuItem value="Alta">Alta</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="estado-label">Estado</InputLabel>
              <Select
                labelId="estado-label"
                value={estado}
                label="Estado"
                onChange={(e) => setEstado(e.target.value as Estado)}
              >
                <MenuItem value="Identificado">Identificado</MenuItem>
                <MenuItem value="Mitigado">Mitigado</MenuItem>
                <MenuItem value="Resuelto">Resuelto</MenuItem>
                <MenuItem value="Ocurrido">Ocurrido</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export const Riesgo: React.FC = () => (
  <GalleryLayout>
    <RiesgoInner />
  </GalleryLayout>
);

export default Riesgo;
// ...existing code...