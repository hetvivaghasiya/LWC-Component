public without sharing class uploadDoc {
        @AuraEnabled
        public static String uploadFileToNotesAndAttachments(Id recordId, String fileName, String base64Data, String contentType) {
            try {
                Attachment attach = new Attachment();
                attach.ParentId = recordId; // Attach to the student record
                attach.Name = fileName;
                attach.Body = EncodingUtil.base64Decode(base64Data);
                attach.ContentType = contentType;
                insert attach;
                return 'Uploaded';
            } catch (Exception e) {
                throw new AuraHandledException('Error uploading file: ' + e.getMessage());
            }
        } 
}