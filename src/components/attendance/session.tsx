import SessionStudentViewer from './sessionViewer';
import NavBar from '../navbar/navbar';

interface Session {
  id: number;
  unit_id: string;
  session_date: string;
  students: string[];
}

export default function Session () {
  // Your data from Supabase
  const data: Session[]  =  [
      {
        "id": 71,
        "unit_id": "BIT2315",
        "session_date": "2025-03-10",
        "students": [
          "SCT221-0211/2021",
          "SCT221-0111/2021",
          "SCT221-0097/2021",
          "SCT221-0408/2022",
          "SCT221-0409/2022",
          "SCT221-0413/2022"
        ]
      },
      {
        "id": 72,
        "unit_id": "BIT2315",
        "session_date": "2025-03-17",
        "students": [
          "SCT221-0211/2021",
          "SCT221-0111/2021",
          "SCT221-0097/2021"
        ]
      }
    ]

  return (
    <>
        <NavBar />
        <SessionStudentViewer enhancedSessions={data} />
    </>
  );
};