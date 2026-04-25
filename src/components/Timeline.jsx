import ClueCard from './ClueCard.jsx';
import EmptyState from './EmptyState.jsx';
import SkeletonLoader from './SkeletonLoader.jsx';

const Timeline = ({ clues, loading, onClueSelect, selectedClueId }) => {
  if (loading) {
    return <SkeletonLoader type="timeline" />;
  }

  if (!clues || clues.length === 0) {
    return <EmptyState type="search" />;
  }

  return (
    <div className="timeline" id="investigation-timeline">
      <div className="timeline-line" />

      {clues.map((clue, index) => (
        <div
          key={clue.id}
          className={`timeline-item ${clue.isLastSighting ? 'timeline-item-critical' : ''}`}
          style={{ animationDelay: `${index * 0.08}s` }}
        >
          {/* Timeline Dot */}
          <div className={`timeline-dot ${clue.isLastSighting ? 'timeline-dot-critical' : ''}`}>
            <span className="timeline-dot-inner" style={{
              backgroundColor: clue.isLastSighting
                ? 'var(--color-neon-red)'
                : `var(--color-${clue.formType === 'sighting' ? 'sighting' : clue.formType === 'location' ? 'checkin' : clue.formType === 'evidence' ? 'message' : clue.formType === 'message' ? 'note' : 'tip'})`
            }} />
          </div>

          {/* Zaman Etiketi */}
          <div className="timeline-time">
            {clue._parsedTime?.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
          </div>

          {/* Kart */}
          <div className="timeline-content">
            <ClueCard
              clue={clue}
              onClick={onClueSelect}
              isSelected={selectedClueId === clue.id}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
