public without sharing class homeStudentLoginClass {

    @AuraEnabled(cacheable=true)
    public static Student__c studentProfileImg(String studentId){
        try {
            System.debug('Received Student ID: ' + studentId);

            // Trim spaces
            String trimmedStudentId = studentId != null ? studentId.trim() : '';
            System.debug('Trimmed Student ID: ' + trimmedStudentId);
    
            List<Student__c> students = [SELECT Id, 
                Name,
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
                WHERE College__c = :college];
            System.debug('Events-=-=-=-=-=-=-=-='+events);
            return events;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

@AuraEnabled
public static string registerStudentForEvent(String studentId, String eventId) {
    try {
        String trimmedStudentId = studentId != null ? studentId.trim() : '';
        // Fetch the student record based on Name
        List<Student__c> students = [SELECT Id FROM Student__c WHERE Name = :trimmedStudentId LIMIT 1];

        // If no student is found, throw an exception
        if (students.isEmpty()) {
            throw new AuraHandledException('Error: No student found with the provided name.');
        }

        
        String studId = students[0].Id;

        // Check if the student is already registered for the event
        List<Student_Registered_Events__c> existingRegistrations = [
            SELECT Id FROM Student_Registered_Events__c
            WHERE Student__c = :studId AND College_Events__c = :eventId
            LIMIT 1
        ];
        if (!existingRegistrations.isEmpty()) {
            return 'Student is already registered for this event.';
        }
        // Create a new event registration record
        Student_Registered_Events__c newRegistration = new Student_Registered_Events__c(
            Name=studentId,
            Student__c = students[0].Id,  // Assign the retrieved student ID
            College_Events__c = eventId
        );
    
        insert newRegistration;
         // Return success message
         return 'Success: Student registered successfully for the event.';
    } catch (Exception e) {
        return 'Error registering student: ' + e.getMessage();
    }
}


}