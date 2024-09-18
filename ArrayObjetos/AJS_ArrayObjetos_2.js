let seguirValidando = true;

function arrojarError(mensaje) {
    it(mensaje, () => {
        expect(false).to.be.equal(true);
    });
}


function simplificarString(cadena) {
    // Ignorar Case Sensitivity - Convertir a Mayúsculas:
    cadena = cadena.toUpperCase();
    // Ignorar diacríticos (tildes, diéresis) - reemplazar por versión simple
    cadena = cadena.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    // Ignorar signos de puntuación y caracteres especiales (excepto espacios) - los Borra
    cadena = cadena.normalize("NFD").replace(/[^0-9a-zA-Z\s]/g, "");
    // Corregir ocasiones donde haya ingresado doble-espacio: lo reemplaza por espaciado simple.
    cadena = cadena.replace(/ +(?= )/g, '')
    // Ignorar Espacios al principio y final - Limpiar
    cadena = cadena.trim();
    // logger.test(stringObtenido)
    return cadena
}

//Función que se encarga de mostrar un error por cada caso de prueba
function mostrarErroresPruebas(arrayMensajes) {
    arrayMensajes.forEach(mensajeDeError => {
        arrojarError(mensajeDeError)
    })
}
const adjetivos = ["primer", "segundo", "tercer", "cuarto", "quinto", "sexto", "séptimo", "octavo", "noveno", "décimo", "decimoprimer", "decimosegundo", "decimotercer"];

//--------> Validación HTML <------------
const validarElemento = (padre, selector, mensajeError) => {
    const elemento = padre?.querySelector(selector);
    if (!elemento) {
        arrojarError(mensajeError);
    }
    return elemento;
};

const mainActividad = document.querySelector("main");

//Valido que haya un div con clase actividad 01
if (mainActividad == null) {
    seguirValidando = false
    arrojarError('Dentro de tu html, debes tener un <main>. Revisa no haberlo borrado.')
}
else {
    //Validar que exista el button
    const buttonAlu = validarElemento(mainActividad, "button", 'Dentro del main, debes tener el elemento <button>. Revisa no haberlo borrado.')
    const sectionAlu = validarElemento(mainActividad, "section", 'Dentro del main, debes tener el elemento <section>. Revisa no haberlo borrado.')
    //Si el button existe, entro a validar
    if (buttonAlu) {
        //Validar que el button tenga atributo onclick
        if (buttonAlu.getAttribute("onclick") == null) {
            seguirValidando = false
            arrojarError('El elemento button debe tener el atributo "onclick". Si ya lo colocaste, revisa haberlo escrito correctamente.')
        }
        //Validar que el button tenga en su atributo onclick el valor esperado: mostrarAmigos()
        else if (buttonAlu.getAttribute("onclick") != "mostrarAmigos()") {
            seguirValidando = false
            arrojarError('El elemento button debe tener en su atributo onclick el valor "mostrarAmigos()". Si ya lo colocaste, revisa haberlo escrito correctamente.')
        }
    }
    if (sectionAlu) {
        //Validar que el section tenga atributo onclick
        if (sectionAlu.getAttribute("id") == null) {
            seguirValidando = false
            arrojarError('El elemento section debe tener el atributo "id", revisa no haberlo borrado.')
        }
        //Validar que el section tenga en su atributo id el valor esperado: actividad02
        else if (sectionAlu.getAttribute("id") != "actividad02") {
            seguirValidando = false
            arrojarError('El elemento section debe tener en su atributo id el valor "actividad02", Revisa no haberlo borrado.')
        }
    }else{
        seguirValidando = false
    }
}

//-------------->Validación JS<--------------------

// Modificamos el comportamiento de alert() y prompt() para que nos sirvan para el test

let dhsPromptArray = [];
let dhsAlertArray = [];
let dhsPromptResponseSimulado = [];
dhsPromptResponseSimulado = [1]

//Evaluo si creo la funcion

const funMostrarAmigos = check("functionDeclaration", "mostrarAmigos");
// logger.test(funMostrarAmigos)

