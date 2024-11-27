import { useEffect, useState } from "react";
import apiService from "../../services/apiService"
import { ClassEndTime, ScannerConfig, ScannerSuccessCallback, ScannerErrorCallback } from "../../types"
import { Html5QrcodeScanner } from "html5-qrcode";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function ScanStudentQrCode({unit_id}:{unit_id:string}) {
    const [data,setData] = useState<ClassEndTime>({"end_time":"","session_end":false,"date":"1999-12-31"})
    const [scannedData, setScannedData] = useState<{ student_id: string }>({ student_id: '' });
    /*
    const [hasPermission, setHasPermission] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [errorMssg, setErrorMssg] = useState<boolean>(false);
    const [didscan, setDidscan] = useState<boolean>(false);

    const [student, setStudent] = useState<string>('');
    */
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

    //scan students QR
    useEffect(() => {
        // Only initialize scanner if conditions are met
        if (!data.session_end) {
            return;
        }

        const scannerConfig: ScannerConfig = {
            qrbox: {width:250, height:250},
            fps: 10,
            rememberLastUsedCamera: true,
        }
        
        const scanner = new Html5QrcodeScanner('reader',scannerConfig,true);

        //on successful scan
        const onSuccessfullScan:ScannerSuccessCallback = (result) => {
            setScannedData(JSON.parse(result))
            uploadStudent(unit_id,`SCT221-${scannedData.student_id}`)
            //setDidscan(true)
            //setHasPermission(true)
            //scanner.clear()
        }

        //error callback
        const error:ScannerErrorCallback = (err) => {
            //setErrorMssg(true)
            if(err.includes('NotAllowedError')) {
                //setHasPermission(false)
                toast.error('Camera Access Denied!')
            } else {
                //setError(err)
                toast.error(`Scan-Error: ${err}`)
            }
        }

        // Small delay to ensure DOM element exists before starting scan
        setTimeout(() => {
            scanner.render(onSuccessfullScan,error)
        }, 100);

        //clean up component on unmount
        return () => {
            void scanner.clear().catch((err:Error) => console.error(err))
        };

    },[data.session_end]);

  return (
    <div className="flex flex-col justify-center items-center w-full bg-base-200 my-5 border border-teal-500 rounded-lg">
        <ToastContainer />
        {
            data.session_end && (
                <div className="w-full h-full">
                    <div className="flex justify-center mt-2 text-lg font-semibold">
                        Scan Student's QR code
                    </div>
                    <div className="relative aspect-square max-w-sm bg-gray-100 rounded-lg overflow-hidden text-gray-600 mx-3 my-2">
                        {/* Scanner will be rendered here */}
                        <div id="reader" className="w-full h-full" />
                    </div>
                </div>
            )
        }
    </div>
  )
}
