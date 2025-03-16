import { useEffect, useState } from "react"
import apiService from "../../services/apiService"
import { AttendedStats } from "../../types";
import NavBar from "../navbar/navbar";

export default function Attendance() {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const units = params.get('unit');

    const [data, setData] = useState<AttendedStats[]>([])

    useEffect(() => {
        //load from ls
        const ls_data = localStorage.getItem('class_attendance')
        if (ls_data) {
            setData(JSON.parse(ls_data))
        }

        //load from db
        const fetchData = async () => {
            try {
                const result = await apiService.geAttendanceStats(String(units))
                setData(result)

                localStorage.setItem('class_attendance', JSON.stringify(result))
            } catch (error) {
                console.log(`Error: ${error}`)
            }
        }

        fetchData()

    },[])

    let attendance = false

    if(data.length > 0)
        attendance = true

  return (
    <>
        <NavBar />
        <main className="">
        <h2 className="text-lg font-semibold my-1 flex justify-center">{units} Attendance Report</h2>
            {
                data.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="table table-xs table-pin-rows table-pin-cols">
                            <thead>
                                <tr className="bg-teal-600">
                                    <th className="text-lg p-1 bg-teal-600"></th>
                                    <td className="text-lg p-1 text-white">Admission No.</td>
                                    <td className="text-lg p-1 text-white">Name</td>
                                    <td className="text-lg p-1 text-white">Attended</td>
                                    <td className="text-lg p-1 text-white">%</td>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data.map((item,index) => (
                                        <tr key={index}>
                                            <th className="p-1 dark:bg-teal-900 bg-teal-400">{index + 1}</th>
                                            <td className="p-1 text-lg">{item.student_id}</td>
                                            <td className="p-1 text-lg">{item.name}</td>
                                            <td className="p-1 text-lg">{item.attended_sessions}</td>
                                            <td className="p-1 text-lg">{item.attendance_percentage}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex justify-center">
                        {
                            !attendance ? (
                                <p className='text-amber-500 text-lg'>No Attendance Records Available</p>
                            ) : (
                                <span className="loading loading-infinity loading-lg"></span>
                            )
                        }
                    </div>
                )
            }
        </main>
    </>
    
  )
}
