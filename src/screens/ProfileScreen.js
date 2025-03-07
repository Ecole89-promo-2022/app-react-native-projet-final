import React, { useEffect, useState, useContext } from "react";
import { View, StyleSheet, FlatList, Image } from "react-native";
import { Text, Button, ActivityIndicator, Avatar } from "react-native-paper";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { API_URL } from "../services/authService";

export default function ProfileScreen({ navigation }) {
    const { userToken, logout } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleLogout = async () => {
        await logout();
        navigation.replace("Login");
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${API_URL}/user/monprofil`, {
                    headers: { Authorization: `Bearer ${userToken}` },
                });

                setProfile(response.data.data);
                console.log("✅ Profil chargé :", response.data.data);
            } catch (error) {
                setError("Impossible de récupérer le profil.");
            } finally {
                setLoading(false);
            }
        };

        const fetchUserPosts = async () => {
            try {
                const response = await axios.get(`${API_URL}/post/all`, {
                    headers: { Authorization: `Bearer ${userToken}` },
                });

                // Filtrer les posts de l'utilisateur
                const userPosts = response.data.data.filter(post => post.userId === profile?.id);
                setPosts(userPosts);
            } catch (error) {
                console.error("❌ Erreur lors de la récupération des posts :", error);
            }

        };



        fetchProfile();
        fetchUserPosts();
    }, [userToken]);

    return (
        <View style={styles.container}>
            <View style={styles.header} />
            <View style={styles.profileCard}>
                <Avatar.Text size={80} label={profile?.name?.charAt(0).toUpperCase()} style={styles.avatar} />
                <Text style={styles.name}>{profile?.name}</Text>
                <Text style={styles.email}>{profile?.email}</Text>
                <View style={styles.statsContainer}>
                    <View style={styles.stat}>
                        <Text style={styles.statNumber}>{posts.length}</Text>
                        <Text style={styles.statLabel}>Posts</Text>
                    </View>
                    <View style={styles.stat}>
                        <Text style={styles.statNumber}>{profile?.isAdmin ? "Admin" : "User"}</Text>
                        <Text style={styles.statLabel}>Rôle</Text>
                    </View>
                    <View style={styles.stat}>
                        <Text style={styles.statNumber}>{new Date(profile?.createdAt).toLocaleDateString()}</Text>
                        <Text style={styles.statLabel}>Inscription</Text>
                    </View>
                </View>
                <Button
                    mode="contained"
                    icon="pencil"
                    style={styles.createPostButton}
                    onPress={() => navigation.navigate("CreatePost")}
                >
                    Créer un article
                </Button>
                <Button
                    mode="contained"
                    icon="logout"
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                    Déconnexion
                </Button>
            </View>

            <Text style={styles.sectionTitle}>Mes articles</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#6200ea" />
            ) : error ? (
                <Text style={styles.error}>{error}</Text>
            ) : (
                <FlatList
                    data={posts}
                    keyExtractor={(item) => item?.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.postItem}>
                            <Text style={styles.postTitle}>{item.title}</Text>
                            <Text style={styles.postDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                            <Text style={styles.postContent} numberOfLines={2}>{item.content}</Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    header: {
        height: 100,
        backgroundColor: "#6200ea",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    profileCard: {
        backgroundColor: "white",
        marginHorizontal: 20,
        marginTop: -50,
        borderRadius: 15,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    avatar: {
        backgroundColor: "#6200ea",
    },
    name: {
        fontSize: 22,
        fontWeight: "bold",
        marginTop: 10,
    },
    email: {
        fontSize: 16,
        color: "gray",
    },
    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        marginTop: 15,
    },
    stat: {
        alignItems: "center",
    },
    statNumber: {
        fontSize: 18,
        fontWeight: "bold",
    },
    statLabel: {
        fontSize: 14,
        color: "gray",
    },
    createPostButton: {
        marginTop: 15,
        width: "100%",
        backgroundColor: "#6200ea",
    },
    logoutButton: {
        marginTop: 10,
        width: "100%",
        backgroundColor: "red",
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 20,
        marginTop: 20,
    },
    postItem: {
        backgroundColor: "white",
        marginHorizontal: 20,
        marginVertical: 10,
        padding: 15,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    postTitle: {
        fontSize: 16,
        fontWeight: "bold",
    },
    postDate: {
        fontSize: 12,
        color: "gray",
        marginBottom: 5,
    },
    postContent: {
        fontSize: 14,
        color: "#333",
    },
    error: {
        color: "red",
        textAlign: "center",
        marginTop: 20,
    },
});

