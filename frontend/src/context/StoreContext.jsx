import { createContext, useEffect ,useState } from "react";
import { useNavigate } from "react-router-dom";
export const StoreContext = createContext(null)

const StoreContextProvider = (props)=>{
    const navigate=useNavigate()
    const [loading, setLoading] = useState(false);

    const contextValue={
       
        loading,
        setLoading,
       
    }
    return(
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}
export default StoreContextProvider;