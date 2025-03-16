import { useState, useEffect } from 'react';
import SessionStudentViewer from './sessionViewer';
import NavBar from '../navbar/navbar';
import { SessionData } from '../../types';
import apiService from '../../services/apiService';

export default function Session () {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const units = params.get('unit');

  const [sessions, setSessions] = useState<SessionData[]>([])

  useEffect(() => {
    //from ls
    const ls_data = localStorage.getItem('class_sessions')
    if (ls_data) {
      setSessions(JSON.parse(ls_data))
    }

    //from db
    const fetchData = async () => {
      const response = await apiService.getSessionStats(String(units))
      if(response) {
        setSessions(response)
        console.log(`==> ${JSON.stringify(response)}`)
        localStorage.setItem('class_sessions', JSON.stringify(response))
      }
    }

    fetchData()
  }, [])

  return (
    <>
      <NavBar />
      <SessionStudentViewer enhancedSessions={sessions} />
    </>
  );
};