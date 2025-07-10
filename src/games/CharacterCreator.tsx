import React, { useState, useEffect } from 'react';
import { Stage, Layer, Group, Image } from 'react-konva';
import { useGame } from '../App';
import BackButton from '../components/BackButton';

// Utility to create robot part thumbnails for selection buttons
const createRobotPartThumbnail = (
  partType: 'head' | 'eyes' | 'antennas' | 'torso' | 'arms' | 'legs' | 'feet',
  variant: string,
  color: string = '#94A3B8'
): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  canvas.width = 120;
  canvas.height = 120;
  const ctx = canvas.getContext('2d')!;

  // Clear canvas
  ctx.clearRect(0, 0, 120, 120);

  // Center position for thumbnails
  const center = { x: 60, y: 60 };

  // Set common styles
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (partType === 'head') {
    // Draw different head shapes (larger for thumbnails)
    ctx.fillStyle = color;
    ctx.strokeStyle = '#1E293B'; // slate-800

    switch (variant) {
      case 'round':
        ctx.beginPath();
        ctx.arc(center.x, center.y, 40, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        break;

      case 'square':
        ctx.fillRect(center.x - 40, center.y - 40, 80, 80);
        ctx.strokeRect(center.x - 40, center.y - 40, 80, 80);
        break;

      case 'hexagon':
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const x = center.x + 40 * Math.cos(angle);
          const y = center.y + 40 * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
    }
  }

  if (partType === 'eyes') {
    const eyeLeft = { x: center.x - 20, y: center.y };
    const eyeRight = { x: center.x + 20, y: center.y };

    switch (variant) {
      case 'blue_led':
        // Blue circular LEDs (larger for thumbnail)
        ctx.fillStyle = '#3B82F6'; // blue-500
        ctx.strokeStyle = '#1E40AF'; // blue-800
        ctx.beginPath();
        ctx.arc(eyeLeft.x, eyeLeft.y, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(eyeRight.x, eyeRight.y, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Add LED glow effect
        ctx.fillStyle = '#DBEAFE'; // blue-100
        ctx.beginPath();
        ctx.arc(eyeLeft.x, eyeLeft.y, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(eyeRight.x, eyeRight.y, 8, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'red_laser':
        // Red rectangular laser eyes (larger)
        ctx.fillStyle = '#EF4444'; // red-500
        ctx.strokeStyle = '#B91C1C'; // red-700
        ctx.fillRect(eyeLeft.x - 18, eyeLeft.y - 8, 36, 16);
        ctx.strokeRect(eyeLeft.x - 18, eyeLeft.y - 8, 36, 16);
        ctx.fillRect(eyeRight.x - 18, eyeRight.y - 8, 36, 16);
        ctx.strokeRect(eyeRight.x - 18, eyeRight.y - 8, 36, 16);
        break;

      case 'green_scan':
        // Green scanning lines (larger)
        ctx.strokeStyle = '#10B981'; // emerald-500
        ctx.lineWidth = 3;

        // Horizontal scanning lines
        for (let i = 0; i < 4; i++) {
          const y = center.y - 12 + i * 8;
          ctx.beginPath();
          ctx.moveTo(eyeLeft.x - 20, y);
          ctx.lineTo(eyeLeft.x + 20, y);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(eyeRight.x - 20, y);
          ctx.lineTo(eyeRight.x + 20, y);
          ctx.stroke();
        }

        // Add scanner borders
        ctx.strokeStyle = '#047857'; // emerald-700
        ctx.lineWidth = 2;
        ctx.strokeRect(eyeLeft.x - 22, eyeLeft.y - 16, 44, 32);
        ctx.strokeRect(eyeRight.x - 22, eyeRight.y - 16, 44, 32);
        break;
    }
  }

  if (partType === 'antennas') {
    ctx.strokeStyle = '#374151'; // gray-700
    ctx.lineWidth = 4;

    switch (variant) {
      case 'straight':
        // Simple straight antenna (larger)
        ctx.beginPath();
        ctx.moveTo(center.x, center.y + 20);
        ctx.lineTo(center.x, center.y - 30);
        ctx.stroke();

        // Add antenna tip
        ctx.fillStyle = '#EF4444'; // red-500
        ctx.beginPath();
        ctx.arc(center.x, center.y - 30, 8, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'coiled':
        // Coiled spring antenna (larger)
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(center.x, center.y + 20);

        // Create coil pattern
        for (let i = 0; i <= 25; i++) {
          const y = center.y + 20 - i * 2;
          const x = center.x + Math.sin(i * 0.6) * 12;
          ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Add antenna ball
        ctx.fillStyle = '#F59E0B'; // amber-500
        ctx.beginPath();
        ctx.arc(center.x, center.y - 30, 10, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'satellite':
        // Satellite dish antenna (larger)
        ctx.lineWidth = 3;

        // Antenna pole
        ctx.beginPath();
        ctx.moveTo(center.x, center.y + 10);
        ctx.lineTo(center.x, center.y - 15);
        ctx.stroke();

        // Dish
        ctx.fillStyle = '#D1D5DB'; // gray-300
        ctx.strokeStyle = '#374151'; // gray-700
        ctx.beginPath();
        ctx.ellipse(center.x, center.y - 15, 30, 15, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Dish center
        ctx.fillStyle = '#6B7280'; // gray-500
        ctx.beginPath();
        ctx.arc(center.x, center.y - 15, 8, 0, Math.PI * 2);
        ctx.fill();
        break;
    }
  }

  if (partType === 'torso') {
    ctx.fillStyle = color;
    ctx.strokeStyle = '#1E293B'; // slate-800
    ctx.lineWidth = 3;

    switch (variant) {
      case 'rectangular':
        // Basic rectangular torso
        ctx.fillRect(center.x - 25, center.y - 30, 50, 60);
        ctx.strokeRect(center.x - 25, center.y - 30, 50, 60);

        // Add some details
        ctx.strokeStyle = '#475569'; // slate-600
        ctx.lineWidth = 2;
        ctx.strokeRect(center.x - 15, center.y - 20, 30, 15);
        ctx.strokeRect(center.x - 10, center.y, 20, 10);
        break;

      case 'rounded':
        // Rounded capsule torso
        ctx.beginPath();
        ctx.roundRect(center.x - 25, center.y - 30, 50, 60, 15);
        ctx.fill();
        ctx.stroke();

        // Add circular details
        ctx.fillStyle = '#475569'; // slate-600
        ctx.beginPath();
        ctx.arc(center.x, center.y - 15, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(center.x, center.y + 5, 6, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'armored':
        // Angular armored torso
        ctx.beginPath();
        ctx.moveTo(center.x - 25, center.y - 20);
        ctx.lineTo(center.x - 30, center.y - 30);
        ctx.lineTo(center.x + 30, center.y - 30);
        ctx.lineTo(center.x + 25, center.y - 20);
        ctx.lineTo(center.x + 25, center.y + 25);
        ctx.lineTo(center.x - 25, center.y + 25);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Add armor plates
        ctx.strokeStyle = '#64748B'; // slate-500
        ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
          const y = center.y - 15 + i * 15;
          ctx.beginPath();
          ctx.moveTo(center.x - 20, y);
          ctx.lineTo(center.x + 20, y);
          ctx.stroke();
        }
        break;
    }
  }

  if (partType === 'arms') {
    ctx.strokeStyle = '#374151'; // gray-700
    ctx.lineWidth = 4;

    switch (variant) {
      case 'basic':
        // Simple tube arms
        ctx.fillStyle = color;
        ctx.strokeStyle = '#1E293B'; // slate-800

        // Left arm
        ctx.fillRect(center.x - 45, center.y - 10, 15, 40);
        ctx.strokeRect(center.x - 45, center.y - 10, 15, 40);

        // Right arm
        ctx.fillRect(center.x + 30, center.y - 10, 15, 40);
        ctx.strokeRect(center.x + 30, center.y - 10, 15, 40);
        break;

      case 'mechanical':
        // Segmented mechanical arms
        ctx.fillStyle = color;
        ctx.strokeStyle = '#374151'; // gray-700

        // Left arm segments
        ctx.fillRect(center.x - 45, center.y - 10, 15, 18);
        ctx.strokeRect(center.x - 45, center.y - 10, 15, 18);
        ctx.fillRect(center.x - 45, center.y + 12, 15, 18);
        ctx.strokeRect(center.x - 45, center.y + 12, 15, 18);

        // Right arm segments
        ctx.fillRect(center.x + 30, center.y - 10, 15, 18);
        ctx.strokeRect(center.x + 30, center.y - 10, 15, 18);
        ctx.fillRect(center.x + 30, center.y + 12, 15, 18);
        ctx.strokeRect(center.x + 30, center.y + 12, 15, 18);

        // Joint circles
        ctx.fillStyle = '#374151'; // gray-700
        ctx.beginPath();
        ctx.arc(center.x - 37.5, center.y + 8, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(center.x + 37.5, center.y + 8, 4, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'claws':
        // Arms with claw hands
        ctx.fillStyle = color;
        ctx.strokeStyle = '#1E293B'; // slate-800

        // Left arm
        ctx.fillRect(center.x - 45, center.y - 10, 15, 35);
        ctx.strokeRect(center.x - 45, center.y - 10, 15, 35);

        // Right arm
        ctx.fillRect(center.x + 30, center.y - 10, 15, 35);
        ctx.strokeRect(center.x + 30, center.y - 10, 15, 35);

        // Claws
        ctx.strokeStyle = '#DC2626'; // red-600
        ctx.lineWidth = 2;

        // Left claws
        for (let i = 0; i < 3; i++) {
          const x = center.x - 42 + i * 3;
          ctx.beginPath();
          ctx.moveTo(x, center.y + 25);
          ctx.lineTo(x, center.y + 35);
          ctx.stroke();
        }

        // Right claws
        for (let i = 0; i < 3; i++) {
          const x = center.x + 33 + i * 3;
          ctx.beginPath();
          ctx.moveTo(x, center.y + 25);
          ctx.lineTo(x, center.y + 35);
          ctx.stroke();
        }
        break;
    }
  }

  if (partType === 'legs') {
    ctx.fillStyle = color;
    ctx.strokeStyle = '#1E293B'; // slate-800
    ctx.lineWidth = 3;

    switch (variant) {
      case 'basic':
        // Simple rectangular legs
        ctx.fillRect(center.x - 20, center.y - 20, 12, 40);
        ctx.strokeRect(center.x - 20, center.y - 20, 12, 40);
        ctx.fillRect(center.x + 8, center.y - 20, 12, 40);
        ctx.strokeRect(center.x + 8, center.y - 20, 12, 40);
        break;

      case 'wheels':
        // Wheel base instead of legs
        ctx.fillStyle = color;
        ctx.strokeStyle = '#1F2937'; // gray-800

        // Base platform
        ctx.fillRect(center.x - 25, center.y - 5, 50, 10);
        ctx.strokeRect(center.x - 25, center.y - 5, 50, 10);

        // Wheels
        ctx.fillStyle = '#111827'; // gray-900
        ctx.beginPath();
        ctx.arc(center.x - 15, center.y + 10, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(center.x + 15, center.y + 10, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        break;

      case 'treads':
        // Tank-like treads (centered)
        ctx.fillStyle = color;
        ctx.strokeStyle = '#1F2937'; // gray-800

        // Left tread (centered)
        ctx.beginPath();
        ctx.roundRect(center.x - 17, center.y - 15, 12, 30, 6);
        ctx.fill();
        ctx.stroke();

        // Right tread (centered)
        ctx.beginPath();
        ctx.roundRect(center.x + 5, center.y - 15, 12, 30, 6);
        ctx.fill();
        ctx.stroke();
        break;
    }
  }

  if (partType === 'feet') {
    ctx.fillStyle = color;
    ctx.strokeStyle = '#1F2937'; // gray-800
    ctx.lineWidth = 3;

    switch (variant) {
      case 'boots':
        // Robot boots (positioned closer to legs)
        ctx.fillRect(center.x - 25, center.y - 5, 20, 15);
        ctx.strokeRect(center.x - 25, center.y - 5, 20, 15);
        ctx.fillRect(center.x + 5, center.y - 5, 20, 15);
        ctx.strokeRect(center.x + 5, center.y - 5, 20, 15);
        break;

      case 'magnetic':
        // Magnetic feet with indicators (positioned closer to legs)
        ctx.fillRect(center.x - 25, center.y - 5, 20, 12);
        ctx.strokeRect(center.x - 25, center.y - 5, 20, 12);
        ctx.fillRect(center.x + 5, center.y - 5, 20, 12);
        ctx.strokeRect(center.x + 5, center.y - 5, 20, 12);

        // Magnetic indicators
        ctx.fillStyle = '#EF4444'; // red-500
        ctx.beginPath();
        ctx.arc(center.x - 15, center.y + 1, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(center.x + 15, center.y + 1, 3, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'spikes':
        // Spiked feet for traction (positioned closer to legs)
        ctx.fillRect(center.x - 25, center.y - 5, 20, 12);
        ctx.strokeRect(center.x - 25, center.y - 5, 20, 12);
        ctx.fillRect(center.x + 5, center.y - 5, 20, 12);
        ctx.strokeRect(center.x + 5, center.y - 5, 20, 12);

        // Spikes
        ctx.strokeStyle = '#64748B'; // slate-500
        ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
          const x = center.x - 20 + i * 7;
          ctx.beginPath();
          ctx.moveTo(x, center.y + 7);
          ctx.lineTo(x, center.y + 12);
          ctx.stroke();

          const x2 = center.x + 10 + i * 7;
          ctx.beginPath();
          ctx.moveTo(x2, center.y + 7);
          ctx.lineTo(x2, center.y + 12);
          ctx.stroke();
        }
        break;
    }
  }

  return canvas;
};

// Utility to create robot part images programmatically
const createRobotPartImage = (
  partType: 'head' | 'eyes' | 'antennas' | 'torso' | 'arms' | 'legs' | 'feet',
  variant: string,
  color: string = '#94A3B8'
): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Clear canvas
  ctx.clearRect(0, 0, 512, 512);

  // Common positions based on our 512x512 standard
  const headCenter = { x: 256, y: 140 };
  const eyeLeft = { x: 220, y: 125 };
  const eyeRight = { x: 292, y: 125 };
  const antennaTop = { x: 256, y: 80 };

  // Set common styles
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (partType === 'head') {
    // Draw different head shapes
    ctx.fillStyle = color;
    ctx.strokeStyle = '#1E293B'; // slate-800

    switch (variant) {
      case 'round':
        ctx.beginPath();
        ctx.arc(headCenter.x, headCenter.y, 80, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        break;

      case 'square':
        ctx.fillRect(headCenter.x - 80, headCenter.y - 80, 160, 160);
        ctx.strokeRect(headCenter.x - 80, headCenter.y - 80, 160, 160);
        break;

      case 'hexagon':
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const x = headCenter.x + 80 * Math.cos(angle);
          const y = headCenter.y + 80 * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
    }
  }

  if (partType === 'eyes') {
    ctx.lineWidth = 3;

    switch (variant) {
      case 'blue_led':
        // Blue circular LEDs
        ctx.fillStyle = '#3B82F6'; // blue-500
        ctx.strokeStyle = '#1E40AF'; // blue-800
        ctx.beginPath();
        ctx.arc(eyeLeft.x, eyeLeft.y, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(eyeRight.x, eyeRight.y, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Add LED glow effect
        ctx.fillStyle = '#DBEAFE'; // blue-100
        ctx.beginPath();
        ctx.arc(eyeLeft.x, eyeLeft.y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(eyeRight.x, eyeRight.y, 6, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'red_laser':
        // Red rectangular laser eyes
        ctx.fillStyle = '#EF4444'; // red-500
        ctx.strokeStyle = '#B91C1C'; // red-700
        ctx.fillRect(eyeLeft.x - 15, eyeLeft.y - 6, 30, 12);
        ctx.strokeRect(eyeLeft.x - 15, eyeLeft.y - 6, 30, 12);
        ctx.fillRect(eyeRight.x - 15, eyeRight.y - 6, 30, 12);
        ctx.strokeRect(eyeRight.x - 15, eyeRight.y - 6, 30, 12);

        // Add laser beam effect
        ctx.strokeStyle = '#FCA5A5'; // red-300
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(eyeLeft.x, eyeLeft.y);
        ctx.lineTo(eyeLeft.x + 50, eyeLeft.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(eyeRight.x, eyeRight.y);
        ctx.lineTo(eyeRight.x + 50, eyeRight.y);
        ctx.stroke();
        break;

      case 'green_scan':
        // Green scanning lines
        ctx.strokeStyle = '#10B981'; // emerald-500
        ctx.lineWidth = 4;

        // Horizontal scanning lines
        for (let i = 0; i < 3; i++) {
          const y = eyeLeft.y - 8 + i * 8;
          ctx.beginPath();
          ctx.moveTo(eyeLeft.x - 20, y);
          ctx.lineTo(eyeLeft.x + 20, y);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(eyeRight.x - 20, y);
          ctx.lineTo(eyeRight.x + 20, y);
          ctx.stroke();
        }

        // Add scanner borders
        ctx.strokeStyle = '#047857'; // emerald-700
        ctx.lineWidth = 2;
        ctx.strokeRect(eyeLeft.x - 22, eyeLeft.y - 12, 44, 24);
        ctx.strokeRect(eyeRight.x - 22, eyeRight.y - 12, 44, 24);
        break;
    }
  }

  if (partType === 'antennas') {
    ctx.strokeStyle = '#374151'; // gray-700
    ctx.lineWidth = 6;

    switch (variant) {
      case 'straight':
        // Simple straight antenna
        ctx.beginPath();
        ctx.moveTo(antennaTop.x, antennaTop.y);
        ctx.lineTo(antennaTop.x, antennaTop.y - 40);
        ctx.stroke();

        // Add antenna tip
        ctx.fillStyle = '#EF4444'; // red-500
        ctx.beginPath();
        ctx.arc(antennaTop.x, antennaTop.y - 40, 6, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'coiled':
        // Coiled spring antenna
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(antennaTop.x, antennaTop.y);

        // Create coil pattern
        for (let i = 0; i <= 20; i++) {
          const y = antennaTop.y - i * 2;
          const x = antennaTop.x + Math.sin(i * 0.8) * 15;
          ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Add antenna ball
        ctx.fillStyle = '#F59E0B'; // amber-500
        ctx.beginPath();
        ctx.arc(antennaTop.x, antennaTop.y - 40, 8, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'satellite':
        // Satellite dish antenna
        ctx.lineWidth = 4;

        // Antenna pole
        ctx.beginPath();
        ctx.moveTo(antennaTop.x, antennaTop.y);
        ctx.lineTo(antennaTop.x, antennaTop.y - 25);
        ctx.stroke();

        // Dish
        ctx.fillStyle = '#D1D5DB'; // gray-300
        ctx.strokeStyle = '#374151'; // gray-700
        ctx.beginPath();
        ctx.ellipse(antennaTop.x, antennaTop.y - 25, 25, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Dish center
        ctx.fillStyle = '#6B7280'; // gray-500
        ctx.beginPath();
        ctx.arc(antennaTop.x, antennaTop.y - 25, 6, 0, Math.PI * 2);
        ctx.fill();
        break;
    }
  }

  // Additional coordinates for full robot body
  const torsoCenter = { x: 256, y: 220 };
  const armLeft = { x: 180, y: 200 };
  const armRight = { x: 332, y: 200 };
  const legLeft = { x: 230, y: 300 };
  const legRight = { x: 282, y: 300 };
  const feetY = 360; // Moved feet closer to legs

  if (partType === 'torso') {
    ctx.fillStyle = color;
    ctx.strokeStyle = '#1E293B'; // slate-800
    ctx.lineWidth = 4;

    switch (variant) {
      case 'rectangular':
        // Basic rectangular torso
        ctx.fillRect(torsoCenter.x - 50, torsoCenter.y - 60, 100, 120);
        ctx.strokeRect(torsoCenter.x - 50, torsoCenter.y - 60, 100, 120);

        // Add some details
        ctx.strokeStyle = '#475569'; // slate-600
        ctx.lineWidth = 3;
        ctx.strokeRect(torsoCenter.x - 30, torsoCenter.y - 40, 60, 30);
        ctx.strokeRect(torsoCenter.x - 20, torsoCenter.y, 40, 20);
        break;

      case 'rounded':
        // Rounded capsule torso
        ctx.beginPath();
        ctx.roundRect(torsoCenter.x - 50, torsoCenter.y - 60, 100, 120, 30);
        ctx.fill();
        ctx.stroke();

        // Add circular details
        ctx.fillStyle = '#475569'; // slate-600
        ctx.beginPath();
        ctx.arc(torsoCenter.x, torsoCenter.y - 30, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(torsoCenter.x, torsoCenter.y + 10, 12, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'armored':
        // Angular armored torso
        ctx.beginPath();
        ctx.moveTo(torsoCenter.x - 50, torsoCenter.y - 40);
        ctx.lineTo(torsoCenter.x - 60, torsoCenter.y - 60);
        ctx.lineTo(torsoCenter.x + 60, torsoCenter.y - 60);
        ctx.lineTo(torsoCenter.x + 50, torsoCenter.y - 40);
        ctx.lineTo(torsoCenter.x + 50, torsoCenter.y + 50);
        ctx.lineTo(torsoCenter.x - 50, torsoCenter.y + 50);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Add armor plates
        ctx.strokeStyle = '#64748B'; // slate-500
        ctx.lineWidth = 3;
        for (let i = 0; i < 4; i++) {
          const y = torsoCenter.y - 30 + i * 25;
          ctx.beginPath();
          ctx.moveTo(torsoCenter.x - 40, y);
          ctx.lineTo(torsoCenter.x + 40, y);
          ctx.stroke();
        }
        break;
    }
  }

  if (partType === 'arms') {
    ctx.fillStyle = color;
    ctx.strokeStyle = '#1E293B'; // slate-800
    ctx.lineWidth = 4;

    switch (variant) {
      case 'basic':
        // Simple tube arms
        ctx.fillRect(armLeft.x - 15, armLeft.y - 20, 30, 80);
        ctx.strokeRect(armLeft.x - 15, armLeft.y - 20, 30, 80);
        ctx.fillRect(armRight.x - 15, armRight.y - 20, 30, 80);
        ctx.strokeRect(armRight.x - 15, armRight.y - 20, 30, 80);
        break;

      case 'mechanical':
        // Segmented mechanical arms
        ctx.fillStyle = '#6B7280'; // gray-500

        // Left arm segments
        ctx.fillRect(armLeft.x - 15, armLeft.y - 20, 30, 36);
        ctx.strokeRect(armLeft.x - 15, armLeft.y - 20, 30, 36);
        ctx.fillRect(armLeft.x - 15, armLeft.y + 24, 30, 36);
        ctx.strokeRect(armLeft.x - 15, armLeft.y + 24, 30, 36);

        // Right arm segments
        ctx.fillRect(armRight.x - 15, armRight.y - 20, 30, 36);
        ctx.strokeRect(armRight.x - 15, armRight.y - 20, 30, 36);
        ctx.fillRect(armRight.x - 15, armRight.y + 24, 30, 36);
        ctx.strokeRect(armRight.x - 15, armRight.y + 24, 30, 36);

        // Joint circles
        ctx.fillStyle = '#374151'; // gray-700
        ctx.beginPath();
        ctx.arc(armLeft.x, armLeft.y + 16, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(armRight.x, armRight.y + 16, 8, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'claws':
        // Arms with claw hands
        ctx.fillRect(armLeft.x - 15, armLeft.y - 20, 30, 70);
        ctx.strokeRect(armLeft.x - 15, armLeft.y - 20, 30, 70);
        ctx.fillRect(armRight.x - 15, armRight.y - 20, 30, 70);
        ctx.strokeRect(armRight.x - 15, armRight.y - 20, 30, 70);

        // Claws
        ctx.strokeStyle = '#DC2626'; // red-600
        ctx.lineWidth = 3;

        // Left claws
        for (let i = 0; i < 3; i++) {
          const x = armLeft.x - 10 + i * 10;
          ctx.beginPath();
          ctx.moveTo(x, armLeft.y + 50);
          ctx.lineTo(x, armLeft.y + 70);
          ctx.stroke();
        }

        // Right claws
        for (let i = 0; i < 3; i++) {
          const x = armRight.x - 10 + i * 10;
          ctx.beginPath();
          ctx.moveTo(x, armRight.y + 50);
          ctx.lineTo(x, armRight.y + 70);
          ctx.stroke();
        }
        break;
    }
  }

  if (partType === 'legs') {
    ctx.fillStyle = color;
    ctx.strokeStyle = '#1E293B'; // slate-800
    ctx.lineWidth = 4;

    switch (variant) {
      case 'basic':
        // Simple rectangular legs
        ctx.fillRect(legLeft.x - 15, legLeft.y - 20, 30, 80);
        ctx.strokeRect(legLeft.x - 15, legLeft.y - 20, 30, 80);
        ctx.fillRect(legRight.x - 15, legRight.y - 20, 30, 80);
        ctx.strokeRect(legRight.x - 15, legRight.y - 20, 30, 80);
        break;

      case 'wheels':
        // Wheel base instead of legs (connects directly to torso)
        ctx.fillStyle = color;
        ctx.strokeStyle = '#1F2937'; // gray-800

        // Base platform (moved up to connect with torso)
        ctx.fillRect(torsoCenter.x - 60, torsoCenter.y + 60, 120, 20);
        ctx.strokeRect(torsoCenter.x - 60, torsoCenter.y + 60, 120, 20);

        // Wheels (adjusted position)
        ctx.fillStyle = '#111827'; // gray-900
        ctx.beginPath();
        ctx.arc(legLeft.x, torsoCenter.y + 95, 25, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(legRight.x, torsoCenter.y + 95, 25, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        break;

      case 'treads':
        // Tank-like treads (centered and extending to feet)
        ctx.fillStyle = color;
        ctx.strokeStyle = '#1F2937'; // gray-800

        // Left tread (centered and connects to feet)
        ctx.beginPath();
        ctx.roundRect(torsoCenter.x - 30, legLeft.y - 30, 25, 90, 12);
        ctx.fill();
        ctx.stroke();

        // Right tread (centered and connects to feet)
        ctx.beginPath();
        ctx.roundRect(torsoCenter.x + 5, legLeft.y - 30, 25, 90, 12);
        ctx.fill();
        ctx.stroke();
        break;
    }
  }

  if (partType === 'feet') {
    ctx.fillStyle = color;
    ctx.strokeStyle = '#1F2937'; // gray-800
    ctx.lineWidth = 4;

    switch (variant) {
      case 'boots':
        // Robot boots
        ctx.fillRect(legLeft.x - 25, feetY, 40, 25);
        ctx.strokeRect(legLeft.x - 25, feetY, 40, 25);
        ctx.fillRect(legRight.x - 25, feetY, 40, 25);
        ctx.strokeRect(legRight.x - 25, feetY, 40, 25);
        break;

      case 'magnetic':
        // Magnetic feet with indicators
        ctx.fillRect(legLeft.x - 25, feetY, 40, 20);
        ctx.strokeRect(legLeft.x - 25, feetY, 40, 20);
        ctx.fillRect(legRight.x - 25, feetY, 40, 20);
        ctx.strokeRect(legRight.x - 25, feetY, 40, 20);

        // Magnetic indicators
        ctx.fillStyle = '#EF4444'; // red-500
        ctx.beginPath();
        ctx.arc(legLeft.x, feetY + 10, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(legRight.x, feetY + 10, 6, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'spikes':
        // Spiked feet for traction
        ctx.fillRect(legLeft.x - 25, feetY, 40, 20);
        ctx.strokeRect(legLeft.x - 25, feetY, 40, 20);
        ctx.fillRect(legRight.x - 25, feetY, 40, 20);
        ctx.strokeRect(legRight.x - 25, feetY, 40, 20);

        // Spikes
        ctx.strokeStyle = '#64748B'; // slate-500
        ctx.lineWidth = 3;
        for (let i = 0; i < 4; i++) {
          const x = legLeft.x - 15 + i * 10;
          ctx.beginPath();
          ctx.moveTo(x, feetY + 20);
          ctx.lineTo(x, feetY + 30);
          ctx.stroke();

          const x2 = legRight.x - 15 + i * 10;
          ctx.beginPath();
          ctx.moveTo(x2, feetY + 20);
          ctx.lineTo(x2, feetY + 30);
          ctx.stroke();
        }
        break;
    }
  }

  return canvas;
};

const CharacterCreator: React.FC = () => {
  const { state, dispatch } = useGame();

  // State for generated images
  const [headImages, setHeadImages] = useState<{
    [key: string]: HTMLImageElement;
  }>({});
  const [eyeImages, setEyeImages] = useState<{
    [key: string]: HTMLImageElement;
  }>({});
  const [antennaImages, setAntennaImages] = useState<{
    [key: string]: HTMLImageElement;
  }>({});

  // State for new body part images
  const [torsoImages, setTorsoImages] = useState<{
    [key: string]: HTMLImageElement;
  }>({});
  const [armImages, setArmImages] = useState<{
    [key: string]: HTMLImageElement;
  }>({});
  const [legImages, setLegImages] = useState<{
    [key: string]: HTMLImageElement;
  }>({});
  const [feetImages, setFeetImages] = useState<{
    [key: string]: HTMLImageElement;
  }>({});

  // State for thumbnail images (for selection buttons)
  const [headThumbnails, setHeadThumbnails] = useState<{
    [key: string]: HTMLImageElement;
  }>({});
  const [eyeThumbnails, setEyeThumbnails] = useState<{
    [key: string]: HTMLImageElement;
  }>({});
  const [antennaThumbnails, setAntennaThumbnails] = useState<{
    [key: string]: HTMLImageElement;
  }>({});
  const [torsoThumbnails, setTorsoThumbnails] = useState<{
    [key: string]: HTMLImageElement;
  }>({});
  const [armThumbnails, setArmThumbnails] = useState<{
    [key: string]: HTMLImageElement;
  }>({});
  const [legThumbnails, setLegThumbnails] = useState<{
    [key: string]: HTMLImageElement;
  }>({});
  const [feetThumbnails, setFeetThumbnails] = useState<{
    [key: string]: HTMLImageElement;
  }>({});

  const [imagesGenerated, setImagesGenerated] = useState(false);

  // State for part colors
  const [partColors, setPartColors] = useState({
    head: '#3B82F6', // blue-500
    torso: '#EF4444', // red-500
    arms: '#10B981', // emerald-500
    legs: '#F59E0B', // amber-500
    feet: '#8B5CF6', // violet-500
  });

  // Generate robot part images on component mount
  useEffect(() => {
    const generateImages = () => {
      const heads: { [key: string]: HTMLImageElement } = {};
      const eyes: { [key: string]: HTMLImageElement } = {};
      const antennas: { [key: string]: HTMLImageElement } = {};
      const torsos: { [key: string]: HTMLImageElement } = {};
      const arms: { [key: string]: HTMLImageElement } = {};
      const legs: { [key: string]: HTMLImageElement } = {};
      const feet: { [key: string]: HTMLImageElement } = {};

      const headThumbails: { [key: string]: HTMLImageElement } = {};
      const eyeThumbails: { [key: string]: HTMLImageElement } = {};
      const antennaThumbails: { [key: string]: HTMLImageElement } = {};
      const torsoThumbails: { [key: string]: HTMLImageElement } = {};
      const armThumbails: { [key: string]: HTMLImageElement } = {};
      const legThumbails: { [key: string]: HTMLImageElement } = {};
      const feetThumbails: { [key: string]: HTMLImageElement } = {};

      // Generate head images and thumbnails
      for (const headType of ['round', 'square', 'hexagon']) {
        // Main image for robot display
        const canvas = createRobotPartImage('head', headType, partColors.head);
        const img = document.createElement('img');
        img.src = canvas.toDataURL();
        heads[headType] = img;

        // Thumbnail for selection button
        const thumbCanvas = createRobotPartThumbnail(
          'head',
          headType,
          partColors.head
        );
        const thumbImg = document.createElement('img');
        thumbImg.src = thumbCanvas.toDataURL();
        headThumbails[headType] = thumbImg;
      }

      // Generate eye images and thumbnails
      for (const eyeType of ['blue_led', 'red_laser', 'green_scan']) {
        // Main image for robot display
        const canvas = createRobotPartImage('eyes', eyeType);
        const img = document.createElement('img');
        img.src = canvas.toDataURL();
        eyes[eyeType] = img;

        // Thumbnail for selection button
        const thumbCanvas = createRobotPartThumbnail('eyes', eyeType);
        const thumbImg = document.createElement('img');
        thumbImg.src = thumbCanvas.toDataURL();
        eyeThumbails[eyeType] = thumbImg;
      }

      // Generate antenna images and thumbnails
      for (const antennaType of ['straight', 'coiled', 'satellite']) {
        // Main image for robot display
        const canvas = createRobotPartImage('antennas', antennaType);
        const img = document.createElement('img');
        img.src = canvas.toDataURL();
        antennas[antennaType] = img;

        // Thumbnail for selection button
        const thumbCanvas = createRobotPartThumbnail('antennas', antennaType);
        const thumbImg = document.createElement('img');
        thumbImg.src = thumbCanvas.toDataURL();
        antennaThumbails[antennaType] = thumbImg;
      }

      // Generate torso images and thumbnails
      for (const torsoType of ['rectangular', 'rounded', 'armored']) {
        // Main image for robot display
        const canvas = createRobotPartImage(
          'torso',
          torsoType,
          partColors.torso
        );
        const img = document.createElement('img');
        img.src = canvas.toDataURL();
        torsos[torsoType] = img;

        // Thumbnail for selection button
        const thumbCanvas = createRobotPartThumbnail(
          'torso',
          torsoType,
          partColors.torso
        );
        const thumbImg = document.createElement('img');
        thumbImg.src = thumbCanvas.toDataURL();
        torsoThumbails[torsoType] = thumbImg;
      }

      // Generate arm images and thumbnails
      for (const armType of ['basic', 'mechanical', 'claws']) {
        // Main image for robot display
        const canvas = createRobotPartImage('arms', armType, partColors.arms);
        const img = document.createElement('img');
        img.src = canvas.toDataURL();
        arms[armType] = img;

        // Thumbnail for selection button
        const thumbCanvas = createRobotPartThumbnail(
          'arms',
          armType,
          partColors.arms
        );
        const thumbImg = document.createElement('img');
        thumbImg.src = thumbCanvas.toDataURL();
        armThumbails[armType] = thumbImg;
      }

      // Generate leg images and thumbnails
      for (const legType of ['basic', 'wheels', 'treads']) {
        // Main image for robot display
        const canvas = createRobotPartImage('legs', legType, partColors.legs);
        const img = document.createElement('img');
        img.src = canvas.toDataURL();
        legs[legType] = img;

        // Thumbnail for selection button
        const thumbCanvas = createRobotPartThumbnail(
          'legs',
          legType,
          partColors.legs
        );
        const thumbImg = document.createElement('img');
        thumbImg.src = thumbCanvas.toDataURL();
        legThumbails[legType] = thumbImg;
      }

      // Generate feet images and thumbnails
      for (const feetType of ['boots', 'magnetic', 'spikes']) {
        // Main image for robot display
        const canvas = createRobotPartImage('feet', feetType, partColors.feet);
        const img = document.createElement('img');
        img.src = canvas.toDataURL();
        feet[feetType] = img;

        // Thumbnail for selection button
        const thumbCanvas = createRobotPartThumbnail(
          'feet',
          feetType,
          partColors.feet
        );
        const thumbImg = document.createElement('img');
        thumbImg.src = thumbCanvas.toDataURL();
        feetThumbails[feetType] = thumbImg;
      }

      setHeadImages(heads);
      setEyeImages(eyes);
      setAntennaImages(antennas);
      setTorsoImages(torsos);
      setArmImages(arms);
      setLegImages(legs);
      setFeetImages(feet);

      setHeadThumbnails(headThumbails);
      setEyeThumbnails(eyeThumbails);
      setAntennaThumbnails(antennaThumbails);
      setTorsoThumbnails(torsoThumbails);
      setArmThumbnails(armThumbails);
      setLegThumbnails(legThumbails);
      setFeetThumbnails(feetThumbails);

      setImagesGenerated(true);
    };

    generateImages();
  }, [partColors]);

  // Part options for all robot parts
  const partOptions = {
    head: {
      name: 'Pää',
      options: [{ id: 'round' }, { id: 'square' }, { id: 'hexagon' }],
    },
    eyes: {
      name: 'Silmät',
      options: [{ id: 'blue_led' }, { id: 'red_laser' }, { id: 'green_scan' }],
    },
    ears: {
      name: 'Antennit',
      options: [{ id: 'straight' }, { id: 'coiled' }, { id: 'satellite' }],
    },
    torso: {
      name: 'Vartalo',
      options: [{ id: 'rectangular' }, { id: 'rounded' }, { id: 'armored' }],
    },
    arms: {
      name: 'Kädet',
      options: [{ id: 'basic' }, { id: 'mechanical' }, { id: 'claws' }],
    },
    legs: {
      name: 'Jalat',
      options: [{ id: 'basic' }, { id: 'wheels' }, { id: 'treads' }],
    },
    feet: {
      name: 'Jalkine',
      options: [{ id: 'boots' }, { id: 'magnetic' }, { id: 'spikes' }],
    },
  };

  type AvailableParts =
    | 'head'
    | 'eyes'
    | 'ears'
    | 'torso'
    | 'arms'
    | 'legs'
    | 'feet';

  const handlePartChange = (part: AvailableParts, value: string) => {
    dispatch({ type: 'UPDATE_CHARACTER', part, value });
  };

  const handleColorChange = (
    partType: keyof typeof partColors,
    color: string
  ) => {
    setPartColors((prev) => ({
      ...prev,
      [partType]: color,
    }));
  };

  const colorOptions = [
    '#EF4444', // red-500
    '#F97316', // orange-500
    '#F59E0B', // amber-500
    '#EAB308', // yellow-500
    '#84CC16', // lime-500
    '#10B981', // emerald-500
    '#06B6D4', // cyan-500
    '#3B82F6', // blue-500
    '#6366F1', // indigo-500
    '#8B5CF6', // violet-500
    '#EC4899', // pink-500
    '#F43F5E', // rose-500
  ];

  const getSelectedOption = (part: AvailableParts) => {
    const selectedId = state.character[part];
    return (
      partOptions[part].options.find((option) => option.id === selectedId) ||
      partOptions[part].options[0]
    );
  };

  // Render full robot using generated images
  const renderFullRobot = () => {
    if (!imagesGenerated) return null;

    const headOption = getSelectedOption('head');
    const eyeOption = getSelectedOption('eyes');
    const antennaOption = getSelectedOption('ears');
    const torsoOption = getSelectedOption('torso');
    const armOption = getSelectedOption('arms');
    const legOption = getSelectedOption('legs');
    const feetOption = getSelectedOption('feet');

    const headImage = headImages[headOption.id];
    const eyeImage = eyeImages[eyeOption.id];
    const antennaImage = antennaImages[antennaOption.id];
    const torsoImage = torsoImages[torsoOption.id];
    const armImage = armImages[armOption.id];
    const legImage = legImages[legOption.id];
    const feetImage = feetImages[feetOption.id];

    return (
      <Group x={0} y={0}>
        {/* Layer 1: Legs (behind torso except for treads) */}
        {legImage && legOption.id !== 'treads' && (
          <Image image={legImage} x={-256} y={-256} width={512} height={512} />
        )}

        {/* Layer 2: Torso */}
        {torsoImage && (
          <Image
            image={torsoImage}
            x={-256}
            y={-256}
            width={512}
            height={512}
          />
        )}

        {/* Layer 3: Treads (in front of torso) */}
        {legImage && legOption.id === 'treads' && (
          <Image image={legImage} x={-256} y={-256} width={512} height={512} />
        )}

        {/* Layer 4: Arms */}
        {armImage && (
          <Image image={armImage} x={-256} y={-256} width={512} height={512} />
        )}

        {/* Layer 5: Feet (hidden when wheels are selected) */}
        {feetImage && legOption.id !== 'wheels' && (
          <Image image={feetImage} x={-256} y={-256} width={512} height={512} />
        )}

        {/* Layer 6: Head Base */}
        {headImage && (
          <Image image={headImage} x={-256} y={-256} width={512} height={512} />
        )}

        {/* Layer 7: Eyes */}
        {eyeImage && (
          <Image image={eyeImage} x={-256} y={-256} width={512} height={512} />
        )}

        {/* Layer 8: Antennas */}
        {antennaImage && (
          <Image
            image={antennaImage}
            x={-256}
            y={-256}
            width={512}
            height={512}
          />
        )}
      </Group>
    );
  };

  const renderCharacterPreview = () => {
    // Responsive sizing
    const isMobile = window.innerWidth < 640;
    const stageWidth = isMobile ? 280 : 400;
    const stageHeight = isMobile ? 400 : 500; // Increased height on mobile to accommodate full robot
    const centerX = stageWidth / 2;
    const centerY = stageHeight * 0.58; // Moved robot down slightly to prevent head cutoff

    return (
      <div className='bg-gradient-to-b from-blue-300 to-purple-400 rounded-kid-lg border-4 border-yellow-300 p-1 sm:p-2 lg:p-4'>
        <div className='w-full flex items-center justify-center'>
          <div
            className='relative max-w-full'
            style={{
              width: `${stageWidth}px`,
              height: `${stageHeight}px`,
            }}
          >
            <Stage
              width={stageWidth}
              height={stageHeight}
              className='w-full h-full border-0'
              style={{ display: 'block' }}
            >
              <Layer>
                <Group x={centerX} y={centerY}>
                  {/* Full Robot with Generated Images */}
                  <Group>{renderFullRobot()}</Group>
                </Group>
              </Layer>
            </Stage>
          </div>
        </div>
      </div>
    );
  };

  // Show loading state while images are being generated
  if (!imagesGenerated) {
    return (
      <div className='w-full min-h-screen p-4 flex items-center justify-center'>
        <div className='text-white text-lg sm:text-xl lg:text-2xl font-kid text-center'>
          🤖 Luodaan robotin osia...
        </div>
      </div>
    );
  }

  return (
    <div className='w-full min-h-screen p-2 sm:p-4'>
      <BackButton />

      <div className='flex flex-col items-center min-h-full'>
        {/* Title - Hidden on mobile to save space */}
        <h1 className='hidden sm:block text-2xl lg:text-4xl font-kid font-bold text-white mb-4 lg:mb-6 drop-shadow-lg text-center'>
          🤖 Rakenna robotti! 🤖
        </h1>

        <div className='flex flex-col lg:flex-row gap-2 sm:gap-4 lg:gap-8 w-full max-w-7xl items-center lg:items-start justify-center'>
          {/* Robot Preview - Made sticky */}
          <div className='w-full lg:w-auto lg:flex-shrink-0 order-1 lg:order-1 sticky top-0 lg:static bg-gradient-to-br from-kidBlue via-kidGreen to-kidYellow lg:bg-none z-10 lg:z-auto pb-1 lg:pb-0'>
            {/* Robot preview title - Hidden on mobile */}
            <h2 className='hidden sm:block text-lg lg:text-2xl font-kid font-bold text-white mb-2 lg:mb-4 text-center'>
              Sinun robottisi:
            </h2>

            {/* Robot container with floating button */}
            <div className='relative flex justify-center'>
              {renderCharacterPreview()}

              {/* Floating Valmis Button - Bottom right corner */}
              <button
                onClick={() =>
                  dispatch({ type: 'NAVIGATE_TO', screen: 'menu' })
                }
                className='absolute bottom-2 right-2 sm:bottom-4 sm:right-4 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-b from-kidPink to-pink-400 border-2 sm:border-4 border-pink-500 rounded-full text-white shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center text-lg sm:text-xl z-20'
                type='button'
              >
                ✅
              </button>
            </div>
          </div>

          {/* Part Selection - Centered */}
          <div className='w-full max-w-md lg:max-w-none lg:flex-1 bg-white/90 rounded-kid-lg p-2 sm:p-3 lg:p-6 max-h-[55vh] sm:max-h-[70vh] lg:max-h-[600px] overflow-y-auto order-2 lg:order-2'>
            <h2 className='text-base sm:text-lg lg:text-2xl font-kid font-bold text-gray-800 mb-2 sm:mb-3 lg:mb-4 text-center'>
              🎨 Robotin värit ja osat 🎨
            </h2>

            <div className='grid grid-cols-1 gap-2 sm:gap-3 lg:gap-4'>
              {Object.entries(partOptions).map(([partKey, partData]) => (
                <div
                  key={partKey}
                  className='bg-gradient-to-r from-blue-50 to-purple-50 rounded-kid p-2 sm:p-3 lg:p-4 border-2 border-blue-200'
                >
                  <h3 className='text-sm sm:text-base lg:text-lg font-kid font-bold text-gray-700 mb-1 sm:mb-2 lg:mb-3 text-center'>
                    {partData.name}
                  </h3>

                  {/* Shape Selection */}
                  <div className='mb-1 sm:mb-2 lg:mb-3'>
                    <h4 className='text-xs sm:text-sm font-kid font-semibold text-gray-600 mb-1 sm:mb-2 text-center'>
                      Valitse muoto:
                    </h4>
                    <div className='flex gap-1 sm:gap-2 justify-center flex-wrap'>
                      {partData.options.map((option) => {
                        // Get the appropriate thumbnail image for this part type and option
                        let partImage: HTMLImageElement | null = null;
                        if (partKey === 'head' && headThumbnails[option.id]) {
                          partImage = headThumbnails[option.id];
                        } else if (
                          partKey === 'eyes' &&
                          eyeThumbnails[option.id]
                        ) {
                          partImage = eyeThumbnails[option.id];
                        } else if (
                          partKey === 'ears' &&
                          antennaThumbnails[option.id]
                        ) {
                          partImage = antennaThumbnails[option.id];
                        } else if (
                          partKey === 'torso' &&
                          torsoThumbnails[option.id]
                        ) {
                          partImage = torsoThumbnails[option.id];
                        } else if (
                          partKey === 'arms' &&
                          armThumbnails[option.id]
                        ) {
                          partImage = armThumbnails[option.id];
                        } else if (
                          partKey === 'legs' &&
                          legThumbnails[option.id]
                        ) {
                          partImage = legThumbnails[option.id];
                        } else if (
                          partKey === 'feet' &&
                          feetThumbnails[option.id]
                        ) {
                          partImage = feetThumbnails[option.id];
                        }

                        return (
                          <button
                            key={option.id}
                            onClick={() =>
                              handlePartChange(
                                partKey as AvailableParts,
                                option.id
                              )
                            }
                            className={`
                              w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-kid border-2 sm:border-4
                              flex items-center justify-center overflow-hidden
                              transition-all duration-200 transform hover:scale-105
                              ${
                                state.character[partKey as AvailableParts] ===
                                option.id
                                  ? 'border-blue-500 bg-blue-100 scale-105 sm:scale-110'
                                  : 'border-gray-300 bg-white hover:border-gray-400'
                              }
                            `}
                          >
                            {partImage ? (
                              <img
                                src={partImage.src}
                                alt={`${partKey} ${option.id}`}
                                className='w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 object-contain'
                              />
                            ) : (
                              <div className='w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gray-200 rounded flex items-center justify-center text-xs'>
                                ?
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Color Selection for colorable parts */}
                  {['head', 'torso', 'arms', 'legs', 'feet'].includes(
                    partKey
                  ) && (
                    <div>
                      <h4 className='text-xs sm:text-sm font-kid font-semibold text-gray-600 mb-1 sm:mb-2 text-center'>
                        Valitse väri:
                      </h4>
                      <div className='flex gap-1 sm:gap-2 justify-center flex-wrap'>
                        {colorOptions.map((color) => (
                          <button
                            key={color}
                            onClick={() =>
                              handleColorChange(
                                partKey as keyof typeof partColors,
                                color
                              )
                            }
                            className={`
                              w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 rounded-full border-2 transition-all duration-200 transform hover:scale-110
                              ${
                                partColors[
                                  partKey as keyof typeof partColors
                                ] === color
                                  ? 'border-gray-800 scale-110 sm:scale-125'
                                  : 'border-gray-300 hover:border-gray-500'
                              }
                            `}
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCreator;
