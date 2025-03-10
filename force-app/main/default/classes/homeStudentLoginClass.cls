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
                College__r.Name,
                College__r.college_Image__c,
                College__r.Description__c
                FROM Student__c 
                WHERE Name = :trimmedStudentId LIMIT 1];
                System.debug('College Image:'+students[0]);
            
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
    public static List<College_Events__c> getEvents(String course, String college) {
        try {
            System.debug('Fetching subjects for Course: ' + course + ', College: ' + college);

            List<College_Events__c> events = [SELECT Id, Name, Event_Image__c, Events_Description__c,College__r.Name,Event_Starting_Date__c
                FROM College_Events__c 
                WHERE Course__c = :course AND College__c = :college];

            return events;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }


     // Fetch subjects based on course
    //  @AuraEnabled(cacheable=true)
    //  public static List<Subject__c> getSubjectsByCourse(String courseId) {
    //      try {
    //          System.debug('Fetching subjects for Course ID: ' + courseId);
 
    //          if (String.isEmpty(courseId)) {
    //              throw new AuraHandledException('Invalid Course ID.');
    //          }
 
    //          List<Subject__c> subjects = [SELECT Id, Name, Subject_Code__c, Subject_Description__c
    //              FROM Subject__c 
    //              WHERE Course__c = :courseId];
 
    //          System.debug('Subjects found: ' + subjects.size());
 
    //          return subjects;
    //      } catch (Exception e) {
    //          throw new AuraHandledException(e.getMessage());
    //      }
    //  }

}
