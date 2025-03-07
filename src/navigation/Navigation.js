import React, { useContext, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../context/AuthContext";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import UserListScreen from "../screens/UserListScreen";

const Stack = createNativeStackNavigator();

export default function Navigation() {
    const { userToken } = useContext(AuthContext);

    useEffect(() => {
        console.log("🔍 userToken dans Navigation :", userToken);
    }, [userToken]); // Vérifie si le token change

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {userToken ? (
                    <>
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="Profile" component={ProfileScreen} />
                        <Stack.Screen name="UserList" component={UserListScreen} /> {/* ✅ Ajout ici */}
                    </>
                ) : (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Register" component={RegisterScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );

}
