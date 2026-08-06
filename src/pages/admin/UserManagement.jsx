/* ============================================
   UserManagement — CRUD users (Students/Faculty)
   ============================================ */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getUsers, createUser, deleteUser } from '@/services/adminService';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import SearchBar from '@/components/common/SearchBar';
import Pagination from '@/components/common/Pagination';
import Avatar from '@/components/common/Avatar';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import EmptyState from '@/components/common/EmptyState';
import { TableSkeleton } from '@/components/common/SkeletonLoader';
import { DEPARTMENTS } from '@/utils/constants';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PeopleIcon from '@mui/icons-material/People';

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('student');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [createModal, setCreateModal] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [newUser, setNewUser] = useState({ name: '', email: '', department: '', role: 'student' });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsers(activeTab, { search, page, limit: 10 });
      setUsers(res.data);
      setPagination(res.pagination);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [activeTab, search, page]);

  const handleCreate = async () => {
    try {
      await createUser({ ...newUser, role: activeTab });
      toast.success('User created');
      setCreateModal(false);
      setNewUser({ name: '', email: '', department: '', role: 'student' });
      fetchUsers();
    } catch { toast.error('Failed to create user'); }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(deleteDialog.id);
      toast.success('User deleted');
      setDeleteDialog({ open: false, id: null });
      fetchUsers();
    } catch { toast.error('Failed to delete'); }
  };

  const tabs = [
    { key: 'student', label: 'Students' },
    { key: 'faculty', label: 'Faculty' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">User Management</h1>
        <Button icon={AddIcon} onClick={() => setCreateModal(true)}>Add User</Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[var(--bg-secondary)] rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setPage(1); setSearch(''); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <Card padding="p-4">
        <SearchBar placeholder="Search by name or email..." value={search} onChange={(v) => { setSearch(v); setPage(1); }} size="sm" debounceMs={0} />
      </Card>

      {loading ? <TableSkeleton /> : users.length === 0 ? (
        <EmptyState icon={PeopleIcon} title="No Users Found" />
      ) : (
        <Card padding="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
                  <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">User</th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)] hidden sm:table-cell">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)] hidden md:table-cell">Department</th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">Status</th>
                  <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-[var(--hover-bg)] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={u.name} size="sm" />
                        <div>
                          <p className="font-medium text-[var(--text-primary)]">{u.name}</p>
                          <p className="text-xs text-[var(--text-tertiary)]">{u.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-[var(--text-secondary)]">{u.email}</td>
                    <td className="px-4 py-3 hidden md:table-cell text-[var(--text-secondary)]">{u.department}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        u.status === 'active' ? 'bg-success-500/10 text-success-600' : 'bg-surface-200 text-surface-600'
                      }`}>{u.status}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="p-1.5 rounded-lg hover:bg-[var(--hover-bg)] text-[var(--text-tertiary)] hover:text-primary-600"><EditIcon style={{ fontSize: 18 }} /></button>
                      <button onClick={() => setDeleteDialog({ open: true, id: u.id })} className="p-1.5 rounded-lg hover:bg-danger-500/10 text-[var(--text-tertiary)] hover:text-danger-500"><DeleteIcon style={{ fontSize: 18 }} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {pagination.totalPages > 1 && <Pagination currentPage={page} totalPages={pagination.totalPages} totalItems={pagination.total} pageSize={10} onPageChange={setPage} />}

      {/* Create Modal */}
      <Modal isOpen={createModal} onClose={() => setCreateModal(false)} title={`Add ${activeTab === 'faculty' ? 'Faculty' : 'Student'}`} size="md"
        footer={<><Button variant="ghost" onClick={() => setCreateModal(false)}>Cancel</Button><Button onClick={handleCreate}>Create</Button></>}>
        <div className="space-y-4">
          <Input label="Full Name" name="name" placeholder="Enter full name" required value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
          <Input label="Email" name="email" type="email" placeholder="user@abes.ac.in" required value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
          <Select label="Department" name="department" options={DEPARTMENTS.map((d) => ({ value: d.shortName, label: d.name }))} value={newUser.department} onChange={(e) => setNewUser({ ...newUser, department: e.target.value })} />
        </div>
      </Modal>

      <ConfirmDialog isOpen={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null })} onConfirm={handleDelete} title="Delete User" message="This will permanently remove this user." />
    </div>
  );
};

export default UserManagement;
