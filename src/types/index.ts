export type MyClassesToday = {
    "timetable_id": number,
    "start_time": string,
    "end_time": string,
    "classroom_id": string,
    "teacher_id": string,
    "days": {
      "day_id": number,
      "day_name": string
    },
    "units": {
      "unit_id": string,
      "unit_name": string
    },
    "status": number,
    "progress": string
}

export type AttendedStats = {
  "student_id": string,
  "name": string,
  "total_sessions": number,
  "attended_sessions": number,
  "attendance_percentage": number
}

export type AttendedSummary = {
  "unit_name_result": string,
  "total_sessions": number,
  "total_students": number,
  "avg_attendance": number,
  "avg_attendance_percentage": number
}

export type TeacherInfo = {
  "teacher_id": string,
  "name": string,
  "email": string,
  "units": [
    {
      "unit_id": string,
      "semester": string
    }
  ]
}

export type ConfirmClass = {
  "session_end" : boolean
}

type TimeString = `${number}:${number}:${number}`

export type StartClassSession = {
  "success": boolean,
  "message": string,
  "data": [
    {
      "id": number,
      "unit_id": string,
      "session_date": string,
      "session_end": boolean,
      "end_time": TimeString
    }
  ]
}

export type EndClassSession = {
  "success": boolean,
  "message": string,
  "data": [
    {
      "id": number,
      "unit_id": string,
      "session_date": string,
      "session_end": boolean,
      "end_time": TimeString
    }
  ]
}

export type ClassIsActive = {
  "session_end": boolean
}

export type ClassEndTime = {
  "end_time":string,
  "session_end":boolean,
  "date":string
}

export type QrData = {
  end_time: string,
  unit_id: string
}

export interface ScannerConfig {
  qrbox: {
    width: number;
    height: number;
  };
  fps: number;
  rememberLastUsedCamera: boolean;
}

export type ScannerSuccessCallback = (decodedText: string) => void;
export type ScannerErrorCallback = (errorMessage: string) => void;

export type UploadSingle = {
  "success": boolean,
  "message": string
}

export type InAttendance = {
  "started":boolean
}

export type SessionStarted = {
  "id": number,
  "session_end": boolean
}