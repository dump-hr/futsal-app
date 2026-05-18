import { useState } from 'react';
import { HistoryBlack, PlusBlack } from '@assets/icons';
import c from './StartingPage.module.scss';
import { Button } from '@components/Button';
import { ModalNewTournament } from '@components/ModalNewTournament';
import { ModalTournamentHistory } from '@components/ModalTournamentHistory';

type Modal = 'new' | 'history' | null;

export const StartingPage = () => {
  const [openModal, setOpenModal] = useState<Modal>(null);

  return (
    <div className={c.page}>
      <div className={c.actions}>
        <Button
          icon={HistoryBlack}
          variant='primary'
          onClick={() => setOpenModal('history')}>
          Pregledaj turnire
        </Button>
        <Button
          icon={PlusBlack}
          variant='green'
          onClick={() => setOpenModal('new')}>
          Započni novi turnir
        </Button>
      </div>

      {openModal === 'new' && (
        <ModalNewTournament onClose={() => setOpenModal(null)} />
      )}
      {openModal === 'history' && (
        <ModalTournamentHistory onClose={() => setOpenModal(null)} />
      )}
    </div>
  );
};
