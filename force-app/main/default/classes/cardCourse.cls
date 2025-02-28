// public without sharing class cardCourse {
//     @AuraEnabled(cacheable=true)
//     public static List<Course__c> getCourse(String cid){
//        try {
//            return[
//                SELECT Id,Course_Fees__c,Eligibility_Criteria__c,Credits__c,Course_Description__c,Name,Course_Year__c,Course_Code__c 
//                FROM Course__c
//                WHERE College__c=:cid
//            ];
//        } catch (Exception e) {
//            throw new AuraHandledException(e.getMessage());
//        }
//     }


//     @AuraEnabled
//     public static String submitInquiry(
//         String firstName, 
//         String middleName, 
//         String lastName,  
//         String gender, 
//         String dob,   // Change Date to String
//         String emailAddress, 
//         String phno, 
//         String prevEdu, 
//         String stream
//     ) {
//         try {
//             System.debug('--- Incoming Data ---');
//             System.debug('First Name: ' + firstName);
//             System.debug('Last Name: ' + lastName);
//             System.debug('DOB: ' + dob);
            

//             //Mail
//             //User userRecord = [SELECT Id FROM User WHERE Email = :emailAddress LIMIT 1];

//             // Convert DOB String to Date
//             Date parsedDOB;
//             if (dob != null && dob != '') {
//                 parsedDOB = Date.valueOf(dob);
//             }
    
//             Student_Inquiry_Lead__c lead = new Student_Inquiry_Lead__c(
//                 First_Name__c = firstName,
//                 Middle_Name__c = middleName,
//                 Last_Name__c = lastName,
//                 Email__c = emailAddress,
//                 Phone__c = phno,
//                 DOB__c = Date.valueOf(dob),
//                 Gender__c = gender,
//                 Stream__c = stream,
//                 Previous_Education__c = prevEdu
//             );
    
//             insert lead;

//             sendEmailToAdmin(emailAddress, firstName, lastName, phno, prevEdu, stream,emailAddress); 
    
//             System.debug('Inquiry successfully created with ID: ' + lead.Id);
//             return 'Inquiry Submitted Successfully';
//         } catch (Exception e) {
//             System.debug('Error occurred: ' + e.getMessage());
//             return 'Error: ' + e.getMessage();
//         }
//     }
    

//  // Method to send an email to a specific user (e.g., Admin)
//  public static void sendEmailToAdmin(String studentEmail, String firstName, String lastName, String phone, String prevEdu, String stream,String emailAddress) {
//     try {
//         // Define the recipient (Admin/Counselor email)
//         //String adminEmail = 'hetvivaghasiya03@gmail.com'; // Change this to your admin's email

//         Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
//         email.setToAddresses(new String[]{emailAddress}); // Send email to admin
//         email.setCcAddresses(new String[]{studentEmail}); // CC the student (optional)
//         email.setSubject('New Student Inquiry Submission');
        

//         //Link
//         // String communityBaseUrl = 'https://kriittechnologies44-dev-ed.develop.my.site.com/studentEnrollmentProcess/college-data?';
//         // String accountLink = communityBaseUrl + 'id=' + String.escapeSingleQuotes(Id);
//         // System.debug('Generated Account Link: ' + accountLink);

//         // Email Body (Formatted)
//         String body = 'Hello Admissions Team,\n\n' +
//                       'A new student inquiry has been submitted:\n\n' +
//                       '**Name:** ' + firstName + ' ' + lastName + '\n' +
//                       '**Phone:** ' + phone + '\n' +
//                       '**Email:** ' + studentEmail + '\n' +
//                       '**Previous Education:** ' + prevEdu + '\n' +
//                       '**Stream:** ' + stream + '\n\n' +
//                       'Please review the inquiry and take necessary action.\n\n' +
//                       'Best Regards,\nSalesforce Automation';

//                   //  'New Account created: <a href="' + accountLink + '" target="_blank">' + firstName + '</a><br><br>';


//         email.setPlainTextBody(body);
//         Messaging.sendEmail(new Messaging.SingleEmailMessage[]{email});

//         System.debug('Email sent successfully to Admin: ' + emailAddress);
//     } catch (Exception e) {
//         System.debug('Error sending email: ' + e.getMessage());
//     }
// }
    
