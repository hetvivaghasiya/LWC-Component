public with sharing class collegeCourseInside {
    @AuraEnabled(cacheable=true)
    public static Course__c getCollegeInside(Id courseId) {
        try {
            return [SELECT College__c, Name, College__r.Name FROM Course__c WHERE College__c = :courseId LIMIT 1];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
