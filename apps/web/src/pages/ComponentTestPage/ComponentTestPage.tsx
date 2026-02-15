import { MatchInfo, MatchStage, MatchStatus } from '@components/MatchInfo';
import infobipLogo from '../../../public/test-logos/infobip.png';
import otpLogo from '../../../public/test-logos/otp.png';

export const ComponentTestPage = () => {
  return (
    <div
      style={{
        background: 'green',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}>
      Component Test Page
      <MatchInfo
        teamA={{ teamName: 'Ericsson Nikola Tesla', logoUrl: otpLogo }}
        teamB={{ teamName: 'Maurer Electronics', logoUrl: infobipLogo }}
        matchTime={'21:30'}
        teamAScore={3}
        teamBScore={1}
        matchStage={MatchStage.QUARTER_FINALS}
        matchStatus={MatchStatus.LIVE}
      />
    </div>
  );
};
