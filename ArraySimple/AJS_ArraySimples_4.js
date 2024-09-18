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
// Primero capturamos el main para asegurarnos que si borraron la etiqueta por error no rompa la validacion
const mainTag = document.querySelector("main")
if (mainTag != null) {
    const divsActividad = document.querySelectorAll("div");

    //Valido que haya un main
    if (divsActividad.length > 2) {
        seguirValidando = false
        arrojarError('Dentro del main, solamente debes tener los dos <div> brindados por el ejercicio.')
    } else if (divsActividad.length < 2) {
        seguirValidando = false
        arrojarError("Dentro del main, debes tener los dos <div> brindados por el ejercicio.")
    }
    else {
        //Recorremos los divs para validar su interior
        for (let iDiv = 0; iDiv < divsActividad.length; iDiv++) {
            //Validamos que en el primer div haya una etiqueta <button>
            switch (iDiv) {
                //Validamos el contenido del 1° div
                case 0:
                    const buttonPrimerDiv = validarElemento(divsActividad[iDiv], "button", 'Dentro del div con clase "actividad04", debes tener el elemento <button>. Revisa no haberlo borrado.')
                    if (buttonPrimerDiv) {
                        //Validar que el button tenga atributo onclick
                        if (buttonPrimerDiv.getAttribute("onclick") == null) {
                            seguirValidando = false
                            arrojarError('El elemento button debe tener el atributo "onclick". Si ya lo colocaste, revisa haberlo escrito correctamente.')
                        }
                        //Validar que el button tenga en su atributo onclick el valor esperado: mostrarSabores()
                        else if (buttonPrimerDiv.getAttribute("onclick") != "mostrarSabores()") {
                            seguirValidando = false
                            arrojarError('El elemento button debe tener en su atributo onclick el valor "mostrarSabores()". Si ya lo colocaste, revisa haberlo escrito correctamente.')
                        }
                    }
                    break
                //Validamos el contenido del 2° div
                case 1:
                    const listaDesordenadaSegundoDiv = validarElemento(divsActividad[iDiv], "ul", 'Dentro del div con id "actividad04", debes tener el elemento <ul>. Revisa no haberlo borrado.');
                    if (listaDesordenadaSegundoDiv) {
                        //Validar que el ol tenga el atributo id
                        if (listaDesordenadaSegundoDiv.getAttribute("id") == null) {
                            seguirValidando = false;
                            arrojarError('El elemento ol debe tener el atributo "id", Revisa no haberlo borrado.');
                        }
                        //Validar que el ol tenga en su atributo id el valor esperado: listaDeSabores
                        else if (listaDesordenadaSegundoDiv.getAttribute("id") != "listaDeSabores") {
                            seguirValidando = false;
                            arrojarError('El elemento ol debe tener en su atributo id el valor "tareas", Revisa no haberlo borrado.');
                        }
                    } else {
                        seguirValidando = false;
                    }
                    break
            }
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

const funMostrarSabores = check("functionDeclaration", "mostrarSabores");
// logger.test(funMostrarSabores)

if (!funMostrarSabores.exists) {
    arrojarError("Debes declarar la función llamada mostrarSabores()")
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

        mostrarSabores()
    } catch (e) {
        arrojarError("Hay un error de sintaxis: " + e.message)
    }
    // Capturar errores de sintaxis más allá de la consigna (ver variable error_dh en Hidden Code)

    // Buscamos una coincidencia para el bucle for...of
    const regex = /for\s*\(\s*(\w+)\s+of\s+(\w+)\s*\)/;
    const match = funMostrarSabores.toString().match(regex);
    let valueForOF
    let variableAlumForOf 
    if (match && match[1] && match[2]) {
        variableAlumForOf = match[1]
        valueForOF = 'El iterable es: ' + match[2] ;
    } else {
        arrojarError("No se encontró un bucle for...of en la función.");
    }
    
    if(valueForOF){
       if(!funMostrarSabores.toString().includes('document.createElement("li")')){
           seguirValidando = false
        arrojarError('Dentro de la función mostrarSabores() debes crear una variable que debe guardar el elemento <p> creado.');
       }
       if(!funMostrarSabores.toString().includes('document.getElementById("listaDeSabores")')){
           seguirValidando = false
        arrojarError('Dentro de la función mostrarSabores() debes buscar al elemento con id "listaDeSabores" para agregar los sabores del array.');
       }

       if(!funMostrarSabores.toString().includes('.appendChild(')){
           seguirValidando = false
            arrojarError('Dentro de la funcion mostrarSabores() debes agregar el elemento creado para ver los sabores obtenidos del array.')
            
        }
    }

    

    // const varAsigSrc = funMostrarSabores.check('variableAssignment', 'document.getElementById("imagenJugador").src')
    // if(!varAsigSrc.exists){
    //     arrojarError('Dentro de la funcion mostrarSabores() debes capturar el atributo src del elemento imagen con id "imagenJugador" para modificarlo con la selección del usuario.')
    //     seguirValidando = false
    // }


    let textoEsperado;

 
    //Creo una función encargada de ejecutar la función del alumno con distintos valores: se encarga de limpiar los valores previos de la primera ejecución, introduce valores como respuesta del prompt, y también crea una expresión regular acorde a lo que se espera que se responda en este ejercicio

    function crearNuevaSimulacionPrompt(parDeValoresSimulados) {
        dhsAlertArray = []
        dhsPromptArray = []
        dhsPromptResponseSimulado = parDeValoresSimulados;
        mostrarSabores()
        
        // textoEsperado = new RegExp('^El jugador ' + jugadoresTest[dhsPromptResponseSimulado - 1].nombre + ' tiene la camiseta número ' + jugadoresTest[dhsPromptResponseSimulado - 1].camiseta + ';?$');
    }


    //Creo la variable de valores que quiero usar para testear
    const valores = ["Chocolate", "Frutilla", "Frambuesa", "Vainilla", "Mascarpone"];

var posibilidadesCondi = [
    '('+variableAlumForOf+' == "Frambuesa")',
    '("Frambuesa" == '+variableAlumForOf+')',
];


let miCondi;
let i = 0;
let existeIF = funMostrarSabores
    if(!existeIF.toString().includes("if (")){
        seguirValidando = false
        arrojarError("Debes crear la sentencia if else, para evaluar la respuesta del usuario.")
    }else{
        while (i < posibilidadesCondi.length) {
            let posiblescondiciones = posibilidadesCondi[i];
        miCondi = check("ifStatement", posiblescondiciones);
        // logger.test(miCondi)
        if(miCondi.exists){
            if(!existeIF.toString().includes('.classList.add("no-disponible")')){
                arrojarError('Si la condición es positiva, al elemento <li> que creaste, se le debe agregar la clase “no-disponible”. (Te recomendamos prestar atención a las mayúsculas presentes en los nombres de los sabores)')
            }
            break;
        }
            i++;
        }
}


 if(i==2){
    seguirValidando = false
    arrojarError("Revisa tu condición en la sentencia if, para evaluar si dos valores son iguales utilizamos el operador == (es igual) y los operando deben estar bien escritos.")
}




    //Creo variables que me servirán de flags a la hora de testear los distintos casos, para acumular la cantidad de errores y mensajes con los casos con los que se probó y los resultados que se obtuvo para cada uno.
    let erroresValor = []
    let erroresValorImagen = []
    let erroresConcat = []
    let ordenCasos = ["A)", "B)", "C)", "D)","E"]

    //Si tiene los elementos básicos (prompts y alert) esperados para cumplir el objetivo, entro a probar casos
    if (seguirValidando) {
        let listaAlumno = document.getElementById('listaDeSabores')
        valores.forEach((parDeValores, contadorCasos) => {
            //Ejecuto la función que resetea y pushea distintos valores de prueba al código del alumno pasandole un par de valores del array de arrays
            
            crearNuevaSimulacionPrompt(parDeValores)
            
             
            let listaSabores =  listaAlumno.querySelectorAll('li')[contadorCasos]
           
           listaSabores.innerHTML = parDeValores
            // logger.test(imagenAlumno)
           
             //Seteo un texto base para errores
            let textoBaseErrores = "CASO " + ordenCasos[contadorCasos] + " segun el array si ejecutamos mostraria en el " + adjetivos[contadorCasos]+ "  párrafo: " + parDeValores  + ". Pero el resultado obtenido es: "

            // //Evalúo los distintos errores posibles:

            // //Si se que incluyó las dos variables, evalúo si el problema está en la operación (resultado)
            // // logger.test(!textoAlertado.match(textoEsperado))
            if (listaSabores.innerHTML != parDeValores) {

                erroresValor.push(textoBaseErrores + listaSabores.innerHTML + " ❌")
            } else {
                erroresValor.push(textoBaseErrores + listaSabores.innerHTML + " ✅")
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
            arrojarError("Revisa los párrafos agregados. Se probó tu código con los siguientes casos: ")
            mostrarErroresPruebas(erroresValor);
        }

    }

}

// it("Debes agregar el atributo onclick especificado para el elemento <button>", () => {
//     const attr = document.querySelector("body button").getAttribute("onclick")
//     expect(attr).to.match(/\s{0,2}mostrarSabores\s{0,2}\(\s{0,2}\);{0,2}\s{0,2}/)
// });

