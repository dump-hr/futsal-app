import { useLocation } from 'wouter';
import { MatchDto } from '@futsal-app/types';
import { Button, Group } from '@components/index';
import { useGroupGet } from '@api/index';
import { routes } from '@routes/index';
import c from './MatchStanding.module.scss';

type MatchStandingProps = {
  match: MatchDto;
};

export const MatchStanding = ({ match }: MatchStandingProps) => {
  const [, setLocation] = useLocation();
  const groupId =
    match.homeTeam?.groupId ??
    match.homeTeam?.group?.id ??
    match.awayTeam?.groupId ??
    match.awayTeam?.group?.id;

  const { data: group, isLoading, isError } = useGroupGet(groupId ?? 0);

  if (!groupId) return <p className={c.message}>Nema skupine</p>;
  if (isLoading) return <p className={c.message}>Učitavanje…</p>;
  if (isError || !group)
    return <p className={c.message}>Greška pri učitavanju skupine</p>;

  return (
    <div className={c.container}>
      <Group group={group} />
      <Button onClick={() => setLocation(routes.GROUPS)}>Ostale skupine</Button>
    </div>
  );
};
