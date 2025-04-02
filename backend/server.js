import express from "express";
import { MercadoPagoConfig, Preference } from "mercadopago"; // ✅ Correção aqui
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
// const bodyParser = require("body-parser");
// import bodyParser from "body-parser";
// import mercadopago from "mercadopago";
// import { v4 as uuidv4 } from "uuid";
//import { processPayment } from './controllers/paymentController';

import { Payment } from "mercadopago";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: "*", // Ou especifique o domínio do frontend
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
let currentExternalId = null; // Armazena o último external_id recebido
let currentStatus = null; // Armazena o status do último pagamento

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const apiUrl = process.env.PIXUP_API_URL;

if (!clientId || !clientSecret || !apiUrl) {
  throw new Error("CLIENT_ID, CLIENT_SECRET ou PIXUP_API_URL não definidos no .env");
}

// Codifica as credenciais em Base64
const base64Credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

// Função para obter o token de acesso
async function getAccessToken() {
  try {
    const authResponse = await axios.post("https://api.pixupbr.com/v2/oauth/token", {}, {
      headers: {
        accept: "application/json",
        Authorization: `Basic ${base64Credentials}`,
      },
    });
    console.log('Token de acesso obtido:', authResponse.data.access_token);
    return authResponse.data.access_token;
  } catch (error) {
    console.error("Erro ao obter o token de acesso:", error.response?.data || error.message);
    throw new Error("Erro ao obter token");
  }
}

// Endpoint para processar pagamento
app.post("/process_payment", async (req, res) => {
  try {
    const { transaction_amount, description, payer, postbackUrl } = req.body; // Recebe postbackUrl do front
    console.log(payer)
    const external_id = `pedido_${Date.now()}`;
    // Dados do pagamento
    const paymentData = {
      amount: transaction_amount,
      external_id,
      postbackUrl: postbackUrl || process.env.POSTBACK_URL, // Usa postbackUrl do front
      payerQuestion: description,
      payer: {
        name: payer.name,
        document: payer.identification?.number ? payer.identification.number.replace(/\D/g, '') : null, // Remove formatação do CPF
        email: payer.email,
      },
      calendar: {
        expiration: 86400 // Expira em 24 horas (86400 segundos)
      }
    };

    // Obter o token de acesso
    const accessToken = await getAccessToken();
    console.log(paymentData)
    console.log("WEB HOOK",paymentData.postbackUrl)
    console.log("Payer",paymentData.payer)
    // Criar pagamento no PixUp
    const paymentResponse = await axios.post("https://api.pixupbr.com/v2/pix/qrcode", paymentData, {
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("Resposta do PixUp:", paymentResponse.data);
    currentExternalId = external_id;
    currentStatus = "PENDING";
    
    // Responder ao front-end com os dados do pagamento
    return res.json({
      id: external_id,// ID usado para consultas
      status:paymentResponse.data.status,
      qr_code: paymentResponse.data.qrcode,
    });
  } catch (error) {
    console.error("Erro ao processar pagamento:", error.response?.data || error.message);
    res.status(500).json({
      error: error.message || "Erro no processamento",
      details: error.response?.data,
    });
  }
});

app.post("/webhook", async (req, res) => {
  try {
    const { external_id, status } = req.body.requestBody;

    if (!external_id || !status) {
      console.error("Dados incompletos:", req.body);
      return res.status(400).send("Dados inválidos");
    }

    console.log("Recebido webhook:", req.body);

    // Armazena apenas o último external_id e seu status correspondente
    currentExternalId = external_id;
    currentStatus = status;

    console.log(`Último pagamento atualizado: ${currentExternalId} com status: ${currentStatus}`);
    res.sendStatus(200);
  } catch (error) {
    console.error("Erro no webhook:", error);
    res.sendStatus(500);
  }
});

app.get("/payment_status", async (req, res) => {
  
  try {
    if (!currentExternalId || !currentStatus) {
      console.log("Nenhum pagamento registrado ainda.");
      return res.status(404).json({ error: "Nenhum pagamento registrado" });
    }

    console.log("Último pagamento recuperado:", currentExternalId);
    console.log("Consulta de pagamento com ID:", req.query.external_id);
    res.json({ external_id: currentExternalId, status: currentStatus }); // Retorna o external_id e o status
  } catch (error) {
    console.error("Erro ao verificar status:", error);
    res.status(500).json({ error: "Erro ao verificar status do pagamento" });
  }
});

// console.log("Access Token:", process.env.MERCADO_PAGO_ACCESS_TOKEN);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));