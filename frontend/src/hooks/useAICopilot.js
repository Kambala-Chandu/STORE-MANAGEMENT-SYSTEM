import { useState, useEffect, useCallback } from 'react';
import { aiCopilotService } from '../services/aiCopilotService';
import { Toast } from '../components/ui/Toast';

export const useAICopilot = () => {
  const [loading, setLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState([]);
  const [insights, setInsights] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [forecasts, setForecasts] = useState(null);
  const [kpis, setKpis] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [filters, setFilters] = useState({ query: '' });
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [ins, rec, ano, fore, k] = await Promise.all([
        aiCopilotService.getInsights(),
        aiCopilotService.getRecommendations(),
        aiCopilotService.getAnomalies(),
        aiCopilotService.getForecasts(),
        aiCopilotService.get12AIKPIs()
      ]);
      setInsights(ins); setRecommendations(rec); setAnomalies(ano); setForecasts(fore); setKpis(k);
      setChatMessages(aiCopilotService.getConversationHistory());
    } catch (e) {
      console.error(e);
      Toast?.error('Failed to load AI Copilot data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSendMessage = useCallback(async (msg) => {
    if (!msg.trim()) return;
    const userMsg = { role: 'user', content: msg, timestamp: new Date().toISOString() };
    const updatedHistory = [...chatMessages, userMsg];
    setChatMessages(updatedHistory);
    setInputMessage('');
    setIsChatLoading(true);
    try {
      const res = await aiCopilotService.simulateChat(msg);
      const aiMsg = { role: 'ai', content: res.response, confidence: res.confidence, timestamp: new Date().toISOString() };
      const finalHistory = [...updatedHistory, aiMsg];
      setChatMessages(finalHistory);
      aiCopilotService.saveConversationHistory(finalHistory);
    } catch (e) {
      console.error(e);
    } finally {
      setIsChatLoading(false);
    }
  }, [chatMessages]);

  const clearChat = useCallback(() => {
    setChatMessages([]);
    aiCopilotService.saveConversationHistory([]);
  }, []);

  const refreshData = fetchData;

  return { loading, chatMessages, insights, recommendations, anomalies, forecasts, kpis, inputMessage, setInputMessage, isChatLoading, handleSendMessage, clearChat, filters, setFilters, isExportModalOpen, setIsExportModalOpen, refreshData };
};
