import ButtonSmall, { BackgroundColor } from '../components/ButtonSmall';
import c from './HomePage.module.scss';
import trashCanSvg from '@assets/icons/trash-can-gray.svg';
import plusSvg from '@assets/icons/plus-gray.svg';

export const HomePage = () => {
  return (
    <div style={{ background: 'black' }}>
      <h1 className={c.a}>Title 1</h1>
      <h1 className={c.b}>Title 1</h1>
      <h1 className={c.c}>Title 1</h1>
      <ButtonSmall
        iconSrc={trashCanSvg}
        hasBorder
        backgroundColor={BackgroundColor.Lime}
      />
      <ButtonSmall
        iconSrc={plusSvg}
        width={40}
        backgroundColor={BackgroundColor.Red}
      />
    </div>
  );
};
