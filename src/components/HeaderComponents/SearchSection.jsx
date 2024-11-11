import React, { useState, useContext, useCallback, useRef, useEffect } from 'react';
import SearchIcon from '../SearchIcon';
import MicIcon from '../MicIcon';
import { Search, X } from 'lucide-react';
import { SearchContext } from '../../context/SearchContext';

export default function SearchSection() {
    const { searchResults, updateSearch, updateCurrentSearch } = useContext(SearchContext);
    const [searchValue, setSearchValue] = useState("");
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [isFocussed, setIsFocussed] = useState(false);
    const searchBoxRef = useRef(null);

    const handleSearch = useCallback((e) => {
        const term = e.target.value;
        setSearchValue(term);
        updateSearch(term);
        setIsDropdownVisible(term.length > 0);
    }, [updateSearch]);

    const handleResultClick = (result) => {
        setSearchValue(result.title);
        updateCurrentSearch(result.id);
        setIsDropdownVisible(false);
    };

    const handleClickOutside = (e) => {
        if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
            setIsDropdownVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="flex gap-5">
            <div className="flex rounded-full border bg-[#121212] border-[#303030]" ref={searchBoxRef}>
                <div className="p-[6px] pl-4 flex items-center justify-center relative">
                    {(isFocussed || searchValue.length > 0) && <span className='text-white'>
                        <Search height={20} width={20} />
                    </span>}
                    <div className='relative'>
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-[500px] placeholder:text-[#ffffffe0] bg-transparent h-[26px] outline-none text-white pl-3 pb-[2px]"
                            onChange={handleSearch}
                            value={searchValue}
                            onFocus={() => setIsFocussed(true)}
                            onBlur={() => setIsFocussed(false)}
                            aria-label="Search input"
                        />
                        {isDropdownVisible && (
                            <div
                                className="absolute flex flex-col gap-1 py-3 z-50 bg-[#121212] mt-3 rounded-lg left-0 text-white h-[400px] w-full border border-[#303030] shadow-lg"
                                role="listbox"
                            >
                                {searchResults.length > 0 ? (
                                    searchResults.map((result) => (
                                        <div
                                            key={result.id}
                                            onClick={() => handleResultClick(result)}
                                            className="hover:bg-[#303030] p-1 flex gap-2 items-center cursor-pointer"
                                            role="option"
                                        >
                                            <Search height={15} width={15} />
                                            <p>{result.title}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-2 text-[#aaaaaa]">
                                        No results found
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className='w-10'></div>
                    {searchValue.length > 0 && <button
                        onClick={() => {
                            setSearchValue("");
                            setIsDropdownVisible(false);
                        }}
                        className='text-white hover:bg-[#5a5a5a45] flex items-center justify-center absolute right-2 p-2 rounded-full cursor-pointer'>
                        <X height={20} width={20} />
                    </button>}
                </div>
                <div className="bg-[#ffffff14] text-white w-[60px] rounded-r-full flex items-center justify-center">
                    <span className="w-[24px] h-[24px]">
                        <SearchIcon height={24} width={24} />
                    </span>
                </div>
            </div>
            <div className="bg-[#ffffff14] w-[43px] rounded-full text-white flex items-center justify-center">
                <span className="h-[24px] w-[24px]">
                    <MicIcon height={24} width={24} />
                </span>
            </div>
        </div>
    );
}
