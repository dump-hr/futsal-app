import { useState } from 'react';
import { ButtonSmall, Input } from '@components/index';
import { PlusBlack, XBlack } from '@assets/icons';
import { BackgroundColor } from '@types';
import c from './TeamFormModal.module.scss';
import toast from 'react-hot-toast';

export type PlayerEntry = {
  id?: number;
  firstName: string;
  lastName: string;
};

type PlayerGridProps = {
  players: PlayerEntry[];
  onUpdatePlayer: (index: number, patch: Partial<PlayerEntry>) => void;
  onRequestDeletePlayer: (index: number) => void;
  onAddPlayer: (player: { firstName: string; lastName: string }) => void;
};

const PlayerGrid: React.FC<PlayerGridProps> = ({
  players,
  onUpdatePlayer,
  onRequestDeletePlayer,
  onAddPlayer,
}) => {
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');

  const handleAdd = () => {
    const fn = newFirstName.trim();
    const ln = newLastName.trim();

    if (!fn && !ln) {
      toast.error('Unesite ime i prezime igrača');
      return;
    }

    onAddPlayer({ firstName: fn, lastName: ln });
    setNewFirstName('');
    setNewLastName('');
  };

  return (
    <div className={c.playerList}>
      {players.map((player, i) => (
        <div key={player.id ?? `new-${i}`} className={c.playerRow}>
          <span className={c.playerLabel}>Igrač #{i + 1}</span>
          <div className={c.playerFields}>
            <Input
              value={player.firstName}
              onChange={(e) => onUpdatePlayer(i, { firstName: e.target.value })}
              placeholder='Ime'
            />
            <Input
              value={player.lastName}
              onChange={(e) => onUpdatePlayer(i, { lastName: e.target.value })}
              placeholder='Prezime'
            />

            <ButtonSmall
              backgroundColor={BackgroundColor.White}
              iconSrc={XBlack}
              onClick={() => onRequestDeletePlayer(i)}
              aria-label='Izbriši igrača'
            />
          </div>
        </div>
      ))}

      <div className={c.playerRow}>
        <span className={c.playerLabel}>Igrač #{players.length + 1}</span>
        <div className={c.playerFields}>
          <Input
            value={newFirstName}
            onChange={(e) => setNewFirstName(e.target.value)}
            placeholder='Ime'
          />
          <Input
            value={newLastName}
            onChange={(e) => setNewLastName(e.target.value)}
            placeholder='Prezime'
          />

          <ButtonSmall
            backgroundColor={BackgroundColor.White}
            iconSrc={PlusBlack}
            onClick={handleAdd}
            aria-label='Dodaj igrača'
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerGrid;
