(function(root, factory) {

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = factory(root, exports);
    }
  } else if (typeof define === 'function' && define.amd) {
    define(['exports'], function(exports) {
      root.Lockr = factory(root, exports);
    });
  } else {
    root.Lockr = factory(root, {});
  }

}(this, function(root, Lockr) {
  'use strict';

  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(elt /*, from*/)
    {
      var len = this.length >>> 0;

      var from = Number(arguments[1]) || 0;
      from = (from < 0)
      ? Math.ceil(from)
      : Math.floor(from);
      if (from < 0)
        from += len;

      for (; from < len; from++)
      {
        if (from in this &&
            this[from] === elt)
          return from;
      }
      return -1;
    };
  }

  Lockr.prefix = "";

  Lockr._getPrefixedKey = function(key, options) {
    options = options || {};

    if (options.noPrefix) {
      return key;
    } else {
      return this.prefix + key;
    }

  };

  Lockr.set = function (key, value, options) {
    var query_key = this._getPrefixedKey(key, options);

    try {
      localStorage.setItem(query_key, JSON.stringify({"data": value}));
    } catch (e) {
      if (console) console.warn("Lockr didn't successfully save the '{"+ key +": "+ value +"}' pair, because the localStorage is full.");
    }
  };

  Lockr.get = function (key, missing, options) {
    var query_key = this._getPrefixedKey(key, options),
        value;

    try {
      value = JSON.parse(localStorage.getItem(query_key));
    } catch (e) {
      if( localStorage[query_key] ){
        value = JSON.parse('{"data":"' + localStorage.getItem(query_key) + '"}')
      }else{
        value = null;
      }
    }
    if(value === null) {
      return missing;
    } else if (typeof value.data !== 'undefined') {
      return value.data;
    } else {
      return missing;
    }
  };

  Lockr.sadd = function(key, value, options) {
    var query_key = this._getPrefixedKey(key, options),
        json;

    var values = Lockr.smembers(key);

    if (values.indexOf(value) > -1) {
      return null;
    }

    try {
      values.push(value);
      json = JSON.stringify({"data": values});
      localStorage.setItem(query_key, json);
    } catch (e) {
      console.log(e);
      if (console) console.warn("Lockr didn't successfully add the "+ value +" to "+ key +" set, because the localStorage is full.");
    }
  };

  Lockr.smembers = function(key, options) {
    var query_key = this._getPrefixedKey(key, options),
        value;

    try {
      value = JSON.parse(localStorage.getItem(query_key));
    } catch (e) {
      value = null;
    }

    if (value === null)
      return [];
    else
      return (value.data || []);
  };

  Lockr.sismember = function(key, value, options) {
    var query_key = this._getPrefixedKey(key, options);

    return Lockr.smembers(key).indexOf(value) > -1;
  };

  Lockr.getAll = function () {
    var keys = Object.keys(localStorage);

    return keys.map(function (key) {
      return Lockr.get(key);
    });
  };

  Lockr.srem = function(key, value, options) {
    var query_key = this._getPrefixedKey(key, options),
        json,
        index;

    var values = Lockr.smembers(key, value);

    index = values.indexOf(value);

    if (index > -1)
      values.splice(index, 1);

    json = JSON.stringify({"data": values});

    try {
      localStorage.setItem(query_key, json);
    } catch (e) {
      if (console) console.warn("Lockr couldn't remove the "+ value +" from the set "+ key);
    }
  };

  Lockr.rm =  function (key) {
    localStorage.removeItem(key);
  };

  Lockr.flush = function () {
    localStorage.clear();
  };
  return Lockr;

}));
(function(){
	app = function() {
		
		
		// Module - Notebook
		var notebook = function(elemAdd, elemList, elemCount, elemSubmit) {
			
		
			// Module - TransformTime, for creating string-time for different real-time
			var transformTime = function() {
				
				var transformTime = function() {
					this.second = 1000,
					this.minute = 60 * this.second,
					this.hour = 60 * this.minute,
					this.day = 24 * this.hour,
					this.week = 7 * this.day,
					this.month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
				}
				
				transformTime.prototype.live = function(time) {
					var timeNow = Date.now(),
						timeCreate = new Date(time),
						timePass = timeNow - time,
						result = '';
					
					switch(true) {
						// If passed less than minute
						case (timePass <= this.minute) :
							result = "A moment ago";
							break;
						// If passed less than hour
						case (timePass >= this.minute && timePass < this.hour) :
							result = parseInt(timePass / this.minute) + " minutes ago";
							break;
						// If passed more than hour
						case(timePass >= this.hour) :
							var timeNowDate = new Date(timeNow),
								timePassDate = new Date(timePass);
							
							if(((timeNowDate.getDay() - timePassDate.getDay()) != 1) && (timePass <= this.week) ) {
								result = timeCreate.getDate() + " " + this.month[timeCreate.getMonth()] + " at " + timeCreate.getHours() + ":" + timeCreate.getMinutes();
							}
							// If it was yesterday
							else {
								result = "Yesterday, at " + timeCreate.getHours() + ":" + timeCreate.getMinutes();
							}
							break;
						default :
							result = timePass;	
					}
					
					return result;	
				}
				
				
				var newTransformTime = new transformTime();
				
				return newTransformTime;
				
			}
			
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
				model.prototype.getLast = function() {
					// -1, cause (id = 0,1,2)
					var lastNote = Lockr.get(this.getCountElements()-1);
					
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
						result = "You have " + count + " note	s";
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
				
		app.init = function() {
			var nb = new notebook("#notebook-add", "#notebook-list", "#notebook-amount", "#notebook-submit");
		}
				
		return app.init();
	}

	
	var application = new app();
}());