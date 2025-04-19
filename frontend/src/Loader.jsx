import React from 'react';
import styled, { keyframes } from 'styled-components';
import MatrixBackground from './MatrixBackground.jsx'; // Adjust path as needed

const Loader = () => {
return (
    <FullScreenWrapper>
    <MatrixBackground />
    <StyledWrapper>
        <div className="loader">
        <span />
        </div>
        <Typewriter>QuakeSense</Typewriter>
    </StyledWrapper>
    </FullScreenWrapper>
);
};

// keep your existing styled-components below...


const radarSpin = keyframes`
0% {
    transform: rotate(0deg);
}
100% {
    transform: rotate(360deg);
}
`;

const typewriter = keyframes`
from { width: 0 }
to { width: 100% }
`;

const blinkCaret = keyframes`
50% { border-color: transparent }
`;

const FullScreenWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  background: radial-gradient(circle at center, #0d1321 0%, #1a2639 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  /* Glitchy particles */
  &::before {
    content: "";
    position: absolute;
    width: 150%;
    height: 150%;
    background: repeating-radial-gradient(
      circle at center,
      rgba(255, 255, 255, 0.02) 0px,
      rgba(255, 255, 255, 0.02) 1px,
      transparent 1px,
      transparent 4px
    );
    animation: rotateGrid 30s linear infinite;
    z-index: 0;
    pointer-events: none;
  }

  /* Scan pulse */
  &::after {
    content: "";
    position: absolute;
    width: 800px;
    height: 800px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(116, 0, 184, 0.2) 0%, transparent 70%);
    animation: radarPulse 2.5s ease-out infinite;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
  }

  /* Extra rotating ring */
  .pulse-ring {
    position: absolute;
    width: 650px;
    height: 650px;
    border: 1px dashed #444;
    border-radius: 50%;
    animation: rotateRing 12s linear infinite;
    z-index: 2;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  /* Scan line */
  .scan-line {
    position: absolute;
    width: 200%;
    height: 2px;
    background: linear-gradient(to right, transparent, #58a6ff, transparent);
    animation: scanLineMove 3s linear infinite;
    z-index: 2;
    pointer-events: none;
  }

  @keyframes radarPulse {
    0% {
      transform: translate(-50%, -50%) scale(0.5);
      opacity: 0.3;
    }
    100% {
      transform: translate(-50%, -50%) scale(1.6);
      opacity: 0;
    }
  }

  @keyframes rotateGrid {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes rotateRing {
    0% {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    100% {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }

  @keyframes scanLineMove {
    0% {
      top: 0%;
    }
    100% {
      top: 100%;
    }
  }
`;


const StyledWrapper = styled.div`
display: flex;
flex-direction: column;
align-items: center;

.loader {
    position: relative;
    width: 150px;
    height: 150px;
    background: transparent;
    border-radius: 50%;
    box-shadow: 25px 25px 75px rgba(0, 0, 0, 0.55);
    border: 1px solid #333;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.loader::before {
    content: "";
    position: absolute;
    inset: 20px;
    background: transparent;
    border: 1px dashed #444;
    border-radius: 50%;
    box-shadow: inset -5px -5px 25px rgba(0, 0, 0, 0.25),
                inset 5px 5px 35px rgba(0, 0, 0, 0.25);
}

.loader::after {
    content: "";
    position: absolute;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 1px dashed #444;
    box-shadow: inset -5px -5px 25px rgba(0, 0, 0, 0.25),
                inset 5px 5px 35px rgba(0, 0, 0, 0.25);
}

.loader span {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 50%;
    height: 100%;
    background: transparent;
    transform-origin: top left;
    animation: ${radarSpin} 2s linear infinite;
    border-top: 1px dashed #e8a87c;
}

.loader span::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #7400b8;
    transform-origin: top left;
    transform: rotate(-55deg);
    filter: blur(30px) drop-shadow(20px 20px 20px #7400b8);
}
`;

const Typewriter = styled.h1`
margin-top: 2rem;
color: #58a6ff;
font-size: 2rem;
font-family: 'impact';
white-space: nowrap;
overflow: hidden;
border-right: 3px solid #58a6ff;
width: 0;
animation: ${typewriter} 2s steps(10) 0.5s forwards, ${blinkCaret} 0.75s step-end infinite;
`;

export default Loader;
