'use client';

import { useState, FormEvent, ChangeEvent } from 'react';

export function UploadForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(
    new Date().toLocaleDateString('en-CA') // YYYY-MM-DD format
  );
  const [slug, setSlug] = useState('');
  const [tags, setTags] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [draft, setDraft] = useState(false);
  const [autoGenerateSlug, setAutoGenerateSlug] = useState(true);

  // Auto-generate slug from title
  const generateSlug = (titleText: string) => {
    return titleText
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);

      // Auto-fill title from filename if empty
      if (!title) {
        const fileName = selectedFile.name.replace(/\.md$/, '');
        const titleFromFile = fileName
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (l) => l.toUpperCase());
        setTitle(titleFromFile);

        if (autoGenerateSlug) {
          setSlug(generateSlug(titleFromFile));
        }
      }
    }
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);

    if (autoGenerateSlug) {
      setSlug(generateSlug(newTitle));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Parse tags (comma-separated)
      const tagArray = tags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      if (tagArray.length === 0) {
        setError('At least one tag is required');
        setLoading(false);
        return;
      }

      // Create form data
      const formData = new FormData();
      formData.append('file', file!);
      formData.append('title', title);
      formData.append('date', date);
      formData.append('slug', slug);
      formData.append('tags', JSON.stringify(tagArray));
      formData.append('excerpt', excerpt);
      formData.append('draft', String(draft));

      // Upload essay
      const uploadResponse = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const uploadData = await uploadResponse.json();

      if (!uploadData.success) {
        setError(uploadData.message || 'Upload failed');
        setLoading(false);
        return;
      }

      // Trigger rebuild
      const rebuildResponse = await fetch('/api/admin/rebuild', {
        method: 'POST',
      });

      const rebuildData = await rebuildResponse.json();

      if (!rebuildData.success) {
        setError('Essay uploaded but rebuild failed. Refresh manually.');
      } else {
        setSuccess(
          `Essay "${title}" uploaded successfully! ${
            draft ? '(Draft)' : 'View at /essays/' + uploadData.slug
          }`
        );

        // Reset form
        setFile(null);
        setTitle('');
        setSlug('');
        setTags('');
        setExcerpt('');
        setDraft(false);

        // Reset file input
        const fileInput = document.getElementById('file') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('An error occurred during upload');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="rounded-lg bg-green-50 border border-green-200 p-4">
          <p className="text-sm text-green-800">{success}</p>
        </div>
      )}

      {/* File Upload */}
      <div>
        <label
          htmlFor="file"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Markdown File *
        </label>
        <input
          id="file"
          type="file"
          accept=".md"
          onChange={handleFileChange}
          required
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
        />
        <p className="mt-1 text-sm text-gray-500">Upload a .md file</p>
      </div>

      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Title *
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={handleTitleChange}
          required
          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {/* Date */}
      <div>
        <label
          htmlFor="date"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Published Date *
        </label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {/* Slug */}
      <div>
        <label
          htmlFor="slug"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Slug *
        </label>
        <div className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            id="auto-slug"
            checked={autoGenerateSlug}
            onChange={(e) => setAutoGenerateSlug(e.target.checked)}
            className="rounded"
          />
          <label htmlFor="auto-slug" className="text-sm text-gray-600">
            Auto-generate from title
          </label>
        </div>
        <input
          id="slug"
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          disabled={autoGenerateSlug}
          required
          pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <p className="mt-1 text-sm text-gray-500">
          Lowercase letters, numbers, and hyphens only
        </p>
      </div>

      {/* Tags */}
      <div>
        <label
          htmlFor="tags"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Tags *
        </label>
        <input
          id="tags"
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          required
          placeholder="writing, personal, technology"
          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <p className="mt-1 text-sm text-gray-500">
          Comma-separated tags (e.g., &quot;writing, personal, technology&quot;)
        </p>
      </div>

      {/* Excerpt */}
      <div>
        <label
          htmlFor="excerpt"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Excerpt *
        </label>
        <textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          required
          rows={3}
          minLength={50}
          maxLength={300}
          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <p className="mt-1 text-sm text-gray-500">
          {excerpt.length}/300 characters (min 50, max 300)
        </p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Uploading...' : 'Upload Essay'}
      </button>
    </form>
  );
}
