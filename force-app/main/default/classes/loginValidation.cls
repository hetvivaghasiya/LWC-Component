public without sharing class loginValidation {
   @AuraEnabled
   public static Boolean loginEnrollmentPassword(String studentId,String password){
    try {
        // Query the Student__c object using the Student_ID__c field
        List<Student__c> studentList = [SELECT Id FROM Student__c
         WHERE Name = :studentId 
         AND Password__c = :password LIMIT 1];
        // If a record is found, return true; otherwise, return false
        return !studentList.isEmpty();
    } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
    }
   }
}