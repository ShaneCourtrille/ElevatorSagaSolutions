{
    init: function(elevators, floors) {
        var Elevator = function (elevator) {
            var self = this;
                      
            self.elevator = elevator;
            self.requestQueue = [];
            self.servicingRequest = false;
            self.requestedFloor = [];
                        
            self.elevator.on("floor_button_pressed", function(floorNum) {
                self.goToFloor(floorNum);
            });
                             
            self.elevator.on("stopped_at_floor", function(floorNum) {
                console.log("Arrived at " + floorNum);
                self.servicingRequest = false;
                self.requestedFloor = 0;
                _.pull(self.requestQueue, floorNum);
                
                if(self.requestQueue.length > 0)
                {
                    self.goToFloor(self.requestQueue[0]);
                }
            });
            
            self.hasRoom = function()
            {
                return self.elevator.loadFactor < 0.4;
            };
                             
            self.goToFloor = function(floorNum) {
                console.log("Floor Requested " + floorNum);
                if(!self.servicingRequest)
                {
                    self.servicingRequest = true;
                    self.requestedFloor = floorNum;
                    self.elevator.goToFloor(floorNum);
                }
                else
                {
                    self.requestQueue.push(floorNum);
                }
            };
        };

        var Manager = function(elevators) {
            self = this;
            
            self.elevators = _.map(elevators, function (elevator) 
            {
                return new Elevator(elevator);
            });
            
            console.log(self.elevators.length);
            
            self.getNextElevator = function()
            {
                var sorted = _.sortBy(_.filter(self.elevators, 'hasRoom'), function(e) { return e.requestQueue.length });
                
                return sorted[0];
            }
        };
        
        var manager = new Manager(elevators);
        
        _.forEach(floors, function(floor) {
            floor.on("up_button_pressed", function() {
                manager.getNextElevator().goToFloor(this.floorNum());
            });

            floor.on("down_button_pressed", function() {
                manager.getNextElevator().goToFloor(this.floorNum());
            });
        });
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}