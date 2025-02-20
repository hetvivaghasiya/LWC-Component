public with sharing class inquiryMail {
 
        @AuraEnabled
        public static void saveAccount(String accountName, String emailAddress) {
            try {
                Account newAccount = new Account(Name = accountName);
                insert newAccount;
    
                List<Contact> relatedContacts = [SELECT FirstName, LastName, Phone, Email 
                                                  FROM Contact 
                                                //   WHERE AccountId = :newAccount.Id 
                                                  ORDER BY CreatedDate DESC LIMIT 5];
    
                if (!relatedContacts.isEmpty()) {
                    sendEmail(newAccount, relatedContacts, emailAddress);
                }
            } catch (Exception e) {
                throw new AuraHandledException('Error creating account: ' + e.getMessage());
            }
        }
    
        private static void sendEmail(Account account, List<Contact> contacts, String toAddress) {
    // Ensure this URL structure matches your actual community setup
    String communityBaseUrl = 'https://kriittechnologies44-dev-ed.develop.my.site.com/studentEnrollmentProcess/college-data?';
    String accountLink = communityBaseUrl + 'id=' + String.escapeSingleQuotes(account.Id);

    // Debugging to verify link is generated correctly
    System.debug('Generated Account Link: ' + accountLink);

    String emailBody = 'New Account created: <a href="' + accountLink + '" target="_blank">' + account.Name + '</a><br><br>';
    emailBody += 'Recent 5 Contacts:<br>';
    emailBody += '<table border="1"><tr><th>First Name</th><th>Last Name</th><th>Phone</th><th>Email</th></tr>';

    for (Contact c : contacts) {
        emailBody += '<tr><td>' + c.FirstName + '</td><td>' + c.LastName + '</td><td>' + c.Phone + '</td><td>' + c.Email + '</td></tr>';
    }
    
    emailBody += '</table>';
    
    // Add account link separately if needed
    emailBody += '<br><strong>View Account:</strong> <a href="' + accountLink + '" target="_blank">' + accountLink + '</a>';

    Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
    mail.setToAddresses(new String[] { toAddress });
    mail.setSubject('New Account Created with Recent Contacts');
    mail.setHtmlBody(emailBody);
    Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
}

        

    



            // // Fetch Semester Data Based on Inquiry ID
            // @AuraEnabled(cacheable=true)
            // public static List<Semester__c> getSemesters(String inquiryId) {
            //     return [SELECT Id, Name, Start_Date__c, End_Date__c FROM Semester__c WHERE Course__c = :inquiryId];
            // }
        
            // // Send Email with Semester Table
            // @AuraEnabled
            // public static void sendEmail(String recipientEmail, String inquiryId) {
            //     // Fetch semesters for the given inquiry
            //     List<Semester__c> semesterList = [SELECT Name, Start_Date__c, End_Date__c FROM Semester__c WHERE Course__c = :inquiryId];
        
            //     // Build the email body with semester details
            //     String emailBody = '<h2>Semester Details</h2><table border="1"><tr><th>Semester Name</th><th>Start Date</th><th>End Date</th></tr>';
            //     for (Semester__c sem : semesterList) {
            //         emailBody += '<tr><td>' + sem.Name + '</td><td>' + sem.Start_Date__c + '</td><td>' + sem.End_Date__c + '</td></tr>';
            //     }
            //     emailBody += '</table>';
        
            //     // Send email
            //     Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
            //     mail.setToAddresses(new List<String>{recipientEmail});
            //     mail.setSubject('Semester Details');
            //     mail.setHtmlBody(emailBody);
            //     mail.setSenderDisplayName('Course Inquiry Team');
        
            //     Messaging.sendEmail(new List<Messaging.SingleEmailMessage>{mail});
            // }
    }
        
    
