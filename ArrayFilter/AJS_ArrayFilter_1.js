let seguirValidando = true;

function arrojarError(mensaje) {
    seguirValidando = false;
    it(mensaje, () => {
        expect(false).to.be.equal(true);
    });
}

function simplificarString(cadena) {
    cadena = cadena.toUpperCase();
    cadena = cadena.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    cadena = cadena.normalize("NFD").replace(/[^0-9a-zA-Z\s]/g, "");
    cadena = cadena.replace(/ +(?= )/g, '');
    cadena = cadena.trim();
    return cadena;
}

// Función que se encarga de mostrar un error por cada caso de prueba
function mostrarErroresPruebas(arrayMensajes) {
    arrayMensajes.forEach(mensajeDeError => {
        arrojarError(mensajeDeError);
    });
}

const adjetivos = ["primer", "segundo", "tercer", "cuarto", "quinto", "sexto", "séptimo", "octavo", "noveno", "décimo", "decimoprimer", "decimosegundo", "decimotercer"];

const validarElemento = (padre, selector, mensajeError) => {
    const elemento = padre?.querySelector(selector);
    if (!elemento) {
        arrojarError(mensajeError);
    }
    return elemento;
};

// Primero capturamos el main para asegurarnos que si borraron la etiqueta por error no rompa la validacion
const mainTag = document.querySelector("main");

if (mainTag != null && seguirValidando) {
    const asideTag = validarElemento(mainTag, "aside", "Debe haber un <aside> dentro de la etiqueta <main>.");
    const sectionTag = validarElemento(mainTag, "section", "Debe haber un <section> dentro de la etiqueta <main>.");

    if (asideTag && seguirValidando) {
        const inputs = asideTag.querySelectorAll("input");
        if (inputs.length !== 2) {
            arrojarError("Debe haber exactamente 2 elementos <input> dentro del <aside>.");
        } else {
            const inputMinimo = inputs[0];
            if (inputMinimo) {
                // Validación de todos los atributos uno por uno, asegurando que existan
                if (inputMinimo.getAttribute("id") !== "valor-minimo") {
                    arrojarError('El primer <input> debe tener el atributo id="valor-minimo".');
                }
                if (inputMinimo.getAttribute("type") !== "number") {
                    arrojarError('El primer <input> debe tener el atributo type="number".');
                }
                if (inputMinimo.getAttribute("min") !== "1") {
                    arrojarError('El primer <input> debe tener el atributo min="1".');
                }
                if (inputMinimo.getAttribute("max") !== "100") {
                    arrojarError('El primer <input> debe tener el atributo max="100".');
                }
                if (inputMinimo.getAttribute("value") !== "10000") {
                    arrojarError('El primer <input> debe tener el atributo value="10000".');
                }
                if (inputMinimo.getAttribute("step") !== "1000") {
                    arrojarError('El primer <input> debe tener el atributo step="1000".');
                }
            } else {
                arrojarError('El primer <input> no existe o fue eliminado.');
            }

            const inputMaximo = inputs[1];
            if (inputMaximo) {
                if (inputMaximo.getAttribute("id") !== "valor-maximo") {
                    arrojarError('El segundo <input> debe tener el atributo id="valor-maximo".');
                }
                if (inputMaximo.getAttribute("type") !== "number") {
                    arrojarError('El segundo <input> debe tener el atributo type="number".');
                }
                if (inputMaximo.getAttribute("min") !== "1") {
                    arrojarError('El segundo <input> debe tener el atributo min="1".');
                }
                if (inputMaximo.getAttribute("max") !== "200000") {
                    arrojarError('El segundo <input> debe tener el atributo max="200000".');
                }
                if (inputMaximo.getAttribute("value") !== "65000") {
                    arrojarError('El segundo <input> debe tener el atributo value="65000".');
                }
                if (inputMaximo.getAttribute("step") !== "1000") {
                    arrojarError('El segundo <input> debe tener el atributo step="1000".');
                }
            } else {
                arrojarError('El segundo <input> no existe o fue eliminado.');
            }
        }

        const selectLocalidad = validarElemento(asideTag, "select", "Debe haber un elemento <select> dentro del <aside>, revisa no haberlo borrado.");
        if (selectLocalidad && seguirValidando) {
            if (selectLocalidad.getAttribute("id") !== "localidad") {
                arrojarError('El <select> debe tener el atributo id="localidad".');
            }

            const options = selectLocalidad.querySelectorAll("option");
            if (options.length !== 5) {
                arrojarError("El <select> debe tener exactamente 5 elementos <option>.");
            } else {
                const valoresEsperados = ["vacio", "caba", "norte", "sur", "oeste"];
                options.forEach((option, index) => {
                    if (option.getAttribute("value") !== valoresEsperados[index]) {
                        arrojarError('El <option> en la ' + adjetivos[index] + ' posición debe tener el valor "' + valoresEsperados[index] + '".');
                    }
                });
            }
        }

        const buttonFiltrar = validarElemento(asideTag, 'button[onclick="filtrarPropiedades()"]', 'Debe haber un <button> con la propiedad onclick="filtrarPropiedades()".');
        if (!buttonFiltrar && seguirValidando) {
            arrojarError('Falta el botón para filtrar con onclick="filtrarPropiedades()".');
        }
    }

    if (sectionTag && seguirValidando) {
        if (sectionTag.getAttribute("id") !== "listado") {
            arrojarError('El <section> dentro del <main> debe tener el atributo id="listado".');
        }
    }
}



