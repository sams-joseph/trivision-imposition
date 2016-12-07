class Selection {
    selection(x, y, width, height) {
        selectedRegion = Array(Array(x,y),
                         Array(x+width, y),
                         Array(x+width, y+height),
                         Array(x, y+height));

        return selectedRegion;
    }
}

export default Selection;

/*
NOTE To use: document.selection.select(SELECTION)
*/
