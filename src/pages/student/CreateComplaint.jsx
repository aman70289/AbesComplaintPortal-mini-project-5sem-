/* ============================================
   CreateComplaint — full complaint form
   ============================================ */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { createComplaint } from '@/services/complaintService';
import { validationRules } from '@/utils/validators';
import { COMPLAINT_CATEGORIES, DEPARTMENTS, ROUTES } from '@/utils/constants';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import Card from '@/components/common/Card';
import Modal from '@/components/common/Modal';
import Badge from '@/components/common/Badge';
import Breadcrumb from '@/components/layout/Breadcrumb';

import SendIcon from '@mui/icons-material/Send';
import SaveIcon from '@mui/icons-material/Save';
import PreviewIcon from '@mui/icons-material/Preview';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import DescriptionIcon from '@mui/icons-material/Description';
import ImageIcon from '@mui/icons-material/Image';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const priorityOptions = [
  { value: 'low', label: '🟢 Low' },
  { value: 'medium', label: '🟡 Medium' },
  { value: 'high', label: '🟠 High' },
  { value: 'urgent', label: '🔴 Urgent' },
];

const departmentOptions = DEPARTMENTS.map((d) => ({ value: d.id, label: d.name }));
const categoryOptions = COMPLAINT_CATEGORIES.map((c) => ({ value: c.value, label: `${c.icon} ${c.label}` }));

