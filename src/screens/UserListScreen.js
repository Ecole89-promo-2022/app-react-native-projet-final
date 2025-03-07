import React, { useEffect, useState, useContext } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Text, Button, List } from "react-native-paper";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { API_URL } from "../services/authService";

export default function UserListScreen({ navigation }) {
    const { userToken } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${API_URL}/user/all`, {
                    headers: { Authorization: `Bearer ${userToken}` },
                });
                setUsers(response.data.data);
            } catch (error) {
                setError("Accès refusé : Vous devez être administrateur.");
                console.error("Erreur lors de la récupération des utilisateurs :", error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <View style={styles.container}>
            <Text variant="headlineMedium">👥 Liste des Utilisateurs</Text>

            {error ? (
                <Text style={styles.error}>{error}</Text>
            ) : (
                <FlatList
                    data={users}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <List.Item
                            title={item.name}
                            description={item.isAdmin ? "Admin" : "Utilisateur"}
                            left={(props) => <List.Icon {...props} icon={item.isAdmin ? "shield-check" : "account"} />}
                        />
                    )}
                />
            )}

            <Button mode="contained" onPress={() => navigation.goBack()} style={styles.button}>
                Retour
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    button: { marginTop: 20 },
    error: { color: "red", textAlign: "center", marginVertical: 20 },
});
