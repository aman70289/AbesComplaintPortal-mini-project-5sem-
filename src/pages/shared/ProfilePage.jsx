/* ============================================
   ProfilePage — user profile view & edit
   ============================================ */
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Card from '@/components/common/Card';
import Avatar from '@/components/common/Avatar';

import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import SchoolIcon from '@mui/icons-material/School';
import BadgeIcon from '@mui/icons-material/Badge';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });

  const onSubmit = (data) => {
    updateProfile(data);
    setEditing(false);
    toast.success('Profile updated successfully');
  };

  const handleCancel = () => {
    reset();
    setEditing(false);
  };

  const infoItems = [
    { label: 'Full Name', value: user?.name, icon: BadgeIcon },
    { label: 'Email', value: user?.email, icon: EmailIcon },
    { label: 'Phone', value: user?.phone || '—', icon: PhoneIcon },
    { label: 'Role', value: user?.role, icon: BadgeIcon },
    { label: 'Department', value: user?.department || '—', icon: SchoolIcon },
    ...(user?.role === 'student' ? [
      { label: 'Branch', value: user?.branch || '—', icon: SchoolIcon },
      { label: 'Year', value: user?.year || '—', icon: CalendarTodayIcon },
      { label: 'Roll Number', value: user?.rollNumber || '—', icon: BadgeIcon },
    ] : [
      { label: 'Designation', value: user?.designation || '—', icon: BadgeIcon },
      { label: 'Employee ID', value: user?.employeeId || '—', icon: BadgeIcon },
    ]),
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">My Profile</h1>

      {/* Avatar Card */}
      <Card>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <Avatar name={user?.name} size="2xl" />
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">{user?.name}</h2>
            <p className="text-sm text-[var(--text-secondary)] capitalize">{user?.role} · {user?.department}</p>
            <p className="text-xs text-[var(--text-tertiary)] mt-1">{user?.email}</p>
          </div>
          <div className="sm:ml-auto">
            {!editing ? (
              <Button variant="outline" icon={EditIcon} onClick={() => setEditing(true)}>Edit Profile</Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" icon={CancelIcon} onClick={handleCancel}>Cancel</Button>
                <Button icon={SaveIcon} onClick={handleSubmit(onSubmit)}>Save</Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Profile Info */}
      <Card>
        {editing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Full Name" name="name" error={errors.name?.message} {...register('name', { required: 'Name is required' })} />
            <Input label="Email" name="email" type="email" disabled error={errors.email?.message} {...register('email')} />
            <Input label="Phone" name="phone" error={errors.phone?.message} {...register('phone')} />
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {infoItems.map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary-600/10 flex items-center justify-center shrink-0">
                  <item.icon className="text-primary-600" style={{ fontSize: 18 }} />
                </div>
                <div>
                  <p className="text-xs text-[var(--text-tertiary)]">{item.label}</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] capitalize">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProfilePage;
