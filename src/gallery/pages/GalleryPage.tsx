import { Fab, Button } from '@mui/material';
import AddOutlined from '@mui/icons-material/AddOutlined';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../store/reduxHooks';
import { startNewProject } from '../../store/gallery';

import { GalleryLayout } from '../layout/GalleryLayout';
import { NothingSelectedView, ProjectView } from '../views';

export const GalleryPage = () => {
  const { active, isSaving } = useAppSelector((s) => s.gallery);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onClickNewProject = () => dispatch(startNewProject());

  return (
    <GalleryLayout>
      {active ? <ProjectView /> : <NothingSelectedView />}

      {/* Botón temporal para ir a Riesgos */}
      <Button
        variant="contained"
        sx={{ position: 'fixed', left: 50, bottom: 50, borderRadius: 2 }}
        onClick={() => navigate('/gallery/riesgos')}
      >
        Ir a Riesgos
      </Button>

      <Fab
        disabled={isSaving}
        color="error"
        sx={{ position: 'fixed', right: 50, bottom: 50 }}
        onClick={onClickNewProject}
      >
        <AddOutlined sx={{ fontSize: 30 }} />
      </Fab>
    </GalleryLayout>
  );
};