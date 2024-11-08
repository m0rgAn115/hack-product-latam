import { Image, StyleSheet, Platform, Pressable, Text, TextInput, View, ScrollView, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Transaction } from '@/components/Interfaces/transaction.interface';
import { RenderGraphic } from '@/components/chat/RenderGraphic';
import GraphPerMonth from '@/components/Expenses/GraphPerMonth';
import { Transactions_Testing } from '@/components/Expenses/Transactions_Testing';
import { filterTransactions } from '@/components/Expenses/filterTransactions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MainCategories } from '@/components/Expenses/categoriesConfig';

const fechaActual = new Date();

interface Conversation {
  rol: string;
  text: string;
  msg_number: number;
  chart?: {
    transactions: PlaidTransaction[],
    chart_type: 'barras' | 'lineas',
    categoria: string[],
    fecha_final: string,
    fecha_inicial: string,
  }
}

interface Goal_details {
  title: string;
  description: string;
  initial: number;
  amount: number;
  plazo: number;
}

interface gastos_llm {
  categoria: string,

}

interface PlaidTransaction {
  date: string;
  amount: number;
  logo_url?: string;
  merchant_name?: string;
  name: string;
  category: string[];
  mainCategory?: keyof MainCategories | "Others";
}

const server = 'http://192.168.100.52:5001'

