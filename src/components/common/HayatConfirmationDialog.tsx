import React from 'react';
import { useTranslation } from 'react-i18next';

interface HayatConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export const HayatConfirmationDialog: React.FC<HayatConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="hayat-confirmation-dialog">
      <h3>{title}</h3>
      <p>{message}</p>
      <button onClick={onConfirm}>{t('common.confirm')}</button>
      <button onClick={onClose}>{t('common.cancel')}</button>
    </div>
  );
};