// Modificamos el comportamiento de alert() y prompt() para que nos sirvan para el test

let dhsPromptArray = [];
let dhsAlertArray = [];
let dhsPromptResponseSimulado = [];
dhsPromptResponseSimulado = [1]

//Evaluo si creo la funcion

const funFiltrarPropiedades = check("functionDeclaration", "filtrarPropiedades");
// logger.test(funFiltrarPropiedades)

if (!funFiltrarPropiedades.exists) {
    arrojarError("Debes declarar la función llamada filtrarPropiedades()")
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

        filtrarPropiedades()
    } catch (e) {
        arrojarError("Hay un error de sintaxis: " + e.message)
    }




    if(!funFiltrarPropiedades.toString().includes('.getElementById("valor-minimo")')){
           seguirValidando = false
        arrojarError('Dentro de la función filtrarPropiedades() debes buscar al elemento input con id "valor-minimo" para obtener su valor');
       }
    if(!funFiltrarPropiedades.toString().includes('.getElementById("valor-maximo")')){
           seguirValidando = false
        arrojarError('Dentro de la función filtrarPropiedades() debes buscar al elemento input con id "valor-maximo" para obtener su valor');
       }
    if(!funFiltrarPropiedades.toString().includes('.getElementById("localidad")')){
           seguirValidando = false
        arrojarError('Dentro de la función filtrarPropiedades() debes buscar al elemento select con id "localidad" para obtener su valor');
       }



    var ocurrenciasFilter = (funFiltrarPropiedades.toString().match(/\.value/g) || []).length;

        if (ocurrenciasFilter !== 3) {
        seguirValidando = false;
        arrojarError('Dentro de la función filtrarPropiedades() debes usar el .value para obtener el valor de cada input y del select');
        }
    // Buscamos una coincidencia para el bucle for...of
    const regex = /for\s*\(\s*\w+\s+of\s+(\w+)\s*\)/;
    const match = funFiltrarPropiedades.toString().match(regex);
    let valueForOF
    if (match && match[1]) {
        valueForOF = 'El iterable es: ' + match[1] ;
    } else {
        arrojarError("No se encontró un bucle for...of en la función.");
    }
    
    if(valueForOF){
       if(!funFiltrarPropiedades.toString().includes('document.createElement("article")')){
           seguirValidando = false
        arrojarError('Dentro de la función filtrarPropiedades() debes crear una variable que debe guardar el elemento <article> creado.');
       }
       if(!funFiltrarPropiedades.toString().includes('document.createElement("h3")')){
           seguirValidando = false
        arrojarError('Dentro de la función filtrarPropiedades() debes crear una variable que debe guardar el elemento <h3> creado.');
       }
       if(!funFiltrarPropiedades.toString().includes('document.createElement("img")')){
           seguirValidando = false
        arrojarError('Dentro de la función filtrarPropiedades() debes crear una variable que debe guardar el elemento <img> creado.');
       }
       if(!funFiltrarPropiedades.toString().includes('document.createElement("p")')){
           seguirValidando = false
        arrojarError('Dentro de la función filtrarPropiedades() debes crear una variable que debe guardar el elemento <p> creado.');
       }
       if(!funFiltrarPropiedades.toString().includes('document.getElementById("listado")')){
           seguirValidando = false
        arrojarError('Dentro de la función filtrarPropiedades() debes buscar al elemento con id "listado" para agregar las propiedades obtenidas del array.');
       }

    //    if(!funFiltrarPropiedades.toString().includes('.appendChild(')){
    //        seguirValidando = false
    //         arrojarError('Dentro de la funcion filtrarPropiedades() debes agregar el elemento creado para ver las tarea obtenidas del array.')
            
    //     }
        var ocurrenciasFilter = (funFiltrarPropiedades.toString().match(/\.filter\(/g) || []).length;

        if (ocurrenciasFilter !== 3) {
        seguirValidando = false;
        arrojarError('Dentro de la función filtrarPropiedades() debes usar el método .filter() exactamente 3 veces. Recuerda que debes filtrar cada array que obtienes partiendo primero del de "propiedades"');
        }
    


        var ocurrencias = (funFiltrarPropiedades.toString().match(/\.appendChild\(/g) || []).length;

        if (ocurrencias !== 4) {
        seguirValidando = false;
        arrojarError('Dentro de la función filtrarPropiedades() debes usar el método .appendChild() exactamente 4 veces. Recuerda que la imagen y el subtítulo se agregan al elemento <div> creado por ti.');
        }
    }

    

    // const varAsigSrc = funFiltrarPropiedades.check('variableAssignment', 'document.getElementById("imagenJugador").src')
    // if(!varAsigSrc.exists){
    //     arrojarError('Dentro de la funcion filtrarPropiedades() debes capturar el atributo src del elemento imagen con id "imagenJugador" para modificarlo con la selección del usuario.')
    //     seguirValidando = false
    // }


    let textoEsperado;

 
    //Creo una función encargada de ejecutar la función del alumno con distintos valores: se encarga de limpiar los valores previos de la primera ejecución, introduce valores como respuesta del prompt, y también crea una expresión regular acorde a lo que se espera que se responda en este ejercicio

    function crearNuevaSimulacionPrompt(parDeValoresSimulados) {
        dhsAlertArray = []
        dhsPromptArray = []
        dhsPromptResponseSimulado = parDeValoresSimulados;
        // document.getElementById('actividad02').innerHTML = ""
        filtrarPropiedades()
        
        // textoEsperado = new RegExp('^El jugador ' + jugadoresTest[dhsPromptResponseSimulado - 1].nombre + ' tiene la camiseta número ' + jugadoresTest[dhsPromptResponseSimulado - 1].camiseta + ';?$');
    }


    //Creo la variable de valores que quiero usar para testear
    const propiedadesTest = [
  {
    direccion: "Avenida Dorrego 960",
    localidad: "caba",
    precio: 99000,
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_882703-MLA50174106805_062022-F.webp",
    destacada: true,
  },
  {
    direccion: "Avenida Rivadavia 15500",
    localidad: "oeste",
    precio: 195000,
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_770161-MLA50118376458_052022-F.webp",
    destacada: false,
  },
  {
    direccion: "Alcalde Rivas 339",
    localidad: "oeste",
    precio: 53000,
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_832089-MLA50119266256_052022-F.webp",
    destacada: true,
  },
  {
   direccion: "Juncal 335",
    localidad: "norte",
    precio: 169000,
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_748413-MLA50146801416_052022-F.webp",
    destacada: false,
  },
  {
    direccion: "San José 2300",
    localidad: "norte",
    precio: 95000,
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_665483-MLA50111651923_052022-F.webp",
    destacada: false,
  },
  {
    direccion: "17 De Agosto 1600",
    localidad: "oeste",
    precio: 74000, 
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_716620-MLA50147140786_052022-F.webp",
    destacada: false,
  },
  {
    direccion: "Las Flores 500",
    localidad: "sur",
    precio: 70000,
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_893472-MLA50146050180_052022-F.webp",
    destacada: false,
  },
  {
    direccion: "Aristobulo Del Valle 400",
    localidad: "sur",
    precio: 65000,
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_788954-MLA50108043586_052022-F.webp",
    destacada: true,
  },
  {
    direccion: "San Martín 1780",
    localidad: "sur",
    precio: 65000,
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_924554-MLA49766130105_042022-F.webp",
    destacada: true,
  },
];

    //Creo variables que me servirán de flags a la hora de testear los distintos casos, para acumular la cantidad de errores y mensajes con los casos con los que se probó y los resultados que se obtuvo para cada uno.
    let erroresValorH3 = []
    let erroresValorP = []
    let erroresValorImagen = []
    let erroresConcat = []
    let ordenCasos = ["A)", "B)", "C)", "D)","E"]

  

let valoresMinimos = [50000, 70000, 90000]; // Ejemplo de valores mínimos
let valoresMaximos = [100000, 170000, 200000]; // Ejemplo de valores máximos
let localidades = ["oeste", "sur", "norte"]; // Ejemplo de localidades
var primerFiltradoTest;
var segundoFiltradoTest;
var tercerFiltradoTest;
valoresMinimos.forEach(valorMinimo => {
  valoresMaximos.forEach(valorMaximo => {
    localidades.forEach(localidad => {
    document.getElementById("valor-minimo").value = valorMinimo
    document.getElementById("valor-maximo").value = valorMaximo
    document.getElementById("localidad").value = localidad
      primerFiltradoTest = propiedadesTest.filter(propiedad => propiedad.precio > valorMinimo);

      segundoFiltradoTest = primerFiltradoTest.filter(propiedad => propiedad.precio < valorMaximo);

      tercerFiltradoTest = segundoFiltradoTest.filter(propiedad => propiedad.localidad == localidad);
      
    });
  });
});



    //Si tiene los elementos básicos (prompts y alert) esperados para cumplir el objetivo, entro a probar casos
    if (seguirValidando) {
        let sectionAlumno = document.getElementById('listado')
        tercerFiltradoTest.forEach((parDeValores, contadorCasos) => {
            //Ejecuto la función que resetea y pushea distintos valores de prueba al código del alumno pasandole un par de valores del array de arrays
            
            crearNuevaSimulacionPrompt(parDeValores)
            
            //  logger.test(sectionAlumno.querySelector('article'))
            //  logger.test(parDeValores)
            let articleAlumno =  sectionAlumno.querySelector('article')
           

           let h3Alumno = articleAlumno.querySelector('h3')
           h3Alumno.innerHTML = parDeValores.direccion

           let imgSrc = articleAlumno.querySelector('img')
           imgSrc.setAttribute('src', parDeValores.imagen)

           let parrafoAlumno = articleAlumno.querySelector('p')
           parrafoAlumno.innerHTML = parDeValores.precio
           

            let urlSimulada = parDeValores.imagen

            // logger.test(imagenAlumno)
           
             //Seteo un texto base para errores
            let textoBaseErroresH3 = "CASO " + ordenCasos[contadorCasos] + " segun el array si ejecutamos mostraria en el subtítulo: " + parDeValores.direccion  + ". Pero el resultado obtenido es: "
            let textoBaseErroresP = "CASO " + ordenCasos[contadorCasos] + " segun el array si ejecutamos mostraria en el párrafo: " + parDeValores.precio  + ". Pero el resultado obtenido es: "

            // //Evalúo los distintos errores posibles:

            // //Si se que incluyó las dos variables, evalúo si el problema está en la operación (resultado)
            // // logger.test(!textoAlertado.match(textoEsperado))
            if (h3Alumno.innerHTML != parDeValores.direccion) {

                erroresValorH3.push(textoBaseErroresH3 + h3Alumno.innerHTML + " ❌")
            } else {
                erroresValorH3.push(textoBaseErroresH3 + h3Alumno.innerHTML + " ✅")
            }


            if (parrafoAlumno.innerHTML != parDeValores.precio) {

                erroresValorP.push(textoBaseErroresP + parrafoAlumno.innerHTML + " ❌")
            } else {
                erroresValorP.push(textoBaseErroresP + parrafoAlumno.innerHTML + " ✅")
            }

            if (imgSrc.getAttribute('src') != urlSimulada) {
                erroresValorImagen.push("CASO " + ordenCasos[contadorCasos] + ' Si el array tiene la url '+ parDeValores.imagen + ' la url deberia ser: '+ urlSimulada + ' pero en tu sitio se muestra: '+ imgSrc.getAttribute('src') + " ❌")
            } else {
                erroresValorImagen.push("CASO " + ordenCasos[contadorCasos] + ' Si el array tiene la url '+ parDeValores.imagen + ' la url deberia ser: '+ urlSimulada + ' pero en tu sitio se muestra: '+ imgSrc.getAttribute('src') + " ✅")
            }

        })

        //Chequeo si hubo errores en los casos
        let contadorErroresValor = 0
        let contadorErroresSub = 0
        erroresValorH3.forEach((error) => {
            if (error.includes("❌")) {
                contadorErroresSub +=1
                contadorErroresValor += 1
            }
        })

        //Si hubo al menos un error, mostramos los casos y sus resultados
        if (contadorErroresValor >= 1) {
            arrojarError("Revisa las tareas agregadas. Se probó tu código con los siguientes casos: ")
            mostrarErroresPruebas(erroresValorH3);
        }


        //Chequeo si hubo errores en los casos
        let contadorErroresValorP = 0
        let contadorErroresP = 0
        erroresValorP.forEach((error) => {
            if (error.includes("❌")) {
                contadorErroresP +=1
                contadorErroresValor += 1
            }
        })

        //Si hubo al menos un error, mostramos los casos y sus resultados
        if (contadorErroresSub == 0 && contadorErroresValorP >= 1) {
            arrojarError("Revisa las tareas agregadas. Se probó tu código con los siguientes casos: ")
            mostrarErroresPruebas(erroresValorP);
        }

        //Chequeo si hubo errores en los casos de imagen
        let contadorErroresValorImagen = 0
        erroresValorImagen.forEach((error) => {
            if (error.includes("❌")) {
                contadorErroresValorImagen += 1
            }
        })

        //Si hubo al menos un error, mostramos los casos y sus resultados

        if (contadorErroresSub == 0 && contadorErroresP == 0 && contadorErroresValorImagen >= 1) {
            arrojarError("Hay un error al modificar el src de la imagen. Se probó tu código JS con los siguientes casos: ")
            mostrarErroresPruebas(erroresValorImagen);
        }

    }

}

// it("Debes agregar el atributo onclick especificado para el elemento <button>", () => {
//     const attr = document.querySelector("body button").getAttribute("onclick")
//     expect(attr).to.match(/\s{0,2}filtrarPropiedades\s{0,2}\(\s{0,2}\);{0,2}\s{0,2}/)
// });

