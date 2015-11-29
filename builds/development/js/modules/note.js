define(['jquery'], function () { 
	// Object - Note
	var note = function(text, date, timeLive, noteId, isNew) {
		
		var note = function(text, date, timeLive, noteId, isNew) {
			this.text = text,
			this.date = date,
			this.viewTime = timeLive,
			this.id = noteId,
			this.isNewNote = isNew
		}
		
		note.prototype.view = function() {
			// Here, we should put new dom's element in property - elem
			// I know, that isn't good, i think we should create object, save it and use in processing of work
			var template = "<li class='note note-item' data-new='"+ this.isNewNote +"' data-id='"+ this.id +"'><article class='note-inner'><header class='note-data'><div class='note-data__date'>" + this.viewTime + "</div></header><p>" + this.text + "</p><div class='note-control'><i class='fa fa-trash-o note-delete'></i></div></article></li>";
			
			$(".note-add").after(template);
		}


		var newNote = new note(text, date, timeLive, noteId, isNew);
					
		return newNote;
	}

	return note;
});