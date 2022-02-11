import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {urls} from "./historyUtil";
import {refresh} from "../api/apiRequest";


export const useSessionManager = () => {
    const navigate = useNavigate();

    const userSession = () => {
        if(!JSON.parse(localStorage.getItem("session"))){
            localStorage.setItem("session", JSON.stringify({isExpired: false, isLoggedIn: false}))
        }
        return JSON.parse(localStorage.getItem("session"));
    };

    const [session, setSession] = useState(userSession());

    useEffect(() => {
        if (session.isLoggedIn && session.isExpired) {
            refresh(setSession)
                .catch(() => {
                    alert("Session expired, logging out.");
                    navigate(urls.start);
                });
        }

        if (session.isLoggedIn) {
            navigate(urls.home);
        } else {
            navigate(urls.start);
        }

    }, [session])

    return [setSession]

}