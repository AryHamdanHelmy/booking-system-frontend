import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

export function useAuth(){
    const context = useContext(AuthContext);

    if(context === null) {
        throw new Error('useAuth harus dipakai di dalam AuthProvider.');
    }
    return context;
}