import { useLocation } from "react-router-dom";
import ChatVoiceComponent from "../../components/ChatVoiceComponent";
import Layout from "../../components/Layout";

const Chat = () => {
  const location = useLocation();
  const { state } = location;
  return <Layout children={<ChatVoiceComponent formData={state} />} />;
};

export default Chat;
