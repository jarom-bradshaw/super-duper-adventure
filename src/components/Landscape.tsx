import '../styles/mini-game.css';

const Landscape = () => {
  return (
    <div className="relative w-full h-full">
      <svg
        viewBox="0 0 1200 600"
        preserveAspectRatio="xMidYMax slice"
        className="block w-[100vw] max-w-none h-full"
        role="img"
        aria-label="Rolling hills with figures watching the stars"
      >
        <g className="hills">
          <path className="hill hill-3" d="M0,500 C200,430 400,530 600,480 C800,430 1000,520 1200,470 L1200,600 L0,600 Z" />
          <path className="hill hill-2" d="M0,520 C220,450 420,560 640,520 C860,480 1040,560 1200,530 L1200,600 L0,600 Z" />
          <path className="hill hill-1" d="M0,560 C260,520 520,590 780,560 C1040,530 1120,585 1200,580 L1200,600 L0,600 Z" />
        </g>

        <g className="figures">
          {/* Left figure */}
          <g className="figure" style={{ ['--d' as any]: '0.2s' }} transform="translate(250,515)">
            <circle cx="0" cy="-40" r="14" vectorEffect="non-scaling-stroke" />
            <path d="M0,-26 L0,10" vectorEffect="non-scaling-stroke" />
            <path d="M0,-10 L-18,6" vectorEffect="non-scaling-stroke" />
            <path d="M0,-10 L18,6" vectorEffect="non-scaling-stroke" />
            <path d="M0,10 L-16,26" vectorEffect="non-scaling-stroke" />
            <path d="M0,10 L16,26" vectorEffect="non-scaling-stroke" />
          </g>

          {/* Middle figure */}
          <g className="figure" style={{ ['--d' as any]: '0.6s' }} transform="translate(600,540)">
            <circle cx="0" cy="-42" r="14" vectorEffect="non-scaling-stroke" />
            <path d="M0,-28 L0,8" vectorEffect="non-scaling-stroke" />
            <path d="M0,-12 L-18,6" vectorEffect="non-scaling-stroke" />
            <path d="M0,-12 L18,6" vectorEffect="non-scaling-stroke" />
            <path d="M0,8 L-16,26" vectorEffect="non-scaling-stroke" />
            <path d="M0,8 L16,26" vectorEffect="non-scaling-stroke" />
          </g>

          {/* Right figure */}
          <g className="figure" style={{ ['--d' as any]: '0.9s' }} transform="translate(950,525)">
            <circle cx="0" cy="-40" r="14" vectorEffect="non-scaling-stroke" />
            <path d="M0,-26 L0,10" vectorEffect="non-scaling-stroke" />
            <path d="M0,-10 L-18,6" vectorEffect="non-scaling-stroke" />
            <path d="M0,-10 L18,6" vectorEffect="non-scaling-stroke" />
            <path d="M0,10 L-16,26" vectorEffect="non-scaling-stroke" />
            <path d="M0,10 L16,26" vectorEffect="non-scaling-stroke" />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default Landscape;


