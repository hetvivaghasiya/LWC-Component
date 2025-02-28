public without sharing class dateScheduleClass {
    
    @AuraEnabled
    public static String sendEmail(String registrid, String selectedDate) {
        System.debug('Received Registered Student ID: ' + registrid);
        System.debug('Received Selected Date: ' + selectedDate);
        
        if (String.isEmpty(registrid) || String.isEmpty(selectedDate)) {
            System.debug('Error: Missing Registered Student ID or Selected Date');
            throw new AuraHandledException('Registered Student ID or Selected Date is missing.');
        }

        try {
            // Fetch Registered Student record directly using registrid
            Registered_Student__c student = [
                SELECT Id, First_Name__c, Last_Name__c, Email__c, Scheduled_Date__c 
                FROM Registered_Student__c 
                WHERE Id = :registrid 
                LIMIT 1
            ];

            if (student == null) {
                System.debug('Error: No student found for ID: ' + registrid);
                throw new AuraHandledException('No student record found for the provided Registered Student ID.');
            }

            if (student.Email__c == null) {
                System.debug('Error: Student Email is empty');
                throw new AuraHandledException('Student does not have an email.');
            }

            // Update Scheduled Date field
            student.Scheduled_Date__c = Date.valueOf(selectedDate);
            update student;
            System.debug('Scheduled Date updated successfully for student: ' + student.Id);

            // Prepare Email Body
            // Prepare Email Body with HTML Formatting
            String emailBody = '<html><body>';
            emailBody += '<p>Dear <strong>' + student.First_Name__c + '</strong>,</p>';
            emailBody += '<p>We are pleased to inform you that your Exam appointment has been scheduled.</p>';
            emailBody += '<p><strong>📅 Exam Date:</strong> <span style="color: #2E7D32; font-weight: bold;">' + selectedDate + '</span></p>';
            emailBody += '<hr style="border: 1px solid #ccc;">';
            emailBody += '<h3 style="color: #1976D2;">Important Instructions:</h3>';
            emailBody += '<ul>';
            emailBody += '<li>✅ Keep a copy of required documents ready.</li>';
            emailBody += '<li>✅ Dress professionally and choose a quiet place for the Exam.</li>';
            emailBody += '<li>✅ Prepare by reviewing common Exam questions and researching the company.</li>';
            emailBody += '</ul>';
            emailBody += '<p>If you have any questions or need to reschedule, please contact us at <a href="mailto:support@example.com">support@example.com</a>.</p>';
            emailBody += '<h3 style="color: #D32F2F;">🚀 Best Wishes!</h3>';
            emailBody += '<p>We wish you all the best for your Exam. Stay confident, and give it your best shot!</p>';
            emailBody += '<p>Best Regards,<br><strong>HR Team</strong><br>Company Name</p>';
            emailBody += '</body></html>';


            // Create and send email
            Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
            mail.setToAddresses(new String[] { student.Email__c });
            mail.setSubject('Confirmation of Your Scheduled Date');
            mail.setHtmlBody(emailBody);

            Messaging.SendEmailResult[] results = Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
            
            if (results != null && results[0].isSuccess()) {
                System.debug('Email sent successfully to: ' + student.Email__c);
                return student.Id;
            } else {
                System.debug('Email sending failed');
                throw new AuraHandledException('Failed to send email.');
            }

        } catch (QueryException qe) {
            System.debug('QueryException: ' + qe.getMessage());
            throw new AuraHandledException('Error retrieving student record.');
        } catch (Exception e) {
            System.debug('Exception: ' + e.getMessage());
            throw new AuraHandledException('Unexpected error: ' + e.getMessage());
        }
    }
}