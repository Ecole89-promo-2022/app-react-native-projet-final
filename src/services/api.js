import axios from "axios";
import { Platform } from "react-native";

// Vérification de l'environnement

const API_URL = "http://10.89.60.86:3000";
// const API_URL = "http://192.168.0.22:3000";

export const api = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" },
});
