import React from 'react'
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { usePersonale } from '../../hooks/usePersonale';
import { useNavigate } from 'react-router-dom';

const OperatorSelectCalendar = () => {
    const personale = usePersonale()
    const navigate = useNavigate()

    return (
        <FormControl sx={{ width: '350px',mr:'16px' }}>
            <InputLabel id="simple-select-label">Operatore</InputLabel>
            <Select
                labelId="simple-select-label"
                id="simple-select"
                variant='standard'
                label="Operatore"
            >
                
                {
                personale.personale.map((operator) => (
                    <MenuItem onClick={() => navigate('/operatore/calendario/' + operator.id)} key={operator.id} value={operator.id}>{operator.workerName}</MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default OperatorSelectCalendar