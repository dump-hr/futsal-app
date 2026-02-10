import ButtonSmall, { BackgroundColor } from '../components/ButtonSmall';
import { Button, ModalConfirmation } from '@components/index';
import c from './HomePage.module.scss';
import trashCanSvg from '@assets/icons/trash-can-gray.svg';
import plusSvg from '@assets/icons/plus-gray.svg';
import { PlusBlack, XWhite, CheckBlack, TrashCanBlack } from '@assets/index';
import { useState } from 'react';

export const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [showSecondaryModal, setShowSecondaryModal] = useState(false);

  return (
    <div
      style={{
        background: 'black',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}>
      <div
        style={{
          background: 'black',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}>
        <h1 className={c.a}>Title 1</h1>
        <h1 className={c.b}>Title 1</h1>
        <h1 className={c.c}>Title 1</h1>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Button icon={PlusBlack} variant='primary'>
            Nova utakmica
          </Button>
          <Button icon={XWhite} variant='secondary'>
            Odustani
          </Button>
          <Button icon={CheckBlack} variant='green'>
            Potvrdi
          </Button>
        </div>

        <button
          onClick={() => setShowModal(true)}
          style={{ padding: '10px', background: '#333', color: 'white' }}>
          Open Modal
        </button>
        <button
          onClick={() => setShowSecondaryModal(true)}
          style={{ padding: '10px', background: '#333', color: 'white' }}>
          Open Modal
        </button>

        {showSecondaryModal && (
          <ModalConfirmation
            description='Ovim postupkom pokrenut ćeš utakmicu '
            boldText='Maurer Electronics vs Ericsson Nikola Tesla'
            icon={TrashCanBlack}
            circleVariant='green'
            onCancel={() => setShowSecondaryModal(false)}
            onConfirm={() => setShowSecondaryModal(false)}
          />
        )}

        {showModal && (
          <ModalConfirmation
            description='Ovim postupkom izbrisat ćete'
            boldText='Skupinu A'
            icon={TrashCanBlack}
            circleVariant='gray'
            onCancel={() => setShowModal(false)}
            onConfirm={() => setShowModal(false)}
          />
        )}

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
    </div>
  );
};
