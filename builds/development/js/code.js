(function(){
	app = function() {
		
		
		// Module - TransformTime, for creating string-time for different real-time
		var transformTime = function() {
			
		}
		
		// Module - Notebook
		var notebook = function(elemAdd, elemList, elemCount, elemSubmit) {
			
		
			// Object - Model for work with localstorage
			var model = function() {
				var model = function() {}
					
				// Method for creating new structre of local-storage
				model.prototype.create = function() {
					Lockr.set("countNotes", 0);
					Lockr.set("countElems", 0);
				}
				
				// Method for adding new note in local-storage
				model.prototype.add = function(note) {
					var currentCount = Lockr.get("countElems"),
						currentNote  = Lockr.get("countNotes");
					
					Lockr.set(currentNote, note);
					Lockr.set("countNotes", currentNote + 1);
					Lockr.set("countElems", currentCount + 1);
					
					console.log(this.getAll());
				}
				
				// Method for detele note with id = id from local-storage
				model.prototype.delete = function(id) {
					var currentCount = Lockr.get("countElems"),
						currentNote  = Lockr.get("countNotes");
						
					Lockr.set(id, null);
					
					Lockr.set("countNotes", currentNote - 1);
				}
				
				// Method for getting All notes from local-storage
				model.prototype.getAll = function() {
					var result = [];
					
					for(var i = 0, countElems = Lockr.get("countElems"); i < countElems; i++) {
						var elem = Lockr.get(i);
						result[result.length] = elem;
					}
					
					return result;
				}
				
				// Method for optimize memory of localstorage
				model.prototype.fillEmptyMemmories = function() {
					var currentElem;
					
					for(var i = 0, length = Lockr.get("countElems"); i < length; i++) {
						currentElem = Lockr.get(i);
						
						if(currentElem == null) {
							for(var j = i ; j < length - 1; j++) {
								Lockr.set(j, Lockr.get(j+1));
							} 
						}
					}
					
					Lockr.set("countElems", Lockr.get("countNotes"));
				}
				
				// Method for getting last-note form local-storage
				model.prototype.getLast = function() {
					var lastNote = Lockr.get(Lockr.get("countElems")-1);
					
					return lastNote;
				}
			
				// Function for getting information about amount elements in local-storage, notes and empty-notes(note which was deleted)
				model.prototype.getCount = function() {
					var notes;
				
					if((count = Lockr.get("countElems")) >= 0) {
						return count;
					}
					else {
						return null;
					}
				}
				
				// Function for getting information about note's amount in local-storage
				model.prototype.getCountElements = function() {
					var notes;
				
					if((count = Lockr.get("countNotes")) >= 0) {
						return count;
					}
					else {
						return null;
					}
				}
				
				
				var newModel = new model();
			
				return newModel;
			}
	
			// Object - Note
			var note = function(text, date, noteId) {
				var note = function(text, date, noteId) {
					this.text = text,
					this.date = date,
					this.id = noteId
				}
				
				note.prototype.view = function(nodeAdd) {
					// Here, we should put new dom's element in property - elem
					var template = "<li class='note' data-id='"+ this.id +"'><article class='note-inner'><header class='note-data'><div class='note-data__date'>" + this.date + "</div></header><p>" + this.text + "</p><div class='note-control'><i class='fa fa-trash-o note-delete'></i></div></article></li>";
					
					$(".note-add").after(template);
				}
		
				var newNote = new note(text, date, noteId);
							
				return newNote;
			}
			
			
			// Object notebook
			var notebook = function(elemAdd, elemList, elemCount, elemSubmit) {
				this.elemAdd = $(elemAdd),
				this.countView = $(elemCount),
				this.elemList = $(elemList),
				this.elemSubmit = $(elemSubmit)
				this.model = new model()
			}
			
			notebook.prototype.addNote = function(text, date) {
				var newNoteId = this.model.getCount();
				
				// create new note-object
				var newNote = new note(text, date, newNoteId);
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
				if(text.length >= 5 && text.length <= 200) {
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
					result = "You have " + count + " notes";
				}
				
				console.log(result);
				this.countView.html(result);
			}
			
			notebook.prototype.viewLast = function() {
				var lastNote = this.model.getLast();
				
				var currentNote = new note(lastNote.text, lastNote.date, this.model.getCount());
					
					currentNote.view(this.elemAdd);
			}
			
			notebook.prototype.viewAllNote = function() {
				var notes = this.model.getAll();
						
						
				for(var i = 0, length = notes.length; i < length; i++) {
					if(notes[i] != null) {
						var currentNote = new note(notes[i].text, notes[i].date, i);
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
						
						}
						else {
							alert("Note should has more than 5 symbols!");
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
				
			}
			
			var notes = new notebook(elemAdd, elemList, elemCount, elemSubmit);
			
			init(notes);
			
			return notes;
		}
				
		app.init = function() {
			var nb = new notebook("#notebook-add", "#notebook-list", "#notebook-amount", "#notebook-submit");
		}
		
		transformTime();
		
		return app.init();
	}
	
	var application = new app();
}());