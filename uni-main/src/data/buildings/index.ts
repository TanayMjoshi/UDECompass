import { Building } from '../../types/Building';
import { library } from './library';
import { studentCenter } from './studentCenter';
import { cafeteria } from './cafeteria';
import { visaServices } from './visaServices';
import { administration } from './administration';
import { udePortals } from './udePortals';

export const buildings: Building[] = [
  library,
  studentCenter,
  cafeteria,
  visaServices,
  administration,
  udePortals
];