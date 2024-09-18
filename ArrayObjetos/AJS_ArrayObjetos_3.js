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
        //Validar que el button tenga en su atributo onclick el valor esperado: mostrarFeriados()
        else if (buttonAlu.getAttribute("onclick") != "mostrarFeriados()") {
            seguirValidando = false
            arrojarError('El elemento button debe tener en su atributo onclick el valor "mostrarFeriados()". Si ya lo colocaste, revisa haberlo escrito correctamente.')
        }
    }
    if (sectionAlu) {
        //Validar que el section tenga atributo onclick
        if (sectionAlu.getAttribute("id") == null) {
            seguirValidando = false
            arrojarError('El elemento section debe tener el atributo "id", revisa no haberlo borrado.')
        }
        //Validar que el section tenga en su atributo id el valor esperado: actividad03
        else if (sectionAlu.getAttribute("id") != "actividad03") {
            seguirValidando = false
            arrojarError('El elemento section debe tener en su atributo id el valor "actividad03", Revisa no haberlo borrado.')
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

const funMostrarFeriados = check("functionDeclaration", "mostrarFeriados");
// logger.test(funMostrarFeriados)

if (!funMostrarFeriados.exists) {
    arrojarError("Debes declarar la función llamada mostrarFeriados()")
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

        mostrarFeriados()
    } catch (e) {
        arrojarError("Hay un error de sintaxis: " + e.message)
    }
    // Capturar errores de sintaxis más allá de la consigna (ver variable error_dh en Hidden Code)

    // Buscamos una coincidencia para el bucle for...of
    const regex = /for\s*\(\s*(\w+)\s+of\s+(\w+)\s*\)/;
    const match = funMostrarFeriados.toString().match(regex);
    let valueForOF
    let variableAlumForOf 
    if (match && match[1] && match[2]) {
        variableAlumForOf = match[1]
        valueForOF = 'El iterable es: ' + match[2] ;
    } else {
        arrojarError("No se encontró un bucle for...of en la función.");
    }
    
    if(valueForOF){
       if(!funMostrarFeriados.toString().includes('document.createElement("p")')){
           seguirValidando = false
        arrojarError('Dentro de la función mostrarFeriados() debes crear una variable que debe guardar el elemento <p> creado.');
       }
       if(!funMostrarFeriados.toString().includes('document.getElementById("actividad03")')){
           seguirValidando = false
        arrojarError('Dentro de la función mostrarFeriados() debes buscar al elemento con id "actividad03" para agregar los dias del array.');
       }

       if(!funMostrarFeriados.toString().includes('.appendChild(')){
           seguirValidando = false
            arrojarError('Dentro de la funcion mostrarFeriados() debes agregar el elemento creado para ver los dias obtenidos del array.')
            
        }
    }

    

    // const varAsigSrc = funMostrarFeriados.check('variableAssignment', 'document.getElementById("imagenJugador").src')
    // if(!varAsigSrc.exists){
    //     arrojarError('Dentro de la funcion mostrarFeriados() debes capturar el atributo src del elemento imagen con id "imagenJugador" para modificarlo con la selección del usuario.')
    //     seguirValidando = false
    // }


    let textoEsperado;

 
    //Creo una función encargada de ejecutar la función del alumno con distintos valores: se encarga de limpiar los valores previos de la primera ejecución, introduce valores como respuesta del prompt, y también crea una expresión regular acorde a lo que se espera que se responda en este ejercicio

    function crearNuevaSimulacionPrompt(parDeValoresSimulados) {
        dhsAlertArray = []
        dhsPromptArray = []
        dhsPromptResponseSimulado = parDeValoresSimulados;
        mostrarFeriados()
        
        // textoEsperado = new RegExp('^El jugador ' + jugadoresTest[dhsPromptResponseSimulado - 1].nombre + ' tiene la camiseta número ' + jugadoresTest[dhsPromptResponseSimulado - 1].camiseta + ';?$');
    }


    //Creo la variable de valores que quiero usar para testear
    const valores = [
  { numero: 1, feriado: false },
  { numero: 2, feriado: false },
  { numero: 3, feriado: false },
  { numero: 4, feriado: false },
  { numero: 5, feriado: false },
  { numero: 6, feriado: false },
  { numero: 7, feriado: false },
  { numero: 8, feriado: false },
  { numero: 9, feriado: false },
  { numero: 10, feriado: false },
  { numero: 11, feriado: false },
  { numero: 12, feriado: false },
  { numero: 13, feriado: false },
  { numero: 14, feriado: false },
  { numero: 15, feriado: false },
  { numero: 16, feriado: false },
  { numero: 17, feriado: true },
  { numero: 18, feriado: false },
  { numero: 19, feriado: false },
  { numero: 20, feriado: true },
  { numero: 21, feriado: false },
  { numero: 22, feriado: false },
  { numero: 23, feriado: false },
  { numero: 24, feriado: false },
  { numero: 25, feriado: false },
  { numero: 26, feriado: false },
  { numero: 27, feriado: false },
  { numero: 28, feriado: false },
  { numero: 29, feriado: false },
  { numero: 30, feriado: false }
];


var posibilidadesCondi = [
    '('+variableAlumForOf+'.feriado == true)',
    '('+variableAlumForOf+'.feriado != false)',
    '(true == '+variableAlumForOf+'.feriado)',
    '(false != '+variableAlumForOf+'.feriado)',
];


let miCondi;
let i = 0;
let existeIF = funMostrarFeriados
    if(!existeIF.toString().includes("if (")){
        seguirValidando = false
        arrojarError("Debes crear la sentencia if, para evaluar la respuesta del usuario.")
    }else{
        while (i < posibilidadesCondi.length) {
            let posiblescondiciones = posibilidadesCondi[i];
        miCondi = check("ifStatement", posiblescondiciones);
        logger.test(miCondi)
        if(miCondi.exists){
            if(!existeIF.toString().includes('.classList.add("feriado")')){
                arrojarError('Si la condición en positiva, al elemento <p> que creas, se le debe agregar la clase “feriado”. (Te recomendamos prestar atención a las minúsculas.)')
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
        let sectionAlumno = document.getElementById('actividad03')
        valores.forEach((parDeValores, contadorCasos) => {
            //Ejecuto la función que resetea y pushea distintos valores de prueba al código del alumno pasandole un par de valores del array de arrays
            
            crearNuevaSimulacionPrompt(parDeValores)
            
             
            let pCreadoAlumno =  sectionAlumno.querySelector('p')
           
           pCreadoAlumno.innerHTML = parDeValores.numero
            // logger.test(imagenAlumno)
           
             //Seteo un texto base para errores
            let textoBaseErrores = "CASO " + ordenCasos[contadorCasos] + " segun el array si ejecutamos mostraria en el párrafo: " + parDeValores  + ". Pero el resultado obtenido es: "

            // //Evalúo los distintos errores posibles:

            // //Si se que incluyó las dos variables, evalúo si el problema está en la operación (resultado)
            // // logger.test(!textoAlertado.match(textoEsperado))
            if (pCreadoAlumno.innerHTML != parDeValores.numero) {

                erroresValor.push(textoBaseErrores + pCreadoAlumno.innerHTML + " ❌")
            } else {
                erroresValor.push(textoBaseErrores + pCreadoAlumno.innerHTML + " ✅")
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
//     expect(attr).to.match(/\s{0,2}mostrarFeriados\s{0,2}\(\s{0,2}\);{0,2}\s{0,2}/)
// });

