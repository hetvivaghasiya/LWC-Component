public without sharing class profileImgAcls {
 
    @AuraEnabled(cacheable=true)
    public static Student__c studentProfileImg(String studentId){
        try {

            System.debug('Received Student ID: ' + studentId);

            // Trim spaces
            String trimmedStudentId = studentId != null ? studentId.trim() : '';
            System.debug('Trimmed Student ID: ' + trimmedStudentId);
    
            
             List<Student__c> students=[SELECT Id, 
             Name__c,
             Name,
             Last_Name__c,  
             Middle_Name__c,
             Phone_Number__c,
             Email__c,
             Gender__c,
             Status__c,
             Course__r.Name,
             College__r.Name,
             Country__c,
             State__c,
             City__c,
             Street__c,
             Pin_Code__c,
             X10th_Pass_Year__c,
             X10th_Percentage__c,
             X12th_Pass_Year__c,
             X12th_Percentage__c,
             Graduation_Year__c,
             Graduation_CGPA__c
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
        public static void updateStudent(String studentId, String name, String email, String imageUrl) {
            Student__c student = [SELECT Id, Name__c, Email__c, Image__c FROM Student__c WHERE Name = :studentId LIMIT 1];
            System.debug('update stuent Id found--=-=---=-=-'+student);
            student.Name__c = name;
            student.Email__c = email;
    
            if (imageUrl != null && imageUrl != '') {
                student.Image__c = imageUrl; 
            }
    
            try {
                update student;
                System.debug('UPDATE STUDENT -=-=-=-==-=--=-=-=-');
            } catch (Exception e) {
                throw new AuraHandledException('Error updating student record: ' + e.getMessage());
            }
        }
    
    
            @AuraEnabled
            public static String uploadFile(String studentId, String documentId) {
                try {
                    Student__c studentRecord = [SELECT Id, Image__c FROM Student__c WHERE Name = :studentId LIMIT 1];
                    System.debug('update stuent File found--=-=---=-=-'+studentRecord);
        
                    // Generate the URL to download the file (i.e., the image URL)
                    ContentDocument doc = [SELECT Id, Title, FileType FROM ContentDocument WHERE Id = :documentId LIMIT 1];
                    // List<ContentDocument> docs = [SELECT Id, Title, FileType FROM ContentDocument WHERE Id = :documentId LIMIT 1];
                    //     if (docs.isEmpty()) {
                    //         throw new AuraHandledException('Document not found for the given ID.');
                    //     }
                    //     ContentDocument doc = docs[0];

        
                      // Get the Salesforce base URL dynamically
                    String baseUrl = URL.getOrgDomainUrl().toExternalForm();
    
                    // Construct the full image URL
                    String fileUrl = baseUrl + '/sfc/servlet.shepherd/document/download/' + doc.Id;
        
                    // Store the image URL in the Rich Text Area field
                    // studentRecord.Image__c = '<img src="' + fileUrl + '" alt="Uploaded Image" />';
                    studentRecord.Image__c = fileUrl;
        
                    // Update the student record
                    update studentRecord;
        
                    return fileUrl; // Return the URL for LWC to display the image
                } catch (Exception e) {
                    throw new AuraHandledException('Error uploading image: ' + e.getMessage());
                }
            }
    
            @AuraEnabled(cacheable=true)
        public static String getImageUrl(String studentId) {
           
                Student__c studentRecord = [SELECT Id, Image__c FROM Student__c WHERE Name = :studentId LIMIT 1];
                System.debug('get image stuent Id found--=-=---=-=-'+studentRecord);

                return studentRecord.Image__c;
                // return studentRecord.Image__c != null ? studentRecord.Image__c : '';

        }
}