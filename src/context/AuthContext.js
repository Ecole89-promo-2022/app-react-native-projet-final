import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL, loginUser, registerUser } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userToken, setUserToken] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(true);

    useEffect(() => {
        const loadUserData = async () => {
            const storedUser = await AsyncStorage.getItem("user");
            const storedToken = await AsyncStorage.getItem("userToken");
            if (storedUser && storedToken) {
                setUser(JSON.parse(storedUser));
                setUserToken(storedToken);
            }
            setLoadingAuth(false);
        };
        loadUserData();
    }, []);

    const login = async (email, password) => {
        const userData = await loginUser(email, password);
        if (userData?.token) {
            await AsyncStorage.setItem("userToken", userData.token);
            setUserToken(userData.token);

            // ⚠️ Récupération du profil utilisateur immédiatement après login
            const profile = await fetchProfile(userData.token);
            if (profile) {
                await AsyncStorage.setItem("user", JSON.stringify(profile));
                setUser(profile);
            }
        }
        return userData;
    };

    const register = async (email, password, name) => {
        const userData = await registerUser(email, password, name);
        if (userData?.token) {
            await AsyncStorage.setItem("userToken", userData.token);
            setUserToken(userData.token);

            const profile = await fetchProfile(userData.token);
            if (profile) {
                await AsyncStorage.setItem("user", JSON.stringify(profile));
                setUser(profile);
            }
        }
        return userData;
    };

    const logout = async () => {
        await AsyncStorage.removeItem("userToken");
        await AsyncStorage.removeItem("user");
        setUserToken(null);
        setUser(null);
    };

    const fetchProfile = async (token) => {
        try {
            const response = await axios.get(`${API_URL}/user/monprofil`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data.data;
        } catch (error) {
            console.error("Erreur lors de la récupération du profil :", error);
            return null;
        }
    };

    return (
        <AuthContext.Provider value={{ user, userToken, login, register, logout, fetchProfile }}>
            {!loadingAuth && children}
        </AuthContext.Provider>
    );
};
