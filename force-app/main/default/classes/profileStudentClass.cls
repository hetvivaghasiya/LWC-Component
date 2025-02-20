public without sharing class profileStudentClass {
    @AuraEnabled(cacheable=true)
    public static Student__c studentProfile(String studentId){
        try {

            System.debug('Received Student ID: ' + studentId);

            // Trim spaces
            String trimmedStudentId = studentId != null ? studentId.trim() : '';
            System.debug('Trimmed Student ID: ' + trimmedStudentId);
    
            
             List<Student__c> students=[SELECT Id, 
             Name__c,
             Last_Name__c,  
             Middle_Name__c,
             Phone_Number__c,
             Email__c,
             Gender__c
            FROM Student__c 
            WHERE Name=:trimmedStudentId LIMIT 1];
            

            // If no student found, log an error
            if (students.isEmpty()) {
                System.debug('No student found for ID: ' + trimmedStudentId);
                throw new AuraHandledException('No student found with this ID.');
            }

            System.debug('Student Found: ' + students[0]);
            return students[0];
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }


    
    @AuraEnabled
    public static String uploadStudentAttachment(String studentId, String fileName, String base64Data) {
        try {
            System.debug('Uploading image for Student ID: ' + studentId);
    
            // Ensure the student exists
            List<Student__c> students = [SELECT Id FROM Student__c WHERE Id = :studentId LIMIT 1];
            if (students.isEmpty()) {
                System.debug('No student found with ID: ' + studentId);
                throw new AuraHandledException('No student found with this ID.');
            }
            Student__c student = students[0];
    
            // Create and insert ContentVersion
            ContentVersion contentVersion = new ContentVersion();
            contentVersion.Title = fileName;
            contentVersion.PathOnClient = fileName;
            contentVersion.VersionData = EncodingUtil.base64Decode(base64Data);
            insert contentVersion;
            
            System.debug('ContentVersion inserted: ' + contentVersion.Id);
    
            // Fetch ContentDocument ID
            List<ContentDocument> contentDocs = [
                SELECT Id FROM ContentDocument WHERE LatestPublishedVersionId = :contentVersion.Id LIMIT 1
            ];
            
            if (contentDocs.isEmpty()) {
                System.debug('No ContentDocument found for Version ID: ' + contentVersion.Id);
                throw new AuraHandledException('File upload failed.');
            }
    
            ContentDocument contentDoc = contentDocs[0];
            System.debug('ContentDocument ID: ' + contentDoc.Id);
    
            // Attach file to Student record via ContentDocumentLink
            ContentDocumentLink contentLink = new ContentDocumentLink();
            contentLink.ContentDocumentId = contentDoc.Id;
            contentLink.LinkedEntityId = student.Id; // Links file to Student
            contentLink.ShareType = 'V'; // 'V' = Viewer, 'I' = Internal
            insert contentLink;
    
            System.debug('ContentDocumentLink inserted for Student ID: ' + student.Id);
            return 'Image uploaded and attached successfully!';
    
        } catch (QueryException qe) {
            System.debug('Query Exception: ' + qe.getMessage());
            return 'No student found with this ID.';
        } catch (Exception e) {
            System.debug('Error uploading file: ' + e.getMessage());
            return 'Error uploading file: ' + e.getMessage();
        }
    }
    
    
    }
    

