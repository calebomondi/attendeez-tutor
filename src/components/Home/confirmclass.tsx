import { ConfirmClass } from "../../types"
import apiService from "../../services/apiService"
import { useEffect, useState } from "react"

export default function ConfirmTodaysClass({unit_id} : {unit_id : string}) {
    const [data, setData] = useState<ConfirmClass[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await apiService.getConfirmClass(unit_id);
                setData(result);
            } catch (error) {
                console.log(`Error CA: ${error}`);
            }
        }

        fetchData();

    },[unit_id]);

  return (
    <>
        {
            data.length > 0 ? (
                data[0].session_end && (<>✅</>)
            ) : (
                <>❌</>
            )  
        }
    </>
  )
}
