import React, { useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";

const Autocomplete = ({ inputData, suggestions, handleOnChange, name,auto }) => {
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [userInput, setUserInput] = useState("");

    const onChange = (e) => {
        const input = e.target.value;
        const filtered = suggestions.filter((suggestion) =>
            suggestion && suggestion.toLowerCase().includes(input.toLowerCase())
        );
        if(auto){
            handleOnChange({ target: { name: name, value: input } })
        }
        setUserInput(input);
        setFilteredSuggestions(filtered);
        setShowSuggestions(true);
    };

    const onClick = (e) => {
        setFilteredSuggestions([]);
        setUserInput(e.target.innerText);
        handleOnChange({ target: { name: name, value: e.target.innerText } })
        setShowSuggestions(false);
    };

    const renderSuggestions = () => {
        if (showSuggestions && userInput) {
            if (filteredSuggestions.length) {
                
                return (
                    <ul
                        className="list-group position-absolute w-100"
                        style={{
                            zIndex: 1050, // Ensures the dropdown is above other content
                            backgroundColor: "#fff", // Solid background for the suggestion box
                            maxHeight: "200px", // Limits height to keep it manageable
                            overflowY: "auto", // Enables scrolling if too many suggestions
                            border: "1px solid #ced4da", // Adds a border like typical Bootstrap dropdowns
                        }}
                    >
                        {filteredSuggestions.map((suggestion, index) => (
                            <li
                                key={index}
                                className="list-group-item list-group-item-action"
                                onClick={onClick}
                            >
                                {suggestion}
                            </li>
                        ))}
                    </ul>
                );
            }
        }
        return null;
    };

    return (
        <div className="autocomplete position-relative" style={{ maxWidth: "400px", margin: "0 auto" }}>
            <input
                type="text"
                className="form-control"
                onChange={onChange}
                value={inputData[name] ? inputData[name] : userInput}
                placeholder="Type to search..."
                style={{ zIndex: 1040 }} // Ensures the input stays above other content
            />
            {renderSuggestions()}
        </div>
    );
};

export default Autocomplete;
