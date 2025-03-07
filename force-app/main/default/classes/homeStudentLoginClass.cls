public without sharing class homeStudentLoginClass {

    @AuraEnabled(cacheable=true)
    public static Student__c studentProfileImg(String studentId){
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
                Gender__c,
                Status__c,
                Course__c,
                College__c
                FROM Student__c 
                WHERE Name = :trimmedStudentId LIMIT 1];
            
            if (students.isEmpty()) {
                System.debug('No student found for ID: ' + trimmedStudentId);
                throw new AuraHandledException('No student found with this ID.');
            }

            return students[0];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    // New method to fetch subjects based on Course and College
    @AuraEnabled(cacheable=true)
    public static List<Subject__c> getSubjects(String course, String college) {
        try {
            System.debug('Fetching subjects for Course: ' + course + ', College: ' + college);

            List<Subject__c> subjects = [SELECT Id, Name, Event_Image__c, Description__c,College__r.Name,Event_Starting_Date__c
                FROM Subject__c 
                WHERE Course__c = :course AND College__c = :college];

            return subjects;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
