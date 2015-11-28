// Module - Notebook

define(['jquery', 'model', 'note', 'transformTime'],function(jquery, model, note, transformTime) {

	var notebook = function(elemAdd, elemList, elemCount, elemSubmit) {
	
		// Object notebook
		var notebook = function(elemAdd, elemList, elemCount, elemSubmit) {
			this.elemAdd = $(elemAdd),
			this.countView = $(elemCount),
			this.elemList = $(elemList),
			this.elemSubmit = $(elemSubmit),
			this.elemAmount = $("#note-add__amount"),
			this.transformTime = new transformTime(),
			this.model = new model()
		}
		
		notebook.prototype.addNote = function(text, date) {
			var newNoteId = this.model.getCount();
			
			// date hold as amount msecond with 1970.1.1
			date = date - new Date(0);
			// create new note-object
			var newNote = new note(text, date, this.transformTime.live(date), newNoteId);
			// add in Model
			this.model.add(newNote);
			// 
			this.viewCount();
		}
		
		notebook.prototype.deleteNote = function(id) {
			this.model.delete(id);
			this.viewCount();
		}
		
		notebook.prototype.validate = function(text) {
			if(text.length >= 5 && text.length <= 700) {
				return true;
			}
			else {
				return false;
			}
		}
		
		notebook.prototype.viewCount = function() {
			var count = this.model.getCountElements(),
				result = "";
			
			if(count == 0 || count == null) {
				result = "You haven't got any notes, change it!"
			}
			else {
				if(count == 1) {
					result = "You have " + count + " note";
				}
				else {
					result = "You have " + count + " notes";
				}
			}
			
			this.countView.html(result);
		}
		
		notebook.prototype.viewLast = function() {
			var lastNote = this.model.getLast();
							
			var currentNote = new note(lastNote.text, lastNote.date, this.transformTime.live(lastNote.date), this.model.getCountElements());
				
				currentNote.view(this.elemAdd);
		}
		
		notebook.prototype.viewAllNote = function() {
			var notes = this.model.getAll();
					
					
			for(var i = 0, length = notes.length; i < length; i++) {
				if(notes[i] != null) {
					var currentNote = new note(notes[i].text, notes[i].date, this.transformTime.live(notes[i].date), i);
					currentNote.view(this.elemAdd);
				}
			}
		}
		
		
		
		
		// Controller
		// Initialize notebook, add binds elem
		function init(notes) {
			eventData = {
				notebook : notes
			}
			
			
			//Lockr.flush();
			notes.viewCount();
						
			// Create new element in local-storage
			if(notes.model.getCount() == null)	{
				notes.model.create();
			}
			// Or, if local-storage was created - view all notes
			else {
				// If in previous-session user delete some notes, app should come right all elements and delete 
				if(notes.model.getCount() != notes.model. getCountElements()) {
					notes.model.fillEmptyMemmories();	
				}
				
				// View all notes of user
				notes.viewAllNote();
			}
			
			
				// Handler for adding new note
			notes.elemSubmit.click(eventData, function(e) {
							
					var text = $(eventData.notebook.elemAdd).val(),
						date = new Date();
						
					// Validation
					if(notes.validate(text)) {
									
						// Create new note
						eventData.notebook.addNote(text, date);
						
						// View new note
						eventData.notebook.viewLast();
						
						// Clear textarea
						$(eventData.notebook.elemAdd).val(null);
						
						// Clear count
						$(eventData.notebook.elemAmount).text("0");
					
					}
					else {
						alert("Note should has more than 5 symbols and less than 700!");
					}
				
			});
			
			// Handler for working with user's actions
			notes.elemList.click(eventData, function(event) {
				var elemClicked = event.target;
				
				// Delete note from notebook
				if($(elemClicked).hasClass("note-delete")) {
					var noteDelete = $(elemClicked).parents(".note"),
						noteDeleteId = noteDelete.data("id");
						noteDelete.fadeOut(600);
						
					eventData.notebook.deleteNote(noteDeleteId);
				}
			});
			
			
			// Handler for count amount symbols in user's note
			notes.elemAdd.keydown(eventData, function(e) {
							
					var text = $(eventData.notebook.elemAdd).val(),
						length = text.length;
						
					eventData.notebook.elemAmount.text(length+1);
	
			});
			
		}
		
		var notes = new notebook(elemAdd, elemList, elemCount, elemSubmit);	
		init(notes);
		
		return notes;
	}

	return notebook;

});