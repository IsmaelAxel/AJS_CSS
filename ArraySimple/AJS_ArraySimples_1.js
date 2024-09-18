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

let divActividad = document.querySelector("div.actividad01");

//Valido que haya un div con clase actividad 01
if(divActividad == null){
  seguirValidando = false
  arrojarError('Dentro del main, debes tener un <div> con clase "actividad01". Revisa no haberlo borrado.')
}
else{
//Validar que exista el button
  const buttonAlu = validarElemento(divActividad, "button", 'Dentro del div con clase "actividad01", debes tener el elemento <button>. Revisa no haberlo borrado.')

    //Si el button existe, entro a validar
    if(buttonAlu){
        //Validar que el button tenga atributo onclick
        if (buttonAlu.getAttribute("onclick") == null) {
            seguirValidando = false
            arrojarError('El elemento button debe tener el atributo "onclick". Si ya lo colocaste, revisa haberlo escrito correctamente.')
        }
        //Validar que el button tenga en su atributo onclick el valor esperado: mostarDias()
        else if(buttonAlu.getAttribute("onclick") != "mostrarDias()") {
            seguirValidando = false
            arrojarError('El elemento button debe tener en su atributo onclick el valor "mostrarDias()". Si ya lo colocaste, revisa haberlo escrito correctamente.')
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

const funMostrarDias = check("functionDeclaration", "mostrarDias");
// logger.test(funMostrarDias)

if (!funMostrarDias.exists) {
    arrojarError("Debes declarar la función llamada mostrarDias()")
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

        mostrarDias()
    } catch (e) {
        arrojarError("Hay un error de sintaxis: " + e.message)
    }
    // Capturar errores de sintaxis más allá de la consigna (ver variable error_dh en Hidden Code)

    // Buscamos una coincidencia para el bucle for...of
    const regex = /for\s*\(\s*\w+\s+of\s+(\w+)\s*\)/;
    const match = funMostrarDias.toString().match(regex);
    let valueForOF
    if (match && match[1]) {
        valueForOF = 'El iterable es: ' + match[1] ;
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
        } else if (dhsAlertArray.length != 5) {
            //Que no tenga más
            seguirValidando = false;
            arrojarError("Debes mostrar un único mensaje por alert()");
        } else if (dhsAlertArray[dhsAlertArray.length - 1] == null) {
            //Que tenga texto
            seguirValidando = false;
            arrojarError("Tu alert() está vacío. Debe contener la variable  que representa a cada elemento del array.")

        }
    }

    

    // const varAsigSrc = funMostrarDias.check('variableAssignment', 'document.getElementById("imagenJugador").src')
    // if(!varAsigSrc.exists){
    //     arrojarError('Dentro de la funcion mostrarDias() debes capturar el atributo src del elemento imagen con id "imagenJugador" para modificarlo con la selección del usuario.')
    //     seguirValidando = false
    // }


    let textoEsperado;

 
    //Creo una función encargada de ejecutar la función del alumno con distintos valores: se encarga de limpiar los valores previos de la primera ejecución, introduce valores como respuesta del prompt, y también crea una expresión regular acorde a lo que se espera que se responda en este ejercicio

    function crearNuevaSimulacionPrompt(parDeValoresSimulados) {
        dhsAlertArray = []
        dhsPromptArray = []
        dhsPromptResponseSimulado = parDeValoresSimulados;
        mostrarDias()
        
        // textoEsperado = new RegExp('^El jugador ' + jugadoresTest[dhsPromptResponseSimulado - 1].nombre + ' tiene la camiseta número ' + jugadoresTest[dhsPromptResponseSimulado - 1].camiseta + ';?$');
    }


    //Creo la variable de valores que quiero usar para testear
    const valores = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

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
            let textoBaseErrores = "CASO " + ordenCasos[contadorCasos] + " segun el array si ejecutamos mostraria en el alert: " + parDeValores  + ". Pero el resultado del alert es: "

            //Evalúo los distintos errores posibles:

            //Si se que incluyó las dos variables, evalúo si el problema está en la operación (resultado)
            // logger.test(!textoAlertado.match(textoEsperado))
            if (textoAlertado != parDeValores) {

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
//     expect(attr).to.match(/\s{0,2}mostrarDias\s{0,2}\(\s{0,2}\);{0,2}\s{0,2}/)
// });

