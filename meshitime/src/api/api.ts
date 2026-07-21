import axios from "axios";
const IP_ADDRESS = "10.109.0.35"; // 自分のIPアドレスに変更
const PORT = "3000";
const BASE_URL = `http://${IP_ADDRESS}:${PORT}`;

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;