// IMPORTACIONES
const Productos = require('../models/productos.model');

// Obtener datos Productos de Mongo
function ObtenerProductos (req, res) {
    Productos.find((err, productosObtenidos) => {
        if (err) return res.send({ mensaje: "Error: " + err })

        return res.send({ productos: productosObtenidos })
        /* Esto retornara
            {
                productos: ["array con todos los productos"]
            }
        */ 
    })
}

// OBTENER PRODUCTO POR ID
function ObtenerProductoId(req, res) {
    var idProd = req.params.idProductos;

    Productos.findById(idProd, (err, productoEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!productoEncontrado) return res.status(404).send( { mensaje: 'Error al obtener los datos' });

        return res.status(200).send({ producto: productoEncontrado });
    })
}

// OBTENER PRODUCTO POR NOMBRE
function ObtenerProductoNombre(req, res) {
    var nomProd = req.params.nombreProducto;

    // BUSQUEDA NORMAL: Productos.find( { nombre : nomProd }, (err, productoEncontrado) => {
    // BUSCA Y RETORNA EL PRIMERO QUE ENCUENTRE: Productos.findOne( { nombre : { $regex: nomProd, $options: 'i' } }, (err, productoEncontrado) => {
    Productos.find( { nombre : { $regex: nomProd, $options: 'i' } }, (err, productoEncontrado) => {
        if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if(!productoEncontrado) return res.status(404).send({ mensaje: "Error, no se encontraron productos" });

        return res.status(200).send({ producto: productoEncontrado });
    })
}

// AGREGAR PRODUCTOS
function AgregarProducto (req, res){
    // var { nombre, cantidad, precio } = req.body;
    var parametros = req.body;
    var productoModelo = new Productos();

    if( parametros.nombre && parametros.cantidad && parametros.precio ) {
        productoModelo.nombre = parametros.nombre;
        productoModelo.cantidad = parametros.cantidad;
        productoModelo.precio = parametros.precio;

        productoModelo.save((err, productoGuardado) => {
            if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if(!productoGuardado) return res.status(404).send( { mensaje: "Error, no se agrego ningun producto"});

            return res.status(200).send({ producto: productoGuardado });
        })
    }
}

// EDITAR PRODUCTO
function EditarProducto (req, res) {
    var idProd = req.params.idProducto;
    var parametros = req.body;

    Productos.findByIdAndUpdate(idProd, parametros, { new: true } ,(err, productoActualizado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});
        if(!productoActualizado) return res.status(404).send( { mensaje: 'Error al Editar el Producto'});

        return res.status(200).send({ producto: productoActualizado});
    });
}

// ELIMINAR PRODUCTO
function EliminarProducto(req, res) {
    var idProd = req.params.idProducto;

    Productos.findByIdAndDelete(idProd, (err, productoEliminado) => {
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion'});
        if(!productoEliminado) return res.status(404).send( { mensaje: 'Error al eliminar el Producto'});

        return res.status(200).send({ producto: productoEliminado});
    })
}

// INCREMENTAR/RESTAR LA CANTIDAD DEL PRODUCTO

function stockProducto(req, res) {
    const productoId = req.params.idProducto;
    const parametros = req.body;

    Productos.findByIdAndUpdate(productoId, { $inc : { cantidad: parametros.cantidad } }, { new: true },
        (err, productoModificado) => {
            if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if(!productoModificado) return res.status(500).send({ mensaje: 'Error al editar la cantidad del Producto'});

            return res.status(200).send({ producto: productoModificado});
        })

    
}









// Parametro en ruta obligatorio
function EjemploParametroRuta (req, res) {
    var id = req.params.idKinal;

    res.send("Hola Mundo, el id obtenido es: " + id);
}

// Paramentro en ruta opcional
function EjemploParametroRutaOpcional (req, res) {
    var idOp = req.params.idOpcional;

    if(idOp) {
        res.send("Hola Mundo, el id Opcional obtenido es: " + idOp);
    } else {
        res.send("El correo del Usuario es: " + req.user.email)
    }    
}

module.exports = {
    ObtenerProductos,
    EjemploParametroRuta,
    EjemploParametroRutaOpcional,
    ObtenerProductoId,
    ObtenerProductoNombre,
    AgregarProducto,
    EditarProducto,
    EliminarProducto,
    stockProducto
}