export default function ChatScreen() {
  const router = useRouter();
  const textInputRef = useRef<TextInput>(null);
  const flatListRef = useRef<FlatList>(null);
  const [inputValue, setInputValue] = useState<string | undefined>(undefined);
  const [funcionLlamada, setFuncionLlamada] = useState('');
  const [shouldFocusInput, setShouldFocusInput] = useState(false);
  const [conversation, setConversation] = useState<Conversation[]>([]);
  const [assistant_response_state, setAssistantResponseState] = useState(false);
  const [currentAgent, setCurrentAgent] = useState<'master' | 'goal' | 'chat'>('chat');
  const [nextAgent, setNextAgent] = useState<'master' | 'goal' | 'chat' | null>(null);
  const [transactions, setTransactions] = useState<PlaidTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [information_completed, setinformation_completed] = useState(false)

  const [goal, setGoal] = useState<Goal_details>({
    amount: 0,
    description: '',
    initial: 0,
    plazo: 0, 
    title: '',
  })

  const fetchTransactions = async () => {
    try {
      const response = await fetch('https://zttizctjsl.execute-api.us-east-1.amazonaws.com/lazy-devs-plaid/transactions/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: 'access-sandbox-afd1b0a9-36eb-4a0b-8173-acdcbb1b0c0a',
        }),
      });

      if (!response.ok) {
        throw new Error('Error al obtener las transacciones');
      }

      const data: PlaidTransaction[] = await response.json();
      const filteredData = filterTransactions(data); // Filtrar los datos aquí
      await AsyncStorage.setItem('transactionsData', JSON.stringify(filteredData)); // Guardar los datos en AsyncStorage
      setTransactions(filteredData); // Actualizar el estado con los datos filtrados
    } catch (error) {
      console.error('Error al obtener las transacciones:', error);
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStoredTransactions = async () => {
    try {
      const storedData = await AsyncStorage.getItem('transactionsData');
      if (storedData) {
        const parsedData: PlaidTransaction[] = JSON.parse(storedData);
        setTransactions(parsedData);
      } else {
        fetchTransactions();
      }
    } catch (error) {
      console.error('Error al recuperar las transacciones almacenadas:', error);
      fetchTransactions();
    }
  };

  useEffect(() => {
    getStoredTransactions();
  }, []);

  const handleInputValue = () => {
    if (inputValue === '') setInputValue(undefined);
  };



  const fetchDataMaster = async () => {
    try {
      const response = await fetch(`http://192.168.100.52:5001/master`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputValue }),
      });
      if (!response.ok) throw new Error('Error en la solicitud');
      const data = await response.json();
      const funcion = data.response.function;
      const user_text = data.response.user_text;
      setFuncionLlamada(funcion);
      
      if (funcion === "crear una meta financiera") {
        setNextAgent('goal');
        router.push(`/goal-details?q_user_text=${user_text}`);
      }
      
      return "Procesando tu solicitud...";
    } catch (error) {
      console.error('Error:', error);
      return "Lo siento, hubo un error procesando tu solicitud.";
    }
  };

  const fetchDataGoal = async () => {
    console.log("Agente Goalme");

    try {
      const response = await fetch(`${server}/goal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputValue, previous_chats: conversation }),
      });
      if (!response.ok) throw new Error('Error en la solicitud');
      const data = await response.json();
      console.log(data.response.goal_validation.suggested_questions);
      console.log(data.response);
      console.log(data.response.goal_validation.missing_fields);
      const assistant_messages = data.response.goal_validation.suggested_questions;
      const validation = data.response.goal_validation.confidence_score;
      const amount = data.response?.q_goal_amount;
      const description = data.response?.q_goal_description;
      const title = data.response?.q_goal_title;
      const initial = data.response?.q_initial_amount;
      const plazo = data.response?.q_goal_plazo;
      
      
      if (data.response.goal_validation.missing_fields.length == 0) {
        setinformation_completed(true)
        setGoal({
          amount: amount,
          description: description,
          initial: initial,
          plazo: plazo,
          title: title
        })
        console.log("validado");
      }
      
      
      return (assistant_messages) ? assistant_messages[0] : [];
    } catch (error) {
      console.error('Error:', error);
      return "Lo siento, hubo un error procesando tu meta.";
    }
  };

  const fetchDataChat = async () => {
    console.log('chat');
    const conversation_filter = conversation.map(({ rol, text, msg_number }) => ({
      rol,
      text,
      msg_number
    })) 
    console.log("filter: ",JSON.stringify({ text: inputValue,date: fechaActual.toString(), previous_chats: conversation.map(({ rol, text, msg_number }) => ({
      rol,
      text,
      msg_number
    })) 
  }));
    
    
    try {
      const response = await fetch(`${server}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputValue, date: fechaActual.toString(), previous_chats: conversation.map(({ rol, text, msg_number }) => ({
          rol,
          text,
          msg_number
        })) 
      }),
      });
      if (!response.ok) throw new Error('Error en la solicitud');
      const data = await response.json();
      const assistant_message = data.response.message;
      const funcion = data.response.funcion;
      setInputValue('');
      console.log(funcion);
      
      if (funcion === "crear_meta_financiera") {
        setCurrentAgent('goal')
      }

      if (funcion === "consultar_gastos"){
        const response = await  fetchDataGastos();
        console.log("response:", response);
        return undefined
      }
      
      return data.response.message;
    } catch (error) {
      console.error('Error:', error);
      return "Lo siento, hubo un error en la conversación.";
    }
  };

  const fetchDataGastos = async () => {
    try {
      const response = await fetch(`${server}/analityc`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputValue, date: fechaActual.toString(),previous_chats: conversation }),
      });
      if (!response.ok) throw new Error('Error en la solicitud');
      const data = await response.json();
      console.log(data);

      const transacciones_filtradas = transactions

      setConversation(prev => [
        ...prev,
        { rol: 'assistant', msg_number: prev.length, text: data.response.mensajeAsistente },
      ]);

      setConversation(prev => [
        ...prev,
        { rol: 'assistant', msg_number: prev.length, text: '',
          chart: {
            show: true,
            transactions: transacciones_filtradas,
            chart_type: data.response.tipoGrafica,
            categoria: data.response.categoria,
            fecha_final: data.response.fecha_final,
            fecha_inicial: data.response.fecha_inicial
          }
         },
      ]);
      
      return undefined;
    } catch (error) {
      console.error('Error:', error);
      return "Lo siento, hubo un error en la conversación.";
    }
  };

  const fetchDataAnalisis = async () => {
    try {
      const response = await fetch(`${server}/analytics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputValue, date: fechaActual.toString(),previous_chats: conversation }),
      });
      if (!response.ok) throw new Error('Error en la solicitud');
      const data = await response.json();
      console.log(data);

      const transacciones_filtradas = transactions

      setConversation(prev => [
        ...prev,
        { rol: 'assistant', msg_number: prev.length, text: data.response.mensajeAsistente },
      ]);

      setConversation(prev => [
        ...prev,
        { rol: 'assistant', msg_number: prev.length, text: '',
          chart: {
            show: true,
            transactions: transacciones_filtradas,
            chart_type: data.response.tipoGrafica,
            categoria: data.response.categoria,
            fecha_final: data.response.fecha_final,
            fecha_inicial: data.response.fecha_inicial
          }
         },
      ]);
      
      return undefined;
    } catch (error) {
      console.error('Error:', error);
      return "Lo siento, hubo un error en la conversación.";
    }
  };

  const getAgentFunction = () => {
    switch (currentAgent) {
      case 'master':
        return fetchDataMaster;
      case 'goal':
        return fetchDataGoal;
      case 'chat':
      default:
        return fetchDataChat;
    }
  };

  useEffect(() => {
    if (shouldFocusInput && textInputRef.current) {
      textInputRef.current.focus();
      setShouldFocusInput(false);
    }
  }, [shouldFocusInput]);

  const handleSendMessage = async () => {
    if (!inputValue) return;
    
    const text = inputValue.toLowerCase();
    setInputValue('');

    setAssistantResponseState(true);
    setConversation(prev => [...prev, { rol: 'user', msg_number: prev.length, text: text }]);
    
    const agentFunction = getAgentFunction();
    const response = await agentFunction();
    
    if(response!= undefined)
      setConversation(prev => [
        ...prev,
        { rol: 'assistant', msg_number: prev.length, text: response },
      ]);
    
    setAssistantResponseState(false);
    if (nextAgent) {
      setCurrentAgent(nextAgent);
      setNextAgent(null);
    }
  };

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [conversation]);

  const handleGoalCompleted = () => {
    const { amount, description, initial, plazo, title } = goal;

    router.push(`/goal-details?q_goal_title=${title}&q_goal_amount=${amount}&q_initial_amount=${initial}&q_goal_description=${description}&q_plazo=${plazo}`)

  }

  const clearChat = () => {
    setAssistantResponseState(false)
    setConversation([])
    setinformation_completed(false)
  }

  return (
    <View style={{ paddingHorizontal: "5%", paddingTop: "5%", backgroundColor: 'white', flex: 1 }}>
      <View style={{ elevation: 4}}>
        <Text style={{ fontSize: 14, textAlign: 'center', marginVertical: 30 }}>TEPOZ AI</Text>
      </View>
      <View style={{flex: 1}}>
        <FlatList 
          ref={flatListRef}
          data={conversation}
          renderItem={({ item }) => <ChatItem item={item}
                                             assistant_response_state={assistant_response_state} 
                                            last_msg_index={conversation.length-1} 
                                            info_completed_state={information_completed} 
                                            onPress={handleGoalCompleted} 
                                             showChart
                                             transactions={transactions}
                                             
                                            />}
          keyExtractor={(item) => item.msg_number.toString()}
          
        />
      </View>

      <View style={{ backgroundColor: '#ececec', borderRadius: 20, padding: 10, marginVertical: 10 }}>
        <View style={{  flexDirection: 'row'}}>
          <TextInput
            ref={textInputRef}
            value={inputValue}
            onChangeText={setInputValue}
            placeholder="Send a message..."
            multiline
            style={{ fontSize: 16, flex: 1, paddingHorizontal: 10 }}
            onFocus={() => console.log("Input focused")}
            onPressOut={handleInputValue}
          />
          <View style={{flexDirection: 'column', justifyContent: 'flex-end'}}>
            <Pressable 
              onPress={handleSendMessage}
              style={({ pressed }) => [{ opacity: pressed ? 0.3 : 1, borderRadius: 50 }]}>
              <Ionicons name='send-sharp' size={25} style={{   }} />
            </Pressable>
          </View>

        </View>
      </View>
    </View>
  );
}

interface ChatItemProps {
  item: Conversation;
  assistant_response_state: boolean;
  last_msg_index: number;
  info_completed_state: boolean;
  onPress: () => void;
  transactions: PlaidTransaction[]
  showChart: boolean;
}

const ChatItem = ({ item, assistant_response_state, last_msg_index, info_completed_state, onPress, transactions }: ChatItemProps) => {
  return (
    !item.chart ? (
      <View style={{ marginBottom: item.msg_number === last_msg_index ? 40 : (item.rol === 'user') ? 20 : 0, marginTop: ((item.rol === 'user')) ? 10 : 0 }}>
        { item.rol === 'assistant' ?
          
          <View style={{ flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 18, borderRadius: 20}}>
            <View style={{marginRight: 10}}>
              <View style={{width: 35, height: 35, alignItems: 'center', backgroundColor: '#20B2AA', justifyContent: 'center', borderRadius: 100 }}>
                <Ionicons name='aperture-outline' size={25} color='white' />
              </View> 
            </View>
            <View style={{flex: 1, justifyContent: 'center'}}>
              <Text style={{ fontSize: 17.5 }}>{item.text}</Text>
            </View>
          </View>
          
          : 
          
          <View style={{ backgroundColor: "#ececec", flexDirection: 'row', paddingHorizontal: 18, paddingVertical: 14, borderRadius: 20}}>
            <View style={{marginRight: 10}}>
              <View style={{width: 35, height: 35, alignItems: 'center', backgroundColor: '#000', justifyContent: 'center', borderRadius: 100 }}>
                <Ionicons name='wallet-outline' size={20} color='white' />
              </View>
            </View>
            <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center'}}>
              <Text style={{ fontSize: 17.5 }}>{item.text}</Text>
            </View>
          </View>
        }

        {assistant_response_state && item.msg_number === last_msg_index && (
          <View style={{ flexDirection: 'row', paddingHorizontal: 18, paddingVertical: 18, borderRadius: 20}}>
          <View style={{marginRight: 10}}>
            <View style={{width: 35, height: 35, alignItems: 'center', backgroundColor: '#20B2AA', justifyContent: 'center', borderRadius: 100 }}>
              <Ionicons name='aperture-outline' size={25} color='white' />
            </View> 
          </View>
          <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center'}}>
            <Text style={{ fontSize: 16 }}>TEPOZ AI is thinking...</Text>
          </View>
        </View>
        )}

        {info_completed_state && item.msg_number === last_msg_index && (
          <Pressable
            onPress={onPress}
            style={{
              backgroundColor: '#3a9343',
              width: '80%',
              borderRadius: 10,
              padding: 10,
              alignSelf: 'center',
              marginTop: 15,
            }}
          >
            <Text style={{ fontSize: 16, color: 'white', textAlign: 'center' }}>Create Goal</Text>
          </Pressable>
        )}
        
      </View>
    ) : (
      <View style={{ marginBottom: (item.msg_number === last_msg_index ) ? 40 : 10, marginTop: 0}} >
        <RenderGraphic PlaidTransaction={item.chart.transactions} chart_info={item.chart} />
      </View>
    )
  );
};


const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});