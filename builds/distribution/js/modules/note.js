define(['jquery'], function () { 
	// Object - Note
	var note = function(text, date, timeLive, noteId) {
		
		var note = function(text, date, timeLive, noteId) {
			this.text = text,
			this.date = date,
			this.viewTime = timeLive,
			this.id = noteId
		}
		
		note.prototype.view = function(nodeAdd) {
			
			// Here, we should put new dom's element in property - elem
			var template = "<li class='note' data-id='"+ this.id +"'><article class='note-inner'><header class='note-data'><div class='note-data__date'>" + this.viewTime + "</div></header><p>" + this.text + "</p><div class='note-control'><i class='fa fa-trash-o note-delete'></i></div></article></li>";
			
			$(".note-add").after(template);
		}


		var newNote = new note(text, date, timeLive, noteId);
					
		return newNote;
	}

	return note;
});