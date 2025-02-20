public without sharing class UpdateStudentInquiry {

    // Fetch inquiry data based on the provided recordId
    @AuraEnabled(cacheable = true)
    public static Student_Inquiry_Lead__c getInquiryData(Id leadId) {
        try {
            return [SELECT Id, First_Name__c, Middle_Name__c, Last_Name__c, Email__c, Phone__c, Gender__c, 
                           Street__c, City__c, Country__c, State__c, X10th_Pass_Year__c, X10th_Percentage__c, 
                           X12th_Pass_Year__c, X12th_Percentage__c
                    FROM Student_Inquiry_Lead__c
                    WHERE Id = :leadId
                    LIMIT 1];
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching inquiry data: ' + e.getMessage());
        }
    }

    @AuraEnabled
    public static String updateStudentInquiryLead(Id leadId, Map<String, Object> fieldValues) {
        try {
            System.debug('======leadId=====' + leadId);
            System.debug('Field Values: ' + JSON.serializePretty(fieldValues));
            System.debug('Map Size: ' + fieldValues.size());
            System.debug('Map Keys: ' + fieldValues.keySet());

            // Fetch the lead record
            Student_Inquiry_Lead__c lead = [SELECT Id, First_Name__c, Last_Name__c
                                            FROM Student_Inquiry_Lead__c
                                            WHERE Id = :leadId
                                            LIMIT 1];

            if (lead == null) {
                throw new CustomException('The requested Lead does not exist.');
            }

            // Update the lead record with new field values
            for (String field : fieldValues.keySet()) {
                lead.put(field, fieldValues.get(field));
            }
            update lead;
            System.debug('Lead after update: ' + lead);

                // Check if related Registration_Student__c exists
            List<Registered_Student__c> existingStudents = [
                SELECT Id FROM Registered_Student__c
                WHERE Student_Inquiry_Lead__c = :leadId
                LIMIT 1
            ];

            System.debug('==========existingStudents==========='+existingStudents);

            Id registrationStudentId;
            if (existingStudents.isEmpty()) {
                // Create a new Registration Student
                Registered_Student__c student = new Registered_Student__c();
                student.First_Name__c = lead.First_Name__c;
                student.Last_Name__c = lead.Last_Name__c;
                student.Email__c = lead.Email__c;
                student.Student_Inquiry_Lead__c = lead.Id;

                insert student;
                registrationStudentId = student.Id;
            System.debug('==========registrationStudentId==========='+registrationStudentId);

            } else {
                registrationStudentId = existingStudents[0].Id;
            }
           System.debug('Student Inquiry Lead and Registration Student updated successfully!');
            return registrationStudentId;
        } catch (QueryException e) {
            return 'Error: Lead not found.';
        } catch (CustomException e) {
            return 'Error: ' + e.getMessage();
        } catch (Exception e) {
            return 'Error: ' + e.getMessage();
        }
    }

    

    // Custom Exception to handle specific cases
    public class CustomException extends Exception {
    }




    //regitration student
    

    // //Send Mail
    // // Apex method to send emails based on the most recent record
    // @AuraEnabled
    // public static String sendEmail(){
    //     try{
    //         Student_Inquiry_Lead__c recentRecord = [SELECT Id, Name, CreatedDate
    //                                                 FROM Student_Inquiry_Lead__c
    //                                                 ORDER BY CreatedDate DESC
    //                                                 LIMIT 1];


    //         if (recentRecord != null){
    //             // Get today's date
    //             DateTime today = recentRecord.CreatedDate;
    //             DateTime date1 = today.addDays(1);
    //             DateTime date2 = today.addDays(2);
    //             DateTime date3 = today.addDays(3);

    //             // Format the dates
    //             String formattedToday = today.format('dd-MM-yyyy HH:mm');
    //             String formattedDate1 = date1.format('dd-MM-yyyy');
    //             String formattedDate2 = date2.format('dd-MM-yyyy');
    //             String formattedDate3 = date3.format('dd-MM-yyyy');

    //             // Prepare the HTML email body with styled date slots
    //             String emailBody = '<html><body>';
    //             emailBody += '<h2 style="color:#2E86C1;">Student Inquiry Lead Details</h2>';

    //             // **Display Date Slots Outside Table with Specific Margin**
    //             emailBody += '<div style="margin-bottom: 15px;">';
    //             emailBody += '<p style="font-weight:bold;">Select a Date Slot:</p>';
    //             emailBody += '<div style="display: flex;">';  // Flexbox for alignment

    //             // First button
    //             emailBody += '<span style="background-color: #007bff; color: white; padding: 10px 15px; border-radius: 5px; display: inline-block; text-align: center; min-width: 100px; margin-right: 10px;">' + 
    //                      formattedDate1 + '</span>';

    //             // Second button (Extra margin on right side)
    //             emailBody += '<span style="background-color: #007bff; color: white; padding: 10px 15px; border-radius: 5px; display: inline-block; text-align: center; min-width: 100px; margin-right: 20px;">' + 
    //                      formattedDate2 + '</span>';

    //             // Third button
    //             emailBody += '<span style="background-color: #007bff; color: white; padding: 10px 15px; border-radius: 5px; display: inline-block; text-align: center; min-width: 100px;">' + 
    //                      formattedDate3 + '</span>';

    //             emailBody += '</div></div>';

    //             // **Student Inquiry Details Table**
    //             emailBody += '<table style="border-collapse: collapse; width: 100%;">';
    //             emailBody += '<tr><td style="font-weight:bold; padding:8px; border: 1px solid #ddd;">Name:</td>' + 
    //                      '<td style="padding:8px; border: 1px solid #ddd;">' + recentRecord.Name + '</td></tr>';
    //             emailBody += '<tr><td style="font-weight:bold; padding:8px; border: 1px solid #ddd;">Created Date:</td>' + 
    //                      '<td style="padding:8px; border: 1px solid #ddd;">' + formattedToday + '</td></tr>';
    //             emailBody += '</table>';

    //             emailBody += '<br><p style="color:#555;">This is an automated notification. Please follow up accordingly.</p>';
    //             emailBody += '</body></html>';

    //             // Prepare the email
    //             Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
    //             //email.setToAddresses(new String[] {'hetvivaghasiya03@gmail.com'});
    //             //below 2 lines code is exceed email limit and send email to users instead of these "email.setToAddresses(new String[] {'hetvivaghasiya03@gmail.com'});"
    //             email.setTargetObjectId(UserInfo.getUserId());
    //             email.setSaveAsActivity(false);
    //             // Replace with actual recipient
    //             email.setSubject('Student Inquiry Lead Follow-up Details');
    //             email.setHtmlBody(emailBody); // Use HTML instead of plain text
                
    //             // Send the email
    //             Messaging.sendEmail(new Messaging.SingleEmailMessage[]{ email });
    //             System.debug('Mail sent successfully!!!');
    //         }
    //         return 'Mail send succesfully';
    //     }catch (Exception e) {
    //         System.debug('Error in submitInquiry: ' + e.getMessage());
    //         return 'Error: ' + e.getMessage();
    //     }
    // }


    // public static void sendEmailNotification(Student_Inquiry_Lead__c lead) {
    //     try {

    //         OrgWideEmailAddress owea = [SELECT Id, Address, DisplayName FROM OrgWideEmailAddress where Address = 'hetvivaghasiya03@gmail.com'];


    //         List<Messaging.SingleEmailMessage> allMails = new List<Messaging.SingleEmailMessage>();

    //         for(Student_Inquiry_Lead__c ld : [SELECT Id, Email__c FROM Student_Inquiry_Lead__c WHERE Id = :lead.Id]) {
    //             Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
    //             // mail.setTargetObjectId(ld.Id);
    //             //mail.setOrgWideEmailAddressId(owa.id);
    //             System.debug('65 email==>'+ld.Email__c);
    //             mail.setToAddresses(new String[] { ld.Email__c });

    //             if ( owea != null) {
    //                 mail.setOrgWideEmailAddressId(owea.Id);
    //                 }


    //             mail.setSubject('Student Inquiry Lead Updated');
    //             mail.setPlainTextBody('Dear ' + lead.First_Name__c + ' ' + lead.Last_Name__c + ',\n\n' +
    //                                 'Your inquiry details have been successfully updated. If you have any questions, feel free to reach out.\n\n' +
    //                                 'Best regards,\nYour Company Name');
    //             allMails.add(mail);
               
    //         }
    //         system.debug('=====allMails===='+allMails);
    //         // Messaging.sendEmail(allMails);

    //         Messaging.SendEmailResult[] results = Messaging.sendEmail(allMails);

    //         for (Messaging.SendEmailResult res : results) {
    //             if (res.isSuccess()) {
    //                 System.debug('Email sent successfully');
    //             }
    //             else {
    //                 System.debug('The following errors occurred: ' + res.getErrors());                 
    //             }
    //         }
    //         System.debug('Email sent successfully to ' + lead.Email__c);
    //     } catch (Exception e) {
    //         System.debug('Error sending email: ' + e.getMessage());
    //     }
    // }

}