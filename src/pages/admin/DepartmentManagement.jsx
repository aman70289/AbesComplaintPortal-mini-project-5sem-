/* ============================================
   DepartmentManagement — CRUD departments
   ============================================ */
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from '@/services/adminService';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import ConfirmDialog from '@/components/common/ConfirmDialog';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BusinessIcon from '@mui/icons-material/Business';

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, editing: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [form, setForm] = useState({ name: '', shortName: '', coordinator: '' });

  const fetchDepts = async () => {
    setLoading(true);
    try {
      const res = await getDepartments();
      setDepartments(res.data);
    } catch { /* ignore */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchDepts(); }, []);

  const handleSubmit = async () => {
    try {
      if (modal.editing) {
        await updateDepartment(modal.editing, form);
        toast.success('Department updated');
      } else {
        await createDepartment(form);
        toast.success('Department created');
      }
      setModal({ open: false, editing: null });
      setForm({ name: '', shortName: '', coordinator: '' });
      fetchDepts();
    } catch { toast.error('Operation failed'); }
  };

  const handleDelete = async () => {
    try {
      await deleteDepartment(deleteDialog.id);
      toast.success('Department deleted');
      setDeleteDialog({ open: false, id: null });
      fetchDepts();
    } catch { toast.error('Failed to delete'); }
  };

  const openEdit = (dept) => {
    setForm({ name: dept.name, shortName: dept.shortName, coordinator: dept.coordinator });
    setModal({ open: true, editing: dept.id });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Department Management</h1>
        <Button icon={AddIcon} onClick={() => { setForm({ name: '', shortName: '', coordinator: '' }); setModal({ open: true, editing: null }); }}>
          Add Department
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => (
          <Card key={dept.id} hover>
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary-600/10 flex items-center justify-center">
                <BusinessIcon className="text-primary-600" style={{ fontSize: 22 }} />
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(dept)} className="p-1.5 rounded-lg hover:bg-[var(--hover-bg)] text-[var(--text-tertiary)]">
                  <EditIcon style={{ fontSize: 16 }} />
                </button>
                <button onClick={() => setDeleteDialog({ open: true, id: dept.id })} className="p-1.5 rounded-lg hover:bg-danger-500/10 text-[var(--text-tertiary)] hover:text-danger-500">
                  <DeleteIcon style={{ fontSize: 16 }} />
                </button>
              </div>
            </div>
            <h3 className="font-semibold text-[var(--text-primary)]">{dept.name}</h3>
            <p className="text-xs text-[var(--text-tertiary)] mt-1">Code: {dept.shortName}</p>
            <p className="text-xs text-[var(--text-secondary)] mt-2">
              Coordinator: {dept.coordinator || 'Not assigned'}
            </p>
          </Card>
        ))}
      </div>

      <Modal isOpen={modal.open} onClose={() => setModal({ open: false, editing: null })} title={modal.editing ? 'Edit Department' : 'Add Department'} size="sm"
        footer={<><Button variant="ghost" onClick={() => setModal({ open: false, editing: null })}>Cancel</Button><Button onClick={handleSubmit}>{modal.editing ? 'Update' : 'Create'}</Button></>}>
        <div className="space-y-4">
          <Input label="Department Name" name="name" placeholder="Computer Science & Engineering" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Short Name" name="shortName" placeholder="CSE" required value={form.shortName} onChange={(e) => setForm({ ...form, shortName: e.target.value })} />
          <Input label="Coordinator" name="coordinator" placeholder="Dr. Name" value={form.coordinator} onChange={(e) => setForm({ ...form, coordinator: e.target.value })} />
        </div>
      </Modal>

      <ConfirmDialog isOpen={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null })} onConfirm={handleDelete} title="Delete Department" message="This will remove the department and unassign its coordinator." />
    </div>
  );
};

export default DepartmentManagement;