// }
public without sharing class cardCourse {
    @AuraEnabled(cacheable=true)
    public static List<Course__c> getCourse(String cid) {
        try {
            List<Course__c> course = [
                SELECT Id, Course_Fees__c, Eligibility_Criteria__c, Credits__c, Course_Description__c, Name, Course_Year__c, Course_Code__c 
                FROM Course__c
                WHERE College__c = :cid
            ];
            return course;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Course__c> getCourseList(String cid) {
        try {
            List<Course__c> cl = [
                SELECT Id, Course_Fees__c, Eligibility_Criteria__c, Credits__c, Course_Description__c, Name, Course_Year__c, Course_Code__c 
                FROM Course__c
                WHERE College__c = :cid
            ];
            return cl;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    
    @AuraEnabled(cacheable=true)
    public static List<College__c> getCollegeList(String cid) {
        try {
            List<College__c> clg = [
                SELECT Id, Name 
                FROM College__c
                WHERE Id = :cid
            ];
            return clg;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static String submitInquiry(
        Id courseId, 
        Id collegeId,
        String firstName, 
        String middleName, 
        String lastName,  
        String gender, 
        Date dob,  
        String emailAddress, 
        String phno, 
        String prevEdu, 
        String stream
    ) {
        try {
            // Debug Course ID before using it in the query
            System.debug('Received Course ID: ' + courseId);
            System.debug('Received College ID: ' + collegeId);
    
            // Fetch College Name from Course ID
        // Course__c course = [SELECT Id, Name, College__c, College__r.Name FROM Course__c WHERE Id = :courseId LIMIT 1];
        // String collegeName = course.College__r.Name;

        
            // Create a new Lead for student inquiry
            Student_Inquiry_Lead__c lead = new Student_Inquiry_Lead__c(
                First_Name__c = firstName,
                Middle_Name__c = middleName,
                Last_Name__c = lastName,
                Email__c = emailAddress,
                Phone__c = phno,
                DOB__c = dob,
                Gender__c = gender,
                Stream__c = stream,
                Previous_Education__c = prevEdu,
                Course__c = courseId,
                College__c = collegeId,
                Lead_Status__c='Inquiry'
            );
            insert lead;
    
            // Fetch Semester details for the given Course
            List<Semester__c> semesters = [SELECT Id, Name, Start_Date__c, End_Date__c, Semester_Fees__c, 
                                           Course__r.Name, Course__r.Prerequisites__c, Course__r.College__r.Name,
                                           (SELECT Id, Name FROM Subjects__r) 
                                           FROM Semester__c 
                                           WHERE Course__c = :courseId];
    
            System.debug('Fetched Semester Data: ' + semesters);
    
            // Send email with semester details
            sendEmailToStudent(semesters, firstName, middleName, lastName, phno, dob, gender, prevEdu, stream, emailAddress, courseId, lead.Id);
    
            return 'Inquiry Submitted Successfully';
        } catch (Exception e) {
            System.debug('Error in submitInquiry: ' + e.getMessage());
            return 'Error: ' + e.getMessage();
        }
    }
    
    public static void sendEmailToStudent(
    List<Semester__c> semList, 
    String firstName, 
    String middleName, 
    String lastName, 
    String phone, 
    Date dob, 
    String gender, 
    String prevEdu, 
    String stream, 
    String emailAddress,
    String courseId,
    Id leadId
) {
    try {
        System.debug('Sending email to: ' + emailAddress);
        System.debug('Semester List Size: ' + semList.size());

        Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
        email.setToAddresses(new String[]{emailAddress});
        email.setSaveAsActivity(false);
        email.setSubject('Thank You, ' + firstName + ' ' + lastName + ' for Your Inquiry');

        String body = '<p>Dear ' + firstName + ',</p>';
        body += '<p>Your inquiry details are as follows:</p>';
        body += '<ul>';
        body += '<li><strong>First Name:</strong> ' + firstName + '</li>';
        body += '<li><strong>Last Name:</strong> ' + lastName + '</li>';
        body += '<li><strong>Phone:</strong> ' + phone + '</li>';
        body += '<li><strong>Email:</strong> ' + emailAddress + '</li>';
        body += '<li><strong>Date of Birth:</strong> ' + dob + '</li>';
        body += '<li><strong>Gender:</strong> ' + gender + '</li>';
        body += '<li><strong>Previous Education:</strong> ' + prevEdu + '</li>';
        body += '<li><strong>Stream:</strong> ' + stream + '</li>';
        body += '</ul>';

        body += '<h3>Semester Details:</h3>';

        Decimal totalCourseFees = 0;

        if (!semList.isEmpty()) {
            body += '<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">';
            body += '<tr><th>Semester Name</th><th>Start Date</th><th>End Date</th><th>Fees</th></tr>';

            for (Semester__c sem : semList) {
                body += '<tr>';
                body += '<td>' + sem.Name + '</td>';
                body += '<td>' + sem.Start_Date__c + '</td>';
                body += '<td>' + sem.End_Date__c + '</td>';
                body += '<td>' + sem.Semester_Fees__c + '</td>';
                body += '</tr>';
                totalCourseFees += sem.Semester_Fees__c;
            }

            body += '</table>';
            body += '<p><strong>Total Course Fees:</strong> ' + totalCourseFees + ' Rs.</p>';
        } else {
            body += '<p><em>No semester details available for this course.</em></p>';
        }

        // Inquiry details link
        String leadDetailPageUrl = 'https://kriittechnologies44-dev-ed.develop.my.site.com/studentEnrollmentProcess/additional-detail-page?leadId=' + leadId;
        body += '<p>For more details, you can view your inquiry record here: <a href="' + leadDetailPageUrl + '">View Inquiry</a></p>';
        
        body += '<p>Thank you for your interest!</p>';
        
        email.setHtmlBody(body);

        Messaging.sendEmail(new Messaging.SingleEmailMessage[]{email});

        System.debug('Email sent successfully to: ' + emailAddress);
    } catch (Exception e) {
        System.debug('Error sending email: ' + e.getMessage());
    }
}

}                             


