const express = require('express');
const encuestaControlador = require('../controllers/encuesta.controller');

const md_autenticacion = require('../middlewares/autenticacion');

const api = express.Router();
api.post('/agregarEncuesta', md_autenticacion.Auth, encuestaControlador.agregarEncuesta);
api.get('/obtenerEncuestas', md_autenticacion.Auth, encuestaControlador.obtenerEncuestas);
api.put('/agregarRespuesta/:idEncuesta', md_autenticacion.Auth, encuestaControlador.agregarRespuestaEncuesta);
api.put('/editarRespuesta/:idRespuesta', md_autenticacion.Auth, encuestaControlador.editarRespuestaEncuesta);
api.get('/obtenerEncuestasUsuario', md_autenticacion.Auth, encuestaControlador.obtenerEncuestasUsuario);

module.exports = api;