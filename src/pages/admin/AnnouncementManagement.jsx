/* ============================================
   AnnouncementManagement — CRUD announcements
   ============================================ */
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '@/services/adminService';
import { formatDate } from '@/utils/formatters';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import ConfirmDialog from '@/components/common/ConfirmDialog';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PushPinIcon from '@mui/icons-material/PushPin';
import PushPinOutlinedIcon from '@mui/icons-material/PushPin';
import CampaignIcon from '@mui/icons-material/Campaign';

const AnnouncementManagement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, editing: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [form, setForm] = useState({ title: '', content: '', author: '', isPinned: false, category: 'general' });

  const fetchAnn = async () => {
    setLoading(true);
    try {
      const res = await getAnnouncements();
      setAnnouncements(res.data);
    } catch { /* ignore */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchAnn(); }, []);

  const handleSubmit = async () => {
    try {
      if (modal.editing) {
        await updateAnnouncement(modal.editing, form);
        toast.success('Announcement updated');
      } else {
        await createAnnouncement(form);
        toast.success('Announcement created');
      }
      setModal({ open: false, editing: null });
      setForm({ title: '', content: '', author: '', isPinned: false, category: 'general' });
      fetchAnn();
    } catch { toast.error('Operation failed'); }
  };

  const handlePin = async (ann) => {
    await updateAnnouncement(ann.id, { isPinned: !ann.isPinned });
    toast.success(ann.isPinned ? 'Unpinned' : 'Pinned');
    fetchAnn();
  };

  const handleDelete = async () => {
    try {
      await deleteAnnouncement(deleteDialog.id);
      toast.success('Announcement deleted');
      setDeleteDialog({ open: false, id: null });
      fetchAnn();
    } catch { toast.error('Failed to delete'); }
  };

  const openEdit = (ann) => {
    setForm({ title: ann.title, content: ann.content, author: ann.author, isPinned: ann.isPinned, category: ann.category || 'general' });
    setModal({ open: true, editing: ann.id });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Announcements</h1>
        <Button icon={AddIcon} onClick={() => { setForm({ title: '', content: '', author: '', isPinned: false, category: 'general' }); setModal({ open: true, editing: null }); }}>
          New Announcement
        </Button>
      </div>

      <div className="space-y-4">
        {announcements.map((ann) => (
          <Card key={ann.id} padding="p-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-accent-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <CampaignIcon className="text-accent-500" style={{ fontSize: 22 }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      {ann.isPinned && <PushPinIcon className="text-accent-500" style={{ fontSize: 14 }} />}
                      <h3 className="font-semibold text-[var(--text-primary)]">{ann.title}</h3>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] mt-1 line-clamp-2">{ann.content}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-[var(--text-tertiary)]">
                      <span>{ann.author}</span>
                      <span>·</span>
                      <span>{formatDate(ann.createdAt)}</span>
                      <span className="capitalize bg-[var(--bg-secondary)] px-2 py-0.5 rounded">{ann.category}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => handlePin(ann)} className="p-1.5 rounded-lg hover:bg-[var(--hover-bg)] text-[var(--text-tertiary)]" title={ann.isPinned ? 'Unpin' : 'Pin'}>
                      {ann.isPinned ? <PushPinIcon style={{ fontSize: 16 }} /> : <PushPinOutlinedIcon style={{ fontSize: 16 }} />}
                    </button>
                    <button onClick={() => openEdit(ann)} className="p-1.5 rounded-lg hover:bg-[var(--hover-bg)] text-[var(--text-tertiary)]"><EditIcon style={{ fontSize: 16 }} /></button>
                    <button onClick={() => setDeleteDialog({ open: true, id: ann.id })} className="p-1.5 rounded-lg hover:bg-danger-500/10 text-[var(--text-tertiary)] hover:text-danger-500"><DeleteIcon style={{ fontSize: 16 }} /></button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={modal.open} onClose={() => setModal({ open: false, editing: null })} title={modal.editing ? 'Edit Announcement' : 'New Announcement'} size="md"
        footer={<><Button variant="ghost" onClick={() => setModal({ open: false, editing: null })}>Cancel</Button><Button onClick={handleSubmit}>{modal.editing ? 'Update' : 'Publish'}</Button></>}>
        <div className="space-y-4">
          <Input label="Title" name="title" placeholder="Announcement title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Input label="Content" name="content" textarea rows={4} placeholder="Announcement content..." required value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          <Input label="Author" name="author" placeholder="e.g., Examination Cell" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isPinned} onChange={(e) => setForm({ ...form, isPinned: e.target.checked })} className="rounded" />
            <span className="text-sm text-[var(--text-secondary)]">Pin this announcement</span>
          </label>
        </div>
      </Modal>

      <ConfirmDialog isOpen={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null })} onConfirm={handleDelete} title="Delete Announcement" message="This announcement will be permanently removed." />
    </div>
  );
};

export default AnnouncementManagement;
