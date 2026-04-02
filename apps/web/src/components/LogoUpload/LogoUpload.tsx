import { useRef, useState } from 'react';
import clsx from 'clsx';
import ButtonSmall from '@components/ButtonSmall/ButtonSmall';
import { UploadGray, TrashCanGray } from '@assets/icons';
import { useTeamUploadLogo, useTeamDeleteLogo } from '@api/team';
import c from './LogoUpload.module.scss';

type LogoUploadProps = {
  teamId: number;
  logoUrl?: string | null;
};

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];

const LogoUpload: React.FC<LogoUploadProps> = ({ teamId, logoUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const { mutate: uploadLogo, isPending: isUploading } = useTeamUploadLogo();
  const { mutate: deleteLogo } = useTeamDeleteLogo();

  const handleFile = (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) return;
    if (file.size > 5 * 1024 * 1024) return;
    uploadLogo({ teamId, file });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  return (
    <div className={c.wrapper}>
      <div
        className={clsx(c.dropzone, isDragOver && c.dragOver, isUploading && c.loading)}
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}>
        {logoUrl ? (
          <img src={logoUrl} alt='Team logo' className={c.logo} />
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
        <ButtonSmall
          iconSrc={TrashCanGray}
          onClick={() => deleteLogo(teamId)}
        />
      </div>
    </div>
  );
};

export default LogoUpload;
