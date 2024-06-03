import time
import numpy as np

class Plan(object):
    def __init__(self):
        self.scoreMap = {} #dictionary where we'll map point values to rides based on user input
        # Default to 1, funny outcomes
        # Perhaps give user 5 qualitatitive options (0: Can't/Wouldn't ride, 1: Last Resort, 2: Meh, why not, 3: Hope to ride, 4: Must-Ride Variable: Need the Credit
        # Allow them to assign point value to new credits
        # Allow custom point values on each ride
        # Specifiy if second rides are worth full, half, or no points
        # Option to just go for maximizing credits (this would be fun)
        self.time_allotted = 600
        self.lunch = False # who needs lunch?
        self.walk_speed = 2
        self.distanceGraph = {}
        # Graph storing walking distance between each attraction
        # Manually collect this data? I'm down lol
        self.wait_data = {}
        # This will be a challange
        # Store predicted queue length or just most comparable data?
        # It's tough, obviously past data will make this easier so let's lean there
        # Maybe average between last week, and expected?
        # We'll want to allow for some customization here
    
    def plan(self):
        ride_list = {}
        # List of rides populated as we ride them
        # dictionary with ride count for each ride
        return ride_list

    def display(self):
        # Display the plan created by the trip planner
        # Embed YouTube POVs for featured attractions?
        # Draw on map with red line and nodes
        # Display point total, ride breakdown, and credits
        ride_list = self.plan()
        return ride_list
        
# Create the plan and draw it
plan = Plan()
plan.display()