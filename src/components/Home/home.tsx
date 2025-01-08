import AttendanceProgress from "./attendanceprogress"
import TodaysClasses from "./todaysclasses"
import ScanStudentQrCode from "./scanstudentsqrcode"
import NavBar from "../navbar/navbar"

export default function Home({teacher_id,unit_id}:{teacher_id:string,unit_id:string}) {
  
  return (
    <>
    <NavBar />
      <main className="flex justify-center w-full">
        <div className="md:w-1/2 p-2 w-full">
          <h2 className="flex justify-center my-2 py-2 text-xl font-semibold">My Class</h2>
          <AttendanceProgress unit_id={unit_id}/>
          <h2 className="flex justify-center my-2 py-2 text-xl font-semibold">Today's Sessions</h2>
          <TodaysClasses teacher_id={teacher_id} unit_id={unit_id}/>
          <ScanStudentQrCode unit_id={unit_id}/>
        </div>
      </main>
    </>
  )
}
