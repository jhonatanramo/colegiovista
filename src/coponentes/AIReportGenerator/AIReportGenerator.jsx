// components/AIReportGenerator.jsx
import { Barra } from '../BarraMenu/Barra';
import React, { useState, useCallback, useRef } from 'react';
import api from '../../api';
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ToggleButton,
  ToggleButtonGroup,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CardHeader,
  Divider
} from '@mui/material';
import {
  Refresh,
  FilterList,
  ExpandMore,
  Download,
  ContentCopy,
  Analytics,
  TableChart,
  TextFields,
  Mic,
  Stop,
  BarChart,
  PieChart,
  ShowChart,
  Insights,
  Lightbulb,
  TrendingUp,
  Warning,
  CheckCircle
} from '@mui/icons-material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend
);

const AIReportGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    curso: '',
    gestion: '',
    materia: '',
    estudiante: ''
  });
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [availableEntities, setAvailableEntities] = useState({
    cursos: [],
    gestiones: [],
    materias: []
  });
  const [isListening, setIsListening] = useState(false);
  const [viewMode, setViewMode] = useState('all');

  const recognitionRef = useRef(null);

  // Configurar reconocimiento de voz
  React.useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'es-ES';
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        setPrompt(transcript);
      };
      
      recognition.onerror = (event) => {
        console.error('Error en reconocimiento de voz:', event.error);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  // Cargar entidades disponibles al montar el componente
  React.useEffect(() => {
    const fetchEntities = async () => {
      try {
        const response = await api.get('/api/ai-reports/entities/');
        setAvailableEntities(response.data);
      } catch (err) {
        console.error('Error loading entities:', err);
      }
    };
    fetchEntities();
  }, []);

  const generateReport = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Por favor ingresa una consulta');
      return;
    }

    setLoading(true);
    setError('');
    setReport(null);

    try {
      const response = await api.post('/api/ai-reports/generate/', {
        prompt: prompt.trim(),
        filters: Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        ),
        include_charts: true
      });

      setReport(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.details || 
                          'Error al generar el reporte. Por favor intenta nuevamente.';
      setError(errorMessage);
      console.error('Error generating report:', err);
    } finally {
      setLoading(false);
    }
  }, [prompt, filters]);

  const clearFilters = () => {
    setFilters({
      curso: '',
      gestion: '',
      materia: '',
      estudiante: ''
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) {
      console.warn('No hay datos para exportar');
      return;
    }
    
    try {
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(row => 
        Object.values(row).map(value => {
          // Manejar valores null/undefined y escapar comillas
          const stringValue = value === null || value === undefined ? '' : String(value);
          return `"${stringValue.replace(/"/g, '""')}"`;
        }).join(',')
      ).join('\n');
      
      const csvContent = `${headers}\n${rows}`;
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      alert('Error al exportar el archivo CSV');
    }
  };

  const renderChart = (chartData, chartType = 'bar') => {
    if (!chartData || !chartData.labels) return null;

    const commonOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: chartData.title || 'Gráfico de Datos',
        },
      },
    };

    switch (chartType) {
      case 'bar':
        return (
          <Bar 
            data={chartData} 
            options={commonOptions}
            height={300}
          />
        );
      case 'pie':
        return (
          <Pie 
            data={chartData} 
            options={commonOptions}
            height={300}
          />
        );
      case 'line':
        return (
          <Line 
            data={chartData} 
            options={commonOptions}
            height={300}
          />
        );
      default:
        return (
          <Bar 
            data={chartData} 
            options={commonOptions}
            height={300}
          />
        );
    }
  };

  const renderInsights = (insights) => {
    if (!insights || insights.length === 0) return null;

    const getInsightIcon = (tipo) => {
      switch (tipo) {
        case 'positivo':
          return <CheckCircle color="success" />;
        case 'negativo':
          return <Warning color="warning" />;
        case 'oportunidad':
          return <Lightbulb color="primary" />;
        default:
          return <Insights color="info" />;
      }
    };

    const getImpactColor = (impacto) => {
      switch (impacto) {
        case 'alto':
          return 'error';
        case 'medio':
          return 'warning';
        case 'bajo':
          return 'info';
        default:
          return 'info';
      }
    };

    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Insights color="primary" />
              Insights y Recomendaciones
            </Box>
          }
        />
        <Divider />
        <CardContent>
          <List>
            {insights.map((insight, index) => (
              <ListItem key={index} alignItems="flex-start">
                <ListItemIcon>
                  {getInsightIcon(insight.tipo)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="h6" component="span">
                        {insight.titulo}
                      </Typography>
                      <Chip 
                        label={insight.impacto} 
                        size="small" 
                        color={getImpactColor(insight.impacto)}
                        variant="outlined"
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.primary" paragraph>
                        {insight.descripcion}
                      </Typography>
                      <Typography variant="body2" color="primary">
                        <strong>Recomendación:</strong> {insight.recomendacion}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    );
  };

  const renderCharts = (chartData) => {
    if (!chartData) return null;

    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BarChart color="primary" />
              Visualizaciones de Datos
            </Box>
          }
        />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            {Object.entries(chartData).map(([key, data]) => (
              <Grid item xs={12} md={6} key={key}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  {renderChart(data, key.includes('pie') ? 'pie' : 'bar')}
                </Paper>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const renderReportContent = () => {
    if (!report) return null;

    const hasStructuredData = report.data?.detalles || report.data?.pagos || report.data?.asistencias;
    const hasMetrics = report.data?.metricas || report.data?.resumen;
    const hasCharts = report.data?.chart_data && Object.keys(report.data.chart_data).length > 0;
    const hasInsights = report.insights && report.insights.length > 0;

    // Si hay un modo de vista específico, filtrar el contenido
    const showAll = viewMode === 'all';
    const showCharts = showAll || viewMode === 'charts';
    const showTable = showAll || viewMode === 'table';
    const showNarrative = showAll || viewMode === 'narrative';

    return (
      <Box sx={{ mt: 3 }}>
        {/* Controles de vista */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">
                Vista del Reporte
              </Typography>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(e, newView) => newView && setViewMode(newView)}
                size="small"
              >
                <ToggleButton value="all">
                  <Analytics /> Todo
                </ToggleButton>
                <ToggleButton value="charts">
                  <BarChart /> Gráficos
                </ToggleButton>
                <ToggleButton value="table">
                  <TableChart /> Tabla
                </ToggleButton>
                <ToggleButton value="narrative">
                  <TextFields /> Narrativa
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </CardContent>
        </Card>

        {/* Interpretación del prompt */}
        {report.interpretation && showAll && (
          <Accordion sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Analytics color="primary" />
                <Typography variant="subtitle1">
                  Interpretación del Prompt
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Tipo de Análisis
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    <Chip 
                      label={report.interpretation.tipo_reporte} 
                      color="primary" 
                      variant="outlined"
                    />
                    <Chip 
                      label={report.interpretation.formato_salida} 
                      color="secondary" 
                      variant="outlined"
                    />
                    <Chip 
                      label={report.interpretation.nivel_detalle} 
                      variant="outlined"
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Entidades y Métricas
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {report.interpretation.entidades?.map((ent, idx) => (
                      <Chip 
                        key={idx} 
                        label={ent} 
                        variant="outlined" 
                        size="small" 
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Insights */}
        {hasInsights && showAll && renderInsights(report.insights)}

        {/* Gráficos */}
        {hasCharts && showCharts && renderCharts(report.data.chart_data)}

        {/* Métricas y Resumen */}
        {hasMetrics && showAll && (
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUp /> Resumen del Reporte
              </Typography>
              <Grid container spacing={2}>
                {Object.entries(report.data.metricas || report.data.resumen || {}).map(([key, value]) => (
                  <Grid item xs={6} sm={4} md={3} key={key}>
                    <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom noWrap>
                        {key.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </Typography>
                      <Typography variant="h6" color="primary">
                        {typeof value === 'number' ? 
                          (Number.isInteger(value) ? value : value.toFixed(2)) : 
                          value
                        }
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Narrativa */}
        {report.narrative && showNarrative && (
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextFields /> Análisis Narrativo
                </Typography>
                <Tooltip title="Copiar narrativa">
                  <IconButton onClick={() => copyToClipboard(report.narrative)} size="small">
                    <ContentCopy />
                  </IconButton>
                </Tooltip>
              </Box>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                {report.narrative}
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Datos Estructurados */}
        {hasStructuredData && showTable && (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TableChart /> Datos Detallados
                </Typography>
                <Box>
                  <Tooltip title="Exportar a CSV">
                    <IconButton 
                      onClick={() => {
                        const data = report.data.detalles || report.data.pagos || report.data.asistencias;
                        if (data && data.length > 0) {
                          exportToCSV(data, `reporte-${report.interpretation?.tipo_reporte || 'datos'}`);
                        } else {
                          alert('No hay datos para exportar');
                        }
                      }}
                      size="small"
                    >
                      <Download />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              {(() => {
                const tableData = report.data.detalles || report.data.pagos || report.data.asistencias;
                if (!tableData || tableData.length === 0) {
                  return (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                      No hay datos detallados para mostrar
                    </Typography>
                  );
                }

                const headers = Object.keys(tableData[0]);
                
                return (
                  <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 400 }}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          {headers.map((key) => (
                            <TableCell key={key} sx={{ fontWeight: 'bold', backgroundColor: 'background.default' }}>
                              {key.split('_').map(word => 
                                word.charAt(0).toUpperCase() + word.slice(1)
                              ).join(' ')}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {tableData.map((row, index) => (
                          <TableRow key={index} hover>
                            {headers.map((key, cellIndex) => (
                              <TableCell key={cellIndex}>
                                {row[key] !== null && row[key] !== undefined ? (
                                  String(row[key])
                                ) : (
                                  <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                    N/A
                                  </Typography>
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                );
              })()}
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                Mostrando {(report.data.detalles || report.data.pagos || report.data.asistencias).length} registros
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Información de generación */}
        {report.generated_at && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 2 }}>
            Reporte generado el {new Date(report.generated_at).toLocaleString()}
          </Typography>
        )}
      </Box>
    );
  };

  return (
    <Barra >
    <Box sx={{ maxWidth: 1400, margin: '0 auto', p: { xs: 1, sm: 2, md: 3 } }}>
      <Card elevation={2} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom color="primary" sx={{ 
            fontSize: { xs: '1.75rem', sm: '2.125rem' },
            textAlign: { xs: 'center', sm: 'left' }
          }}>
            🚀 Generador de Reportes con IA
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
            Describe en lenguaje natural la información que necesitas analizar. 
            Usa tu voz o escribe directamente para generar reportes inteligentes con gráficos y insights.
          </Typography>

          {/* Ejemplos de prompts */}
          <Paper variant="outlined" sx={{ p: 2, mb: 3, backgroundColor: 'primary.50' }}>
            <Typography variant="subtitle2" gutterBottom color="primary">
              💡 Ejemplos de consultas:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {[
                "Mostrar las notas promedio de matemáticas por curso",
                "Estado de pagos pendientes del último mes",
                "Asistencias de estudiantes en el primer trimestre",
                "Comparativa de rendimiento entre cursos",
                "Tendencias de aprobación en los últimos 3 años"
              ].map((example, index) => (
                <Chip
                  key={index}
                  label={example}
                  variant="outlined"
                  size="small"
                  onClick={() => setPrompt(example)}
                  clickable
                />
              ))}
            </Box>
          </Paper>

          {/* Campo de entrada principal con reconocimiento de voz */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <Box sx={{ position: 'relative', flex: 1 }}>
              <TextField
                fullWidth
                variant="outlined"
                label="¿Qué información necesitas analizar?"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !loading && generateReport()}
                disabled={loading}
                multiline
                maxRows={3}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'background.paper',
                    pr: 6
                  }
                }}
              />
              <Box sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}>
                {recognitionRef.current ? (
                  <Tooltip title={isListening ? "Detener grabación" : "Iniciar grabación de voz"}>
                    <IconButton
                      onClick={isListening ? stopListening : startListening}
                      color={isListening ? "error" : "primary"}
                      size="small"
                    >
                      {isListening ? <Stop /> : <Mic />}
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title="Reconocimiento de voz no disponible en este navegador">
                    <span>
                      <IconButton disabled size="small">
                        <Mic />
                      </IconButton>
                    </span>
                  </Tooltip>
                )}
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'row', sm: 'column' } }}>
              <Button
                variant="contained"
                onClick={generateReport}
                disabled={loading || !prompt.trim()}
                sx={{ 
                  minWidth: 120,
                  flex: { xs: 1, sm: 'none' }
                }}
                startIcon={loading ? <CircularProgress size={16} /> : null}
              >
                {loading ? 'Generando...' : 'Generar'}
              </Button>
              
              <Tooltip title="Aplicar filtros">
                <Button
                  variant="outlined"
                  onClick={() => setFilterDialogOpen(true)}
                  sx={{ 
                    minWidth: 'auto',
                    flex: { xs: 'none', sm: 'none' }
                  }}
                >
                  <FilterList />
                </Button>
              </Tooltip>
            </Box>
          </Box>

          {/* Indicadores de estado */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            {Object.values(filters).some(value => value !== '') && (
              <Chip
                label="Filtros activos"
                color="primary"
                variant="outlined"
                onDelete={clearFilters}
                size="small"
              />
            )}
            {isListening && (
              <Chip
                icon={<Mic />}
                label="Grabando..."
                color="error"
                variant="outlined"
                size="small"
              />
            )}
            {prompt.length > 0 && (
              <Typography variant="caption" color="text.secondary">
                {prompt.length} caracteres
              </Typography>
            )}
          </Box>

          {/* Mensaje de error */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ mt: 2 }}
              action={
                <Button color="inherit" size="small" onClick={() => setError('')}>
                  Cerrar
                </Button>
              }
            >
              {error}
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Contenido del reporte */}
      {renderReportContent()}

      {/* Diálogo de filtros */}
      <Dialog 
        open={filterDialogOpen} 
        onClose={() => setFilterDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterList /> Filtros Avanzados
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Aplica filtros específicos para refinar tu búsqueda
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Curso</InputLabel>
                <Select
                  value={filters.curso}
                  label="Curso"
                  onChange={(e) => setFilters(prev => ({ ...prev, curso: e.target.value }))}
                >
                  <MenuItem value="">Todos los cursos</MenuItem>
                  {availableEntities.cursos.map((curso, index) => (
                    <MenuItem key={index} value={curso}>{curso}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Gestión</InputLabel>
                <Select
                  value={filters.gestion}
                  label="Gestión"
                  onChange={(e) => setFilters(prev => ({ ...prev, gestion: e.target.value }))}
                >
                  <MenuItem value="">Todas las gestiones</MenuItem>
                  {availableEntities.gestiones.map((gestion, index) => (
                    <MenuItem key={index} value={gestion}>{gestion}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Materia</InputLabel>
                <Select
                  value={filters.materia}
                  label="Materia"
                  onChange={(e) => setFilters(prev => ({ ...prev, materia: e.target.value }))}
                >
                  <MenuItem value="">Todas las materias</MenuItem>
                  {availableEntities.materias.map((materia, index) => (
                    <MenuItem key={index} value={materia}>{materia}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Estudiante"
                value={filters.estudiante}
                onChange={(e) => setFilters(prev => ({ ...prev, estudiante: e.target.value }))}
                placeholder="Buscar por nombre..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={clearFilters} color="inherit">
            Limpiar
          </Button>
          <Button onClick={() => setFilterDialogOpen(false)}>
            Aplicar Filtros
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
    </Barra>
  );
};

export default AIReportGenerator;