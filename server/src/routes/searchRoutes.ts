import { Router } from 'express';
import { searchGlobal } from '../controllers/searchController';

const router = Router();

router.get('/', searchGlobal);

export default router;
