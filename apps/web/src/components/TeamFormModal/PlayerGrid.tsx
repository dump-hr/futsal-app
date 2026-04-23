import { ButtonSmall, Input } from '@components/index';
import { PlusBlack } from '@assets/icons';
import { BackgroundColor } from '@types';
import c from './TeamFormModal.module.scss';

export type PlayerEntry = {
  id?: number;
  firstName: string;
  lastName: string;
};

type PlayerGridProps = {
  players: PlayerEntry[];
  onEditPlayer: (index: number) => void;
  onAddPlayer: () => void;
};

const PlayerGrid: React.FC<PlayerGridProps> = ({
  players,
  onEditPlayer,
  onAddPlayer,
}) => {
  const cols = 3;
  const totalSlots = players.length + 1;
  const perCol = Math.max(3, Math.ceil(totalSlots / cols));

  let placed = 0;
  let newRowPlaced = false;

  const columns = Array.from({ length: cols }, (_, colIndex) => {
    const start = placed;
    const columnPlayers = players.slice(start, start + perCol);
    placed += columnPlayers.length;
    const showNewRow =
      !newRowPlaced &&
      columnPlayers.length < perCol &&
      start + columnPlayers.length === players.length;
    if (showNewRow) newRowPlaced = true;

    if (columnPlayers.length === 0 && !showNewRow) return null;

    return (
      <div key={colIndex} className={c.playerColumn}>
        {columnPlayers.map((player, i) => {
          const globalIndex = start + i;
          return (
            <div
              key={player.id ?? `new-${globalIndex}`}
              className={c.playerRow}
              onClick={() => onEditPlayer(globalIndex)}>
              <span className={c.playerLabel}>Igrač #{globalIndex + 1}</span>
              <Input
                value={`${player.firstName} ${player.lastName}`}
                readOnly
              />
            </div>
          );
        })}
        {showNewRow && (
          <div className={c.playerRow}>
            <span className={c.playerLabel}>Igrač #{players.length + 1}</span>
            <div className={c.newPlayerRow}>
              <div className={c.newPlayerInput}>
                <Input
                  value=''
                  readOnly
                  placeholder='Ime i prezime'
                  onClick={onAddPlayer}
                />
              </div>
              <ButtonSmall
                backgroundColor={BackgroundColor.White}
                iconSrc={PlusBlack}
                onClick={onAddPlayer}
              />
            </div>
          </div>
        )}
      </div>
    );
  });

  return <div className={c.playerList}>{columns}</div>;
};

export default PlayerGrid;
