import React, { useEffect, useState, useContext } from "react";
import { View, StyleSheet, FlatList, ActivityIndicator, Modal, Alert } from "react-native";
import { Appbar, Button, Text, List, TextInput, FAB } from "react-native-paper";
import { AuthContext } from "../context/AuthContext";
import { getAllPosts } from "../services/authService";
import { createPost, deletePost } from "../services/postService"; // correction ici

export default function HomeScreen({ navigation }) {
    const { logout, userToken } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    // Déplacer fetchPosts ici pour qu'elle soit accessible globalement
    const fetchPosts = async () => {
        setLoading(true);
        try {
            const data = await getAllPosts();
            setPosts(data?.data || []);
        } catch (error) {
            Alert.alert("Erreur", "Impossible de charger les articles : " + error.message);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchPosts();
    }, []);

    const handleLogout = async () => {
        await logout();
        navigation.replace("Login");
    };

    const handleCreatePost = async () => {
        if (!title.trim() || !content.trim()) {
            Alert.alert("Erreur", "Le titre et le contenu ne peuvent pas être vides.");
            return;
        }

        setLoading(true);
        try {
            const result = await createPost(title, content, userToken);
            if (result) {
                Alert.alert("Succès", "Article créé avec succès !", [
                    {
                        text: "OK",
                        onPress: async () => {
                            setModalVisible(false);
                            setTitle("");
                            setContent("");
                            await fetchPosts();
                        }
                    }
                ]);
            } else {
                Alert.alert("Erreur", "Impossible de créer l'article. Veuillez réessayer.");
            }
        } catch (error) {
            Alert.alert("Erreur", "Impossible de créer l'article : " + error.message);
        } finally {
            setLoading(false); // 🔥 indispensable ici
        }
    };


    const handleDeletePost = async (postId) => {
        const result = await deletePost(postId, userToken);
        if (result) {
            Alert.alert("Succès", "L'article a été supprimé.");
            fetchPosts(); // 🔥 Actualiser la liste des articles après suppression
        } else {
            Alert.alert("Erreur", "Impossible de supprimer l'article.");
        }
    };


    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.appbar}>
                <Appbar.Content title="🏠 Home" />
                <Appbar.Action icon="account" onPress={() => navigation?.navigate("Profile")} />
                <Appbar.Action icon="account-group" onPress={() => navigation?.navigate("UserList")} />
                <Appbar.Action icon="logout" onPress={handleLogout} />
            </Appbar.Header>

            <View style={styles.content}>
                <Text variant="headlineMedium" style={styles.title}>📰 Articles récents</Text>

                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <FlatList
                        data={posts}
                        keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
                        renderItem={({ item }) => (
                            <List.Item
                                title={item?.title || "Article sans titre"}
                                description={item?.content?.substring(0, 100) + (item?.content?.length > 100 ? "..." : "") || "Pas de contenu"}
                                left={() => <List.Icon icon="newspaper" />}
                                onPress={() => navigation.navigate("PostDetail", { postId: item.id })}
                            />
                        )}
                    />
                )}
            </View>

            {/* Bouton flottant pour créer un article */}
            <View style={styles.fabContainer}>
                <FAB
                    icon="pencil"
                    label="Nouveau Post"
                    color="#fff"
                    style={styles.fab}
                    onPress={() => setModalVisible(true)}
                />
            </View>

            {/* MODAL POUR CRÉER UN ARTICLE */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
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
                        <Button mode="contained" onPress={handleCreatePost} style={styles.button}>
                            Publier
                        </Button>
                        <Button onPress={() => setModalVisible(false)} style={styles.closeButton}>Annuler</Button>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    appbar: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        elevation: 4,
        zIndex: 1000,
    },
    content: {
        flex: 1,
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    fabContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        padding: 20,
    },
    fab: {
        backgroundColor: "#6200ea",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        width: "90%",
        padding: 20,
        backgroundColor: "white",
        borderRadius: 10,
    },
    input: {
        marginBottom: 10,
    },
    inputMultiline: {
        marginBottom: 10,
        height: 100,
    },
    button: {
        marginTop: 10,
    },
    closeButton: {
        marginTop: 10,
    },
});
