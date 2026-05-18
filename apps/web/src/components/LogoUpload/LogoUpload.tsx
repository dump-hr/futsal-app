import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import { ButtonSmall } from '@components/ButtonSmall';
import { UploadGray, TrashCanGray } from '@assets/icons';
import c from './LogoUpload.module.scss';

type LogoUploadProps = {
  logoUrl?: string | null;
  file?: File | null;
  removed?: boolean;
  onFileChange: (file: File | null) => void;
};

const ACCEPTED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'image/webp',
];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const isValidFile = (f: File) =>
  ACCEPTED_TYPES.includes(f.type) && f.size <= MAX_FILE_SIZE;

export const LogoUpload: React.FC<LogoUploadProps> = ({
  logoUrl,
  file,
  removed,
  onFileChange,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const displayUrl = previewUrl ?? (removed ? null : logoUrl);

  const handleFile = (picked: File | null) => {
    if (picked && !isValidFile(picked)) {
      toast.error(
        ACCEPTED_TYPES.includes(picked.type)
          ? 'Datoteka je prevelika'
          : 'Format nije podržan',
      );
      return;
    }

    onFileChange(picked);
    if (picked) toast.success('Logo odabran');
  };

  const handleDrag = (e: React.DragEvent, over: boolean) => {
    e.preventDefault();
    setIsDragOver(over);
  };

  const handleDrop = (e: React.DragEvent) => {
    handleDrag(e, false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    if (picked) handleFile(picked);
    e.target.value = '';
  };

  return (
    <div className={c.wrapper}>
      <div
        className={clsx(c.dropzone, isDragOver && c.dragOver)}
        onDragOver={(e) => handleDrag(e, true)}
        onDragEnter={(e) => handleDrag(e, true)}
        onDragLeave={(e) => handleDrag(e, false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}>
        {displayUrl ? (
          <img src={displayUrl} alt='Team logo' className={c.logo} />
        ) : (
          <span className={c.placeholder}>LOGO</span>
        )}
      </div>

      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        className={c.hiddenInput}
        onChange={handleInputChange}
      />

      <div className={c.actions}>
        <ButtonSmall
          iconSrc={UploadGray}
          onClick={() => fileInputRef.current?.click()}
        />
        <ButtonSmall iconSrc={TrashCanGray} onClick={() => handleFile(null)} />
      </div>
    </div>
  );
};
