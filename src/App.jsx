import "./index.css";
import { useState } from "react";

const App = () => {
    const [loadError, setLoadError] = useState(""); // error message

    const [inputValue, setInputValue] = useState(""); // user input

    const [chatHistory, setChatHistory] = useState([]); // chat history

    const surpriseOptions = [
        "Give me a fun fact about Estonia.",
        "when are UK elections?",
        "what are Paris Olympics events to watch for?",
        "what is the weather today like in Mumbai?",
        "Who will win India elections?",
    ];

    const surpriseValue = () => {
        const randomSurprise = Math.floor(Math.random() * surpriseOptions.length);
        setInputValue(surpriseOptions[randomSurprise]);
    };

    const clear = () => {
        setLoadError("");
        setInputValue("");
        setChatHistory([]);
    };

    const responseOut = async () => {
        if (!inputValue) {
            setLoadError("Please enter a question...!");
            return;
        }

        try {
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    history: chatHistory,
                    message: inputValue,
                }),
            };
            const response = await fetch("http://localhost:9090/gemini/", options);
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
            const data = await response.json(); // get the response
            console.log("Response received(web console): ", data);
            //console.log(`questions was ${inputValue}`);

            //how to make array from string to array where entire string is a part of the array

            setChatHistory((oldHistory) => [
                {
                    role: "user",
                    parts: inputValue,
                },
                {
                    role: "model",
                    parts: data[0].text,
                },
                ...oldHistory,
            ]);

            setInputValue(""); // reset value
            console.log("chat history is ", chatHistory);
        } catch (error) {
            console.error(error);
            setLoadError("Something went wrong...! Please try again.");
        }
    };

    return (
        <div className="App">
            <p className="surprise-bar">
                What do you want to know?
                <button
                    type="button"
                    className="surprise-button"
                    onClick={surpriseValue}
                    disabled={!chatHistory}>
                    surprise me!
                </button>{" "}
            </p>
            <div className="input-container">
                <input
                    type="text"
                    placeholder="What is your question?"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                {!loadError && (
                    <button
                        type="button"
                        onClick={responseOut}>
                        Search
                    </button>
                )}
                {loadError && (
                    <button
                        type="button"
                        onClick={clear}>
                        Clear
                    </button>
                )}
            </div>
            {loadError && <p>{loadError}</p>}

            <div className="search-results">
                {chatHistory.map((chatItem, _index) => (
                    <div
                        className="searchbox"
                        key={_index}>
                        <p className="answer">
                            {chatItem.role}: {chatItem.parts}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default App;
