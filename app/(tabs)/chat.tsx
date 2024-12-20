import {
  StyleSheet,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { RenderGraphic } from "@/components/chat/RenderGraphic";
import { MainCategories } from "@/components/Expenses/categoriesConfig";
import useFetch from "@/hooks/useFetch";
import { Goal } from "@/components/Interfaces/goal";
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { useUserStore } from "@/store/useUserStore";
import { useRoute, RouteProp } from "@react-navigation/native";
import KeyboardLayout from "@/components/chat/KeyboardLayout";

const fechaActual = new Date();

type RootStackParamList = {
  Chat: { context?: string };
};

interface Conversation {
  rol: string;
  text: string;
  msg_number: number;
  chart?: {
    transactions: PlaidTransaction[];
    chart_type: "barras" | "lineas";
    categoria: string[];
    fecha_final: string;
    fecha_inicial: string;
  };
}

interface Goal_details {
  title: string;
  description: string;
  initial: number;
  amount: number;
  plazo: number;
}

interface gastos_llm {
  categoria: string;
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

const server =
  "https://zttizctjsl.execute-api.us-east-1.amazonaws.com/backend/tepoz-ai";

export default function ChatScreen() {
  const router = useRouter();

  // Función para regresar
  const handleBack = () => {
    router.back();
  };
  const route = useRoute<RouteProp<RootStackParamList, "Chat">>();
  const { context = undefined } = route.params || {};
  // console.log(context);
  const textInputRef = useRef<TextInput>(null);
  const flatListRef = useRef<FlatList>(null);
  const [inputValue, setInputValue] = useState<string | undefined>(undefined);
  const [shouldFocusInput, setShouldFocusInput] = useState(false);
  const [conversation, setConversation] = useState<Conversation[]>([]);
  const [assistant_response_state, setAssistantResponseState] = useState(false);
  const [currentAgent, setCurrentAgent] = useState<"master" | "goal" | "chat">(
    "chat"
  );

  const [nextAgent, setNextAgent] = useState<"master" | "goal" | "chat" | null>(
    null
  );
  const [transactions, setTransactions] = useState<PlaidTransaction[]>([]);
  const { correo } = useUserStore();

  const [goal_details, setgoal_details] = useState<Goal>();

  const [information_completed, setinformation_completed] = useState(false);

  const [agentAvailable, setagentAvailable] = useState(true);

  const [goal, setGoal] = useState<Goal_details>({
    amount: 0,
    description: "",
    initial: 0,
    plazo: 0,
    title: "",
  });

  useEffect(() => {
    if (context) {
      // First, set the input value
      setInputValue(context);
      // Then, update conversation and handle the message
      setConversation((prevConversation) => {
        console.log("prevConversation");
        const newConversation = [
          ...prevConversation,
          {
            rol: "user",
            text: `Detalles de la tarjeta de credito Recomendada.`,
            msg_number: prevConversation.length + 1,
          },
        ];

        setTimeout(() => {
          setAssistantResponseState(true);
          handleContextMessage(context);
          setInputValue("");
        }, 100);

        return newConversation;
      });
    }
  }, [context]);

  useEffect(() => {
    
  }, [currentAgent]);

  const handleInputValue = () => {
    if (inputValue === "") setInputValue(undefined);
  };

  const fetchDataGoal = async () => {
    console.log("Agente Goalme");

    try {
      const response = await fetch(`${server}/goal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inputValue,
          previous_chats: conversation,
        }),
      });
      if (!response.ok) throw new Error("Error en la solicitud");
      const data = await response.json();
      console.log(data.response.goal_validation.suggested_questions);
      console.log(data.response);
      console.log(data.response.goal_validation.missing_fields);
      const assistant_messages =
        data.response.goal_validation.suggested_questions;
      const validation = data.response.goal_validation.confidence_score;
      const amount = data.response?.q_goal_amount;
      const description = data.response?.q_goal_description;
      const title = data.response?.q_goal_title;
      const initial = data.response?.q_initial_amount;
      const plazo = data.response?.q_goal_plazo;

      if (data.response.goal_validation.missing_fields.length == 0) {
        setinformation_completed(true);
        setGoal({
          amount: amount,
          description: description,
          initial: initial,
          plazo: plazo,
          title: title,
        });
        console.log("validado");
      }

      return assistant_messages ? assistant_messages[0] : [];
    } catch (error) {
      console.error("Error:", error);
      return "Lo siento, hubo un error procesando tu meta.";
    }
  };

  const switch_agent = (funcion: string, user_msg: string) => {
    switch (funcion) {
      case "crear_meta_financiera":
        GoalAgent(user_msg);
        return false;

      case "analisis_gastos":
        AnalyticAgent(user_msg);
        return false;

      default:
        return true;
    }
  };

  // <----- [ AGENTS FUNCTIONS ] ------>

  const MasterAgente = async (user_msg: string) => {
    try {
      const data = await useFetch(
        `${server}/chat`,
        {
          user_input: user_msg,
          date: fechaActual.toString(),
          previous_chats: conversation,
        },
        "POST"
      );

      const assistant_message = data.respuesta;
      const funcion = data.funcion;

      console.log(funcion);

      const agent_reply: boolean = switch_agent(funcion, user_msg);

      if (agent_reply) {
        setConversation((prev) => [
          ...prev,
          {
            rol: "assistant",
            msg_number: prev.length,
            text: assistant_message,
          },
        ]);
        setAssistantResponseState(false);
        setagentAvailable(true);
        setInputValue("");
      }
    } catch (error) {
      throw new Error("Error en la solicitud");
    }
  };

  const AnalyticAgent = async (user_msg: string) => {
    try {
      const data = await useFetch(
        `${server}/analytic`,
        {
          user_input: user_msg,
          date: fechaActual.toString(),
          previous_chats: conversation,
          email: correo,
        },
        "POST"
      );

      console.log("datos de analiticas: ", data);

      if (!data.respuesta) throw new Error("Error en la solicitud");

      const grafica = data.grafica;

      setConversation((prev) => [
        ...prev,
        { rol: "assistant", msg_number: prev.length, text: data.respuesta },
      ]);

      if (grafica) {
        setConversation((prev) => [
          ...prev,
          {
            rol: "assistant",
            msg_number: prev.length,
            text: "",
            chart: {
              show: true,
              transactions: data.transacciones,
              chart_type: grafica,
              categoria: data.categoria,
              fecha_final: data.fecha_final,
              fecha_inicial: data.fecha_inicial,
            },
          },
        ]);
      }

      setagentAvailable(true);
      setAssistantResponseState(false);
    } catch (error) {
      setagentAvailable(true);
      setAssistantResponseState(false);
      console.error("Error:", error);
      return "Lo siento, hubo un error en la conversación.";
    }
  };

  const GoalAgent = async (user_msg: string) => {
    try {
      const data = await useFetch(
        `${server}/goal`,
        {
          user_input: user_msg,
          date: fechaActual.toString(),
          previous_chats: conversation,
        },
        "POST"
      );

      console.log("datos de analiticas: ", data.missing_fields);

      if (!data.respuesta) throw new Error("Error en la solicitud: ", data);

      const {
        q_goal_title,
        q_goal_amount,
        q_goal_description,
        goal_validation,
        q_deadline,
      } = data.respuesta;

      setConversation((prev) => [
        ...prev,
        {
          rol: "assistant",
          msg_number: prev.length,
          text: goal_validation.suggested_questions[0],
        },
      ]);

      if (goal_validation.is_valid) {
        setgoal_details({
          actual_amount: 0,
          description: q_goal_description,
          deadline: q_deadline,
          title: q_goal_title,
          goal_amount: q_goal_amount,
        });
        setinformation_completed(true);
      }

      setagentAvailable(true);
      setAssistantResponseState(false);
    } catch (error) {
      setagentAvailable(true);
      setAssistantResponseState(false);
      console.error("Error:", error);
      return "Lo siento, hubo un error en la conversación.";
    }
  };

  useEffect(() => {
    if (shouldFocusInput && textInputRef.current) {
      textInputRef.current.focus();
      setShouldFocusInput(false);
    }
  }, [shouldFocusInput]);

  const handleContextMessage = async (message: string) => {
    console.log("handleContextMessage");
    try {
      setagentAvailable(false);
      await MasterAgente(message);
    } catch (error) {
      console.error("Error processing context message:", error);
      setConversation((prev) => [
        ...prev,
        {
          rol: "assistant",
          msg_number: prev.length,
          text: "Lo siento, hubo un error en la conversación.",
        },
      ]);
    } finally {
      setAssistantResponseState(false);
      setagentAvailable(true);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue) return;

    if(information_completed)
      clearChat()

    const userMsg = inputValue;
    const userInput = userMsg;

    // Update conversation first
    setConversation((prev) => [
      ...prev,
      { rol: "user", msg_number: prev.length, text: userInput },
    ]);

    setAssistantResponseState(true);
    setInputValue("");

    try {
      setagentAvailable(false);
      await MasterAgente(userMsg);
    } catch (error) {
      console.error("Error processing message:", error);
      setInputValue(userMsg);
      setConversation((prev) => [
        ...prev,
        {
          rol: "assistant",
          msg_number: prev.length,
          text: "Lo siento, hubo un error en la conversación.",
        },
      ]);
      setAssistantResponseState(false);
      setagentAvailable(true);
    }
  };

  useEffect(() => {
    if(information_completed)
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [conversation]);

  const handleGoalCompleted = () => {
    console.log(goal_details);

    router.push(
      `/goal-details?q_goal_title=${goal_details?.title}&q_goal_amount=${goal_details?.goal_amount}&q_initial_amount=${goal_details?.actual_amount}&q_goal_description=${goal_details?.description}&q_plazo=${goal_details?.deadline}`
    );
  };

  const clearChat = () => {
    setAssistantResponseState(false);
    setConversation([]);
    setinformation_completed(false);
  };

  useEffect(() => {
    console.log(conversation);
    
  }, [conversation])
  

  return (
    
      <KeyboardLayout>
        <View style={{ elevation: 4, flexDirection: 'row', alignItems: 'center', position: 'relative', marginBottom: 15 }}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <TabBarIcon 
              name={"chevron-back-outline"}
              size={30}
              color="#4A4A4A" 
            />
          </TouchableOpacity>
          <Text style={{ fontSize: 24, fontWeight: '600', flex: 1, textAlign: 'center' }}>
            Tepoz AI
          </Text>

          <View style={{ position: 'absolute', right: 0 }}>
            <Pressable
              onPress={clearChat}
              disabled={!agentAvailable}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.3 : 1,
                  borderRadius: 50,
                  flexDirection: 'row',
                  alignItems: 'center',
                },
              ]}
            >
              <Ionicons
                name="add-circle-outline"
                size={30}
                style={{ marginRight: 5 }}
              />
              
            </Pressable>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          {
            conversation.length > 0 ? (
              <FlatList
                ref={flatListRef}
                data={conversation}
                renderItem={({ item }) => (
                  <ChatItem
                    item={item}
                    assistant_response_state={assistant_response_state}
                    last_msg_index={conversation.length - 1}
                    info_completed_state={information_completed}
                    onPress={handleGoalCompleted}
                    showChart
                    transactions={transactions}
                  />
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            ) : (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View
                style={{
                  width: 45,
                  height: 45,
                  alignItems: "center",
                  backgroundColor: "#20B2AA",
                  justifyContent: "center",
                  borderRadius: 100,
                  marginBottom: 45
                }}>
                  <Ionicons
                    name="aperture-outline"
                    size={40}
                    color="white"
                  />
                </View>
                <Text style={{ fontSize: 18, color: '#4A4A4A' }}>
                  Hi! I'm Tepoz AI, your financial assistant.
                </Text>
                <Text style={{ fontSize: 18, color: '#4A4A4A' }}>
                  Let's talk finance!
                </Text>
              </View>
            )
          }
        </View>


        <View
          style={{
            backgroundColor: "#ececec",
            borderRadius: 20,
            padding: 10,
            marginVertical: 10,
          }}>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flexDirection: "column", justifyContent: "flex-end" }}>
              <Pressable
                onPress={() => console.log("Mic pressed")}
                disabled={!agentAvailable}
                style={({ pressed }) => [
                  { opacity: pressed ? 0.3 : 1, borderRadius: 50 },
                ]}>
                {agentAvailable ? (
                  <Ionicons
                    name="mic-outline"
                    size={25}
                    style={{}}
                  />
                ) : (
                  <></>
                )}
              </Pressable>
            </View>
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
            <View style={{ flexDirection: "column", justifyContent: "flex-end" }}>
              <Pressable
                onPress={handleSendMessage}
                disabled={!agentAvailable}
                style={({ pressed }) => [
                  { opacity: pressed ? 0.3 : 1, borderRadius: 50 },
                ]}>
                {agentAvailable ? (
                  <Ionicons
                    name="send-sharp"
                    size={25}
                    style={{}}
                  />
                ) : (
                  <Ionicons
                    name="ellipse-outline"
                    size={25}
                    style={{ opacity: 0.3 }}
                  />
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardLayout>
  );
}

interface ChatItemProps {
  item: Conversation;
  assistant_response_state: boolean;
  last_msg_index: number;
  info_completed_state: boolean;
  onPress: () => void;
  transactions: PlaidTransaction[];
  showChart: boolean;
}

const ChatItem = ({
  item,
  assistant_response_state,
  last_msg_index,
  info_completed_state,
  onPress,
  transactions,
}: ChatItemProps) => {
  return !item.chart ? (
    <View
      style={{
        marginBottom:
          item.msg_number === last_msg_index
            ? 40
            : item.rol === "user"
            ? 20
            : 0,
        marginTop: item.rol === "user" ? 10 : 0,
      }}>
      {item.rol === "assistant" ? (
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 14,
            paddingVertical: 14,
            borderRadius: 20,
          }}>
          <View style={{ marginRight: 14 }}>
            <View
              style={{
                width: 35,
                height: 35,
                alignItems: "center",
                backgroundColor: "#20B2AA",
                justifyContent: "center",
                borderRadius: 100,
              }}>
              <Ionicons
                name="aperture-outline"
                size={25}
                color="white"
              />
            </View>
          </View>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Text style={{ fontSize: 17.5 }}>{item.text}</Text>
          </View>
        </View>
      ) : (
        <View
          style={{
            backgroundColor: "#FAFAFA",
            flexDirection: "row",
            paddingHorizontal: 14,
            paddingVertical: 14,
            borderRadius: 14,
          }}>
          <View style={{ marginRight: 14 }}>
            <View
              style={{
                width: 35,
                height: 35,
                alignItems: "center",
                backgroundColor: "#000",
                justifyContent: "center",
                borderRadius: 100,
              }}>
              <Ionicons
                name="wallet-outline"
                size={20}
                color="white"
              />
            </View>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
            }}>
            <Text style={{ fontSize: 17.5 }}>{item.text}</Text>
          </View>
        </View>
      )}

      {assistant_response_state && item.msg_number === last_msg_index && (
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 18,
            paddingVertical: 18,
            borderRadius: 20,
          }}>
          <View style={{ marginRight: 10 }}>
            <View
              style={{
                width: 35,
                height: 35,
                alignItems: "center",
                backgroundColor: "#20B2AA",
                justifyContent: "center",
                borderRadius: 100,
              }}>
              <Ionicons
                name="aperture-outline"
                size={25}
                color="white"
              />
            </View>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
            }}>
            <Text style={{ fontSize: 16 }}>TEPOZ AI is thinking...</Text>
          </View>
        </View>
      )}

      {info_completed_state && item.msg_number === last_msg_index && (
        <Pressable
          onPress={onPress}
          style={{
            backgroundColor: "#3a9343",
            width: "80%",
            borderRadius: 10,
            padding: 10,
            alignSelf: "center",
            marginTop: 15,
          }}>
          <Text style={{ fontSize: 16, color: "white", textAlign: "center" }}>
            Create Goal
          </Text>
        </Pressable>
      )}
    </View>
  ) : (
    <View
      style={{
        marginBottom: item.msg_number === last_msg_index ? 40 : 10,
        marginTop: 0,
      }}>
      <RenderGraphic
        PlaidTransaction={item.chart.transactions}
        chart_info={item.chart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
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
    position: "absolute",
  },
  backButton: {
    position: "absolute",
    left: -10,
    padding: 10,
    zIndex: 10,
  },
});
