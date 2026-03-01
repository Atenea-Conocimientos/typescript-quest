import { MENTORS } from './mentors';
import { MentorId } from '../engine/types';

interface MentorProps {
  mentorId: MentorId;
  message: string;
}

export default function Mentor({ mentorId, message }: MentorProps) {
  const mentor = MENTORS[mentorId];

  return (
    <div style={{
      display: 'flex', gap: 12, alignItems: 'flex-start',
      background: 'var(--bg-secondary)', border: `1px solid ${mentor.color}33`,
      borderRadius: 10, padding: '12px 14px', margin: '8px 0',
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%', display: 'flex',
        alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0,
        background: `${mentor.color}22`, border: `1px solid ${mentor.color}55`,
      }}>
        {mentor.emoji}
      </div>
      <div>
        <div style={{ fontSize: 11, color: mentor.color, fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>
          {mentor.name}
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {message}
        </div>
      </div>
    </div>
  );
}
