// Concerto Base Libraries.
// author: Taehoon Moon <panarch@kaist.ac.kr>
//
// NoteTool
//
// Copyright Taehoon Moon 2014

// minor modifications: Tomas Hudziec 2016

editor.NoteTool = {};

    /**
     * @param {Object} staveNote
     * @param {number} divisions
     * @return {number}
     */
    editor.NoteTool.getDurationFromStaveNote = function getDurationFromStaveNote(staveNote, divisions) {
        var noteType = staveNote.getDuration();
        var numDots;
        // TODO: get numDots in some other way,
        // I don't have -concerto-num-dots property in staveNote
        // probably this way: numDots = staveNote.dots;
        // maybe staveNote.dots property was added to vexflow after Concerto was completed
        if (staveNote['-concerto-num-dots'])
            numDots = staveNote['-concerto-num-dots'];
        else
            numDots = 0;

        var index = editor.table.NOTE_VEX_TYPES.indexOf(noteType);
        var offset = index - editor.table.NOTE_VEX_QUARTER_INDEX;
        var duration = Math.pow(2, offset) * divisions;
        duration = duration * 2 - duration * Math.pow(2, -numDots);

        return duration;
    };

    function _calculateNoteType(duration, divisions) {
        var i = 0;
        var count;
        var num;
        for (count = 0; count < 20; count++) {
            num = Math.floor(duration / divisions);
            if (num === 1)
                break;
            else if (num > 1) {
                divisions *= 2;
                i++;
            }
            else {
                divisions /= 2;
                i--;
            }
        }

        if (count === 20)
            console.error('No proper StaveNote type');

        var dots = 0;
        for (count = 0; count < 5; count++) {
            duration -= Math.floor(duration / divisions);
            divisions /= 2;
            num = Math.floor(duration / divisions);
            if (num === 1)
                dots++;
            else
                break;
        }

        return {
            index: i,
            dots: 0     //shouldn't be here 'dots : dots' ?
        };
    }

    /**
     * @param {number} duration
     * @param {number} divisions
     * @param {boolean=} withDots
     */
    editor.NoteTool.getStaveNoteTypeFromDuration = function getStaveNoteTypeFromDuration(duration, divisions, withDots) {
        if (withDots === undefined)
            withDots = false;

        var result = _calculateNoteType(duration, divisions);
        var index = editor.table.NOTE_VEX_QUARTER_INDEX + result.index;
        var noteType = editor.table.NOTE_VEX_TYPES[index];

        if (withDots) {
            for (var i = 0; i < result.dots.length; i++)
                noteType += 'd';
        }

        return noteType;
    };

    editor.NoteTool.getNoteTypeFromDuration = function getNoteTypeFromDuration(duration, divisions) {
        var result = _calculateNoteType(duration, divisions);
        var index = editor.table.NOTE_QUARTER_INDEX + result.index;

        return {
            type: editor.table.NOTE_TYPES[index],
            dot: result.dots
        };
    };