const Encuesta = require('../models/encuesta.model');


function agregarEncuesta(req, res){
    var parametros = req.body;
    var encuestaModel = new Encuesta();

    if(parametros.descripcion && parametros.categoria){
        encuestaModel.descripcion = parametros.descripcion;
        encuestaModel.categoria = parametros.categoria;
        encuestaModel.idCreadorEncuesta = req.user.sub;

        encuestaModel.save((err, encuestaGuardada) => {
            if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if(!encuestaGuardada) return res.status(500).send({ mensaje: "Error al guardar la Encuesta"});
            
            return res.status(200).send({ encuesta: encuestaGuardada });
        });
    } else{
        return res.status(500).send({ mensaje: "Debe rellenar los campos necesarios." });
    }
}

function obtenerEncuestas(req, res) {
    Encuesta.find({}, (err, encuestasEncontradas) => {
        if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if(!encuestasEncontradas) return res.status(500).send({ mensaje: "Error al obtener las encuestas."});

        return res.status(200).send({ encuestas: encuestasEncontradas });
    }).populate('idCreadorEncuesta', 'nombre email')
        .populate('respuestas.idUsuarioRespuesta', 'nombre apellido email');
}

function agregarRespuestaEncuesta(req, res) {
    var idEnc = req.params.idEncuesta;
    var parametros = req.body;

    Encuesta.findByIdAndUpdate(idEnc, { $push: { respuestas: { textoRespuesta: parametros.textoRespuesta,
        idUsuarioRespuesta: req.user.sub } } }, {new: true}, (err, respuestaAgregada) => {
            if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if(!respuestaAgregada) return res.status(500).send({ mensaje: 'Error al agregar la Respuesta'});

            return res.status(200).send({ respuesta: respuestaAgregada })
    })
}

function editarRespuestaEncuesta(req, res) {
    var idResp = req.params.idRespuesta;
    var parametros = req.body;

    // Encuesta.findOneAndUpdate({ "respuestas._id" : idResp, "respuestas.idUsuarioRespuesta": req.user.sub },
    Encuesta.findOneAndUpdate({ respuestas: { $elemMatch : { _id: idResp, idUsuarioRespuesta: req.user.sub } } },
        { "respuestas.$.textoRespuesta": parametros.textoRespuesta }, {new : true}, (err, respuestaEditada)=>{
            if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if(!respuestaEditada) return res.status(500)
                .send({ mensaje: "No tiene acceso para editar esta respuesta"});

            return res.status(200).send({ respuesta: respuestaEditada });
    })
}

function obtenerEncuestasUsuario(req, res) {
    Encuesta.find({ idCreadorEncuesta : req.user.sub }, (err, encuestasEncontradas) => {
        if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if(!encuestasEncontradas) return res.status(500).send({ mensaje: "Error al obtener las encuestas"});

        return res.status(200).send({ encuestas: encuestasEncontradas });
    })
}

module.exports = {
    agregarEncuesta,
    obtenerEncuestas,
    agregarRespuestaEncuesta,
    editarRespuestaEncuesta,
    obtenerEncuestasUsuario
}