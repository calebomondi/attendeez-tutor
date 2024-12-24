import { useEffect, useState } from "react"
import apiService from "../../services/apiService"
import { AttendedSummary } from "../../types"
import { useNavigate } from "react-router-dom"

import { useCookies } from "react-cookie";

export default function AttendanceProgress({unit_id}:{unit_id:string}) {

  const [data,setData] = useState<AttendedSummary[]>([])
  const [cookies, setCookie] = useCookies([`studentsProgress_${unit_id}`])

  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/attendance?unit=${unit_id}`)
  }

  useEffect(() => {
    //Try to load data from cookie
    const cookieData = cookies[`studentsProgress_${unit_id}`]
    if (cookieData) {
      console.log(`cookieData-Progress: ${cookieData}`)
      setData(cookieData)
    }

    const fetchData = async () => {
      try {
        const result = await apiService.getAttendanceSummary(unit_id)
        console.log(`result: ${result}`)
        setData(result)

        // Store the new data in cookie
        setCookie(`studentsProgress_${unit_id}`, result, {
          path: '/',
          maxAge: 3600, // Cookie expires in 1 hour
          secure: true,
          sameSite: 'strict'
        });
      } catch (error) {
        console.log(`Error: ${error}`)
      }
    }

    fetchData()

    console.log(`Data: ${data}`)

  },[unit_id]);

  return (
    <>
      {
        data.length > 0 ? (
          data.map((item,index) => (
            <div className="bg-base-200 border border-teal-500 rounded-lg w-full flex flex-col md:flex-row md:justify-between md:items-center p-2 shadow-none hover:text-teal-500 hover:shadow-[0_0_10px_5px_rgba(0,128,128,0.85)] hover:bg-base-200 transition-shadow duration-300" key={index} onClick={() => handleClick()}>
              <div className="w-full md:w-1/2 flex flex-col justify-center pl-2">
                <p className="text-xl">{unit_id}</p>
                <p className="truncate text-xl">{item.unit_name_result}</p>
              </div>
              <div className="md:w-1/2 flex flex-row justify-evenly mt-2 p-2">
                <div 
                  style={{ "--value": `100`, "--size": "4rem", "--thickness": "2px" } as any} 
                  role="progressbar"
                  className="
                  text-success
                  text-xl
                  mx-2
                  radial-progress
                  sm:[--size:8rem]   // Size for screens ≥ 640px
                  md:[--size:10rem]  // Size for screens ≥ 768px
                  lg:[--size:12rem]  // Size for screens ≥ 1024px
                  "
                >
                    {item.total_sessions}
                </div>
                <div 
                    style={{ "--value": `${Math.round(item.avg_attendance_percentage)}`, "--size": "4rem", "--thickness": "2px" } as any} 
                    role="progressbar"
                    className="
                    text-warning
                    mx-2
                    radial-progress
                    sm:[--size:8rem]   // Size for screens ≥ 640px
                    md:[--size:10rem]  // Size for screens ≥ 768px
                    lg:[--size:12rem]  // Size for screens ≥ 1024px
                    "
                >
                    {Math.round(item.avg_attendance)}
                </div>
                <div 
                    style={{ "--value": `${Math.round(item.avg_attendance_percentage)}`, "--size": "4rem", "--thickness": "2px" } as any} 
                    role="progressbar"
                    className="
                    mx-2
                    radial-progress
                    sm:[--size:8rem]   // Size for screens ≥ 640px
                    md:[--size:10rem]  // Size for screens ≥ 768px
                    lg:[--size:12rem]  // Size for screens ≥ 1024px
                    "
                >
                    {Math.round(item.avg_attendance_percentage)}{'%'}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-center">
            <span className="loading loading-infinity loading-lg"></span>
          </div>
        )
      }
    </>
  )
}
