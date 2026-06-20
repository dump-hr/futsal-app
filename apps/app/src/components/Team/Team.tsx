import { useState, type CSSProperties } from 'react';
import c from './Team.module.scss';
import {
  getDominantLogoColor,
  hexToRgba,
  PLACEHOLDER_DOMINANT_COLOR,
} from './utils';

type Team = {
  name: string;
  logoUrl?: string;
};

type TeamProps = {
  team: Team;
};

export const Team: React.FC<TeamProps> = ({ team }) => {
  const [dominantColorState, setDominantColorState] = useState({
    logoUrl: team.logoUrl,
    color: PLACEHOLDER_DOMINANT_COLOR,
  });
  const dominantColor =
    dominantColorState.logoUrl === team.logoUrl
      ? dominantColorState.color
      : PLACEHOLDER_DOMINANT_COLOR;
  const containerGradientStyle = {
    background: `linear-gradient(180deg, rgba(0, 0, 0, 0.80) 0%, ${hexToRgba(
      dominantColor,
      0.8,
    )} 100%)`,
  } as CSSProperties;

  const handleLogoLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const detectedColor = getDominantLogoColor(event.currentTarget);
    const nextDominantColor = detectedColor ?? PLACEHOLDER_DOMINANT_COLOR;

    setDominantColorState({
      logoUrl: team.logoUrl,
      color: nextDominantColor,
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
