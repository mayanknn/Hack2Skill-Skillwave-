import React, { useState } from 'react';
import '../../../App.css';
import axios from 'axios';

function YT() {
    const [videoLink, setVideoLink] = useState('');
    const [summary, setSummary] = useState('');
    const [language, setLanguage] = useState('english'); // Default language
    const [showCodes, setShowCodes] = useState(false);
    const [showTheory, setShowTheory] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        setVideoLink(e.target.value);
    };

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        if (name === "showCodes") {
            setShowCodes(checked);
        } else if (name === "showTheory") {
            setShowTheory(checked);
        }
    };

    const handleButtonClick = async (type) => {
        let additionalPrompt = '';
        if (showCodes && showTheory) {
            additionalPrompt = 'with both codes and conceptual theory';
        } else if (showCodes) {
            additionalPrompt = 'with only codes';
        } else if (showTheory) {
            additionalPrompt = 'with only conceptual theory';
        }

        setIsLoading(true); // Start loading

        try {
            const response = await axios({
                url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyCn3A8z6z1jIQn-JWoEoXQkw0Mgm8GRojw",
                method: "post",
                data: {
                    "contents": [
                        {
                            "parts": [
                                { "text": `Give ${type} of the following: ${videoLink} | in ${language} ${additionalPrompt}` }
                            ]
                        }
                    ]
                }
            });

            setSummary(response.data.candidates[0].content.parts[0].text);
        } catch (error) {
            console.error("Error fetching the summary", error);
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    return (
        <div className="yt-container">
            <h2>Topic Summarization</h2>
            <input
                type="text"
                placeholder="Enter Topic Name or The Prompt"
                value={videoLink}
                onChange={handleInputChange}
                className="yt-input"
            />
            <div className="yt-select">
                <label htmlFor="language">Select Language: </label>
                <select id="language" value={language} onChange={handleLanguageChange}>
                    <option value="hindi">Hindi</option>
                    <option value="english">English</option>
                    <option value="spanish">Spanish</option>
                    <option value="french">French</option>
                    <option value="german">German</option>
                    <option value="chinese">Chinese</option>
                    <option value="japanese">Japanese</option>
                </select>
            </div>
            <div className="yt-options">
                <label>
                    <input
                        type="checkbox"
                        name="showCodes"
                        checked={showCodes}
                        onChange={handleCheckboxChange}
                    />
                    Only Codes
                </label>
                <label>
                    <input
                        type="checkbox"
                        name="showTheory"
                        checked={showTheory}
                        onChange={handleCheckboxChange}
                    />
                    Only Conceptual Theory
                </label>
            </div>
            <div className="yt-buttons">
                <button onClick={() => handleButtonClick('Full Detailed Explanation With all things explained in detail')} disabled={isLoading}>Detailed Explanation</button>
                <button onClick={() => handleButtonClick('Summary with not more detailed explanation but explanation vital to learn something')} disabled={isLoading}>Summary</button>
                <button onClick={() => handleButtonClick('Key Points only to learn or the topic names')} disabled={isLoading}>Key Points</button>
            </div>
            {isLoading ? (
                <div className="yt-loading">Loading...</div>
            ) : (
                <div className="yt-summary-box">
                    {summary.split('\n').map((line, index) => (
                        <p key={index}>{line}</p>
                    ))}
                </div>
            )}
        </div>
    );
}

export default YT;
