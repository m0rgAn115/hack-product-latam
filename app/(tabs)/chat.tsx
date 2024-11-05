import { Image, StyleSheet, Platform, Pressable, Text, TextInput, View, ScrollView, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';

interface Conversation {
  rol: string;
  text: string;
  msg_number: number;
}

interface Goal_details {
  title: string;
  description: string;
  initial: number;
  amount: number;
  plazo: number;
}

const server = 'http://192.168.0.80:5001'

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

  const [information_completed, setinformation_completed] = useState(false)

  const [goal, setGoal] = useState<Goal_details>({
    amount: 0,
    description: '',
    initial: 0,
    plazo: 0, 
    title: '',
  })

  


  const handleInputValue = () => {
    if (inputValue === '') setInputValue(undefined);
  };

  const fetchDataMaster = async () => {
    try {
      const response = await fetch(`http://192.168.0.80:5001/master`, {
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
    try {
      const response = await fetch(`${server}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputValue, previous_chats: conversation }),
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
        const response = await  fetchDataAnalisis();
        console.log("response:", response);
        return response.mensajeAsistente
      }
      
      return data.response.message;
    } catch (error) {
      console.error('Error:', error);
      return "Lo siento, hubo un error en la conversación.";
    }
  };

  const fetchDataAnalisis = async () => {
    try {
      const response = await fetch(`${server}/analityc`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputValue, previous_chats: conversation }),
      });
      if (!response.ok) throw new Error('Error en la solicitud');
      const data = await response.json();
      
      return data.response;
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

    setAssistantResponseState(true);
    setConversation(prev => [...prev, { rol: 'user', msg_number: prev.length, text: inputValue }]);
    
    const agentFunction = getAgentFunction();
    const response = await agentFunction();
    
    setConversation(prev => [
      ...prev,
      { rol: 'assistant', msg_number: prev.length, text: response },
    ]);
    
    setInputValue('');
    setAssistantResponseState(false);
    // console.log(conversation);
    
    // Solo después de completar la respuesta, actualizamos el agente si hay uno pendiente
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
    <View style={{ paddingHorizontal: 30, backgroundColor: 'white', height: '100%', justifyContent: 'space-between' }}>
      <Text style={{ fontSize: 25, color: 'black', fontWeight: '600', textAlign: 'center', marginTop: 30 }}>Welcome $user</Text>
      <View>
        <Text style={{ fontSize: 20, color: 'black', fontWeight: '600' }}>Funcion llamada: {funcionLlamada}</Text>
        <FlatList 
          ref={flatListRef}
          data={conversation}
          renderItem={({ item }) => <ChatItem item={item} assistant_response_state={assistant_response_state} last_msg_index={conversation.length-1} info_completed_state={information_completed} onPress={handleGoalCompleted} />}
          keyExtractor={(item) => item.msg_number.toString()}
          style={{ backgroundColor: '#ececec', padding: 20, borderRadius: 10, height: '60%' }}
        />
      </View>
      <View style={{ backgroundColor: '#ececec', borderRadius: 20, padding: 10, marginBottom: 10 }}>
        {inputValue !== undefined && (
          <TextInput
            ref={textInputRef}
            value={inputValue}
            onChangeText={setInputValue}
            multiline
            style={{ fontSize: 20 }}
            onFocus={() => console.log("Input focused")}
            onPressOut={handleInputValue}
          />
        )}
        <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name='mic-outline' size={25} />
          {inputValue === undefined && (
            <Pressable
              style={{ flex: 1 }}
              onPress={() => {
                setInputValue(''); 
                setShouldFocusInput(true); 
              }}>
              <Text style={{ fontSize: 18, color: '#888888', textAlign: 'left', marginLeft: 10 }}>Message</Text>
            </Pressable>
          )}
          <Pressable 
            onPress={handleSendMessage}
            style={({ pressed }) => [{ opacity: pressed ? 0.3 : 1, borderRadius: 50 }]}>
            <Ionicons name='send-sharp' size={25} style={{ opacity: inputValue === '' ? 0 : 1 }} />
          </Pressable>
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
}

const ChatItem = ({ item, assistant_response_state, last_msg_index, info_completed_state, onPress }: ChatItemProps) => {
  

  return (
    <View style={{ marginBottom: (item.msg_number === last_msg_index ) ? 40 : 20 }}>
      <Text style={{
        alignSelf: item.rol === 'user' ? 'flex-end' : 'flex-start',
        backgroundColor: item.rol === 'user' ? 'white' : '#d3ebfe',
        paddingHorizontal: 8,
        paddingVertical: 5,
        fontSize: 16,
        borderRadius: 10
      }}>
        {item.text}
      </Text>
      {assistant_response_state && item.msg_number === last_msg_index && (
        <Text style={{ color: 'blue', fontSize: 12, marginBottom: 10 }}>Assistant is typing...</Text>
      )}

      {
        info_completed_state && item.msg_number === last_msg_index && 
          <Pressable
            onPress={onPress}
            style={{ backgroundColor: '#3a9343', width: '80%', borderRadius: 10, padding: 10, alignSelf: 'center', marginTop: 15 }} >
            <Text style={{ fontSize: 16, color: 'white', textAlign: 'center' }} >Create Goal</Text>
          </Pressable>
      }
    </View>
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