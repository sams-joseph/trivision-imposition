import config from '../config'
import SaveFile from './SaveFile';
import Selection from './Selection';
import Color from './Color';
import Logging from './Logging';
import OpenFile from './OpenFile';

let openFiles = new OpenFile(),
    jobNumber = '123456P01',
    bladeWidth = 95,
    numBlades = 138,
    fileDims = openFiles.open(
        `G33STORE-1/WIP/${jobNumber}/prep_art/${jobNumber}.tif`
    ),
    height = fileDims[0],
    width = fileDims[1],
    res = fileDims[2],
    bladeWidthMM = ((bladeWidth / 25.4) * res),
    gapWidth = (width - ((bladeWidthMM / 10) * numBlades)) / (numBlades - 1),
    log = new Logging(
        jobNumber,
        config.name,
        config.adobeVersion,
        config.mac.name,
        config.mac.version
    ),
    magenta = new Color().solidColor(0, 100, 0, 0);


function cutBlades(width, height, gap, num) {
    for(let i = 0; i < num; i++) {
        let xPositionOffset;
        if(i == 0) {
            xPositionOffset = 0;
        }else {
            xPositionOffset = gap;
        }
        let selectedRegion = new Selection().selection(
            i * ((width / 10) + xPositionOffset),
            0,
            width / 10,
            height
        );
        app.activeDocument.selection.select(selectedRegion);
        app.activeDocument.selection.fill(magenta);
    }
}

cutBlades(bladeWidthMM, height, gapWidth, numBlades);
// TODO Receive input from user.
