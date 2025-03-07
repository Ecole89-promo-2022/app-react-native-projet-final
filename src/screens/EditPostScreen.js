import React, { useEffect, useState, useContext } from "react";
import { View, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { API_URL } from "../services/authService";

export default function EditPostScreen({ route, navigation }) {
    const { postId } = route.params;
    const { user, userToken } = useContext(AuthContext);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`${API_URL}/post/${postId}`);
                setTitle(response.data.data.title);
                setContent(response.data.data.content);
            } catch (error) {
                Alert.alert("Erreur", "Impossible de charger l'article.");
            } finally {
                setInitialLoading(false);
            }
        };
        fetchPost();
    }, [postId]);

    const handleEditPost = async () => {
        if (!title.trim() || !content.trim()) {
            Alert.alert("Erreur", "Le titre et le contenu ne peuvent pas être vides.");
            return;
        }

        setLoading(true);
        const routeAPI = user.isAdmin
            ? `${API_URL}/post/update/${postId}`
            : `${API_URL}/post/updateOwnPost/${postId}`;

        try {
            await axios.put(routeAPI, { title, content }, {
                headers: { Authorization: `Bearer ${userToken}` },
            });

            Alert.alert("Succès", "L'article a été modifié avec succès !", [
                { text: "OK", onPress: () => navigation.navigate("Home") }
            ]);
        } catch (error) {
            console.error("Erreur modification :", error.response?.data || error.message);
            Alert.alert("Erreur", "Échec de la modification : " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return <ActivityIndicator size="large" style={{ flex: 1 }} />;
    }

    return (
        <View style={styles.container}>
            <Text variant="headlineMedium" style={styles.title}>✏️ Modifier l'article</Text>

            <TextInput
                label="Titre"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
            />
            <TextInput
                label="Contenu"
                value={content}
                onChangeText={setContent}
                multiline
                numberOfLines={5}
                style={styles.inputMultiline}
            />
            <Button mode="contained" onPress={handleEditPost} loading={loading} style={styles.button}>
                Modifier
            </Button>
            <Button onPress={() => navigation.goBack()} style={styles.buttonCancel}>
                Annuler
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: "center" },
    title: { textAlign: "center", marginBottom: 20 },
    input: { marginBottom: 10 },
    inputMultiline: { marginBottom: 10, height: 100 },
    button: { marginTop: 10 },
    buttonCancel: { marginTop: 10, backgroundColor: "#ccc" },
});