const CreateComplaint = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const { register, handleSubmit, watch, formState: { errors }, getValues, reset } = useForm({
    defaultValues: {
      title: '',
      category: '',
      department: '',
      description: '',
      priority: 'medium',
      location: '',
      expectedResolution: '',
    },
  });

  const descriptionValue = watch('description', '');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const complaintData = {
        ...data,
        isAnonymous,
        createdBy: isAnonymous ? 'anonymous' : user?.id,
        createdByName: isAnonymous ? 'Anonymous' : user?.name,
        department: DEPARTMENTS.find((d) => d.id === data.department)?.name || data.department,
        departmentId: data.department,
        attachments: files.map((f) => ({
          name: f.name,
          size: f.size,
          type: f.type,
        })),
      };

      await createComplaint(complaintData);
      toast.success('Complaint submitted successfully!');
      navigate(ROUTES.STUDENT_MY_COMPLAINTS);
    } catch (err) {
      toast.error(err.message || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = () => {
    toast.success('Draft saved locally');
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...newFiles].slice(0, 5));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles].slice(0, 5));
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formValues = getValues();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Breadcrumb items={[
        { label: 'Dashboard', path: ROUTES.STUDENT_DASHBOARD, isLast: false },
        { label: 'Create Complaint', path: '#', isLast: true },
      ]} />

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Create New Complaint</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Fill in the details below to submit your complaint. All fields marked with * are required.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-5">Basic Information</h3>
          <div className="space-y-4">
            <Input
              label="Complaint Title"
              name="title"
              placeholder="Brief title describing the issue"
              required
              error={errors.title?.message}
              {...register('title', validationRules.complaintTitle)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Category"
                name="category"
                options={categoryOptions}
                placeholder="Select category"
                required
                error={errors.category?.message}
                {...register('category', { required: 'Category is required' })}
              />

              <Select
                label="Department"
                name="department"
                options={departmentOptions}
                placeholder="Select department"
                required
                error={errors.department?.message}
                {...register('department', { required: 'Department is required' })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Priority"
                name="priority"
                options={priorityOptions}
                required
                error={errors.priority?.message}
                {...register('priority', { required: 'Priority is required' })}
              />

              <Input
                label="Location"
                name="location"
                placeholder="e.g., Block C, Floor 3, Room 301"
                error={errors.location?.message}
                {...register('location')}
              />
            </div>

            <Input
              label="Description"
              name="description"
              textarea
              rows={5}
              placeholder="Describe the issue in detail. Include when it started, how it affects you, and any steps already taken..."
              required
              maxLength={2000}
              currentLength={descriptionValue.length}
              error={errors.description?.message}
              {...register('description', validationRules.complaintDescription)}
            />

            <Input
              label="Expected Resolution Date"
              name="expectedResolution"
              type="date"
              error={errors.expectedResolution?.message}
              {...register('expectedResolution')}
            />
          </div>
        </Card>

        {/* File Upload */}
        <Card>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-5">Attachments</h3>

          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
              ${dragActive
                ? 'border-primary-500 bg-primary-500/5'
                : 'border-[var(--border-color)] hover:border-primary-400 hover:bg-[var(--hover-bg)]'
              }
            `}
          >
            <CloudUploadIcon className="text-[var(--text-tertiary)] mx-auto mb-3" style={{ fontSize: 40 }} />
            <p className="text-sm text-[var(--text-secondary)] mb-1">
              Drag & drop files here or{' '}
              <label className="text-primary-600 font-medium cursor-pointer hover:text-primary-700">
                browse
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </p>
            <p className="text-xs text-[var(--text-tertiary)]">
              Supports: JPEG, PNG, WebP, PDF · Max 5MB per file · Up to 5 files
            </p>
          </div>

          {/* File list */}
          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]"
                >
                  {file.type.startsWith('image') ? (
                    <ImageIcon className="text-primary-600 shrink-0" style={{ fontSize: 20 }} />
                  ) : (
                    <DescriptionIcon className="text-danger-500 shrink-0" style={{ fontSize: 20 }} />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[var(--text-primary)] truncate">{file.name}</p>
                    <p className="text-xs text-[var(--text-tertiary)]">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="p-1 rounded hover:bg-danger-500/10 text-[var(--text-tertiary)] hover:text-danger-500 transition-colors"
                  >
                    <CloseIcon style={{ fontSize: 18 }} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Anonymous Option */}
        <Card>
          <div className="flex items-start gap-4">
            <div className={`
              w-12 h-12 rounded-xl flex items-center justify-center shrink-0
              ${isAnonymous ? 'bg-primary-600/10' : 'bg-[var(--bg-secondary)]'}
            `}>
              <VisibilityOffIcon className={isAnonymous ? 'text-primary-600' : 'text-[var(--text-tertiary)]'} style={{ fontSize: 24 }} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-[var(--text-primary)]">Submit Anonymously</h4>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    Your identity will be hidden from the assigned staff and public view
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  className={`
                    relative w-11 h-6 rounded-full transition-colors duration-300
                    ${isAnonymous ? 'bg-primary-600' : 'bg-surface-300 dark:bg-surface-600'}
                  `}
                  role="switch"
                  aria-checked={isAnonymous}
                >
                  <span className={`
                    absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300
                    ${isAnonymous ? 'translate-x-5' : 'translate-x-0'}
                  `} />
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Button type="submit" icon={SendIcon} size="lg" loading={loading} className="w-full sm:w-auto">
            Submit Complaint
          </Button>
          <Button type="button" variant="outline" icon={SaveIcon} size="lg" onClick={handleSaveDraft} className="w-full sm:w-auto">
            Save Draft
          </Button>
          <Button type="button" variant="ghost" icon={PreviewIcon} size="lg" onClick={() => setShowPreview(true)} className="w-full sm:w-auto">
            Preview
          </Button>
        </div>
      </form>

      {/* Preview Modal */}
      <Modal isOpen={showPreview} onClose={() => setShowPreview(false)} title="Complaint Preview" size="lg">
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-semibold text-[var(--text-primary)]">{formValues.title || 'Untitled'}</h4>
            <div className="flex items-center gap-2 mt-2">
              {formValues.priority && <Badge type="priority" value={formValues.priority} />}
              {formValues.category && (
                <span className="text-xs bg-[var(--bg-secondary)] px-2 py-1 rounded-full text-[var(--text-secondary)]">
                  {COMPLAINT_CATEGORIES.find((c) => c.value === formValues.category)?.label || formValues.category}
                </span>
              )}
              {isAnonymous && (
                <span className="text-xs bg-surface-200 dark:bg-surface-700 px-2 py-1 rounded-full text-[var(--text-secondary)]">
                  Anonymous
                </span>
              )}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-[var(--text-tertiary)] mb-1">Department</p>
            <p className="text-sm text-[var(--text-primary)]">{DEPARTMENTS.find((d) => d.id === formValues.department)?.name || '—'}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-[var(--text-tertiary)] mb-1">Location</p>
            <p className="text-sm text-[var(--text-primary)]">{formValues.location || '—'}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-[var(--text-tertiary)] mb-1">Description</p>
            <p className="text-sm text-[var(--text-primary)] whitespace-pre-wrap">{formValues.description || '—'}</p>
          </div>
          {files.length > 0 && (
            <div>
              <p className="text-xs font-medium text-[var(--text-tertiary)] mb-1">Attachments ({files.length})</p>
              <div className="flex flex-wrap gap-2">
                {files.map((f, i) => (
                  <span key={i} className="text-xs bg-[var(--bg-secondary)] px-2 py-1 rounded-lg text-[var(--text-secondary)]">{f.name}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default CreateComplaint;
