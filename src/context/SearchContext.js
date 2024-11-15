/* global chrome */

import React, { createContext, useEffect, useState } from 'react';

export const SearchContext = createContext();

async function getVideoData(setUserData, setLoading,setCurrentsearch) {
    try {
        setLoading(true);
        await chrome.storage.local.get("userData").then(async (result) => {
            if (result.userData) {
                const userData = result.userData || {} ;
                setUserData(userData);
                setCurrentsearch(Object.keys(userData)[0]);
            }
        });
    } catch (error) {
        console.log(error)
    } finally {
        setLoading(false);
    }
}



export const SearchProvider = ({ children }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [currentSearch, setCurrentsearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [UserData, setUserData] = useState({});

    useEffect(() => {
        getVideoData(setUserData, setLoading,setCurrentsearch);
    }, [])

    const videoMapById = {};
    const videoMapByTitle = {};

    Object.keys(UserData).forEach((key) => {
        videoMapById[key] = UserData[key].heading;
        videoMapByTitle[UserData[key].heading.toLowerCase()] = key;
    });

    const updateSearch = (term) => {
        setSearchTerm(term);
        const results = performSearch(term);
        setSearchResults(results);
    };

    const updateCurrentSearch = (videoid) => {
        setCurrentsearch(videoid);
    }

    const performSearch = (term) => {
        if (!term) return [];

        const lowerCaseTerm = term.toLowerCase();

        const titleMatches = Object.keys(videoMapByTitle)
            .filter((title) => title.includes(lowerCaseTerm))
            .map((title) => {
                const id = videoMapByTitle[title];
                return { id, title: videoMapById[id] };
            });

        const idMatches = Object.keys(videoMapById)
            .filter((id) => id.includes(lowerCaseTerm))
            .map((id) => ({ id, title: videoMapById[id] }));

        const uniqueResults = [...new Map([...titleMatches, ...idMatches].map((item) => [item.id, item])).values()];

        return uniqueResults;
    };

    return (
        <SearchContext.Provider value={{ searchTerm, searchResults, updateSearch, updateCurrentSearch, currentSearch, UserData, loading }}>
            {children}
        </SearchContext.Provider>
    );
};
