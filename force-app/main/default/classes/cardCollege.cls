public without sharing class cardCollege {
    @AuraEnabled(cacheable=true)
    public static List<College__c> getCollege(String uid){
        try {
            return [
                SELECT Id,UniversityId__c,Name,City__c,Country__c,Description__c,college_Image__c
                FROM College__c 
                WHERE UniversityId__c=:uid
                ];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}