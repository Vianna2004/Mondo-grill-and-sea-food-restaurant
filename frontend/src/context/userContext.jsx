import { useState } from "react";
import { createContext } from "react";

const UserContext = createContext();

const UserContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : null);

    //localStorage.getItem('token') 

    const value = {
        backendUrl,
        token,
        setToken
    };

    return (
        <UserContext.Provider value={value}>
            {props.children}
        </UserContext.Provider>
    );
};

export default UserContextProvider;
export { UserContext };