import api.assignment_type as at

class assignment:
    def __init__(instance, assignment_type, assignment_title):
        instance.assignment_type = at.assignment_type(assignment_type).name
        instance.assignment_title = assignment_title
        instance = assignment
        
    def is_equal(self, instance):
       if self.assignment_title == instance.assignment_title and self.assignment_type == instance.assignment_type:
           return True
       else:
           return False
