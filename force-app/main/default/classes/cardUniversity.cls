public without sharing class cardUniversity {
    @AuraEnabled(cacheable=true)
    public static List<University__c> getUniversity(){
        try {
            return [
                SELECT Id,Name,University_City__c,University_Country__c,Description__c,Pincode__c,Image__c FROM University__c
                ];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}