const express = require("express");
const app = express();
const path = require("path");
const axios = require("axios");

app.use("/", express.static(path.join(__dirname, "public")));

console.log(__dirname);

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.get("/api/:id", async (req, res) => {
  return res.status(404).send({ texto: "Token não informado" });
});

app.get("/api/:id/:bearer", async (req, res) => {
  const { id, bearer } = req.params;

  console.log(
    "Índice passado como parâmetro de rota selecionado no combobox de serviços: ",
    id
  );

  if (isNaN(id) || (id < 0 && id > 8)) {
    return res.status(404).send({ texto: "URL inválida" });
  }

  if (!bearer) {
    return res.status(404).send({ texto: "Token não informado" });
  }

  const urls = [
    "https://pessoal.betha.cloud/service-layer/v1/api/pessoa/resumido",
    "https://pessoal.betha.cloud/service-layer/v1/api/matricula/resumido",
    "https://pessoal.betha.cloud/service-layer/v1/api/cargo/resumido",
    "https://pessoal.betha.cloud/service-layer/v1/api/ato/resumido",
    "https://pessoal.betha.cloud/service-layer/v1/api/matricula/14354971",
    "https://pessoal.betha.cloud/service-layer/v1/api/concurso?offset=0&limit=50",
    "https://pessoal.betha.cloud/service-layer/v1/api/feriado?offset=0&limit=10",
    "https://pessoal.betha.cloud/service-layer/v1/api/organograma?offset=0&limit=10",
    "https://pessoal.betha.cloud/service-layer/v1/api/jornada-trabalho?offset=0&limit=10",
    "https://pessoal.betha.cloud/service-layer/v1/api/diaria?offset=0&limit=10",
    "https://api.protocolo.betha.cloud/protocolo/service-layer/v1/api/pessoatelefone/19075137",
  ];

  try {
    const { data } = await axios.get(urls[id], {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Methods": "*",
        Authorization: `Bearer ${bearer}`,
      },
    });

    res.send(data);
  } catch {
    res.status(404).send({ texto: "Requisição inválida" });
  }
});

// app.listen(8080, () => console.log("Running on port 8080"));

app.listen(process.env.PORT || 3000);

module.exports = app;
