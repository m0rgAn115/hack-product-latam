import React from 'react';
import { TouchableOpacity, Text, FlatList, Modal, StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type MonthSelectorProps = {
  mesSeleccionado: number;
  setMesSeleccionado: (index: number) => void;
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  Months_data: string[];
};

const MonthSelector: React.FC<MonthSelectorProps> = ({
  mesSeleccionado,
  setMesSeleccionado,
  modalVisible,
  setModalVisible,
  Months_data,
}) => {

  const handleCambiarMes = (mesIndex: number) => {
    setMesSeleccionado(mesIndex);
    setModalVisible(false);
  };

  const renderMonthItem = ({ item, index }: { item: string; index: number }) => (
    <TouchableOpacity 
      style={[styles.modalItem, index === mesSeleccionado && styles.selectedModalItem]}
      onPress={() => handleCambiarMes(index)}
    >
      <Text style={styles.modalItemText}>{item}</Text>
      {index === mesSeleccionado && (
        <MaterialIcons name="check" size={20} color="#6200EE" />
      )}
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity 
        style={styles.monthSelector} 
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.selectedMonthText}>
          {Months_data[mesSeleccionado]} 2024
        </Text>
        <MaterialIcons name="arrow-drop-down" size={20} color="#777" />
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={Months_data}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderMonthItem}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  selectedMonthText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#777',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    maxHeight: 350,
    paddingBottom: 20,
  },
  modalItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedModalItem: {
    backgroundColor: '#f0f0f0',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
});

export default MonthSelector;