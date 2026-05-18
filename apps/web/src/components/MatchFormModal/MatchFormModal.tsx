import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { Button } from '@components/Button';
import { ButtonSmall } from '@components/ButtonSmall';
import { DateTimePicker } from '@components/DateTimePicker';
import { FilterDropdown } from '@components/Dropdown';
import { XGray, CheckBlack, XWhite } from '@assets/icons';
import { useMatchCreate } from '@api/match';
import { useTeamsGet } from '@api/team';
import { useCloseComponent } from '@hooks/useCloseComponent';
import { useTournamentContext } from '@hooks/useTournamentContext';
import { MatchType } from '@futsal-app/types';
import { MATCH_TYPE_OPTIONS, validateMatchForm } from '@helpers/matchHelpers';
import { TeamPicker } from './TeamPicker';
import common from '../TeamFormModal/ModalCommon.module.scss';
import c from './MatchFormModal.module.scss';

type MatchFormModalProps = {
  onClose: () => void;
};

export const MatchFormModal: React.FC<MatchFormModalProps> = ({ onClose }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [matchType, setMatchType] = useState('');
  const [homeTeamId, setHomeTeamId] = useState('');
  const [awayTeamId, setAwayTeamId] = useState('');

  const { mutate: createMatch, isPending: isCreating } = useMatchCreate();

  const tournamentId = useTournamentContext();
  const { data: teams } = useTeamsGet(tournamentId);

  const modalRef = useRef<HTMLDivElement>(null);
  const { overlayRef } = useCloseComponent({ onClose, containerRef: modalRef });

  const teamOptions: { label: string; value: string }[] = (teams ?? []).map(
    (t) => ({ label: t.name, value: String(t.id) }),
  );

  const homeTeam = teams?.find((t) => String(t.id) === homeTeamId);
  const awayTeam = teams?.find((t) => String(t.id) === awayTeamId);

  const handleSubmit = () => {
    const error = validateMatchForm({
      date,
      time,
      matchType,
      homeTeamId,
      awayTeamId,
    });

    if (error) {
      toast.error(error);
      return;
    }

    createMatch(
      {
        timeOfMatch: new Date(`${date}T${time}`),
        homeTeamId: Number(homeTeamId),
        awayTeamId: Number(awayTeamId),
        matchType: matchType as `${MatchType}`,
      },
      { onSuccess: onClose },
    );
  };

  return (
    <div className={`${common.overlay} ${c.overlay}`} ref={overlayRef}>
      <div className={c.modal} ref={modalRef} role='dialog'>
        <div className={common.header}>
          <div className={common.headerText}>
            <h2 className={common.title}>Nova utakmica</h2>
            <p className={common.subtitle}>
              Unesi vrijeme, datum i ostale informacije bitne za novu utakmicu
            </p>
          </div>
          <div className={c.closeButton}>
            <ButtonSmall iconSrc={XGray} hasBorder onClick={onClose} />
          </div>
        </div>

        <div className={c.topRow}>
          <DateTimePicker
            date={date}
            time={time}
            onDateChange={setDate}
            onTimeChange={setTime}
          />
          <div className={c.field}>
            <label className={c.label}>Tip utakmice</label>
            <div className={c.dropdownWrap}>
              <FilterDropdown
                value={matchType}
                options={MATCH_TYPE_OPTIONS}
                onChange={setMatchType}
                variant='default'
                placeholder='Odaberi tip'
              />
            </div>
          </div>
        </div>

        <div className={c.teamsSection}>
          <p className={c.sectionLabel}>Ekipe</p>
          <div className={c.teamsRow}>
            <TeamPicker
              label='Ekipa #1'
              team={homeTeam}
              value={homeTeamId}
              options={teamOptions}
              onChange={setHomeTeamId}
            />

            <span className={c.vs}>VS</span>

            <TeamPicker
              label='Ekipa #2'
              team={awayTeam}
              value={awayTeamId}
              options={teamOptions}
              onChange={setAwayTeamId}
            />
          </div>
        </div>

        <div className={common.footer}>
          <Button icon={XWhite} variant='secondary' onClick={onClose}>
            Odustani
          </Button>
          <Button
            icon={CheckBlack}
            variant='primary'
            onClick={handleSubmit}
            disabled={isCreating}>
            Spremi
          </Button>
        </div>
      </div>
    </div>
  );
};
