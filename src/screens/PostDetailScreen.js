import React, { useEffect, useState, useContext } from "react";
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, Alert } from "react-native";
import { Button } from "react-native-paper";
import axios from "axios";
import { deletePost, getUserById } from "../services/postService";
import { API_URL } from "../services/authService";
import { AuthContext } from "../context/AuthContext";

export default function PostDetailScreen({ route, navigation }) {
    const { postId } = route.params;
    const { user, userToken } = useContext(AuthContext);
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [authorName, setAuthorName] = useState("Auteur inconnu");

    useEffect(() => {
        const fetchPost = async () => {
            try {
                console.log(`📥 Chargement de l'article ${postId}...`);
                const response = await axios.get(`${API_URL}/post/${postId}`);
                console.log("✅ Article chargé :", response.data.data);
                setPost(response.data.data);
            } catch (err) {
                setError("Impossible de charger l'article.");
                console.error("❌ Erreur lors du chargement :", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [postId]);

    useEffect(() => {
        const fetchAuthor = async () => {
            if (!post?.userId) return;

            const name = await getUserById(post.userId, user, userToken); // passe l'utilisateur actuel
            setAuthorName(name);
            console.log("👤 Nom de l'auteur récupéré :", name);
        };

        fetchAuthor();
    }, [post?.userId, user, userToken]);


    const handleDeletePost = async () => {
        if (!postId) {
            Alert.alert("Erreur", "ID de l'article invalide !");
            return;
        }
        console.log("🛠️ ID de l'article à supprimer :", postId);

        Alert.alert(
            "Confirmation",
            "Voulez-vous vraiment supprimer cet article ?",
            [
                {
                    text: "Annuler",
                    style: "cancel"
                },
                {
                    text: "Supprimer",
                    onPress: async () => {
                        const isAdmin = user?.isAdmin || false;
                        const success = await deletePost(postId, isAdmin, userToken);
                        if (success) {
                            Alert.alert("Succès", "Article supprimé !");
                            navigation.navigate("Home"); // Retour accueil après suppression
                        } else {
                            Alert.alert("Erreur", "Impossible de supprimer l'article.");
                        }
                    },
                    style: "destructive"
                }
            ]
        );
    };

    return (
        <ScrollView style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#6200ee" />
            ) : error ? (
                <Text style={styles.error}>{error}</Text>
            ) : (
                <>
                    <Text style={styles.title}>{post?.title}</Text>
                    <Text style={styles.date}>🗓 {new Date(post?.createdAt).toLocaleDateString()}</Text>
                    <Text style={styles.author}>👤 Auteur : {authorName}</Text>
                    <Text style={styles.content}>{post?.content}</Text>
                </>
            )}

            <Button mode="contained" onPress={() => navigation.goBack()} style={styles.button}>
                Retour
            </Button>

            {/* Bouton de suppression visible uniquement si user est admin ou userId == user.id */}
            {(user?.isAdmin || post?.userId === user?.id) && (
                <Button mode="contained" onPress={handleDeletePost} style={styles.deleteButton}>
                    Supprimer l'article
                </Button>
            )}
            {(user?.isAdmin || post?.userId === user?.id) && (
                <Button
                    mode="contained"
                    onPress={() => navigation.navigate("EditPost", { postId })}
                    style={{ marginTop: 10 }}
                >
                    Modifier l'article
                </Button>
            )}

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
    date: { fontSize: 14, color: "gray", marginBottom: 10 },
    author: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
    content: { fontSize: 16, lineHeight: 24 },
    button: { marginTop: 20 },
    deleteButton: {
        marginTop: 10,
        backgroundColor: "red",
    },
    error: { color: "red", textAlign: "center", marginVertical: 20 },
});
