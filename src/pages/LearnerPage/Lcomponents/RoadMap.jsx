import React, { useState, useEffect } from 'react';
import '../../../App.css';
import axios from 'axios';

function RoadMap() {
    const [videoLink, setVideoLink] = useState('');
    const [summary, setSummary] = useState('');
    const [language, setLanguage] = useState('english'); // Default language
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const localPrefrence = localStorage.getItem('preferencesData');
        const localUser = localStorage.getItem('userData');
        if (localPrefrence && localUser) {
            const prefData = JSON.parse(localPrefrence);
            const userData = JSON.parse(localUser);

            if (prefData.length > 0 && userData) {
                const userName = userData.Username;
                const prefCategory = prefData[0].category;
                const prefSubCategory = prefData[0].subCategory;
                const prefGoal = prefData[0].goals;
                const prefCurrentSkills = prefData[0].currentSkills;
                const prefDesiredSkills = prefData[0].desiredSkills;

                const prefString = `My name is ${userName}. I am interested in the field: ${prefCategory} and in that ${prefSubCategory}. My future Goal is ${prefGoal}. My Current Skills are ${prefCurrentSkills} and I want to Learn ${prefDesiredSkills}.`;
                setVideoLink(prefString);
            }
        }
    }, []);

    const handleInputChange = (e) => {
        setVideoLink(e.target.value);
    };

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
    };

    const handleButtonClick = async (type) => {
        setIsLoading(true); // Start loadingZ

        try {
            const response = await axios({
                url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyCywA4XfhzAuvm3KZEN619DAT362fb9aZg",
                method: "post",
                data: {
                    "contents": [
                        {
                            "parts": [
                                { "text": `Give ${type} Roadmap of the following: ${videoLink} | in ${language} | with detailed all day Schedule(including all timings)` }
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
            <h2>RoadMap Generator</h2>
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
            <div className="yt-buttons">
                <button onClick={() => handleButtonClick('One Month')} disabled={isLoading}>One Month</button>
                <button onClick={() => handleButtonClick('Six Months')} disabled={isLoading}>Six Months</button>
                <button onClick={() => handleButtonClick('One Year')} disabled={isLoading}>One Year</button>
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

export default RoadMap;
