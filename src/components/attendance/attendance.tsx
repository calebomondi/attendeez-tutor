import { useEffect, useState } from "react"
import apiService from "../../services/apiService"
import { AttendedStats } from "../../types"
import NavBar from "../navbar/navbar";

import { useCookies } from "react-cookie";

export default function Attendance() {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const units = params.get('unit');

    const [data, setData] = useState<AttendedStats[]>([])
    const [cookies, setCookie] = useCookies([`attendance_${units}`])

    useEffect(() => {
        //Try to load data from cookie
        const cookieData = cookies[`attendance_${units}`]
        if (cookieData) {
            console.log(`cookieData-Attendance: ${cookieData}`)
            setData(cookieData)
        }

        const fetchData = async () => {
            try {
                const result = await apiService.geAttendanceStats(String(units))
                setData(result)

                // Store the new data in cookie
                setCookie(`attendance_${units}`, result, {
                    path: '/attendance',
                    maxAge: 3600, // Cookie expires in 1 hour
                    secure: true,
                    sameSite: 'strict'
                });
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
        <main>
            {
                data.length > 0 ? (
                    <div className="overflow-x-auto">
                        <h2 className="text-lg font-semibold my-1 flex justify-center">{units} Attendance Report</h2>
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
                    <div className="flex justify-center mt-5">
                        {
                            !attendance ? (
                                <p>No Attendance Records Yet!</p>
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
