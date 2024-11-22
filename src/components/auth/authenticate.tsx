import supabase from "../../utils/supabase";
import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"

export default function Authenticate() {

  return (
    <main className="flex flex-col justify-center items-center h-full w-full p-3">
      <div className="md:w-1/2 w-full">
        <h2 className="my-3 text-3xl font-semibold text-center">Attendeez</h2>
        <div className="p-3 border border-teal-500 rounded-lg">
          <Auth 
            supabaseClient={supabase}
            appearance={{theme: ThemeSupa}}
            theme="dark"
            providers={[]}
          />
        </div>
      </div>
    </main>
  )
}
