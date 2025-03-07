import axios from "axios";
import { API_URL } from "../services/authService";

// Récupérer tous les posts
export const getAllPosts = async () => {
    try {
        const url = `${API_URL}/post/all`;
        console.log("📤 Requête API vers :", url);
        const response = await axios.get(url);
        console.log("✅ Articles reçus :", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des articles :", error.response?.data || error);
        return [];
    }
};

// Créer un post
export const createPost = async (title, content, token) => {
    try {
        const url = `${API_URL}/post/new`;
        const response = await axios.post(url, { title, content }, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        console.log("✅ Article créé :", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Erreur API createPost :", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Erreur réseau ou serveur");
    }
};


// Supprimer un post (admin => /delete/:id, auteur => /deleteOwnPost/:id)
export const deletePost = async (postId, isAdmin, token) => {
    try {
        const route = isAdmin ? "delete" : "deleteOwnPost";
        const url = `${API_URL}/post/${route}/${postId}`;
        console.log("🛠️ Suppression de l'article :", url);

        const response = await axios.delete(url, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200 || response.status === 204) {
            console.log("✅ Article supprimé !");
            return true;
        }
        return false;
    } catch (error) {
        console.error("❌ Erreur lors de la suppression de l'article :", error.response?.data || error);
        return false;
    }
};

// Récupérer l'auteur du post
export const getUserById = async (userId, user, token) => {
    try {
        if (!user?.isAdmin) {
            // Si l'utilisateur n'est pas admin, inutile d'appeler l'API, retourne directement :
            return "Auteur inconnu";
        }

        const url = `${API_URL}/user/all`;
        const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const users = response.data?.data;
        const author = users?.find(u => u.id === userId);
        return author?.name || "Auteur inconnu";
    } catch (error) {
        console.error("Erreur récupération auteur:", error);
        return "Auteur inconnu";
    }
};
