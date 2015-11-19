(function(){
	app = function() {
		
		// Module - Notebook
		var notebook = function(elemAdd, elemList) {
			
			// Object - Note
			var note = function(text, date) {
				var note = function(text, date) {
					this.text = text,
					this.date = date,
					this.elem = ''
				}
				
				note.prototype.add = function() {
					
				}
				
				note.prototype.view = function() {
					// here, we should put new dom's element in property - elem
				}
				
				note.prototype.delete = function() {
					
				}
			
				var newNote = new note(text, date);
				
				return newNote;
			}
				
			// Object notebook
			var notebook = function(elemAdd, elemList) {
				this.elemAdd = $(elemAdd),
				this.elemList = $(elemList),
				this.notes = [],
				this.mount = 0
			}
			
			notebook.prototype.addNote = function(text, date) {
				// create new note-object
				var newNote = new note(text, date);
				// add in notebook
				this.notes[this.count] = newNote;
				// increment mount of notes
				this.mount++;
			}
			
			notebook.prototype.viewLast = function() {
				this.notes[this.count].view();
			}
			
			notebook.prototype.viewAllNote = function() {
				for(var i = 0, length = this.count; i < length; i++) {
					this.notes[i].view();
				}
			}
			
			// Initialize notebook, add binds elem
			function init(notes) {
				
				eventData = {
					notebook : notes
				}
				
				notes.elemAdd.keypress(eventData, function(e) {
					if(e.charCode == "0") {
						var text = $(this).val(),
							date = new Date();
						
						// Create new note
						eventData.notebook.addNote(text, date);
						
						// View new note
						eventData.notebook.viewLast();
						
						// Clear area
						$(this).val("");
					}
					
				});
			}
			
			var notes = new notebook(elemAdd, elemList);
			
			init(notes);
			
			return notes;
		}
				
		app.init = function() {
			var nb = new notebook("#notebook-add", "#notebook-list");
		}
		
		return app.init();
	}
	
	var application = new app(); 
}());