import { useEffect, useState, type CSSProperties } from 'react';
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
  const [dominantColor, setDominantColor] = useState(
    PLACEHOLDER_DOMINANT_COLOR,
  );
  const containerGradientStyle = {
    background: `linear-gradient(180deg, rgba(0, 0, 0, 0.80) 0%, ${hexToRgba(
      dominantColor,
      0.8,
    )} 100%)`,
  } as CSSProperties;

  useEffect(() => {
    setDominantColor(PLACEHOLDER_DOMINANT_COLOR);
  }, [team.logoUrl]);

  return (
    <div className={c.container} style={containerGradientStyle}>
      {team.logoUrl ? (
        <img
          crossOrigin='anonymous'
          className={c.logo}
          src={team.logoUrl}
          alt={`${team.name} logo`}
          onLoad={(event) => {
            const detectedColor = getDominantLogoColor(event.currentTarget);
            const nextDominantColor =
              detectedColor ?? PLACEHOLDER_DOMINANT_COLOR;

            setDominantColor(nextDominantColor);
          }}
          onError={() => {
            setDominantColor(PLACEHOLDER_DOMINANT_COLOR);
          }}
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
