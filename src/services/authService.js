import axios from "axios";

export const API_URL = "http://10.89.60.97:3000"; // Modifier selon l'URL de ton API
// export const API_URL = "http://192.168.0.22:3000"; // Modifier selon l'URL de ton API

export const loginUser = async (email, password) => {
    try {
        console.log("🛠️ Envoi de la requête login à :", `${API_URL}/user/login`);

        const response = await axios.post(`${API_URL}/user/login`, { email, password });

        console.log("✅ Réponse API login :", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Erreur lors du login :", error.response?.data || error);
        return null;
    }
};


export const registerUser = async (email, password, name) => {
    try {
        const response = await axios.post(`${API_URL}/user/new`, { name, email, password });

        console.log("✅ Réponse API register :", response.data); // Log de la réponse
        return response.data;
    } catch (error) {
        console.error("❌ Erreur lors de l'inscription :", error.response?.data || error);
        return null;
    }
};

export const getProfile = async () => {
    try {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) throw new Error("Token non disponible");

        const response = await axios.get(`${API_URL}/user/monprofil`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération du profil :", error);
        throw error;
    }
};

export const getAllPosts = async () => {
    try {
        const url = `${API_URL}/post/all`;
        console.log("📤 Requête API vers :", url); // Vérification ici
        const response = await axios.get(url);
        console.log("✅ Articles reçus :", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des articles :", error.response?.data || error);
        return [];
    }
};

