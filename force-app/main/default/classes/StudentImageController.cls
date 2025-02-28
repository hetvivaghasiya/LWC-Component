public with sharing class StudentImageController {
        
    // @AuraEnabled
    // public static String updateStudentImage(Id studentId, Id fileId) {
    //     try {
    //         // Fetch ContentVersion URL
    //         ContentVersion cv = [SELECT Id, ContentDocumentId, Title, FileExtension FROM ContentVersion WHERE ContentDocumentId = :fileId LIMIT 1];
            
    //         // Construct Image URL
    //         String imageUrl = '/sfc/servlet.shepherd/version/download/' + cv.Id;
            
    //         // Update Student__c record
    //         Student__c student = [SELECT Id, Image__c FROM Student__c WHERE Id = :studentId LIMIT 1];
    //         student.Image__c = imageUrl;
    //         update student;

    //         return imageUrl; // Return updated image URL
    //     } catch (Exception e) {
    //         throw new AuraHandledException(e.getMessage());
    //     }
    // }

   
    @AuraEnabled(cacheable=true)
    public static List<ContentDocumentLink> getContentDocumentLinks(String recordId) {
        return [SELECT ContentDocument.LatestPublishedVersionId, ContentDocument.Title 
                FROM ContentDocumentLink 
                WHERE LinkedEntityId = :recordId];
    }
        
}


