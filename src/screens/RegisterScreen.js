import React, { useState, useContext, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { AuthContext } from "../context/AuthContext";

export default function RegisterScreen({ navigation }) {
    const { register, userToken } = useContext(AuthContext);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (userToken) {
            navigation.replace("Home");
        }
    }, [userToken]);

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert("Erreur", "Tous les champs sont requis.");
            return;
        }

        const response = await register(email, password, name);

        console.log("📡 Réponse API après inscription :", response);

        if (response?.message?.includes("a été créé")) {
            navigation.navigate("Home"); // ✅ Redirection vers Login au lieu de Home
        } else {
            Alert.alert("Erreur", "L'inscription a échoué.");
        }
    };






    return (
        <View style={styles.container}>
            <Text variant="headlineMedium">Inscription</Text>
            <TextInput label="Nom" value={name} onChangeText={setName} style={styles.input} />
            <TextInput label="Email" value={email} onChangeText={setEmail} style={styles.input} />
            <TextInput label="Mot de passe" value={password} secureTextEntry onChangeText={setPassword} style={styles.input} />
            <Button mode="contained" onPress={handleRegister}>S'inscrire</Button>
            <Button onPress={() => navigation.navigate("Login")}>Déjà inscrit ? Se connecter</Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 20 },
    input: { marginBottom: 10 },
});
