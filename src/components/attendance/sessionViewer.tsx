import React, { useState, useEffect } from 'react';

// Define TypeScript interfaces for our data
interface Session {
  id: number;
  unit_id: string;
  session_date: string;
  students: string[];
}

interface SessionStudentViewerProps {
  enhancedSessions: Session[];
}

const SessionStudentViewer: React.FC<SessionStudentViewerProps> = ({ enhancedSessions }) => {
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  // Set initial selected session if data is available
  useEffect(() => {
    if (enhancedSessions && enhancedSessions.length > 0 && !selectedSessionId) {
      setSelectedSessionId(enhancedSessions[0].id);
    }
  }, [enhancedSessions, selectedSessionId]);

  // Update selected session when ID changes
  useEffect(() => {
    if (selectedSessionId && enhancedSessions) {
      const session = enhancedSessions.find(s => s.id === selectedSessionId);
      setSelectedSession(session || null);
    }
  }, [selectedSessionId, enhancedSessions]);

  // Handle date selection change
  const handleDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sessionId = parseInt(e.target.value, 10);
    setSelectedSessionId(sessionId);
  };

  if (!enhancedSessions || enhancedSessions.length === 0) {
    return <div className="p-4 text-gray-500">No session data available</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="shadow rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Session Attendance</h2>
        
        {/* Date selector */}
        <div className="mb-6">
          <select
            id="sessionSelect"
            className="block p-2 border border-teal-300 rounded-md shadow-sm "
            onChange={handleDateChange}
            value={selectedSessionId || ''}
          >
            {enhancedSessions.map((session) => (
              <option key={session.id} value={session.id}>
                {new Date(session.session_date).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>
        
        {/* Selected session details */}
        {selectedSession && (
          <div>
            {/* Students list */}
            <div>
              <h3 className="font-medium text-lg mb-2">Students Present ({selectedSession.students.length})</h3>
              {selectedSession.students.length > 0 ? (
                <div className="rounded-md divide-y">
                  {selectedSession.students.map((studentId, index) => (
                    <div key={studentId} className="p-3">
                      <p className="flex justify-between">
                        <span className="font-medium text-gray-600">#{index + 1}</span>
                        <span>{studentId}</span>
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-amber-500 italic">No students present in this session</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionStudentViewer;