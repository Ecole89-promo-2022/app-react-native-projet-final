import React, { useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { fetchPosts } from "../services/postService";
import PostItem from "../components/PostItem";

export default function PostListScreen({ navigation }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPosts = async () => {
            const data = await fetchPosts();
            setPosts(data);
            setLoading(false);
        };
        loadPosts();
    }, []);

    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

    return (
        <FlatList
            data={posts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <PostItem post={item} onPress={() => navigation.navigate("PostDetail", { postId: item.id })} />}
        />
    );
}
