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

const bodyActividad = document.querySelector("body");

//Valido que haya un body
if(bodyActividad == null){
  seguirValidando = false
  arrojarError('Dentro de tu html, debes tener un <body>. Revisa no haberlo borrado.')
}
else{
//Validar que exista el button
  const buttonAlu = validarElemento(bodyActividad, "button", 'Dentro del body, debes tener el elemento <button>. Revisa no haberlo borrado.')

    //Si el button existe, entro a validar
    if(buttonAlu){
        //Validar que el button tenga atributo onclick
        if (buttonAlu.getAttribute("onclick") == null) {
            seguirValidando = false
            arrojarError('El elemento button debe tener el atributo "onclick". Si ya lo colocaste, revisa haberlo escrito correctamente.')
        }
        //Validar que el button tenga en su atributo onclick el valor esperado: consultarAlaApi()
        else if(buttonAlu.getAttribute("onclick") != "consultarAlaApi()") {
            seguirValidando = false
            arrojarError('El elemento button debe tener en su atributo onclick el valor "consultarAlaApi()". Si ya lo colocaste, revisa haberlo escrito correctamente.')
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

const funConsultarAlaApi = check("functionDeclaration", "consultarAlaApi");
// logger.test(funConsultarAlaApi)

if (!funConsultarAlaApi.exists) {
    arrojarError("Debes tener la función llamada consultarAlaApi() declarada en tu codigo")
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
    // try {

    //     consultarAlaApi()
    // } catch (e) {
    //     arrojarError("Hay un error de sintaxis: " + e.message)
    // }




    if(!funConsultarAlaApi.toString().includes('https://www.themealdb.com/api/json/v1/1/categories.php')){
           seguirValidando = false
        arrojarError('Dentro de la función consultarAlaApi() crear una variable que almacene la url propuesta en la consigna');
       }
    if(!funConsultarAlaApi.toString().includes('datos.categories[')){
           seguirValidando = false
        arrojarError('Dentro de la función consultarAlaApi() debes buscar las categorias e indicar la posicion del elemento');
       }


    var ocurrenciasFilter = (funConsultarAlaApi.toString().match(/console.log\(/g) || []).length;

        if (ocurrenciasFilter !== 2) {
        seguirValidando = false;
        arrojarError('Dentro de la función consultarAlaApi() debes usar 2 console.log para mostrar el valor del título (strCategory) e imagen (strCategoryThumb) en cada uno.');
        }
}

// it("Debes tener la funcion consultarAlaApi() en el atributo onclick para el elemento <button>", () => {
//     const attr = document.querySelector("body button").getAttribute("onclick")
//     expect(attr).to.match(/\s{0,2}consultarAlaApi\s{0,2}\(\s{0,2}\);{0,2}\s{0,2}/)
// });

