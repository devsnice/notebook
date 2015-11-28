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

	return transformTime;

});