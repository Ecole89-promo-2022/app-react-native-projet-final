import React, { useState, useContext, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { AuthContext } from "../context/AuthContext";

export default function LoginScreen({ navigation }) {
    const { login, userToken } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (userToken) {
            navigation.replace("Home");
        }
    }, [userToken, navigation]);

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert("Erreur", "Veuillez renseigner tous les champs.");
            return;
        }

        setLoading(true);
        const userData = await login(email, password);
        setLoading(false);

        if (userData?.token) {
            navigation.replace("Home"); // Utiliser replace pour éviter le retour arrière vers Login
        } else {
            Alert.alert("Erreur", "Email ou mot de passe incorrect.");
        }
    };

    return (
        <View style={styles.container}>
            <Text variant="headlineMedium">Connexion</Text>
            <TextInput
                label="Email"
                value={email}
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={setEmail}
                style={styles.input}
            />
            <TextInput
                label="Mot de passe"
                value={password}
                secureTextEntry
                onChangeText={setPassword}
                style={styles.input}
            />
            <Button mode="contained" onPress={handleLogin} loading={loading}>
                Se connecter
            </Button>
            <Button onPress={() => navigation.navigate("Register")}>
                Créer un compte
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 20 },
    input: { marginBottom: 10 },
});
