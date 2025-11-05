type Props = {
  result: 'win' | 'loss' | 'draw';
  playerScore: number;
  opponentScore: number;
  onClose?: () => void;
};

export default function GameResult({ result, playerScore, opponentScore, onClose }: Props) {
  const scoreDiff = Math.abs(playerScore - opponentScore);
  const message = result === 'win' 
    ? `You won by ${scoreDiff} point${scoreDiff !== 1 ? 's' : ''}!`
    : result === 'loss'
    ? `You lost by ${scoreDiff} point${scoreDiff !== 1 ? 's' : ''}`
    : 'Draw!';

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/50">
      <div className="glass-card rounded-lg p-6 text-center min-w-[280px]">
        <div className={`text-2xl font-bold mb-2 ${
          result === 'win' ? 'text-green-400' : 
          result === 'loss' ? 'text-red-400' : 
          'text-[color:var(--muted-foreground)]'
        }`}>
          {result === 'win' ? '🎉 Victory!' : result === 'loss' ? '💔 Defeat' : '🤝 Tie'}
        </div>
        <div className="text-lg mb-4">{message}</div>
        <div className="text-sm text-[color:var(--muted-foreground)] mb-4">
          Final Score: You {playerScore} - {opponentScore} {opponentScore > 0 ? 'AI' : 'Opponent'}
        </div>
        {onClose && (
          <button
            type="button"
            className="px-4 py-2 rounded border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] hover:bg-[color:var(--glass-bg)]/80"
            onClick={onClose}
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
}

