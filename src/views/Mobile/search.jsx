import React from 'react';
import { useDispatch } from "react-redux";
import { SearchIcon } from "@heroicons/react/outline";
import CategoryBox from '../../components/Mobile/CategoryBox';
import {setShowSwitchToAppSuggestionDialog} from "../../store/ui";

function Search(props) {

    const dispatch = useDispatch();

    const handleSearchClick = () => {
        dispatch(setShowSwitchToAppSuggestionDialog(true))
    }

    return (
        <div className="search-container">
            <div className="search">
                <div className="search-bar">
                    <form>
                        <input  onClick={handleSearchClick} type='text' className='form-group' placeholder='Search Empowerverse' />
                        <SearchIcon className='category-search-icon' />
                    </form>
                </div>
                <CategoryBox />
            </div>
        </div>
    );
}

export default Search;