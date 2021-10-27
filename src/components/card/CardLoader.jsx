import {useEffect, useReducer, useRef} from "react";
import {ApiResponse} from "../api/ApiResponse";
import {apiConfig} from "../api/apiUtil";
import {load, loadGroup, validation} from "../api/responseTemplates";

const initialLoader = {
    selectedOption: {
        hidePasswordBox: true,
        cardName: ""
    },
    cards: [{name: "-- Load Card --"}],
    allCards: {},
    passwordValidate: {},
    singleCardRequest: {},
    displayedCards: []
};

const loaderReducer = (loaderState, stateChange) => {
    return {...loaderState, [stateChange.type]: stateChange.action};
};

export const CardLoader = ({hasUpdate}) => {
    const update = useRef(false);
    const cardPassword = useRef({password: ""});
    const [loaderState, setLoaderState] = useReducer(loaderReducer, initialLoader);

    useEffect(() => {
        update.current = hasUpdate;
        if (update.current) {
            loadCards();
            update.current = false;
        }
    }, [hasUpdate]);

    const loadCards = () => {
        let config = apiConfig({url: "/api/load-cards", method: "get"}, null);
        let actions = {
            onComplete: {
                success: (res) => {
                    setLoaderState({type: "cards", action: mapResponse(res)})
                },
                fail: () => setLoaderState({type: "cards", action: {name: "No Cards Found"}})
            }
        };
        setLoaderState({type: "allCards", action: {config, templates: loadGroup("Cards"), actions}});
    };

    const mapResponse = (response) => {
        return Object.keys(response.body)
            .map((key) => ({"name": key}))
            .filter(key => !loaderState.cards.some(card => card.name === key.name))
            .concat(loaderState.cards)
    };

    const getCard = () => {
        let actions = {
            onComplete: {
                success: (res) => {
                    setLoaderState({
                        type: "displayedCards", action: [...loaderState.displayedCards,
                            {name: res.body.cardName, balances: JSON.stringify(res.body.balances)}]
                    });
                    setLoaderState({type: "selectedOption", action: {hidePasswordBox: true}});
                },
                fail: () => null
            }
        };
        let config = apiConfig({url: `/api/load-a-card/${loaderState.selectedOption.cardName}`, method: "get"}, null);

        setLoaderState({type: "singleCardRequest", action: {config, templates: load("Card"), actions}});
    };

    const loadSingleCard = () => {
        let actions = {
            onComplete: {
                success: () => getCard(),
                fail: () => null
            }
        };
        let config = apiConfig(
            {url: "/api/card-password", method: "post"},
            {cardName: loaderState.selectedOption.cardName, password: cardPassword.current});

        setLoaderState({type: "passwordValidate", action: {config, templates: validation("Card"), actions}});
    };


    return (
        <div>
            <ApiResponse cssId={"loadCards"} isHidden={true} request={loaderState.allCards}/>
            <select id={"cardSelect"} onClick={() => loadCards()} onChange={e => {
                if (e.target.value === "-- Load Card --") {
                    setLoaderState({type: "selectedOption", action: {hidePasswordBox: true}})
                } else {
                    setLoaderState({type: "selectedOption", action: {hidePasswordBox: false, cardName: e.target.value}})
                }
            }
            }>
                {loaderState.cards.map((card) =>
                    <option key={card.name} value={card.name}>{card.name}</option>
                )}
            </select>
            <div hidden={loaderState.selectedOption.hidePasswordBox}>
                <label htmlFor={"cardPassword"}>Card Password</label>
                <input id={"cardPassword"} type={"text"} onChange={e => cardPassword.current = e.target.value}/>
                <ApiResponse cssId={"cardPasswordCheck"} request={loaderState.passwordValidate}/>
                <ApiResponse cssId={"loadSingleCard"} request={loaderState.singleCardRequest}/>
                <button id={"cardPasswordButton"} type={"button"} onClick={loadSingleCard}>Load Card</button>
            </div>
            {loaderState.displayedCards.map((card) =>
                <div id={"displayedCards"}>
                    <output data-testid={`cardName${loaderState.displayedCards.indexOf(card)}`}>{card.name}</output>
                    <output
                        data-testid={`cardBalance${loaderState.displayedCards.indexOf(card)}`}>{card.balances}</output>
                </div>
            )}
        </div>
    )

};