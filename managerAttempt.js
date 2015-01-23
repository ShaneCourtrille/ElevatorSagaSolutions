{
    init: function(elevators, floors) {
        var DirectionEnum = { NONE : 0, UP : 1, DOWN : 2 };
        
        var Elevator = function (elevator, manager) {
            var self = this;
            
            self.elevator = elevator;
            self.manager = manager;
            self.currentRequest = -1;
            self.currentDirection = DirectionEnum.NONE;
            self.stopFloors = [];
 
            self.elevator.on("stopped_at_floor", function(floorNum) {
                if(floorNum == self.currentRequest)
                {
                    self.currentRequest = -1;
                    self.currentDirection = DirectionEnum.NONE;
                }
            });
            
            self.elevator.on("floor_button_pressed", function(floorNum) {
            });
            
            self.handleRequest = function(floorNum) {
                if(self.canHandleRequest(floorNum))
                {
                    self.stopFloors.push(floorNum);
                    
                    if(self.currentRequest == -1)
                    {
                        self.currentRequest = floorNum;
                        elevator.goToFloor(floorNum);
                    }
                    
                    return true;
                }
                
                return false;
            };
            
            self.canHandleRequest = function(floorNum) {
                if(self.currentDirection == DirectionEnum.NONE)
                {
                    return true;
                }
                
                return false;
            };
            
            self.requestIsUp = function(floorNum) {
                return floorNum < currentFloor;
            };
        };
        
        var Manager = function(elevators) {
            var self = this;
            
            self.elevators = _.map(elevators, function (e) { return new Elevator(e) });
            self.requestedFloors = [];
            
            self.requestElevator = function(floorNum) {
                self.requestedFloors.push(floorNum);
                
                self.getElevator().handleRequest(floorNum);
            };
            
            self.getElevator = function(floorNum)
            {
                return self.elevators[0];
            }
        };
        
        var manager = new Manager(elevators);
        
        _.forEach(floors, function(floor) {
            floor.on("up_button_pressed", function() {
                manager.requestElevator(this.floorNum());
            });

            floor.on("down_button_pressed", function() {
                manager.requestElevator(this.floorNum());
            });
        });
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}