if (!funMostrarAmigos.exists) {
    arrojarError("Debes declarar la función llamada mostrarAmigos()")
} else {
    prompt = function (textoPrompt) {
        let detallesPrompt = {
            textoPrompt: textoPrompt,
            respuestaPrompt: dhsPromptResponseSimulado[dhsPromptArray.length],
        }
        dhsPromptArray.push(detallesPrompt)
        return detallesPrompt.respuestaPrompt
    }

    alert = function (textoAlert) {
        dhsAlertArray.push(textoAlert)
    }

    // Flag sobre errores de sintaxis más allá de la consigna.
    let error_dh = false;

    // EJECUTO LA FUNCIÓN QUE ESTOY TESTEANDO
    try {

        mostrarAmigos()
    } catch (e) {
        arrojarError("Hay un error de sintaxis: " + e.message)
    }
    // Capturar errores de sintaxis más allá de la consigna (ver variable error_dh en Hidden Code)

    // Buscamos una coincidencia para el bucle for...of
    const regex = /for\s*\(\s*\w+\s+of\s+(\w+)\s*\)/;
    const match = funMostrarAmigos.toString().match(regex);
    let valueForOF
    if (match && match[1]) {
        valueForOF = 'El iterable es: ' + match[1];
    } else {
        arrojarError("No se encontró un bucle for...of en la función.");
    }

    if (valueForOF) {
        if (!funMostrarAmigos.toString().includes('document.createElement("img")')) {
            seguirValidando = false
            arrojarError('Dentro de la función mostrarAmigos() debes crear una variable que debe guardar el elemento <img> creado.');
        }
        if (!funMostrarAmigos.toString().includes('document.createElement("div")')) {
            seguirValidando = false
            arrojarError('Dentro de la función mostrarAmigos() debes crear una variable que debe guardar el elemento <div> creado.');
        }
        if (!funMostrarAmigos.toString().includes('document.createElement("h2")')) {
            seguirValidando = false
            arrojarError('Dentro de la función mostrarAmigos() debes crear una variable que debe guardar el elemento <h2> creado.');
        }
        if (!funMostrarAmigos.toString().includes('document.getElementById("actividad02")')) {
            seguirValidando = false
            arrojarError('Dentro de la función mostrarAmigos() debes buscar al elemento con id "tareas" para agregar las tareas obtenidas del array.');
        }

        //    if(!funMostrarAmigos.toString().includes('.appendChild(')){
        //        seguirValidando = false
        //         arrojarError('Dentro de la funcion mostrarAmigos() debes agregar el elemento creado para ver las tarea obtenidas del array.')

        //     }
        var ocurrencias = (funMostrarAmigos.toString().match(/\.appendChild\(/g) || []).length;

        if (ocurrencias !== 3) {
            seguirValidando = false;
            arrojarError('Dentro de la función mostrarAmigos() debes usar el método .appendChild() exactamente 3 veces. Recuerda que la imagen y el subtítulo se agregan al elemento <div> creado por ti.');
        }
    }



    // const varAsigSrc = funMostrarAmigos.check('variableAssignment', 'document.getElementById("imagenJugador").src')
    // if(!varAsigSrc.exists){
    //     arrojarError('Dentro de la funcion mostrarAmigos() debes capturar el atributo src del elemento imagen con id "imagenJugador" para modificarlo con la selección del usuario.')
    //     seguirValidando = false
    // }


    let textoEsperado;


    //Creo una función encargada de ejecutar la función del alumno con distintos valores: se encarga de limpiar los valores previos de la primera ejecución, introduce valores como respuesta del prompt, y también crea una expresión regular acorde a lo que se espera que se responda en este ejercicio

    function crearNuevaSimulacionPrompt(parDeValoresSimulados) {
        dhsAlertArray = []
        dhsPromptArray = []
        dhsPromptResponseSimulado = parDeValoresSimulados;
        // document.getElementById('actividad02').innerHTML = ""
        mostrarAmigos()

        // textoEsperado = new RegExp('^El jugador ' + jugadoresTest[dhsPromptResponseSimulado - 1].nombre + ' tiene la camiseta número ' + jugadoresTest[dhsPromptResponseSimulado - 1].camiseta + ';?$');
    }


    //Creo la variable de valores que quiero usar para testear
    const valores = [
        {
            nombre: "Monica Geller",
            imagen: "https://imagenes.20minutos.es/files/image_656_370/uploads/imagenes/2020/06/15/monica_geller.jpg"
        },
        {
            nombre: "Rachel Green",
            imagen: "https://www.revistaestilo.net/binrepository/LOSMEJORESLOOKSDERACHELGREENportada0_ES1446491_MG248404351.jpg"
        },
        {
            nombre: "Phoebe Buffay",
            imagen: "https://static01.nyt.com/images/2019/09/08/arts/08friends-phoebe6/08friends-phoebe6-jumbo.jpg"
        },
        {
            nombre: "Ross Geller",
            imagen: "https://media.revistagq.com/photos/5cb725b0cd5468d970512e0c/16:9/w_1280,c_limit/ross_geller_friends_1863.jpg"
        },
        {
            nombre: "Joey Tribbiani",
            imagen: "https://fotografias-neox.atresmedia.com/clipping/cmsimages02/2019/03/19/32795A2D-8773-4A4B-BF41-71175D8B745F/63.jpg"
        },
        {
            nombre: "Chandler Bing",
            imagen: "https://i.pinimg.com/564x/a4/a4/7d/a4a47d837726daa86ece52c8dc5b812a--chandler-bing-friends-season.jpg"
        }
    ];

    //Creo variables que me servirán de flags a la hora de testear los distintos casos, para acumular la cantidad de errores y mensajes con los casos con los que se probó y los resultados que se obtuvo para cada uno.
    let erroresValor = []
    let erroresValorImagen = []
    let erroresConcat = []
    let ordenCasos = ["A)", "B)", "C)", "D)", "E"]

    //Si tiene los elementos básicos (prompts y alert) esperados para cumplir el objetivo, entro a probar casos
    if (seguirValidando) {
        let divAlumno = document.getElementById('actividad02')
        valores.forEach((parDeValores, contadorCasos) => {
            //Ejecuto la función que resetea y pushea distintos valores de prueba al código del alumno pasandole un par de valores del array de arrays

            crearNuevaSimulacionPrompt(parDeValores)


            let textoH3 = divAlumno.querySelector('h2')
            textoH3.innerHTML = parDeValores.nombre

            let imgSrc = divAlumno.querySelector('img')
            imgSrc.setAttribute('src', parDeValores.imagen)

            let urlSimulada = parDeValores.imagen

            // logger.test(imagenAlumno)

            //Seteo un texto base para errores
            let textoBaseErrores = "CASO " + ordenCasos[contadorCasos] + " segun el array si ejecutamos mostraria en el subtítulo: " + parDeValores + ". Pero el resultado obtenido es: "

            // //Evalúo los distintos errores posibles:

            // //Si se que incluyó las dos variables, evalúo si el problema está en la operación (resultado)
            // // logger.test(!textoAlertado.match(textoEsperado))
            if (textoH3.innerHTML != parDeValores.nombre) {

                erroresValor.push(textoBaseErrores + textoH3.innerHTML + " ❌")
            } else {
                erroresValor.push(textoBaseErrores + textoH3.innerHTML + " ✅")
            }

            if (imgSrc.getAttribute('src') != urlSimulada) {
                erroresValorImagen.push(textoBaseErrores + ' Si el array tiene la url ' + parDeValores.imagen + ' la url deberia ser: ' + urlSimulada + ' pero en tu sitio se muestra: ' + imgSrc.getAttribute('src') + " ❌")
            } else {
                erroresValorImagen.push(textoBaseErrores + ' Si el array tiene la url ' + parDeValores.imagen + ' la url deberia ser: ' + urlSimulada + ' pero en tu sitio se muestra: ' + imgSrc.getAttribute('src') + " ✅")
            }

        })

        //Chequeo si hubo errores en los casos
        let contadorErroresValor = 0
        let contadorErroresSub = 0
        erroresValor.forEach((error) => {
            if (error.includes("❌")) {
                contadorErroresSub += 1
                contadorErroresValor += 1
            }
        })

        //Si hubo al menos un error, mostramos los casos y sus resultados
        if (contadorErroresValor >= 1) {
            arrojarError("Revisa las tareas agregadas. Se probó tu código con los siguientes casos: ")
            mostrarErroresPruebas(erroresValor);
        }

        //Chequeo si hubo errores en los casos de imagen
        let contadorErroresValorImagen = 0
        erroresValorImagen.forEach((error) => {
            if (error.includes("❌")) {
                contadorErroresValorImagen += 1
            }
        })

        //Si hubo al menos un error, mostramos los casos y sus resultados

        if (contadorErroresSub == 0 && contadorErroresValorImagen >= 1) {
            arrojarError("Hay un error al modificar el src de la imagen. Se probó tu código JS con los siguientes casos: ")
            mostrarErroresPruebas(erroresValorImagen);
        }

    }

}

// it("Debes agregar el atributo onclick especificado para el elemento <button>", () => {
//     const attr = document.querySelector("body button").getAttribute("onclick")
//     expect(attr).to.match(/\s{0,2}mostrarAmigos\s{0,2}\(\s{0,2}\);{0,2}\s{0,2}/)
// });

