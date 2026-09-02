import axios from "axios";
const IP_ADDRESS = "192.168.11.22"; // 自分のIPアドレスに変更
const PORT = "3000";
const BASE_URL = `http://${IP_ADDRESS}:${PORT}`;

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;