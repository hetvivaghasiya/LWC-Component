public with sharing class subjectSectionClass {

  
    // Fetch Student Profile (No changes here)
    @AuraEnabled(cacheable=true)
    public static Student__c studentProfile(String studentId) {
        try {
            System.debug('Received Student ID: ' + studentId);
            // Trim spaces
            String trimmedStudentId = studentId != null ? studentId.trim() : '';
            System.debug('Trimmed Student ID: ' + trimmedStudentId);
            
            List<Student__c> students = [SELECT Id, 
                                         Name__c,
                                         Last_Name__c,  
                                         Middle_Name__c,
                                         Phone_Number__c,
                                         Email__c,
                                         Gender__c
                                      FROM Student__c 
                                      WHERE Name = :trimmedStudentId 
                                      LIMIT 1];
    
            if (students.isEmpty()) {
                System.debug('No student found for ID: ' + trimmedStudentId);
                throw new AuraHandledException('No student found with this ID.');
            }
    
            System.debug('Student Found: ' + students[0]);
            return students[0];
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    // Fetch Subjects related to the Course of the Student
    @AuraEnabled(cacheable=true)
    public static List<Subject__c> fetchSubjectsForStudent(String studentId) {
        try {
            System.debug('Received Student ID for Subjects: ' + studentId);
            String trimmedStudentId = studentId != null ? studentId.trim() : '';
            System.debug('Trimmed Student ID for Subjects: ' + trimmedStudentId);
            
            // Query to fetch the student and related course (through Course__c lookup field)
            List<Student__c> students = [SELECT Id, Name__c, Course__c 
                                        FROM Student__c 
                                        WHERE Name = :trimmedStudentId 
                                        LIMIT 1];

            // Check if the student exists and has a related course
            if (students.isEmpty()) {
                System.debug('No student found for ID: ' + trimmedStudentId);
                throw new AuraHandledException('No student found with this ID.');
            }

            // Get the course ID related to the student
            Id courseId = students[0].Course__c;

            // Query the related subjects from Subject__c for the course
            List<Subject__c> subjects = [SELECT Id, Name, Subject_Code__c, Subject_Image__c, Subject_Description__c 
                                         FROM Subject__c
                                         WHERE Course__c = :courseId];

            if (subjects.isEmpty()) {
                System.debug('No subjects found for the course ID: ' + courseId);
                throw new AuraHandledException('No subjects found for this course.');
            }

            System.debug('Subjects Found: ' + subjects);
            return subjects;

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
}