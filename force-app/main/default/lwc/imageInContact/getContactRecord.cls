//imageInContact component
public with sharing class getContactRecord {
   @AuraEnabled (cacheable=true)
   public static List<Contact> getRecords(){
    try {
        return [
            SELECT Id,FirstName,LastName,PhotoUrl__c, Description,Title FROM Contact
            ];
    } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
    }
   }
}
