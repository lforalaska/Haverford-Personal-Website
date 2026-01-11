import { UploadForm } from '@/components/admin/UploadForm';

export default function AdminUploadPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Upload Essay</h1>
        <p className="mt-2 text-gray-600">
          Upload a new markdown essay with metadata
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <UploadForm />
      </div>
    </div>
  );
}
