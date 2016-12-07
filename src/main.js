import config from '../config'
import SaveFile from './SaveFile';
import Selection from './Selection';
import Color from './Color';
import Logging from './Logging';
import OpenFile from './OpenFile';

let openFiles = new OpenFile(),
    jobNumber = '123456P01',
    bladeWidth = 95,
    numBlades = 95,
    fileDims = openFiles.open(
        `G33STORE-1/WIP/${jobNumber}/prep_art/${jobNumber}.tif`
    ),
    height = fileDims[0],
    width = fileDims[1],
    res = fileDims[2],
    gapWidth = ((((bladeWidth / 10) * res) * numBlades) - width) / (numBlades - 1),
    log = new Logging(jobNumber, config.name, config.adobeVersion, config.mac.name, config.mac.version, '');

log.logger();
