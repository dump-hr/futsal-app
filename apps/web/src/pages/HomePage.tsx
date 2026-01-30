import { Button } from '../components';
import { ButtonColor, ButtonIcon, IconColor } from '@futsal-app/types';

export const HomePage = () => {
  return (
    <div
      style={{
        backgroundColor: '#141414',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}>
      <Button>Nova utakmica</Button>

      <Button
        color={ButtonColor.GREEN}
        hoverColor={ButtonColor.BLACK}
        icon={ButtonIcon.ARROW}
        iconColor={IconColor.BLACK}
        hoverIconColor={IconColor.GREEN}>
        Login
      </Button>

      <Button
        color={ButtonColor.DARK_GRAY}
        hoverColor={ButtonColor.BLACK}
        icon={ButtonIcon.X}
        iconColor={IconColor.BLACK}
        hoverIconColor={IconColor.DARK_GRAY}>
        Cancel
      </Button>

      <Button
        color={ButtonColor.GREEN}
        hoverColor={ButtonColor.BLACK}
        icon={ButtonIcon.PLUS}
        iconColor={IconColor.BLACK}
        hoverIconColor={IconColor.GREEN}>
        Green
      </Button>

      <Button
        color={ButtonColor.WHITE}
        hoverColor={ButtonColor.GRAY}
        icon={ButtonIcon.CLOCK}
        iconColor={IconColor.GRAY}>
        Time
      </Button>
    </div>
  );
};
