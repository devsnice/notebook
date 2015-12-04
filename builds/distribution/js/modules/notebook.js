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
		
		// Method for adding new note(text, date) in notelist
		notebook.prototype.addNote = function(text, date) {
			var newNoteId = this.model.getCount();
			
			// date hold as amount msecond with 1970.1.1
			date = date - new Date(0);
			// create new note-object
			var newNote = new note(text, date, this.transformTime.live(date), newNoteId);
			// Add in Model
			this.model.add(newNote);
			// Show new count
			this.viewCount();
			
			return newNote;
		}
		
		// Delete note with id from notelist
		notebook.prototype.deleteNote = function(id) {
			// delete from model
			this.model.delete(id);
			// view new amount of elements
			this.viewCount();
		}
		
		// Validation of note
		notebook.prototype.validate = function(text) {
			if(text.length >= 5 && text.length <= 700) {
				return true;
			}
			else {
				return false;
			}
		}
		
		// Method for viewing amount of notes in notelist
		notebook.prototype.viewCount = function() {
			var count = this.model.getCountElements(),
				result = "";
			
			if(count == 0 || count == null) {
				result = "Don't have notes"
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
		
		// Method for viewing all notes 
		notebook.prototype.viewAllNote = function() {
			var notes = this.model.getAll(),
				noteTemp = new note();
					
					
			for(var i = 0, length = notes.length; i < length; i++) {
				if(notes[i] != null) {
					//var currentNote = new note(notes[i].text, notes[i].date, this.transformTime.live(notes[i].date), i, this.transformTime.isNew(notes[i].date));
					 notes[i].viewTime = this.transformTime.live(notes[i].date);
					 notes[i].isNewNote = this.transformTime.isNew(notes[i].date);
					 
					 noteTemp.view.call(notes[i]);
				}
			}
		}
		
		// Method for auto-update time of notes
		notebook.prototype.updateTime = function() {
			var currentNotes = $(".note-item");
			
			for(var index = 0, length = currentNotes.length; index < length; index++){
				var currentElem = $(currentNotes[index]);
				
				// For optimize this process, we calculate and view just date of new element, which was created less than hour ago
				if(currentElem.data("new") == true) {
					var currentElemId = currentElem.data("id"),
						time = this.model.getById(currentElemId).date,
						newRealTime = this.transformTime.live(time);
						
					$(currentNotes[index]).find(".note-data__date").html(newRealTime);		
				}
			
			}
			
		}
		
		// Controller
		// Initialize notebook, add binds elem
		function init(notes) {
			eventData = {
				notebook : notes
			}
			
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
						var newNote = eventData.notebook.addNote(text, date);
						
						// View new note
						newNote.view();
						
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
						noteDelete.remove();
						
					eventData.notebook.deleteNote(noteDeleteId);
				}
			});
			
			
			// Handler for count amount symbols in user's note
			notes.elemAdd.keyup(eventData, function(e) {
				var text = $(eventData.notebook.elemAdd).val(),
					length = text.length;
				
				eventData.notebook.elemAmount.text(length);
			
			});
			
			// Element for scroll up
			$(document).scroll(function(e){
				if( $(window).scrollTop() > parseInt($("body").css("height"))) {
					$("#js-submit-mobile").fadeIn("slow");	
				}
				else {
					$("#js-submit-mobile").fadeOut("slow");	
				}
			});
			
			
			setInterval(function(){
				notes.updateTime();
			}, 10000);
			
			
		}
		
		
		// create new notebook
		var notes = new notebook(elemAdd, elemList, elemCount, elemSubmit);
		
		// init all bind and firstly work with elements of user's notelist
		init(notes);
		
		return notes;
	}

	return notebook;

});