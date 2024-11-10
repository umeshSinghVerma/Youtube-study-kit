import React, { createContext, useState } from 'react';

export const SearchContext = createContext();
export const SearchProvider = ({ children }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const updateSearch = (term) => {
        setSearchTerm(term);
        const results = performSearch(term);
        setSearchResults(results);
    };

    const performSearch = (term) => {
        return term ? [{ id: 1, title: `Result for "${term}"` }] : [];
    };

    return (
        <SearchContext.Provider value={{ searchTerm, searchResults, updateSearch }}>
            {children}
        </SearchContext.Provider>
    );
};
