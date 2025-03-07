import React, { useState, useContext } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { AuthContext } from "../context/AuthContext";
import { createPost } from "../services/postService";

export default function CreatePostScreen({ navigation }) {
    const { userToken } = useContext(AuthContext);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCreatePost = async () => {
        console.log("🔑 userToken actuel:", userToken);

        if (!userToken) {
            Alert.alert("Erreur", "Session expirée, reconnectez-vous.");
            return;
        }

        if (!title.trim() || !content.trim()) {
            Alert.alert("Erreur", "Le titre et le contenu ne peuvent pas être vides.");
            return;
        }

        setLoading(true);
        try {
            const result = await createPost(title, content, userToken);
            console.log("✅ Résultat création article:", result);
            Alert.alert("Succès", "Article créé avec succès !", [
                { text: "OK", onPress: () => navigation.navigate("Home") }
            ]);
        } catch (error) {
            console.error("❌ Erreur création article:", error.message);
            Alert.alert("Erreur", "Impossible de créer l'article : " + error.message);
        } finally {
            setLoading(false);
        }
    };



    return (
        <View style={styles.container}>
            <Text variant="headlineMedium" style={styles.title}>📝 Créer un article</Text>
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
            <Button mode="contained" onPress={handleCreatePost} loading={loading} disabled={loading} style={styles.button}>
                Publier
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
});
