import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TextField, 
  IconButton,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const Completation = () => {
  // Dati iniziali basati sull'immagine
  const [data, setData] = useState([
    { month: 'GEN', monthFull: 'Gennaio', lucchetto: 40, connettore: 30 },
    { month: 'FEB', monthFull: 'Febbraio', lucchetto: 62, connettore: 45 },
    { month: 'MAR', monthFull: 'Marzo', lucchetto: 20, connettore: 47 },
    { month: 'APR', monthFull: 'Aprile', lucchetto: 39, connettore: 37 },
    { month: 'MAG', monthFull: 'Maggio', lucchetto: 15, connettore: 5 },
    { month: 'GIU', monthFull: 'Giugno', lucchetto: null, connettore: null },
    { month: 'LUG', monthFull: 'Luglio', lucchetto: null, connettore: null },
    { month: 'AGO', monthFull: 'Agosto', lucchetto: null, connettore: null },
    { month: 'SET', monthFull: 'Settembre', lucchetto: null, connettore: null },
    { month: 'OTT', monthFull: 'Ottobre', lucchetto: null, connettore: null },
    { month: 'NOV', monthFull: 'Novembre', lucchetto: null, connettore: null },
    { month: 'DIC', monthFull: 'Dicembre', lucchetto: null, connettore: null }
  ]);

  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleEdit = (rowIndex, field, currentValue) => {
    setEditingCell(`${rowIndex}-${field}`);
    setEditValue(currentValue || '');
  };

  const handleSave = (rowIndex, field) => {
    const newData = [...data];
    const value = editValue === '' ? null : Number(editValue);
    newData[rowIndex][field] = value;
    setData(newData);
    setEditingCell(null);
    setEditValue('');
  };

  const handleCancel = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const handleKeyPress = (e, rowIndex, field) => {
    if (e.key === 'Enter') {
      handleSave(rowIndex, field);
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const renderEditableCell = (value, rowIndex, field) => {
    const cellKey = `${rowIndex}-${field}`;
    const isEditing = editingCell === cellKey;

    if (isEditing) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField
            type="number"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => handleKeyPress(e, rowIndex, field)}
            size="small"
            sx={{ width: '80px' }}
            autoFocus
            variant="outlined"
          />
          <IconButton
            onClick={() => handleSave(rowIndex, field)}
            size="small"
            color="success"
            sx={{ p: 0.5 }}
          >
            <CheckIcon fontSize="small" />
          </IconButton>
          <IconButton
            onClick={handleCancel}
            size="small" 
            color="error"
            sx={{ p: 0.5 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      );
    }

    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1, 
        '&:hover .edit-icon': { opacity: 1 } 
      }}>
        <Box sx={{ minWidth: '32px', textAlign: 'center' }}>
          {value || '-'}
        </Box>
        <IconButton
          onClick={() => handleEdit(rowIndex, field, value)}
          size="small"
          className="edit-icon"
          sx={{ 
            p: 0.5, 
            opacity: 0, 
            transition: 'opacity 0.2s',
            color: 'text.secondary',
            '&:hover': { color: 'text.primary' }
          }}
        >
          <EditIcon sx={{ fontSize: '0.875rem' }} />
        </IconButton>
      </Box>
    );
  };

  // Filtra i dati per il grafico (solo mesi con dati)
  const chartData = data.filter(item => item.lucchetto !== null || item.connettore !== null);

  const months = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
  ];

  return (
    <Box sx={{ 
      p: 6, 
      maxWidth: '1280px', 
      mx: 'auto', 
      bgcolor: '#f9fafb', 
      minHeight: '100vh' 
    }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#1e293b', mb: 6 }}>
        Dashboard 2025
      </Typography>

      {/* Tabella */}
      <Paper sx={{ mb: 6, borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell 
                  sx={{ 
                    fontWeight: 'bold', 
                    bgcolor: '#f1f5f9', 
                    borderRight: '1px solid #e2e8f0',
                    color: '#334155'
                  }}
                >
                  2025
                </TableCell>
                {months.map((month) => (
                  <TableCell 
                    key={month} 
                    align="center" 
                    sx={{ 
                      fontWeight: 'bold', 
                      minWidth: '160px', 
                      borderRight: '1px solid #e5e7eb',
                      color: '#334155',
                      fontSize: '0.875rem'
                    }}
                  >
                    {month}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Riga Lucchetto */}
              <TableRow sx={{ borderBottom: '1px solid #e5e7eb' }}>
                <TableCell 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: '#ea580c',
                    bgcolor: '#f8fafc', 
                    borderRight: '1px solid #e2e8f0',
                    p: 2
                  }}
                >
                  <Box sx={{
                    transform: 'rotate(-90deg)',
                    transformOrigin: 'center',
                    whiteSpace: 'nowrap'
                  }}>
                    LUCCHETTO
                  </Box>
                </TableCell>
                {data.map((item, index) => (
                  <TableCell 
                    key={`lucchetto-${index}`} 
                    align="center" 
                    sx={{ 
                      borderRight: '1px solid #f1f5f9',
                      p: 2
                    }}
                  >
                    {renderEditableCell(item.lucchetto, index, 'lucchetto')}
                  </TableCell>
                ))}
              </TableRow>

              {/* Riga Connettore */}
              <TableRow>
                <TableCell 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: '#16a34a',
                    bgcolor: '#f8fafc', 
                    borderRight: '1px solid #e2e8f0',
                    p: 2
                  }}
                >
                  <Box sx={{
                    transform: 'rotate(-90deg)',
                    transformOrigin: 'center',
                    whiteSpace: 'nowrap'
                  }}>
                    CONNETTORE
                  </Box>
                </TableCell>
                {data.map((item, index) => (
                  <TableCell 
                    key={`connettore-${index}`} 
                    align="center"
                    sx={{ 
                      borderRight: '1px solid #f1f5f9',
                      p: 2
                    }}
                  >
                    {renderEditableCell(item.connettore, index, 'connettore')}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Grafico */}
      <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3 }}>
          Andamento Mensile
        </Typography>
        <Box sx={{ height: '384px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
                domain={[0, 80]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="lucchetto"
                stroke="#ea580c"
                strokeWidth={3}
                dot={{ fill: '#ea580c', strokeWidth: 2, r: 4 }}
                name="Lucchetto"
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="connettore"
                stroke="#16a34a"
                strokeWidth={3}
                dot={{ fill: '#16a34a', strokeWidth: 2, r: 4 }}
                name="Connettore"
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      {/* Legenda informativa */}
      <Paper sx={{ mt: 3, p: 3, borderRadius: 2, boxShadow: 1 }}>
        <Typography variant="body2" sx={{ color: '#4b5563', mb: 1, fontWeight: 'bold' }}>
          Istruzioni:
        </Typography>
        <List dense sx={{ pl: 2 }}>
          <ListItem sx={{ display: 'list-item', listStyleType: 'disc' }}>
            <ListItemText primary="Passa il mouse sopra una cella per vedere l'icona di modifica" />
          </ListItem>
          <ListItem sx={{ display: 'list-item', listStyleType: 'disc' }}>
            <ListItemText primary="Clicca sull'icona di modifica per editare il valore" />
          </ListItem>
          <ListItem sx={{ display: 'list-item', listStyleType: 'disc' }}>
            <ListItemText primary="Premi Enter per salvare o Escape per annullare" />
          </ListItem>
          <ListItem sx={{ display: 'list-item', listStyleType: 'disc' }}>
            <ListItemText primary="Il grafico si aggiorna automaticamente con i nuovi valori" />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
};

export default Completation;