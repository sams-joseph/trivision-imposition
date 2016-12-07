class OpenFile {
    open(file) {
        let workingFileLocation = File(file);

        app.preferences.rulerUnits = Units.PIXELS;
        app.displayDialogs = DialogModes.NO;
        open(workingFileLocation);

        let res = app.activeDocument.resolution,
            height = parseInt(app.activeDocument.height),
            width = parseInt(app.activeDocument.width);

        return [height, width, res];
    }
}

export default OpenFile;
