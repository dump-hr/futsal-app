import ButtonSmall, { BackgroundColor } from '../components/ButtonSmall';
import { Button, ModalConfirmation } from '../components';
import c from './HomePage.module.scss';
import trashCanSvg from '@assets/icons/trash-can-gray.svg';
import plusSvg from '@assets/icons/plus-gray.svg';
import {
  PlusBlack,
  XWhite,
  CheckBlack,
  TrashCanGray,
} from '@assets/index';
import { useState } from 'react';

export const HomePage = () => {
  const [activeModal, setActiveModal] = useState<
    'delete' | 'lock' | 'unlock' | null
  >(null);

  const modalConfigs = {
    delete: {
      title: 'Jeste li sigurni?',
      description: (
        <>
          Ovim postupkom izbrisat ćete
          <br />
          <strong>Skupinu A</strong>
        </>
      ),
      icon: TrashCanGray,
      circleVariant: 'gray' as const,
    },
    lock: {
      title: 'Jeste li sigurni?',
      description: (
        <>
          Ovim postupkom zaključat ćete
          <br />
          <strong>Skupinu A</strong>
        </>
      ),
      icon: CheckBlack,
      circleVariant: 'green' as const,
    },
    unlock: {
      title: 'Jeste li sigurni?',
      description: (
        <>
          Ovim postupkom otključat ćete
          <br />
          <strong>Skupinu A</strong>
        </>
      ),
      icon: CheckBlack,
      circleVariant: 'green' as const,
    },
  };

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

      {/* Modal trigger buttons */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveModal('delete')}
          style={{ padding: '10px', background: '#333', color: 'white' }}>
          Open Delete Modal
        </button>
        <button
          onClick={() => setActiveModal('lock')}
          style={{ padding: '10px', background: '#333', color: 'white' }}>
          Open Lock Modal
        </button>
        <button
          onClick={() => setActiveModal('unlock')}
          style={{ padding: '10px', background: '#333', color: 'white' }}>
          Open Unlock Modal
        </button>
      </div>

      {/* Modals */}
      {activeModal && (
        <ModalConfirmation
          title={modalConfigs[activeModal].title}
          description={modalConfigs[activeModal].description}
          icon={modalConfigs[activeModal].icon}
          circleVariant={modalConfigs[activeModal].circleVariant}
          onCancel={() => setActiveModal(null)}
          onConfirm={() => {
            console.log(`${activeModal} confirmed`);
            setActiveModal(null);
          }}
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
  );
};
