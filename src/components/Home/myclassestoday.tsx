import apiService from "../../services/apiService"
import { useEffect, useState } from "react"
import { MyClassesToday } from "../../types";

export default function ClassesToday({teachID}:{teachID:string}) {
    const [data,setData] = useState<MyClassesToday[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await apiService.getMyClassesToday(teachID)
                setData(result)
            } catch (error) {
                console.log(`Error: ${error}`)
            }
        }
        
        fetchData();
        
    },[]);

  return (
    <>
        {
            data.map((item,index) => (
                <div key={index}>
                    <p>{item.units.unit_name}</p>
                    <p>{item.teacher_id}</p>
                    <p>{item.progress}</p>
                </div>
            ))
        }
    </>
  )
}
