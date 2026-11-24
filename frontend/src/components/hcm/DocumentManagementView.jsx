import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Download,
  Eye,
  Search,
  Filter,
  ShieldCheck,
  Calendar,
  CheckCircle,
  Plus,
  Paperclip
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { useToast } from '../ui/Toast';

export function DocumentManagementView({
  documents = [],
  onUploadDocument,
  onRefresh
}) {
  const { addToast } = useToast();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const [newDoc, setNewDoc] = useState({
    title: '',
    category: 'Corporate Policy',
    version: 'v1.0',
    notes: ''
  });

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!newDoc.title) {
      addToast({ title: 'Validation Error', message: 'Document title is required.', type: 'danger' });
      return;
    }
    onUploadDocument(newDoc);
    setIsUploadModalOpen(false);
    setNewDoc({
      title: '',
      category: 'Corporate Policy',
      version: 'v1.0',
      notes: ''
    });
  };

  const filtered = documents.filter((d) => {
    const matchCat = filterCategory === 'ALL' || d.category === filterCategory;
    const matchSearch = !searchTerm ||
      d.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.category?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-4">
      {/* Control bar */}
      <div className="p-4 rounded-xl border border-white/10 bg-[#0B1329] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Classification:</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Document Types</option>
            <option value="Corporate Policy">Corporate Policy</option>
            <option value="SOP Manual">SOP Manual</option>
            <option value="Safety & Compliance">Safety & Compliance</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search policies, SOPs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#050A16] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsUploadModalOpen(true)}
            className="text-xs shadow-md shadow-primary/20"
          >
            <Upload className="w-3.5 h-3.5 mr-1" />
            Upload Document
          </Button>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((doc) => (
          <div
            key={doc.id}
            className="p-5 rounded-xl border border-white/10 bg-[#0B1329] space-y-3 hover:border-primary/40 transition group"
          >
            <div className="flex items-start justify-between">
              <div className="p-2 rounded-lg bg-primary/15 text-primary">
                <FileText className="w-5 h-5" />
              </div>
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-[10px]">
                {doc.status}
              </Badge>
            </div>

            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                {doc.category} • {doc.version}
              </span>
              <h4 className="text-sm font-bold text-white mt-1 group-hover:text-primary transition line-clamp-2">
                {doc.title}
              </h4>
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-[11px]">{doc.file_size} • {doc.date}</span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    addToast({
                      title: 'Document Downloaded',
                      message: `${doc.title} saved to workstation.`,
                      type: 'success'
                    });
                  }}
                  className="p-1.5 text-primary hover:text-white"
                  title="Download File"
                >
                  <Download className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload HR Compliance Document"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1">Document Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Retail POS Cash Handling Standard"
              value={newDoc.title}
              onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Category</label>
              <select
                value={newDoc.category}
                onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Corporate Policy">Corporate Policy</option>
                <option value="SOP Manual">SOP Manual</option>
                <option value="Safety & Compliance">Safety & Compliance</option>
                <option value="Employment Contract">Employment Contract</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Version</label>
              <input
                type="text"
                value={newDoc.version}
                onChange={(e) => setNewDoc({ ...newDoc, version: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#050A16] border border-white/10 text-white font-mono focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl border border-dashed border-white/20 bg-[#050A16] text-center space-y-2">
            <Upload className="w-6 h-6 text-slate-400 mx-auto" />
            <div className="text-white font-medium">Select file or drag PDF here</div>
            <p className="text-[11px] text-slate-500">Max size 25MB • PDF, DOCX, XLSX</p>
          </div>

          <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsUploadModalOpen(false)}
              className="text-xs border-white/10 text-slate-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="text-xs"
            >
              Upload to Vault
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
