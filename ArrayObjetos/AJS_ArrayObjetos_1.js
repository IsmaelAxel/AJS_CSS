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
if(mainActividad == null){
  seguirValidando = false
  arrojarError('Dentro de tu html, debes tener un <main>. Revisa no haberlo borrado.')
}
else{
//Validar que exista el button
  const buttonAlu = validarElemento(mainActividad, "button", 'Dentro del main, debes tener el elemento <button>. Revisa no haberlo borrado.')

    //Si el button existe, entro a validar
    if(buttonAlu){
        //Validar que el button tenga atributo onclick
        if (buttonAlu.getAttribute("onclick") == null) {
            seguirValidando = false
            arrojarError('El elemento button debe tener el atributo "onclick". Si ya lo colocaste, revisa haberlo escrito correctamente.')
        }
        //Validar que el button tenga en su atributo onclick el valor esperado: mostarDias()
        else if(buttonAlu.getAttribute("onclick") != "mostrarNombres()") {
            seguirValidando = false
            arrojarError('El elemento button debe tener en su atributo onclick el valor "mostrarNombres()". Si ya lo colocaste, revisa haberlo escrito correctamente.')
        }
    }
}

//-------------->Validación JS<--------------------

// Modificamos el comportamiento de alert() y prompt() para que nos sirvan para el test

let dhsPromptArray = [];
let dhsAlertArray = [];
let dhsPromptResponseSimulado = [];
dhsPromptResponseSimulado = [1]

//Evaluo si creo la funcion

const funMostrarNombres = check("functionDeclaration", "mostrarNombres");
// logger.test(funMostrarNombres)

if (!funMostrarNombres.exists) {
    arrojarError("Debes declarar la función llamada mostrarNombres()")
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

        mostrarNombres()
    } catch (e) {
        arrojarError("Hay un error de sintaxis: " + e.message)
    }
    // Capturar errores de sintaxis más allá de la consigna (ver variable error_dh en Hidden Code)

    // Buscamos coincidencia para el bucle for...of
    const regex = /for\s*\(\s*(\w+)\s+of\s+(\w+)\s*\)/;
    const match = funMostrarNombres.toString().match(regex);
    let valueForOF
    let variableAlumForOf 
    if (match) {
        if (match[1]) {
            variableAlumForOf = match[1];// la guardo en esta variable ya que me sirve cuando usamos condicionales
        } else {
            arrojarError("No se encontró la variable de iteración en el bucle for...of.");
        }

        if (match[2]) {
            valueForOF = 'El iterable es: ' + match[2];
        } else {
            arrojarError("No se encontró el array o iterable en el bucle for...of.");
        }

    } else {
        arrojarError("No se encontró un bucle for...of en la función.");
    }
    
    if(valueForOF){
        //--------------------------> TEST ALERT   <----------------------------
        //Chequeo la cantidad de alerts generados y que tenga contenido:
        if (dhsAlertArray.length == 0) {
            //Que incluya el pedido en la consigna
            seguirValidando = false
            arrojarError("Debes mostrar un mensaje por alert()")
        } else if (dhsAlertArray.length != 6) {
            //Que no tenga más
            seguirValidando = false;
            arrojarError("Debes mostrar un único mensaje por alert()");
        } else if (dhsAlertArray[dhsAlertArray.length - 1] == null) {
            //Que tenga texto
            seguirValidando = false;
            arrojarError("Tu alert() está vacío. Debe contener la variable  que representa a cada elemento del array.")

        }
    }

    

    // const varAsigSrc = funMostrarNombres.check('variableAssignment', 'document.getElementById("imagenJugador").src')
    // if(!varAsigSrc.exists){
    //     arrojarError('Dentro de la funcion mostrarNombres() debes capturar el atributo src del elemento imagen con id "imagenJugador" para modificarlo con la selección del usuario.')
    //     seguirValidando = false
    // }


    let textoEsperado;

 
    //Creo una función encargada de ejecutar la función del alumno con distintos valores: se encarga de limpiar los valores previos de la primera ejecución, introduce valores como respuesta del prompt, y también crea una expresión regular acorde a lo que se espera que se responda en este ejercicio

    function crearNuevaSimulacionPrompt(parDeValoresSimulados) {
        dhsAlertArray = []
        dhsPromptArray = []
        dhsPromptResponseSimulado = parDeValoresSimulados;
        mostrarNombres()
        
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
];;

    //Creo variables que me servirán de flags a la hora de testear los distintos casos, para acumular la cantidad de errores y mensajes con los casos con los que se probó y los resultados que se obtuvo para cada uno.
    let erroresValor = []
    let erroresValorImagen = []
    let erroresConcat = []
    let ordenCasos = ["A)", "B)", "C)", "D)","E"]

    //Si tiene los elementos básicos (prompts y alert) esperados para cumplir el objetivo, entro a probar casos
    if (seguirValidando) {
        let imagenAlumno = document.getElementById('imagenJugador')
        valores.forEach((parDeValores, contadorCasos) => {
            //Ejecuto la función que resetea y pushea distintos valores de prueba al código del alumno pasandole un par de valores del array de arrays
            
            crearNuevaSimulacionPrompt(parDeValores)
            
             
            let textoAlertado = dhsAlertArray[contadorCasos]
            // logger.test(textoAlertado)
            // logger.test(imagenAlumno)
           
             //Seteo un texto base para errores
            let textoBaseErrores = "CASO " + ordenCasos[contadorCasos] + " segun el array si ejecutamos mostraria en el alert: " + parDeValores.nombre  + ". Pero el resultado del alert es: "

            //Evalúo los distintos errores posibles:

            //Si se que incluyó las dos variables, evalúo si el problema está en la operación (resultado)
            // logger.test(!textoAlertado.match(textoEsperado))
            if (textoAlertado != parDeValores.nombre) {

                erroresValor.push(textoBaseErrores + textoAlertado + " ❌")
            } else {
                erroresValor.push(textoBaseErrores + textoAlertado + " ✅")
            }

        })

        //Chequeo si hubo errores en los casos
        let contadorErroresValor = 0
        let contadorErroresConcat = 0
        erroresValor.forEach((error) => {
            if (error.includes("❌")) {
                contadorErroresValor += 1
            }
        })

        //Si hubo al menos un error, mostramos los casos y sus resultados
        if (contadorErroresValor >= 1) {
            arrojarError("Revisa el mensaje del alert. Se probó tu código con los siguientes casos: ")
            mostrarErroresPruebas(erroresValor);
        }

    }

}

// it("Debes agregar el atributo onclick especificado para el elemento <button>", () => {
//     const attr = document.querySelector("body button").getAttribute("onclick")
//     expect(attr).to.match(/\s{0,2}mostrarNombres\s{0,2}\(\s{0,2}\);{0,2}\s{0,2}/)
// });

