import { useState, useEffect } from "react";
import { createContext } from "react";
import { UserContext } from "./userContext";
import { useContext } from "react";

const AdminContext = createContext();

const AdminContextProvider = (props) => {
    const { token } = useContext(UserContext);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setIsAdmin(payload.role === 'admin');
            } catch (error) {
                setIsAdmin(false);
            }
        } else {
            setIsAdmin(false);
        }
    }, [token]);

    const value = {
        isAdmin
    };

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;
export { AdminContext };