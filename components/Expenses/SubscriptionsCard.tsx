import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';

type RootStackParamList = {
    expenses: undefined;
    Gastos: undefined;
};

const NetflixIcon = () => (
    <Svg width="25" height="25" viewBox="0 0 24 24"><Path fill="#e50914" d="M5.398 0v.006c3.028 8.556 5.37 15.175 8.348 23.596c2.344.058 4.85.398 4.854.398c-2.8-7.924-5.923-16.747-8.487-24zm8.489 0v9.63L18.6 22.951c-.043-7.86-.004-15.913.002-22.95zM5.398 1.05V24c1.873-.225 2.81-.312 4.715-.398v-9.22z"/></Svg>
);
const AppleTvIcon = () => (
    <Svg width="25" height="25" viewBox="0 0 128 128"><Path d="M97.905 67.885c.174 18.8 16.494 25.057 16.674 25.137c-.138.44-2.607 8.916-8.597 17.669c-5.178 7.568-10.553 15.108-19.018 15.266c-8.318.152-10.993-4.934-20.504-4.934c-9.508 0-12.479 4.776-20.354 5.086c-8.172.31-14.395-8.185-19.616-15.724C15.822 94.961 7.669 66.8 18.616 47.791c5.438-9.44 15.158-15.417 25.707-15.571c8.024-.153 15.598 5.398 20.503 5.398c4.902 0 14.106-6.676 23.782-5.696c4.051.169 15.421 1.636 22.722 12.324c-.587.365-13.566 7.921-13.425 23.639M82.272 21.719c4.338-5.251 7.258-12.563 6.462-19.836c-6.254.251-13.816 4.167-18.301 9.416c-4.02 4.647-7.54 12.087-6.591 19.216c6.971.54 14.091-3.542 18.43-8.796"/></Svg>
);
const SpotifyIcon = () => (
    <Svg width="40" height="40" viewBox="0 0 256 256"><Path fill="#1ed760" d="M128 0C57.308 0 0 57.309 0 128c0 70.696 57.309 128 128 128c70.697 0 128-57.304 128-128C256 57.314 198.697.007 127.998.007zm58.699 184.614c-2.293 3.76-7.215 4.952-10.975 2.644c-30.053-18.357-67.885-22.515-112.44-12.335a7.98 7.98 0 0 1-9.552-6.007a7.97 7.97 0 0 1 6-9.553c48.76-11.14 90.583-6.344 124.323 14.276c3.76 2.308 4.952 7.215 2.644 10.975m15.667-34.853c-2.89 4.695-9.034 6.178-13.726 3.289c-34.406-21.148-86.853-27.273-127.548-14.92c-5.278 1.594-10.852-1.38-12.454-6.649c-1.59-5.278 1.386-10.842 6.655-12.446c46.485-14.106 104.275-7.273 143.787 17.007c4.692 2.89 6.175 9.034 3.286 13.72zm1.345-36.293C162.457 88.964 94.394 86.71 55.007 98.666c-6.325 1.918-13.014-1.653-14.93-7.978c-1.917-6.328 1.65-13.012 7.98-14.935C93.27 62.027 168.434 64.68 215.929 92.876c5.702 3.376 7.566 10.724 4.188 16.405c-3.362 5.69-10.73 7.565-16.4 4.187z"/></Svg>
);

export { NetflixIcon, AppleTvIcon, SpotifyIcon }

const subscriptions = [
    { id: '1', name: 'Netflix', price: 150.44, icon: NetflixIcon },
    { id: '2', name: 'Apple TV', price: 300.22, icon: AppleTvIcon },
    { id: '3', name: 'Spotify', price: 150.22, icon: SpotifyIcon },
];

const SubscriptionsCard = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const total = subscriptions.reduce((sum, sub) => sum + sub.price, 0);

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Gastos')}>
                    <Ionicons name="chevron-back" size={24} color="#4A4A4A" />
                </TouchableOpacity>
                <Text style={styles.title}>Subscriptions</Text>
            </View>

            <Text style={styles.subtitle}>Your monthly payment for subscriptions</Text>
            <Text style={styles.total}>${total.toFixed(2)}</Text>

            <View style={styles.card}>
                <FlatList 
                    data={subscriptions}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => (
                        <View style={[
                            styles.subscriptionContainer, 
                            index === subscriptions.length - 1 && styles.lastItem
                        ]}>
                            <View style={styles.iconContainer}>
                                <item.icon />
                            </View>
                            <View style={styles.subscriptionDetails}>
                                <Text style={styles.subscriptionName}>{item.name}</Text>
                                <Text style={styles.subscriptionPrice}>${item.price.toFixed(2)}/month</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#A0A0A0" />
                        </View>
                    )}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 8,
        paddingHorizontal: 16,
        flex: 1,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        marginBottom: 20,
    },
    backButton: {
        position: 'absolute',
        left: 0,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4A4A4A',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#A0A0A0',
        marginTop: 10,
    },
    total: {
        fontSize: 36,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333333',
        marginVertical: 20,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        paddingVertical: 10,
        paddingHorizontal: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    subscriptionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    lastItem: {
        borderBottomWidth: 0, // Remueve la línea inferior en el último elemento
    },
    iconContainer: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        marginRight: 10,
        shadowColor: '#000',         // Color de la sombra
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,                // Solo para Android, da un efecto de sombra
    },
    subscriptionDetails: {
        flex: 1,
    },
    subscriptionName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
    },
    subscriptionPrice: {
        fontSize: 16,
        color: '#4F4F4F',
    },
});

export default SubscriptionsCard;