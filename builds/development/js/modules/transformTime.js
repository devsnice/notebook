// Module - TransformTime, for creating string-time for different real-time
define(['jquery'], function () { 
	var transformTime = function() {

		var transformTime = function() {
			this.second = 1000,
			this.minute = 60 * this.second,
			this.hour = 60 * this.minute,
			this.day = 24 * this.hour,
			this.week = 7 * this.day,
			this.month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		}
		
		// method for transform time in string
		transformTime.prototype.live = function(time) {
			var timeNow = Date.now(Date.UTC),
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
						timePassDate = new Date(time),
						minutes = timeCreate.getMinutes() > 9 ? timeCreate.getMinutes() : "0" + timeCreate.getMinutes(),
						countWeekDayBetween = Math.abs((timeNowDate.getDay() - timePassDate.getDay())); 
					
					switch(true) {
						
						// If it was today
						case((countWeekDayBetween == 0) && (timePass < this.week) ) :
							result = "Today, at " + timeCreate.getHours() + ":" + minutes;
							break;
						
						// If it was yesterday
						case((countWeekDayBetween == 1) && (timePass < this.week) ) :
							result = "Yesterday, at " + timeCreate.getHours() + ":" + minutes;
							break;
							
						default :
							result = timeCreate.getDate() + " " + this.month[timeCreate.getMonth()] + " at " + timeCreate.getHours() + ":" + minutes;
							break;
					}
					
					break;
				default :
					result = timePass;	
			}
			
			return result;	
		}
		
		transformTime.prototype.isNew = function(time) {
			var timeNow = Date.now();
			
			if((timeNow - time) < this.hour) {
				return true;
			}
			else {
				return false;
			}
		}
		
		var newTransformTime = new transformTime();
		
		return newTransformTime;
	}

	return transformTime;

});