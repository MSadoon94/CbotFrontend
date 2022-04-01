import {useRef, useState} from "react";
import "./card.css"
import {Card} from "./Card";
import {useApi} from "../api/useApi";
import {cardIds, cardPasswordApiModule, loadCardApiModule} from "./cardApiModule";
import {DynamicSelect} from "../common/DynamicSelect";
import {cardSelectSchema} from "../common/selectSchemas";

export const CardLoader = () => {
    const initialSelected = {hidePasswordBox: true, cardName: ""}
    const cardPassword = useRef({password: ""});
    const [cardSelected, setCardSelected] = useState(initialSelected)
    const [displayedCards, setDisplayedCards] = useState([]);
    const [sendPasswordRequest, passwordResponse, ,] = useApi();
    const [sendCardRequest, cardResponse, ,] = useApi();

    const getCard = async () => {
        await sendCardRequest(loadCardApiModule(cardSelected.cardName))
            .then((res) => {
                let bal = Object.entries(res.body.balances).map(([currency, amount]) => [{currency, amount}]);
                setDisplayedCards([...displayedCards,
                    {name: res.body.cardName, balances: bal, isHidden: false}])
                setCardSelected({...cardSelected, hidePasswordBox: true})
            })
    };

    const loadSingleCard = async () => {
        let cardData = {cardName: cardSelected.cardName, password: cardPassword.current};

        await sendPasswordRequest(cardPasswordApiModule(cardData))
            .then(
                () => getCard(),
                () => null
            );
    };

    const handleSelection = () => {
        const onDefault = () => setCardSelected(initialSelected);
        const onChange = (selection) => setCardSelected({cardName: selection, hidePasswordBox: false});

        return {onDefault, onChange}
    }

    return (
        <>
            <div className={"cardLoader"}>
                <DynamicSelect selectSchema={cardSelectSchema(handleSelection())}/>
            </div>


            <div hidden={cardSelected.hidePasswordBox}
                 id={"cardPasswordVerify"} className={"cardVerify"}>
                <label htmlFor={"cardPassword"}>Card Password</label>
                <input id={"cardPassword"} type={"text"} onChange={e => cardPassword.current = e.target.value}/>
                <output id={cardIds.cardPassResponse} data-testid={cardIds.cardPassResponse}
                        data-issuccess={passwordResponse.isSuccess}>{passwordResponse.message}</output>
                <output id={cardIds.cardResponse} data-testid={cardIds.cardResponse}
                        data-issuccess={cardResponse.isSuccess}>{cardResponse.message}</output>
                <button id={"cardPasswordButton"} type={"button"} onClick={loadSingleCard}>Load Card</button>
            </div>

            <div id={"displayedCards"} className={"loadedCards"}>
                {displayedCards.map((card) =>
                    <Card cardData={card}/>
                )}
            </div>
        </>
    )

};