
public without sharing class FacultyCardClass {


    //     // Apex method to retrieve all colleges for the student (only one college)
    //     @AuraEnabled(cacheable=true)
    //     public static College__c getStudentCollege(Id studentId) {
    //         try {
    //             // Assuming you have a lookup field 'Student__r' on College, this query will return the associated college
    //             return [SELECT Id, Name FROM College__c WHERE Id = :studentId LIMIT 1];
    //         } catch (Exception e) {
    //             throw new AuraHandledException('Error fetching student\'s college: ' + e.getMessage());
    //         }
    //     }
    
    //     // Apex method to retrieve faculty records for a specific CollegeId
    //     @AuraEnabled(cacheable=true)
    //     public static List<Faculty__c> getFacultyByCollegeId(Id collegeId) {
    //         try {
    //             return [SELECT Id, Name, Position__c, Email__c FROM Faculty__c WHERE College__c = :collegeId];
    //         } catch (Exception e) {
    //             throw new AuraHandledException('Error fetching faculty records: ' + e.getMessage());
    //         }
    //     }
    
    
        
    
    
        // Fetch College ID for a given Student ID (with trimming of the studentId)
        @AuraEnabled(cacheable=true)
        public static Id getCollegeIdByStudentId(String studentId) {
            try {
                // Trim spaces from studentId before using it in the query
                String trimmedStudentId = studentId != null ? studentId.trim() : '';
                System.debug('Trimmed Student ID: ' + trimmedStudentId);
    
                // Query the student's collegeId (Assuming there's a lookup field College__c on Student object)
                List<Student__c> students = [SELECT Id, Name, College__c FROM Student__c WHERE Name = :trimmedStudentId LIMIT 1];
                
                // If no student found with the provided studentId
                if (students.isEmpty()) {
                    throw new AuraHandledException('No student found with the provided student ID.');
                }
    
                // Return the College ID
                return students[0].College__c;
                
            } catch (Exception e) {
                throw new AuraHandledException('Error fetching collegeId: ' + e.getMessage());
            }
        }
    
        // Fetch Faculty for a specific collegeId
        @AuraEnabled(cacheable=true)
        public static List<Faculty__c> fetchFacultyForCollege(Id collegeId) {
            try {
                // Query the Faculty records for the provided collegeId
                List<Faculty__c> facultyList = [SELECT Id, Name, Last_Name__c, Position__c, Email__c 
                                                FROM Faculty__c 
                                                WHERE College__c = :collegeId];
                
                // If no faculty found for the given collegeId
                if (facultyList.isEmpty()) {
                    throw new AuraHandledException('No faculty records found for this college.');
                }
    
                return facultyList;
                
            } catch (Exception e) {
                throw new AuraHandledException('Error fetching faculty records: ' + e.getMessage());
            }
        }
    }
    
        