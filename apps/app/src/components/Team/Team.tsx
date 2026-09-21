import { useState, type CSSProperties } from 'react';
import c from './Team.module.scss';
import {
  getCachedLogoColor,
  hexToRgba,
  PLACEHOLDER_DOMINANT_COLOR,
  resolveLogoColor,
} from './utils';

type Team = {
  name: string;
  logoUrl?: string;
};

type TeamProps = {
  team: Team;
};

const getInitialColor = (logoUrl?: string) =>
  getCachedLogoColor(logoUrl) ?? PLACEHOLDER_DOMINANT_COLOR;

export const Team: React.FC<TeamProps> = ({ team }) => {
  const [dominantColorState, setDominantColorState] = useState(() => ({
    logoUrl: team.logoUrl,
    color: getInitialColor(team.logoUrl),
  }));
  const dominantColor =
    dominantColorState.logoUrl === team.logoUrl
      ? dominantColorState.color
      : getInitialColor(team.logoUrl);
  const containerGradientStyle = {
    '--team-dominant-color': hexToRgba(dominantColor, 0.8),
  } as CSSProperties;

  const handleLogoLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    if (!team.logoUrl) return;

    setDominantColorState({
      logoUrl: team.logoUrl,
      color: resolveLogoColor(team.logoUrl, event.currentTarget),
    });
  };

  const handleLogoError = () => {
    setDominantColorState({
      logoUrl: team.logoUrl,
      color: PLACEHOLDER_DOMINANT_COLOR,
    });
  };

  return (
    <div className={c.container} style={containerGradientStyle}>
      {team.logoUrl ? (
        <img
          crossOrigin='anonymous'
          className={c.logo}
          src={team.logoUrl}
          alt={`${team.name} logo`}
          onLoad={handleLogoLoad}
          onError={handleLogoError}
        />
      ) : (
        <span className={c.logoPlaceholder} aria-hidden>
          ?
        </span>
      )}
      <span className={c.name}>{team.name}</span>
    </div>
  );
};
