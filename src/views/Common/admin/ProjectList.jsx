import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTh, FaList } from 'react-icons/fa'; // Import icons
import MobileTopNavigation from '../../../components/Mobile/TopNavigation';
import MobileSideNavigation from '../../../components/Mobile/SideNavigation';
import './project.scss'; // Import the CSS styles

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [view, setView] = useState('grid'); // Default view is grid
  const [loading, setLoading] = useState(true);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/projects/user/get');
      if (response.data.status === 'success') {
        setProjects(response.data.projects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const toggleView = (viewType) => {
    setView(viewType);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <MobileTopNavigation
        isSideNavOpen={isSideNavOpen}
        setIsSideNavOpen={setIsSideNavOpen}
      />
      <div className="container">
        <div style={{ display: `${isSideNavOpen ? 'block' : 'none'}` }} onClick={() => setIsSideNavOpen(false)} className="overlay"></div>
        <aside className="side-bar">
          <MobileSideNavigation
            isOpen={isSideNavOpen}
            onClose={() => setIsSideNavOpen(false)}
          />
        </aside>
        <main className="main-container">
          <div className="project-list-container">
            <div className="view-toggle">
              {view === 'grid' ? (
                <span onClick={() => toggleView('list')} className="icon">
                  <FaList />
                </span>
              ) : (
                <span onClick={() => toggleView('grid')} className="icon">
                  <FaTh />
                </span>
              )}
            </div>
            <div className={`projects ${view}`}>
              {projects.map(project => (
                <div key={project.id} className="project-card">
                  <img 
                    src={project.logo_url} 
                    alt={project.name} 
                    className="project-logo" 
                  />
                  <h3 className="project-name">{project.name}</h3>
                  {view === 'list' && (
                    <p className="project-description">{project.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ProjectList; 