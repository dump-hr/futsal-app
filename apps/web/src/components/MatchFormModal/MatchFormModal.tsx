import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { Button, ButtonSmall, FilterDropdown } from '@components/index';
import TeamPicker from './TeamPicker';
import DateTimePicker from './DateTimePicker';
import { XGray, CheckBlack, XWhite } from '@assets/icons';
import { useMatchCreate, useMatchUpdate, useMatchGet } from '@api/match';
import { useTeamsGet } from '@api/team';
import { useCloseComponent } from '@hooks/index';
import { MatchType } from '@futsal-app/types';
import { MATCH_TYPE_OPTIONS } from '@helpers/matchHelpers';
import { formatLocalDate, formatLocalTime, validateTime } from '@helpers/formatMatchDate';
import common from '../TeamFormModal/ModalCommon.module.scss';
import c from './MatchFormModal.module.scss';

// TODO: Get tournament ID from URL params or context
const TOURNAMENT_ID = 1;

type MatchFormModalProps = {
  onClose: () => void;
  matchId?: number;
};

const MatchFormModal: React.FC<MatchFormModalProps> = ({ onClose, matchId }) => {
  const isEdit = matchId !== undefined;

  const { data: existingMatch } = useMatchGet(matchId ?? 0);
  const { mutate: createMatch, isPending: isCreating } = useMatchCreate();
  const { mutate: updateMatch, isPending: isUpdating } = useMatchUpdate();
  const { data: teams } = useTeamsGet(TOURNAMENT_ID);

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [matchType, setMatchType] = useState('');
  const [homeTeamId, setHomeTeamId] = useState('');
  const [awayTeamId, setAwayTeamId] = useState('');
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (existingMatch && isEdit && !initialized) {
      const dt = new Date(existingMatch.timeOfMatch);
      setDate(formatLocalDate(dt));
      setTime(formatLocalTime(dt));
      setMatchType(existingMatch.matchType);
      setHomeTeamId(String(existingMatch.homeTeam?.id ?? ''));
      setAwayTeamId(String(existingMatch.awayTeam?.id ?? ''));
      setInitialized(true);
    }
  }, [existingMatch, isEdit, initialized]);

  const modalRef = useRef<HTMLDivElement>(null);
  const { overlayRef } = useCloseComponent({ onClose, containerRef: modalRef });

  const teamOptions: { label: string; value: string }[] = (teams ?? []).map(
    (t) => ({ label: t.name, value: String(t.id) }),
  );

  const homeTeam = teams?.find((t) => String(t.id) === homeTeamId);
  const awayTeam = teams?.find((t) => String(t.id) === awayTeamId);

  const handleSubmit = () => {
    if (!date || !time || !matchType) {
      toast.error('Molimo ispunite sva polja');
      return;
    }

    const timeError = validateTime(time);
    if (timeError) {
      toast.error(timeError);
      return;
    }
    if (!isEdit && (!homeTeamId || !awayTeamId)) {
      toast.error('Molimo odaberite ekipe');
      return;
    }
    if (!isEdit && homeTeamId === awayTeamId) {
      toast.error('Ekipe moraju biti različite');
      return;
    }

    if (isEdit) {
      updateMatch(
        {
          id: matchId,
          dto: {
            timeOfMatch: new Date(`${date}T${time}`),
            matchType: matchType as `${MatchType}`,
          },
        },
        { onSuccess: onClose },
      );
    } else {
      createMatch(
        {
          timeOfMatch: new Date(`${date}T${time}`),
          homeTeamId: Number(homeTeamId),
          awayTeamId: Number(awayTeamId),
          matchType: matchType as `${MatchType}`,
        },
        { onSuccess: onClose },
      );
    }
  };

  if (isEdit && !initialized) return null;

  return (
    <div className={`${common.overlay} ${c.overlay}`} ref={overlayRef}>
      <div className={c.modal} ref={modalRef} role='dialog'>
        <div className={common.header}>
          <div className={common.headerText}>
            <h2 className={common.title}>
              {isEdit ? 'Uredi utakmicu' : 'Nova utakmica'}
            </h2>
            <p className={common.subtitle}>
              {isEdit
                ? 'Uredi datum, vrijeme ili tip utakmice'
                : 'Unesi vrijeme, datum i ostale informacije bitne za novu utakmicu'}
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
              disabled={isEdit}
            />

            <span className={c.vs}>VS</span>

            <TeamPicker
              label='Ekipa #2'
              team={awayTeam}
              value={awayTeamId}
              options={teamOptions}
              onChange={setAwayTeamId}
              disabled={isEdit}
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
            disabled={isCreating || isUpdating}>
            Spremi
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MatchFormModal;
