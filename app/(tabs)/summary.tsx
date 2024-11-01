import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome6';
import IconTwo from 'react-native-vector-icons/MaterialCommunityIcons';

import {
    useFonts,
    DMSans_400Regular,
    DMSans_400Regular_Italic,
    DMSans_500Medium,
    DMSans_500Medium_Italic,
    DMSans_700Bold,
    DMSans_700Bold_Italic,
  } from '@expo-google-fonts/dm-sans';

export default function HomeScreen() {
    //---------------------Fonts---------------------
    let [fontsLoaded] = useFonts({
        DMSans_400Regular,
        DMSans_400Regular_Italic,
        DMSans_500Medium,
        DMSans_500Medium_Italic,
        DMSans_700Bold,
        DMSans_700Bold_Italic,
    });

    if (!fontsLoaded) {
        return null; // O muestra un indicador de carga si lo prefieres
    }

    //---------------------Data fetch or data calculation---------------------
    const periodTime = "1 Oct 2024 - 31 Oct 2024";
    const highestExpenses = {
        title: "Apple Store Bj California, MX",
        category: "Shopping",
        amount: 1699.48,
        date: "Oct 26"
    };

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#FEFEFE',}}>
            
            <View style={{height: '40%', backgroundColor: '#000'}}>

            </View>
            <View style={{flex: 1, paddingHorizontal: '3.5%'}}>
                <View style={{padding: '5%', borderWidth: 1, borderColor: '#E3E3E5', borderRadius: 10}}>
                    {/* First Parameter */}
                    <View style={{borderBottomWidth: 1, borderColor: '#E3E3E5'}}>     
                        <View style={{flexDirection:'row', justifyContent: 'space-between', marginBottom: 15}}>
                            <Text style={{color: '#67677A', fontFamily: 'DMSans_700Bold', fontSize: 16}}>Eficiencia Financiera</Text>
                            <Text style={{color: '#303048', fontFamily: 'DMSans_700Bold', fontSize: 16}}>%95</Text>
                        </View>
                        <View style={{flexDirection:'row', justifyContent: 'space-between', marginBottom: 18}}>
                            <Text style={{color: '#3D924B', fontFamily: 'DMSans_400Regular', fontSize: 14}}>Bien</Text>
                            <Text style={{color: '#0066FF', fontFamily: 'DMSans_500Medium',fontSize: 14}}>Conocer más {'>'}</Text>
                        </View>
                    </View>
                    {/* Second Parameter */}
                    <View style={{borderBottomWidth: 1, borderColor: '#E3E3E5', marginTop: 18}}>     
                        <View style={{flexDirection:'row', justifyContent: 'space-between', marginBottom: 15}}>
                            <Text style={{color: '#67677A', fontFamily: 'DMSans_700Bold', fontSize: 16}}>Eficiencia Financiera</Text>
                            <Text style={{color: '#303048', fontFamily: 'DMSans_700Bold', fontSize: 16}}>%45</Text>
                        </View>
                        <View style={{flexDirection:'row', justifyContent: 'space-between', marginBottom: 18}}>
                            <Text style={{color: '#DF8E13', fontFamily: 'DMSans_400Regular', fontSize: 14}}>Problemas</Text>
                            <Text style={{color: '#0066FF', fontFamily: 'DMSans_500Medium',fontSize: 14}}>Conocer más {'>'}</Text>
                        </View>
                    </View>
                    {/* Third Parameter */}
                    <View style={{marginTop: 18}}>     
                        <View style={{flexDirection:'row', justifyContent: 'space-between', marginBottom: 15}}>
                            <Text style={{color: '#67677A', fontFamily: 'DMSans_700Bold', fontSize: 16}}>Eficiencia Financiera</Text>
                            <Text style={{color: '#303048', fontFamily: 'DMSans_700Bold', fontSize: 16}}>%75</Text>
                        </View>
                        <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
                            <Text style={{color: '#3D924B', fontFamily: 'DMSans_400Regular', fontSize: 14}}>Bien</Text>
                            
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    
});