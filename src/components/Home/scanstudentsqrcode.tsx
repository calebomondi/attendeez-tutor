import { useEffect, useState } from "react";
import apiService from "../../services/apiService"
import { ClassEndTime } from "../../types"

import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import QRScanner from "./zxing";

export default function ScanStudentQrCode({unit_id}:{unit_id:string}) {
    const [data,setData] = useState<ClassEndTime>({"end_time":"","session_end":false,"date":"1999-12-31"})
    //const [scannedData, setScannedData] = useState<{ student_id: string }>({ student_id: '' });
    
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

    /*
    function uploadStudent(unit_id:string,student_id:string) : void {
        try {
            const fetchData = async () => {
                const inAttendance = await apiService.checkInAttendance(unit_id,student_id)
                if (inAttendance.started){
                    const result = await apiService.uploadSingleStudent(unit_id,student_id)
                    console.log('upload-student')
                    //setStudent(result.message)
                    toast.success(result.message)
                } else {
                    //setStudent(`${student_id} Did Not Join Session! ⚠`)
                    toast.error(`${student_id} Did Not Join Session! ⚠`)
                }  
            }

            fetchData()
        } catch (error) {
            console.log(`upload-student-error: ${error}`)
            toast.error(`upload-student-error: ${error}`)
        }
    }
        */

    const handleScan = (result: string) => {
        //setScannedData({ student_id: result });
        toast.success(result)
    };

    const handleError = (error: Error) => {
        console.error('QR Scan Error:', error)
        toast.error(`${error}`)
    };

  return (
    <div className="flex flex-col justify-center items-center w-full bg-base-200 my-5 border border-teal-500 rounded-lg">
        <ToastContainer />
        {
            data.session_end && (
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
