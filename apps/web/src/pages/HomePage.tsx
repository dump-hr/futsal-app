import {
  Button,
  ModalConfirmation,
  ButtonSmall,
  EventDropdown,
  MatchEventCard,
  MatchPanel,
} from '@components/index';
import { BackgroundColor } from '../types';
import { useState } from 'react';
import { EventType } from '@futsal-app/types';
import c from './HomePage.module.scss';
import trashCanSvg from '@assets/icons/trash-can-gray.svg';
import plusSvg from '@assets/icons/plus-gray.svg';
import { PlusBlack, XWhite, CheckBlack, TrashCanBlack } from '@assets/index';

export const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [showSecondaryModal, setShowSecondaryModal] = useState(false);

  const [eventLeft, setEventLeft] = useState<EventType | null>(null);
  const [eventRight, setEventRight] = useState<EventType | null>(null);
  const [penaltyEvent, setPenaltyEvent] = useState<EventType | null>(null);

  return (
    <div
      style={{
        background: 'gray',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <h1 className={c.a}>Title 1</h1>
        <h1 className={c.b}>Title 1</h1>
        <h1 className={c.c}>Title 1</h1>
      </div>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <EventDropdown side='left' value={eventLeft} onChange={setEventLeft} />
        <EventDropdown
          side='right'
          value={eventRight}
          onChange={setEventRight}
        />
        <EventDropdown
          side='left'
          isPenaltyShootout
          value={penaltyEvent}
          onChange={setPenaltyEvent}
        />
      </div>

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

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <MatchEventCard
          side='left'
          teamId={1}
          isNew
          onSave={(data) => console.log('save', data)}
          onDelete={() => console.log('delete')}
        />
        <MatchEventCard
          side='right'
          teamId={1}
          isNew
          onSave={(data) => console.log('save', data)}
          onDelete={() => console.log('delete')}
        />
      </div>

      <MatchPanel matchId={6} onClose={() => console.log('close')} />
    </div>
  );
};
