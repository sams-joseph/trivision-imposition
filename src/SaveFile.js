class SaveFiles {
    constructor(saveFile) {
        this.saveFile = saveFile;
    }

    saveTIF() {
        saveTiff = new TiffSaveOptions();
        saveTiff.alphaChannels = true;
        saveTiff.annotations = true;
        saveTiff.byteOrder = ByteOrder.MACOS;
        saveTiff.embedColorProfile = true;
        saveTiff.imageCompression = TIFFEncoding.TIFFLZW;
        saveTiff.layerCompression = LayerCompression.ZIP;
        saveTiff.layers = false;
        saveTiff.saveImagePyramid = false;
        saveTiff.spotColors = false;
        saveTiff.transparency = false;
        app.activeDocument.saveAs(this.saveFile, saveTiff, true, Extension.LOWERCASE);
    }

    savePDF() {
        pdfSaveOpts = new PDFSaveOptions();
	    pdfSaveOpts.pDFPreset = 'MMT PDFx4';
        app.activeDocument.saveAs(this.saveFile, pdfSaveOpts);
    }
}

export default SaveFiles;
