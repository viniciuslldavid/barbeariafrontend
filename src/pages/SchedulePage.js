import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, MenuItem, Select, Button, FormControl, InputLabel } from '@mui/material';
import { getBarbers, getServices, createSchedule, createPublicSchedule } from '../services/api';

const SchedulePage = ({ user }) => {
  const [barbers, setBarbers] = useState([]);
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    serviceId: '',
    barberId: '',
    date: '',
    time: '',
    userName: '',
    userPhone: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [barbersResponse, servicesResponse] = await Promise.all([getBarbers(), getServices()]);
        setBarbers(barbersResponse.data);
        setServices(servicesResponse.data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Adiciona os segundos ao formato do horário (HH:MM para HH:MM:SS)
      const formattedTime = `${formData.time}:00`;

      if (user) {
        await createSchedule({
          serviceId: formData.serviceId,
          barberId: formData.barberId,
          date: formData.date,
          time: formattedTime,
        });
      } else {
        await createPublicSchedule({
          serviceId: formData.serviceId,
          barberId: formData.barberId,
          date: formData.date,
          time: formattedTime,
          userName: formData.userName,
          userPhone: formData.userPhone,
        });
      }
      alert('Agendamento criado com sucesso!');
      navigate(user ? '/my-schedules' : '/');
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      alert(error.response?.data?.message || 'Erro ao criar agendamento.');
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: '#1a1a1a', minHeight: '100vh', mt: 8 }}>
      <Typography variant="h4" color="#FFD700" gutterBottom>
        Agendamento
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto' }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel sx={{ color: '#FFD700' }}>Serviço</InputLabel>
          <Select
            name="serviceId"
            value={formData.serviceId}
            onChange={handleChange}
            required
            sx={{ color: '#fff', backgroundColor: '#2a2a2a', '& .MuiSvgIcon-root': { color: '#FFD700' } }}
          >
            {services.map((service) => (
              <MenuItem key={service.id} value={service.id}>
                {service.name} - R${service.price}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel sx={{ color: '#FFD700' }}>Barbeiro</InputLabel>
          <Select
            name="barberId"
            value={formData.barberId}
            onChange={handleChange}
            required
            sx={{ color: '#fff', backgroundColor: '#2a2a2a', '& .MuiSvgIcon-root': { color: '#FFD700' } }}
          >
            {barbers.map((barber) => (
              <MenuItem key={barber.id} value={barber.id}>
                {barber.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Data (YYYY-MM-DD)"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          fullWidth
          required
          InputLabelProps={{ shrink: true }}
          inputProps={{ min: new Date().toISOString().split('T')[0] }} // Impede datas passadas
          sx={{ mb: 2, backgroundColor: '#2a2a2a', input: { color: '#fff' }, label: { color: '#FFD700' } }}
        />

        <TextField
          label="Horário (HH:MM)"
          name="time"
          type="time"
          value={formData.time}
          onChange={handleChange}
          fullWidth
          required
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2, backgroundColor: '#2a2a2a', input: { color: '#fff' }, label: { color: '#FFD700' } }}
        />

        {!user && (
          <>
            <TextField
              label="Seu Nome"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              fullWidth
              required
              sx={{ mb: 2, backgroundColor: '#2a2a2a', input: { color: '#fff' }, label: { color: '#FFD700' } }}
            />
            <TextField
              label="Seu Telefone"
              name="userPhone"
              value={formData.userPhone}
              onChange={handleChange}
              fullWidth
              required
              sx={{ mb: 2, backgroundColor: '#2a2a2a', input: { color: '#fff' }, label: { color: '#FFD700' } }}
            />
          </>
        )}

        <Button type="submit" variant="contained" sx={{ backgroundColor: '#FFD700', color: '#000', '&:hover': { backgroundColor: '#e6c200' } }}>
          Agendar
        </Button>
      </Box>
    </Box>
  );
};

export default SchedulePage;