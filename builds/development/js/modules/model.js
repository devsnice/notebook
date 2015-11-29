define(['jquery', 'lockr'], function () { 
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
		model.prototype.getById = function(id) {
			var needNote = Lockr.get(id);
			
			return needNote;
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

	return model;
});
