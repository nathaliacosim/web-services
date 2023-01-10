// const axios = require('axios')

const statusEl = document.getElementById("status");
const dataEl = document.getElementById("data");
const _download = document.getElementById("download");
const instance = axios.create({
  baseURL: "https://pessoal.betha.cloud/service-layer/v1/api",
  headers: {
    "Content-Type": "application/json",
    // 'Access-Control-Allow-Origin': "*",
    // 'Access-Control-Allow-Headers': "*",
    // 'Access-Control-Allow-Credentials': true,
    "Access-Control-Allow-Methods": "*",
  },
  withCredentials: false,
  // proxy: {
  //     protocol: 'http',
  //     host: '127.0.0.1',
  //     // hostname: '127.0.0.1' // Takes precedence over 'host' if both are defined
  //     port: 5502
  // }

  // proxy: {
  //     protocol: 'http',
  //     host: '127.0.0.1',
  //     port: 5502
  //   },
});

let conteudoFormatado = null;

const get = () => {
  console.log("clicked");
  // if(window.localStorage.getItem("tokenWS")){
  //     if(document.querySelector('#token').value != '' && document.querySelector('#token').value != window.localStorage.getItem("tokenWS")){
  //         window.localStorage.setItem("tokenWS", (document.querySelector('#token').value))
  //     } else {
  //         window.localStorage.getItem("tokenWS")
  //     }
  // } else {
  //     if(document.querySelector('#token').value == ''){
  //         alert("Token não encontrado.")
  //     } else {
  //         window.localStorage.setItem("tokenWS", (document.querySelector('#token').value))
  //     }
  // }

  // if(!window.localStorage.getItem("tokenWS").toLowerCase().includes("bearer")){
  //     const aux = "Bearer " + document.querySelector('#token').value
  //     window.localStorage.setItem("tokenWS", aux)
  // }

  //const tokenWS = tokenLocal ? tokenLocal : document.querySelector('#token').value;
  const indexServico = document.querySelector("#urlService").value;
  const bearer = document.querySelector("#token").value;

  // instance.defaults.baseURL = indexServico;

  console.log("Índice selecionado no combobox de serviços: ", indexServico);

  axios
    .get(`/api/${indexServico}/${bearer}`)
    .then((response) => renderOutput(response))
    .catch(function (error) {
      if (error.response) {
        renderOutput(error.response);
      } else if (error.request) {
        const objReq = {
          data: "Requisição inválida",
          status: 404,
        };
        renderOutput(objReq);
      } else {
        console.log("Error", error.message);
      }
      console.log(error.config);
    });
};

const clear = () => {
  statusEl.innerHTML = "";
  statusEl.className = "";
  dataEl.innerHTML = "";
};

const renderOutput = (response) => {
  // Status
  const status = response.status ? response.status : 404;
  statusEl.removeAttribute("class");
  let statusElClass =
    "inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium";
  if (status >= 500) {
    statusElClass += " bg-red-100 text-red-800";
  } else if (status >= 400) {
    statusElClass += " bg-yellow-100 text-yellow-800";
  } else if (status >= 200) {
    statusElClass += " bg-green-100 text-green-800";
  }

  statusEl.innerHTML = status;
  statusEl.className = statusElClass;

  // Data
  conteudoFormatado = JSON.stringify(response.data, null, 2);
  dataEl.innerHTML = conteudoFormatado;
  console.log(hljs);
  hljs.highlightElement(dataEl);

  if (dataEl) {
    enableBtn();
  }
};

function enableBtn() {
  const butt = document.querySelector("#download");
  butt.disabled = false;
  butt.className =
    "inline-flex text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800";
}

const downloadClick = () => {
  var arquivo = conteudoFormatado;
  var nomeArquivo = "consulta_folha";

  let element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(arquivo)
  );
  element.setAttribute("download", nomeArquivo + ".json");
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

document.getElementById("get").addEventListener("click", get);
document.getElementById("download").addEventListener("click", downloadClick);
