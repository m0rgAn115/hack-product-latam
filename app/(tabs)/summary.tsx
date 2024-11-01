import React, { useState } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SegmentedArc } from '@shipt/segmented-arc-for-react-native';

import ParameterList from '@/components/Summary/ParameterList';
import ArcComponent from '@/components/Summary/ArcComponent';

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
    const { width, height } = Dimensions.get('window');
    const radius = width * 0.38;

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

    //---------------------Data---------------------
    const points = 660;
    const fillValue = 660/1000 * 100;
    const newPoints = 6;
    const range = { min: 400, max: 850 };
    const segments = [
        {
        arcDegreeScale: 0.40, 
        filledColor: '#856FE5',
        emptyColor: '#E3E3E5',
        data: { label: 'Urgente' }
        },
        {
        
        filledColor: '#856FE5',
        emptyColor: '#E3E3E5',
        data: { label: 'Problemas' }
        },
        {
        
        filledColor: '#856FE5',
        emptyColor: '#E3E3E5',
        data: { label: 'Bien' }
        },
        {
        
        filledColor: '#856FE5',
        emptyColor: '#E3E3E5',
        data: { label: 'Perfecto' }
        }
    ];

    const lastFetchedData = new Date();
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = lastFetchedData.toLocaleDateString('es-ES', options);
    

    const parameters = [
        {
          title: 'Eficiencia Financiera',
          percentage: 95,
          status: 'Bien',
          statusColor: '#3D924B',
          showMore: true,
        },
        {
          title: 'Índice de Ahorro',
          percentage: 45,
          status: 'Problemas',
          statusColor: '#DF8E13',
          showMore: true,
        },
        {
          title: 'Estabilidad de Gastos',
          percentage: 75,
          status: 'Bien',
          statusColor: '#3D924B',
          showMore: false,
        },
    ];

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#FEFEFE',}}>
            
            <View style={{ paddingVertical: 30, paddingHorizontal: '3.5%'}}>
            <ArcComponent
                segments={segments}
                fillValue={fillValue}
                points={points}
                newPoints={newPoints}
                radius={radius}
            />
            <View style={{paddingHorizontal: '5%', paddingTop: 10, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{color: '#67677A', fontSize: 14, fontFamily: 'DMSans_400Regular'}}>
                        {range.min}
                    </Text>
                    <View style={{alignItems: 'center'}}>

                        <Text style={{color: '#67677A', fontSize: 14, fontFamily: 'DMSans_400Regular'}}>
                            Última actualización el
                        </Text>
                        <Text style={{color: '#67677A', fontSize: 14, fontFamily: 'DMSans_400Regular'}}>
                            {formattedDate}
                        </Text>
                    </View>
                    <Text style={{color: '#67677A', fontSize: 14, fontFamily: 'DMSans_400Regular'}}>
                        {range.max}
                    </Text>
            </View>
            </View>
            <View style={{ flex: 1, paddingHorizontal: '3.5%' }}>
                <ParameterList parameters={parameters} />
            </View>
        </SafeAreaView>
    );
}
