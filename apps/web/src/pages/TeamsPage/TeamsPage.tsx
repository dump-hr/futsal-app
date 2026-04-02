import { Button, FilterDropdown, TeamInfo } from '@components/index';
import { PlusBlack } from '@assets/icons';
import { useTeamsGet } from '@api/team/useTeamsGet';
import c from './TeamsPage.module.scss';

const TOURNAMENT_ID = 1;

export const TeamsPage = () => {
  const { data: teams } = useTeamsGet(TOURNAMENT_ID);

  return (
    <div className={c.page}>
      <div className={c.header}>
        <h1 className={c.title}>EKIPE</h1>
        <Button icon={PlusBlack} variant='primary'>
          Nova ekipa
        </Button>
      </div>

      <div className={c.filters}>
        <span className={c.filterLabel}>Filtriraj</span>
        <div className={c.filterDropdowns}>
          <FilterDropdown label='Abecedno' />
          <FilterDropdown label='Skupina' />
        </div>
      </div>

      <div className={c.teamListSection}>
        <div className={c.columnHeaders}>
          <span>Naziv</span>
          <div className={c.columnRight}>
            <span>Broj bodova</span>
            <div className={c.columnInner}>
              <span>Skupina</span>
              <span>Broj igrača</span>
              <span>Broj utakmica</span>
            </div>
          </div>
        </div>

        <div className={c.teamList}>
          {teams?.map((team) => (
            <TeamInfo
              key={team.id}
              teamName={team.name}
              teamLogoUrl={team.logoUrl ?? ''}
              teamScore={0}
              teamGroup={team.group ?? '-'}
              numberOfPlayers={0}
              numberOfMatchesPlayed={0}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
