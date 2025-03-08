import { useEffect, useState } from "react"
import apiService from "../../services/apiService"
import { SessionStarted,MyClassesToday } from "../../types"
import ConfirmTodaysClass from "./confirmclass"

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function TodaysClasses({teacher_id, unit_id} : {teacher_id : string,unit_id : string}) {
    const [data,setData] = useState<MyClassesToday[]>([])

    const [end,setEnd] = useState<boolean>(true)

    const [before,setBefore] = useState<boolean>(false)

    const [started, setStarted] = useState<SessionStarted>({"id":0,"session_end":false})

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await apiService.getMyClassesToday(teacher_id=teacher_id)
                setData(result)
            } catch (error) {
                console.log(`Error: ${error}`)
            }
        }

        fetchData()

        hideStart()

        sessStart()

    },[teacher_id, end, before, started]);

    const handleStartClass = async () => {
        const response = await apiService.postStartClassSession(unit_id)
        if(response.success){
            toast.success(response.message)
        }
        setEnd(false)
        
    }

    const handleEndClass = async () => {
        const response = await apiService.putEndClassSession(unit_id)
        if(response.success) {
            toast.success(response.message)
            hideStart()
        } 
    }

    const hideStart = async () => {
        const hide = await apiService.isClassActive(unit_id)
        console.log(`hide: ${hide.session_end}`)
        if (hide)
            setEnd(hide.session_end)

        const check = await apiService.endBeforeTime(unit_id)
        console.log(`beforeTime: ${check.session_end}`)
        if (check)
            setBefore(check.session_end)

    }

    const sessStart = async () => {
        const start = await apiService.sessionStarted(unit_id)
        console.log(`sessionStarted: ${start.id}`)
        if(start.id > 0)
            setStarted(start)
    }

    let classToday = false
    if(data.length > 0) 
        classToday = true

  return (
    <>
        {
            data.length > 0 ? (
                data.map((item,index) => (
                    <div key={index} className="bg-base-200 flex flex-col md:flex-row w-full border border-teal-500 rounded-lg">
                        <div className="w-full md:w-1/2 p-3">
                            <p className="text-xl md:text-lg flex items-center justify-center md:justify-start">{item.units.unit_id}</p>
                            <p className="text-xl md:text-lg flex items-center justify-center md:justify-start">{item.units.unit_name}</p>
                            <p className="text-xl md:text-lg flex items-center justify-center md:justify-start">{item.start_time} - {item.end_time}</p>
                            <p className="text-xl md:text-lg flex items-center justify-center md:justify-start">{item.classroom_id}</p>
                        </div>
                        <div className="w-full md:w-1/2 flex justify-center items-center py-2">
                            {
                                item.status === 0 ? (
                                    started.id > 0 ? (
                                        !started.session_end ? (
                                            <>
                                                <div className="flex flex-row md:flex-col w-full md:w-1/2 justify-evenly">
                                                    <button 
                                                        className="btn btn-success md:mb-1 text-xl md:text-lg text-white"
                                                        disabled={!end}
                                                        onClick={() => handleStartClass()}
                                                    >
                                                        Start Session
                                                    </button>
                                                    <button 
                                                        className="btn btn-error text-xl md:text-lg text-white"
                                                        disabled={end}
                                                        onClick={() => handleEndClass()}
                                                    >
                                                        End Session
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <span className="text-lg w-1/3 flex justify-evenly">
                                                ended < ConfirmTodaysClass unit_id={unit_id}/>
                                            </span>
                                        )
                                    ) : (
                                        <span className="text-lg w-1/3 flex justify-evenly">
                                            ended < ConfirmTodaysClass unit_id={unit_id}/>
                                        </span>
                                    )
                                ) : ( 
                                    item.status === 1 ? (
                                        before ? (
                                            <span className="text-lg w-1/3 flex justify-evenly">
                                                ended | < ConfirmTodaysClass unit_id={unit_id}/>
                                            </span>
                                        ) : (
                                            <>
                                                <div className="flex flex-row md:flex-col w-full md:w-1/2 justify-evenly">
                                                    <button 
                                                        className="btn btn-success md:mb-1 text-xl md:text-lg text-white"
                                                        disabled={!end}
                                                        onClick={() => handleStartClass()}
                                                    >
                                                        Start Session
                                                    </button>
                                                    <button 
                                                        className="btn btn-error text-xl md:text-lg text-white"
                                                        disabled={end}
                                                        onClick={() => handleEndClass()}
                                                    >
                                                        End Session
                                                    </button>
                                                </div>
                                            </>
                                        )
                                ) : (
                                    item.status === 2 ? (
                                        <span className="text-lg w-1/2 flex justify-evenly flex-row">
                                            upcoming <span className="loading loading-dots loading-lg"></span>
                                        </span>
                                    ) : (
                                        <span className="loading loading-infinity loading-lg"></span>
                                    )
                                ))
                            }
                        </div>
                    </div>
                ))
            ) : (
                <div className="flex justify-center text-lg my-5 font-semibold">
                    {
                        !classToday ? (
                            <p className="text-warning">You Have No Sessions Today</p>
                        ) : (
                            <span className="loading loading-infinity loading-lg"></span>
                        )
                    }
                </div>
            )
        }
    </>

  )
}
