import { useContext, useState } from 'react';
import { ArrowDownWhite } from '@assets/index';
import { ModalTournamentHistory } from '@components/index';
import { TournamentContext } from '@context/index';
import c from './TournamentBadge.module.scss';

export const TournamentBadge = () => {
  const { tournament, isLoading } = useContext(TournamentContext) ?? {
    tournament: null,
    isLoading: false,
  };

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  if (isLoading || !tournament) return null;

  return (
    <>
      <button
        className={c.badge}
        aria-label='Promijeni turnir'
        onClick={() => setIsHistoryOpen(true)}>
        <span className={c.name} title={tournament.name}>
          {tournament.name}
        </span>
        <img className={c.chevron} src={ArrowDownWhite} alt='' />
      </button>

      {isHistoryOpen && (
        <ModalTournamentHistory onClose={() => setIsHistoryOpen(false)} />
      )}
    </>
  );
};
