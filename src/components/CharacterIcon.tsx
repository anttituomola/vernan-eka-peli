import React from 'react';
import { Group, Circle, Rect, Image } from 'react-konva';
import { Character } from '../types';

interface CharacterIconProps {
  character: Character;
  size?: number;
  x?: number;
  y?: number;
}

export const CharacterIcon: React.FC<CharacterIconProps> = ({
  character,
  size = 40,
  x = 0,
  y = 0,
}) => {
  const scale = size / 60; // Base scale for 60px default size
  const centerX = x;
  const centerY = y;

  // Use saved colors from character
  const getHeadColor = () => character.colors.head;
  const getTorsoColor = () => character.colors.torso;
  const getArmColor = () => character.colors.arms;
  const getLegColor = () => character.colors.legs;
  const getFeetColor = () => character.colors.feet;

  // Eye color logic based on eye type
  const getEyeColor = () => {
    switch (character.parts.eyes) {
      case 'blue_led':
        return '#1E40AF'; // dark blue
      case 'red_laser':
        return '#DC2626'; // dark red
      case 'green_scan':
        return '#059669'; // emerald
      default:
        return '#059669';
    }
  };

  return (
    <Group x={centerX} y={centerY}>
      {/* Legs/Base - drawn first (behind torso) */}
      {character.parts.legs === 'wheels' ? (
        <>
          <Circle
            x={-8 * scale}
            y={15 * scale}
            radius={6 * scale}
            fill={getLegColor()}
            stroke='#1E293B'
            strokeWidth={0.5}
          />
          <Circle
            x={8 * scale}
            y={15 * scale}
            radius={6 * scale}
            fill={getLegColor()}
            stroke='#1E293B'
            strokeWidth={0.5}
          />
        </>
      ) : character.parts.legs === 'treads' ? (
        <Rect
          x={-12 * scale}
          y={10 * scale}
          width={24 * scale}
          height={8 * scale}
          fill={getLegColor()}
          stroke='#1E293B'
          strokeWidth={0.5}
          cornerRadius={2 * scale}
        />
      ) : (
        <>
          <Rect
            x={-8 * scale}
            y={8 * scale}
            width={4 * scale}
            height={12 * scale}
            fill={getLegColor()}
            stroke='#1E293B'
            strokeWidth={0.5}
          />
          <Rect
            x={4 * scale}
            y={8 * scale}
            width={4 * scale}
            height={12 * scale}
            fill={getLegColor()}
            stroke='#1E293B'
            strokeWidth={0.5}
          />
        </>
      )}

      {/* Torso */}
      <Rect
        x={-10 * scale}
        y={-5 * scale}
        width={20 * scale}
        height={15 * scale}
        fill={getTorsoColor()}
        stroke='#1E293B'
        strokeWidth={0.5}
        cornerRadius={character.parts.torso === 'rounded' ? 4 * scale : 0}
      />

      {/* Arms */}
      <Rect
        x={-15 * scale}
        y={-2 * scale}
        width={5 * scale}
        height={10 * scale}
        fill={getArmColor()}
        stroke='#1E293B'
        strokeWidth={0.5}
        cornerRadius={character.parts.arms === 'mechanical' ? 2 * scale : 0}
      />
      <Rect
        x={10 * scale}
        y={-2 * scale}
        width={5 * scale}
        height={10 * scale}
        fill={getArmColor()}
        stroke='#1E293B'
        strokeWidth={0.5}
        cornerRadius={character.parts.arms === 'mechanical' ? 2 * scale : 0}
      />

      {/* Feet (only if not wheels) */}
      {character.parts.legs !== 'wheels' &&
        character.parts.legs !== 'treads' && (
          <>
            <Rect
              x={-10 * scale}
              y={20 * scale}
              width={6 * scale}
              height={4 * scale}
              fill={getFeetColor()}
              stroke='#1E293B'
              strokeWidth={0.5}
              cornerRadius={character.parts.feet === 'boots' ? 1 * scale : 0}
            />
            <Rect
              x={4 * scale}
              y={20 * scale}
              width={6 * scale}
              height={4 * scale}
              fill={getFeetColor()}
              stroke='#1E293B'
              strokeWidth={0.5}
              cornerRadius={character.parts.feet === 'boots' ? 1 * scale : 0}
            />
          </>
        )}

      {/* Head */}
      {character.parts.head === 'round' ? (
        <Circle
          x={0}
          y={-15 * scale}
          radius={8 * scale}
          fill={getHeadColor()}
          stroke='#1E293B'
          strokeWidth={0.5}
        />
      ) : (
        <Rect
          x={-8 * scale}
          y={-23 * scale}
          width={16 * scale}
          height={16 * scale}
          fill={getHeadColor()}
          stroke='#1E293B'
          strokeWidth={0.5}
          cornerRadius={character.parts.head === 'hexagon' ? 3 * scale : 0}
        />
      )}

      {/* Eyes */}
      <Circle
        x={-3 * scale}
        y={-15 * scale}
        radius={1.5 * scale}
        fill={getEyeColor()}
      />
      <Circle
        x={3 * scale}
        y={-15 * scale}
        radius={1.5 * scale}
        fill={getEyeColor()}
      />

      {/* Antenna/Ears (simplified representation) */}
      {character.parts.ears && character.parts.ears !== 'none' && (
        <>
          <Circle
            x={-6 * scale}
            y={-22 * scale}
            radius={2 * scale}
            fill='#94A3B8'
            stroke='#1E293B'
            strokeWidth={0.5}
          />
          <Circle
            x={6 * scale}
            y={-22 * scale}
            radius={2 * scale}
            fill='#94A3B8'
            stroke='#1E293B'
            strokeWidth={0.5}
          />
        </>
      )}
    </Group>
  );
};

export default CharacterIcon;
