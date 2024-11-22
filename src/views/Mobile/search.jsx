import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import CategoryBox from '../../components/Mobile/CategoryBox';
import {setShowSwitchToAppSuggestionDialog} from "../../store/ui";
import MobileTopNavigation from '../../components/Mobile/TopNavigation';
import MobileSideNavigation from '../../components/Mobile/SideNavigation';

function Search(props) {

    const dispatch = useDispatch();
    const [isSideNavOpen, setIsSideNavOpen] = useState(false);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
    const handleNavigationClick = () => {
        setIsSideNavOpen(false);
      };

    const handleSearchClick = () => {
        dispatch(setShowSwitchToAppSuggestionDialog(true))
    }

    return (
        <>
        <MobileTopNavigation
        isSideNavOpen={isSideNavOpen}
        setIsSideNavOpen={setIsSideNavOpen}
      />
      <div className="container">
      <div style={{display : `${isSideNavOpen ? 'block' : 'none'} `}} onClick={()=> setIsSideNavOpen(false)} className="overlay"></div>
      <aside className="side-bar">
          <MobileSideNavigation
            isOpen={isSideNavOpen}
            onClose={handleNavigationClick}
          />
        </aside>
        <div className="main-container">
        <div className="search-container">
            <div className="search">
                <div className="search-bar">
                    <form>
                        <input  onClick={handleSearchClick} type='text' className='form-group' placeholder='Search Empowerverse' />
                        <MagnifyingGlassIcon className='category-search-icon' />
                    </form>
                </div>
                <CategoryBox />
            </div>
        </div>
        </div>
      </div>
   
        </>
    );
}

export default Search;