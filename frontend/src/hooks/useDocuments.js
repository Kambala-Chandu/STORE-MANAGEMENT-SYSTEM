import { useState, useEffect, useCallback } from 'react';
import { documentService } from '../services/documentService';

export const useDocuments = () => {
  const [loading, setLoading] = useState(true);
  const [folders, setFolders] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [kpis, setKpis] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [filters, setFilters] = useState({ folder: '', category: '' });
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const refreshData = useCallback(async () => {
    setLoading(true);
    setFolders(await documentService.getFolders());
    setDocuments(await documentService.getDocuments());
    setKpis(await documentService.get12DocumentKPIs());
    setAnalytics(await documentService.getDocumentAnalytics());
    setLoading(false);
  }, []);

  useEffect(() => { refreshData(); }, [refreshData]);

  const handleUploadDocument = async (data) => { await documentService.uploadDocument(data); refreshData(); };
  const handleApproveDocument = async (id) => { await documentService.approveDocument(id); refreshData(); };
  const searchDocuments = async (query) => { setSearchResults(await documentService.searchDocuments(query)); };

  return { loading, folders, documents, searchResults, kpis, analytics, filters, setFilters, isExportModalOpen, setIsExportModalOpen, handleUploadDocument, handleApproveDocument, searchDocuments, refreshData };
};
