import React, { useState } from 'react';
import { useGame } from '../App';
import BackButton from '../components/BackButton';

const ColoringBook: React.FC = () => {
  const { state, dispatch } = useGame();
  const [selectedColor, setSelectedColor] = useState('#FF6B6B');
  const [selectedScene, setSelectedScene] = useState('kite');

  const colors = [
    { id: '1', color: '#FF6B6B', name: 'Punainen' },
    { id: '2', color: '#4ECDC4', name: 'Sininen' },
    { id: '3', color: '#95E1A3', name: 'Vihreä' },
    { id: '4', color: '#FFE66D', name: 'Keltainen' },
    { id: '5', color: '#FF8C42', name: 'Oranssi' },
    { id: '6', color: '#B8B8FF', name: 'Violetti' },
    { id: '7', color: '#FF9EC7', name: 'Vaaleanpunainen' },
  ];

  const coloringScenes = {
    kite: {
      name: 'Leijalentoa',
      areas: [
        {
          id: 'kite-body',
          number: 1,
          path: 'M100,50 L150,50 L175,100 L125,125 L75,100 Z',
        },
        {
          id: 'kite-tail',
          number: 2,
          path: 'M125,125 Q130,140 125,155 Q120,170 125,185',
        },
        {
          id: 'child-head',
          number: 3,
          path: 'M50,200 Q70,180 90,200 Q70,220 50,200',
        },
        {
          id: 'child-body',
          number: 4,
          path: 'M60,220 L80,220 L85,280 L55,280 Z',
        },
        { id: 'ground', number: 5, path: 'M0,300 L300,300 L300,350 L0,350 Z' },
        { id: 'sun', number: 6, path: 'M250,30 Q270,10 290,30 Q270,50 250,30' },
        {
          id: 'cloud1',
          number: 7,
          path: 'M30,40 Q50,20 70,40 Q90,30 110,50 Q80,70 50,60 Q20,50 30,40',
        },
      ],
    },
    house: {
      name: 'Kaunis talo',
      areas: [
        {
          id: 'roof',
          number: 1,
          path: 'M50,100 L150,50 L250,100 L200,100 L100,100 Z',
        },
        {
          id: 'walls',
          number: 2,
          path: 'M100,100 L200,100 L200,200 L100,200 Z',
        },
        {
          id: 'door',
          number: 3,
          path: 'M130,150 L170,150 L170,200 L130,200 Z',
        },
        {
          id: 'window1',
          number: 4,
          path: 'M110,120 L130,120 L130,140 L110,140 Z',
        },
        {
          id: 'window2',
          number: 4,
          path: 'M170,120 L190,120 L190,140 L170,140 Z',
        },
        {
          id: 'tree',
          number: 5,
          path: 'M260,150 Q280,130 300,150 Q280,170 260,150',
        },
        { id: 'grass', number: 6, path: 'M0,200 L350,200 L350,250 L0,250 Z' },
      ],
    },
    car: {
      name: 'Hauska auto',
      areas: [
        {
          id: 'car-body',
          number: 1,
          path: 'M50,150 L250,150 L250,200 L50,200 Z',
        },
        {
          id: 'car-top',
          number: 2,
          path: 'M100,100 L200,100 L200,150 L100,150 Z',
        },
        {
          id: 'wheel1',
          number: 3,
          path: 'M80,200 Q100,180 120,200 Q100,220 80,200',
        },
        {
          id: 'wheel2',
          number: 3,
          path: 'M180,200 Q200,180 220,200 Q200,220 180,200',
        },
        {
          id: 'window',
          number: 4,
          path: 'M110,110 L190,110 L190,140 L110,140 Z',
        },
        { id: 'road', number: 5, path: 'M0,220 L300,220 L300,250 L0,250 Z' },
        { id: 'sky', number: 6, path: 'M0,0 L300,0 L300,150 L0,150 Z' },
      ],
    },
  };

  const currentScene =
    coloringScenes[selectedScene as keyof typeof coloringScenes];
  const sceneProgress = state.coloringProgress[selectedScene] || {};

  const handleAreaClick = (areaId: string) => {
    dispatch({
      type: 'UPDATE_COLORING',
      sceneId: selectedScene,
      areaId,
      color: selectedColor,
    });
  };

  const getAreaColor = (areaId: string) => {
    return sceneProgress[areaId] || '#F0F0F0';
  };

  return (
    <div className='w-full h-full p-4'>
      <BackButton />

      <div className='flex flex-col items-center h-full'>
        {/* Title */}
        <h1 className='text-4xl font-kid font-bold text-white mb-4 drop-shadow-lg'>
          🎨 Väritä kuvat! 🎨
        </h1>

        <div className='flex gap-6 w-full max-w-7xl'>
          {/* Color Palette */}
          <div className='flex-shrink-0 bg-white/90 rounded-kid-lg p-6'>
            <h3 className='text-xl font-kid font-bold text-gray-800 mb-4 text-center'>
              Valitse väri:
            </h3>
            <div className='grid grid-cols-1 gap-3'>
              {colors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color.color)}
                  className={`
                    w-16 h-16 rounded-kid border-4 text-white font-bold text-lg
                    flex items-center justify-center
                    transition-all duration-200 transform hover:scale-105
                    ${
                      selectedColor === color.color
                        ? 'border-gray-800 scale-110 shadow-lg'
                        : 'border-gray-400'
                    }
                  `}
                  style={{ backgroundColor: color.color }}
                >
                  {color.id}
                </button>
              ))}
            </div>
          </div>

          {/* Coloring Area */}
          <div className='flex-1 bg-white rounded-kid-lg p-6 border-4 border-gray-300'>
            <h2 className='text-2xl font-kid font-bold text-gray-800 mb-4 text-center'>
              {currentScene.name}
            </h2>

            <div className='flex justify-center'>
              <svg
                width='350'
                height='300'
                viewBox='0 0 350 300'
                className='border-2 border-gray-300 rounded-kid'
              >
                {currentScene.areas.map((area) => (
                  <g key={area.id}>
                    <path
                      d={area.path}
                      fill={getAreaColor(area.id)}
                      stroke='#333'
                      strokeWidth='2'
                      className='cursor-pointer hover:brightness-110 transition-all duration-200'
                      onClick={() => handleAreaClick(area.id)}
                    />
                    {/* Number overlay */}
                    <text
                      x={
                        area.path.includes('M')
                          ? area.path.split('M')[1].split(',')[0]
                          : 0
                      }
                      y={
                        area.path.includes('M')
                          ? area.path.split(',')[1].split(' ')[0]
                          : 0
                      }
                      textAnchor='middle'
                      dominantBaseline='middle'
                      fontSize='14'
                      fontWeight='bold'
                      fill='#333'
                      pointerEvents='none'
                      className='font-kid'
                    >
                      {area.number}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* Scene Selection & Instructions */}
          <div className='flex-shrink-0 flex flex-col gap-4'>
            {/* Scene Selector */}
            <div className='bg-white/90 rounded-kid-lg p-6'>
              <h3 className='text-xl font-kid font-bold text-gray-800 mb-4 text-center'>
                Valitse kuva:
              </h3>
              <div className='flex flex-col gap-3'>
                {Object.entries(coloringScenes).map(([sceneId, scene]) => (
                  <button
                    key={sceneId}
                    onClick={() => setSelectedScene(sceneId)}
                    className={`
                      p-3 rounded-kid border-4 text-center font-kid font-bold
                      transition-all duration-200 transform hover:scale-105
                      ${
                        selectedScene === sceneId
                          ? 'border-blue-500 bg-blue-100 scale-105'
                          : 'border-gray-300 bg-white'
                      }
                    `}
                  >
                    {scene.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Guide */}
            <div className='bg-white/90 rounded-kid-lg p-4 max-w-48'>
              <h3 className='text-lg font-kid font-bold text-gray-800 mb-2 text-center'>
                Väriohje:
              </h3>
              <div className='space-y-2'>
                {colors.map((color) => (
                  <div key={color.id} className='flex items-center gap-2'>
                    <div
                      className='w-6 h-6 rounded border-2 border-gray-400 flex items-center justify-center text-white font-bold text-sm'
                      style={{ backgroundColor: color.color }}
                    >
                      {color.id}
                    </div>
                    <span className='text-sm text-gray-700 font-kid'>
                      {color.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className='bg-white/90 rounded-kid-lg p-4 max-w-48'>
              <h3 className='text-lg font-kid font-bold text-gray-800 mb-2 text-center'>
                Kuinka pelata:
              </h3>
              <div className='text-sm text-gray-700 space-y-2'>
                <div>1️⃣ Valitse väri</div>
                <div>2️⃣ Klikkaa alueita, joissa on sama numero</div>
                <div>3️⃣ Pidä hauskaa värittäessä!</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColoringBook;
