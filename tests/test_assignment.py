import unittest
import sys
sys.path.append('../')
import api.assignment as Assignment

class assignment_test_case(unittest.TestCase):
    def test_assignment_init(self):
        assignment_result = Assignment.assignment(2, "Homework 1")
        self.assertEqual(assignment_result.assignment_type, "HOMEWORK")
        self.assertEqual(assignment_result.assignment_title, "Homework 1")

    def test_is_equal(self):
        first_assignment = Assignment.assignment(4, "CS 222 Project")
        second_assignment = Assignment.assignment(4, "CS 222 Project")
        self.assertTrue(Assignment.assignment.is_equal(first_assignment, second_assignment))