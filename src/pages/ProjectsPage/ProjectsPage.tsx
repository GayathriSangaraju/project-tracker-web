import styles from './projects-page.module.css';
import { AddProjectFragment } from '../../components/AddProjectFragment/AddProjectFragment';
import { ProjectsList } from '../../components/ProjectsList/ProjectsList';

export const ProjectsPage = () => {
  return (
    <div className={styles['projects-page']}>
      <h4>Projects Page</h4>
      <AddProjectFragment />
      <ProjectsList />
    </div>
  );
};
