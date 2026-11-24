import React, { useState } from 'react';
import apiClient from '../api/client';
import { Database, Download, RefreshCw, ShieldAlert, Upload } from 'lucide-react';
import { PageHeader, Card, CardBody, CardFooter, Button } from '../components/ui';

export const Backup = () => {
  const [loading, setLoading] = useState(false);

  const handleExportBackup = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/backup/export', { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const filename = `StoreHub_Data_Export_${new Date().toISOString().slice(0, 10)}.json`;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Backup export failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in-up">
      <PageHeader
        title="Data Export"
        description="Download an Admin-only JSON data export for offline review."
        icon={Database}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="flex flex-col">
          <CardBody className="flex-1 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-info/15 border border-info/30 text-info-soft flex items-center justify-center">
              <Download className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="text-title font-semibold text-content">Export Store Data</h3>
            <p className="text-body text-content-muted leading-relaxed">
              Generates a structured JSON export of catalog, customer, supplier, sales, purchase, inventory, user-profile,
              and audit data. Password hashes and environment secrets are not included. This is not a restorable database backup.
            </p>
          </CardBody>
          <CardFooter>
            <Button
              variant="primary"
              className="w-full"
              icon={loading ? RefreshCw : Download}
              loading={loading}
              onClick={handleExportBackup}
            >
              Export Database (JSON)
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardBody className="flex-1 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-warning/15 border border-warning/30 text-warning-soft flex items-center justify-center">
              <Upload className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="text-title font-semibold text-content">Restore Not Available</h3>
            <p className="text-body text-content-muted leading-relaxed">
              Version 1 does not import or restore JSON exports. Use a separately verified database backup procedure
              before changing production data.
            </p>
            <div className="flex items-start gap-2 p-3 rounded-md bg-danger/10 border border-danger/25 text-caption text-danger-soft">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span>No restore operation will be performed from this screen.</span>
            </div>
          </CardBody>
          <CardFooter>
            <Button type="button" variant="secondary" className="w-full" disabled>
              Restore Not Available
            </Button>
          </CardFooter>
        </Card>
      </div>

    </div>
  );
};

export default Backup;
