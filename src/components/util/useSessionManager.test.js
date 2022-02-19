import {useSessionManager} from "./useSessionManager";
import {Route, Router, Routes,} from "react-router-dom";
import {Home} from "../home/Home";
import {UserStart} from "../user/UserStart";
import {appHistory, urls} from "./historyUtil";
import {renderHook} from "@testing-library/react-hooks";
import {waitFor} from "@testing-library/react";
import {rest} from "msw";
import {HttpStatus} from "../common/httpStatus";
import {failedRequest} from "../../mocks/apiMocks";

const cleanRender = () => {
    const wrapper = ({children}) => (
        <Router location={appHistory.location} navigator={appHistory}>
            <Routes>
                <Route path={urls.start} element={<UserStart/>}/>
                <Route path={urls.home} element={<Home/>}/>
            </Routes>
            {children}
        </Router>
    )
    return renderHook(() => useSessionManager(), {wrapper});
}

describe("routing features", () => {
    test("should send user to home page when logged in", () => {
        localStorage.setItem("session", JSON.stringify({isExpired: false, isLoggedIn: true}));
        cleanRender();
        expect(appHistory.location.pathname).toBe(urls.index.concat(urls.home));
    })

    test("should send user to start page when not logged in", () => {
        localStorage.setItem("session", JSON.stringify({isExpired: false, isLoggedIn: false}))
        cleanRender();
        expect(appHistory.location.pathname).toBe(urls.index.concat(urls.start));
    })
})

describe("refresh features", () => {

    test("should send refresh request when session expired", async () => {
        localStorage.setItem("session", JSON.stringify({isExpired: true, isLoggedIn: true}))
        cleanRender();
        await waitFor(() =>
            expect(JSON.parse(localStorage.getItem("session")).isExpired).toBe(false));
    });

    test("should display alert when session expired", async () => {
        failedRequest(rest.post, "/refresh-jwt", HttpStatus.unauthorized);
        window.alert = jest.fn();
        localStorage.setItem("session", JSON.stringify({isExpired: true, isLoggedIn: true}))
        cleanRender();
        await waitFor(() => expect(window.alert).toBeCalledWith("Session expired, logging out."));
    })
})