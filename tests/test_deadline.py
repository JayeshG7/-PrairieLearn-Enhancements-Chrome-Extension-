import unittest
import sys
sys.path.append('../')
import api.deadline as Deadline
import api.assignment as Assignment

class deadline_test_case(unittest.TestCase):
    def test_deadline_init(self):
        deadline_result = Deadline.deadline("09/27/2023", Assignment.assignment(5, "Quiz 1"))
        self.assertEqual(deadline_result.due_date, "09/27/2023")
        self.assertTrue(Assignment.assignment.is_equal(deadline_result.assignment, Assignment.assignment(5, "Quiz 1")))
