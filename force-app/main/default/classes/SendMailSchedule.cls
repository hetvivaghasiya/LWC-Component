public with sharing class SendMailSchedule {

    // Apex method to send emails based on the most recent record and future date
    @AuraEnabled
    public static void sendEmail() {
        // Query the most recent record
        Student_Inquiry_Lead__c recentRecord = [SELECT Id, Name, CreatedDate 
                                                FROM Student_Inquiry_Lead__c 
                                                ORDER BY CreatedDate DESC 
                                                LIMIT 1];

        // Calculate the future DateTime (2 or 5 days after the record creation)
        DateTime futureDateTwoDays = recentRecord.CreatedDate.addDays(2);  // 2 days from CreatedDate
        DateTime futureDateFiveDays = recentRecord.CreatedDate.addDays(5);  // 5 days from CreatedDate
        
        // You can decide which future date you want to use (2 or 5 days) - here, we use 2 days
        DateTime futureDate = futureDateTwoDays;

        // If you want the email to be sent after exactly 2 or 5 days, you would typically schedule an Apex job
        // to run at that time. However, to simulate this process, we'll just check the future time and send an email.

        // Prepare the email body
        String emailBody = 'Student Inquiry Lead Details:\n\n';
        emailBody += 'Name: ' + recentRecord.Name + '\n';
        emailBody += 'Created Date: ' + recentRecord.CreatedDate.format('dd/MM/yyyy HH:mm') + '\n';
        emailBody += 'Future Date (Email Scheduled): ' + futureDate.format('dd/MM/yyyy HH:mm') + '\n';

        // Prepare the email
        Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
        email.setToAddresses(new String[] {'hetvivaghasiya03@gmail.com'}); // Replace with actual recipient
        email.setSubject('Student Inquiry Lead Details - Future Email');

        // Set email body
        email.setPlainTextBody(emailBody);

        // If future date has passed, send the email
        if (System.now() >= futureDate) {
            Messaging.sendEmail(new Messaging.SingleEmailMessage[] {email});
        } else {
            // Optionally, log or track that the email will be sent at the future date
            System.debug('Email will be sent at: ' + futureDate);
        }
    }
}
