import {
  Button,
  ModalConfirmation,
  ButtonSmall,
  EventDropdown,
  Search,
  MatchEventCard,
  Input,
} from '@components/index';
import { BackgroundColor } from '../types';
import { useState } from 'react';
import { EventType, PlayerDto } from '@futsal-app/types';

const MOCK_PLAYERS: PlayerDto[] = [
  { id: 1, firstName: 'Ivan', lastName: 'Horvat' },
  { id: 2, firstName: 'Marko', lastName: 'Kovač' },
  { id: 3, firstName: 'Luka', lastName: 'Perić' },
  { id: 4, firstName: 'Ante', lastName: 'Babić' },
  { id: 5, firstName: 'Toma', lastName: 'Gej' },
];
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

  const [searchValue, setSearchValue] = useState<string>('');

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

      <div style={{ backgroundColor: 'black', padding: '10px' }}>
        <Search
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <MatchEventCard
          side='left'
          players={MOCK_PLAYERS}
          isNew
          onSave={(data) => console.log('save', data)}
          onDelete={() => console.log('delete')}
        />
        <MatchEventCard
          side='right'
          players={MOCK_PLAYERS}
          isNew
          onSave={(data) => console.log('save', data)}
          onDelete={() => console.log('delete')}
        />
      </div>

      <div
        style={{
          backgroundColor: 'black',
          padding: '30px',
          display: 'flex',
          gap: '30px',
          flexDirection: 'column',
        }}>
        <Input placeholder='Ericsson Nikola Tesla Jos Nesto' />

        <Input
          label='Ime ekipe'
          placeholder='Ericsson Nikola Tesla Jos Nesto'
        />
      </div>
    </div>
  );
};
