/* ============================================
   ConfirmDialog — confirmation dialog
   ============================================ */
import Modal from './Modal';
import Button from './Button';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger', // danger, primary, warning
  loading = false,
  icon: CustomIcon,
}) => {
  const iconColors = {
    danger: 'text-danger-500 bg-danger-500/10',
    primary: 'text-primary-600 bg-primary-600/10',
    warning: 'text-accent-500 bg-accent-500/10',
  };

  const Icon = CustomIcon || WarningAmberIcon;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showClose={false}>
      <div className="text-center">
        <div className={`w-14 h-14 rounded-full ${iconColors[variant]} flex items-center justify-center mx-auto mb-4`}>
          <Icon style={{ fontSize: 28 }} />
        </div>

        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{title}</h3>
        <p className="text-sm text-[var(--text-secondary)] mb-6">{message}</p>

        <div className="flex gap-3 justify-center">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button variant={variant === 'danger' ? 'danger' : 'primary'} onClick={onConfirm} loading={loading}>
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
