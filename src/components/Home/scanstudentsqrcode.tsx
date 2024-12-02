import { useEffect, useState } from "react";
import apiService from "../../services/apiService"
import { ClassEndTime } from "../../types"

import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import QRScanner from "./zxing";

import isWithinTimeLimit from "../attendance/withinTimeLimit";

export default function ScanStudentQrCode({unit_id}:{unit_id:string}) {
    const [data,setData] = useState<ClassEndTime>({"end_time":"","session_end":false,"date":"1999-12-31"})
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await apiService.checkSessionEnd(unit_id)
                setData(result)
            } catch (error) {
                console.log(`Error: ${error}`)
            }
        }

        fetchData()

    },[unit_id]);

    function uploadStudent(unit_id:string,student_id:string) : void {
        try {
            const fetchData = async () => {
                const inAttendance = await apiService.checkInAttendance(unit_id,student_id)
                if (inAttendance.started){
                    const result = await apiService.uploadSingleStudent(unit_id,student_id)
                    toast.success(result.message)
                } else {
                    toast.error(`${student_id} Did Not Join Session! ⚠`)
                }  
            }

            fetchData()
        } catch (error) {
            console.log(`upload-student-error: ${error}`)
            toast.error(`upload-student-error: ${error}`)
        }
    }

    const handleScan = (result: string) => {
        if (result.length > 0) {
            const jsonObj = JSON.parse(result)
            const stud_id = jsonObj.student_id[0]
            if (isWithinTimeLimit(data.end_time)) 
                uploadStudent(unit_id,`SCT221-${stud_id}`)
            else 
                toast.error('Scanning Period Has Elapsed!')
        }
    };

    const handleError = (error: Error) => {
        console.error('QR Scan Error:', error)
        toast.error(`${error}`)
    };

  return (
    <div className="flex flex-col justify-center items-center w-full bg-base-200 my-5 border border-teal-500 rounded-lg">
        <ToastContainer />
        {
            data.session_end && isWithinTimeLimit(data.end_time) && (
                <div className="w-full h-full">
                    <div className="flex justify-center mt-2 text-lg font-semibold">
                        Scan Student's QR code
                    </div>
                    <QRScanner 
                        onScan={handleScan} 
                        onError={handleError} 
                    />
                </div>
            )
        }
    </div>
  )
}
