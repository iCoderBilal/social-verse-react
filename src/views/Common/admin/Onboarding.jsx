import React from "react";
import MobileTopNavigation from "../../../components/Mobile/TopNavigation";
import MobileSideNavigation from "../../../components/Mobile/SideNavigation";
import OnboardingForm from "./OnboardingForm";

function Onboarding() {
  const [isSideNavOpen, setIsSideNavOpen] = React.useState(false);

  return (
    <>
      <MobileTopNavigation
        isSideNavOpen={isSideNavOpen}
        setIsSideNavOpen={setIsSideNavOpen}
      />
      <div className="container">
        <div 
          style={{ display: `${isSideNavOpen ? "block" : "none"}` }} 
          onClick={() => setIsSideNavOpen(false)} 
          className="overlay"
        />
        <aside className="side-bar">
          <MobileSideNavigation
            isOpen={isSideNavOpen}
            onClose={() => setIsSideNavOpen(false)}
          />
        </aside>
        <main className="main-container">
          <div className="dashboard-container">
            <OnboardingForm />
          </div>
        </main>
      </div>
    </>
  );
}

export default Onboarding; 