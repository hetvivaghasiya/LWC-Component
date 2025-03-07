


public without sharing class feesPaymentSem {

    @AuraEnabled public Student__c student;
    @AuraEnabled public List<Semester__c> semesters;

    // Constructor to initialize student and semesters
    public feesPaymentSem(Student__c student, List<Semester__c> semesters) {
        this.student = student;
        this.semesters = semesters;
    }

    @AuraEnabled(cacheable=true)
    public static feesPaymentSem getStudentProfileWithSemesters(String studentId) {
        System.debug('Received Student ID: ' + studentId);
        
        if (String.isEmpty(studentId)) {
            throw new AuraHandledException('Student ID is required.');
        }
        
        String trimmedStudentId = studentId.trim();
        System.debug('Trimmed Student ID: ' + trimmedStudentId);
        
        // Fetch Student Data
        List<Student__c> students = [SELECT Id, Name__c, Last_Name__c, Middle_Name__c, 
                                      Phone_Number__c, Email__c, Gender__c, Course__c
                                      FROM Student__c WHERE Name = :trimmedStudentId LIMIT 1];

                            //here Student Id='SN-0007 is auto number datatype'


        if (students.isEmpty()) {
            throw new AuraHandledException('No student found with ID: ' + trimmedStudentId);
        }
        
        Student__c studentRecord = students[0];
    
        // Fetch Semesters for the Student's Course
        List<Semester__c> semesters = new List<Semester__c>();
        if (studentRecord.Course__c != null) {
            semesters = [SELECT Id, Name, Start_date__c, End_Date__c, Semester_Fees__c 
                         FROM Semester__c WHERE Course__c = :studentRecord.Course__c];
        }
        
        // Return Student & Semesters in Wrapper Class
        return new feesPaymentSem(studentRecord, semesters);
    }




            @AuraEnabled
        public static String createRazorpayPaymentLink(String semesterId, String studentId) {
            // Fetch the Student record using studentId
            Student__c studentRecord = [SELECT Id, Email__c FROM Student__c WHERE Id = :studentId LIMIT 1];
            
            if (studentRecord == null) {
                throw new AuraHandledException('No student found with ID: ' + studentId);
            }
            
            // Fetch Semester Fee
            List<Semester__c> semesterRecords = [SELECT Semester_Fees__c FROM Semester__c WHERE Id = :semesterId LIMIT 1];
            
            if (semesterRecords.isEmpty()) {
                throw new AuraHandledException('No semester found with ID: ' + semesterId);
            }
            
            Decimal semesterFee = semesterRecords[0].Semester_Fees__c;
            
            // Check if payment has already been made for this semester
            List<Fee_Payment__c> existingPayments = [SELECT Id FROM Fee_Payment__c 
                                                    WHERE Student__c = :studentId 
                                                    AND Semester__c = :semesterId 
                                                    AND Status__c = 'Fees Paid'];
            
            if (!existingPayments.isEmpty()) {
                throw new AuraHandledException('Payment has already been made for this semester.');
            }
            
            // Razorpay API credentials and endpoint
            String razorpayKey = 'rzp_test_qrlr4GGaErK4jZ';
            String razorpaySecret = 'SZiUAyEq4RKCuomZZpNACcdr';
            String endpoint = 'https://api.razorpay.com/v1/payment_links';
            
            HttpRequest req = new HttpRequest();
            req.setEndpoint(endpoint);
            req.setMethod('POST');
            
            // Authorization Header
            String authHeader = 'Basic ' + EncodingUtil.base64Encode(Blob.valueOf(razorpayKey + ':' + razorpaySecret));
            req.setHeader('Authorization', authHeader);
            req.setHeader('Content-Type', 'application/json');
            
            // Amount in paise (100 paise = 1 INR)
            Integer amountInPaise = (Integer)(semesterFee * 100);
            
            // Request Body
            String body = '{"amount": ' + amountInPaise + ', "currency": "INR", "description": "Semester Payment", "accept_partial": false}';
            req.setBody(body);

            // Sending the request to Razorpay API
            Http http = new Http();
            HttpResponse res = http.send(req);

            if (res.getStatusCode() == 200) {
                // Parse response from Razorpay and get payment link
                Map<String, Object> result = (Map<String, Object>) JSON.deserializeUntyped(res.getBody());
                String paymentLink = (String) result.get('short_url');
                
                // Create the Fee Payment Record
                Fee_Payment__c paymentRecord = new Fee_Payment__c(
                    Student__c = studentId,  // Associate the fee payment with the student
                    Semester__c = semesterId,
                    Fee_Payment_Date__c = System.today(),
                    Amount__c = semesterFee,
                    Status__c = 'Fees Due' // Set default status as 'Unpaid'
                );
                insert paymentRecord;
                

                 // Now that the paymentRecord has been inserted, update its status to 'Fees Paid'
                paymentRecord.Status__c = 'Fees Paid'; // Change status to 'Paid'
                update paymentRecord; // Update the payment record with the new status


                // Optionally, send an email with the payment link
                // sendPaymentLinkEmail(paymentLink, studentRecord.Email__c);
                
                return paymentLink;
            } else {
                throw new AuraHandledException('Failed to create Razorpay payment link: ' + res.getBody());
            }
        
        }

         // This method checks if the student has already paid for this semester
        @AuraEnabled(cacheable=true)
        public static Boolean checkIfPaid(String semesterId, String studentId) {
            // Query Fee_Payment__c to see if there is a paid record
            List<Fee_Payment__c> feePayments = [SELECT Id, Status__c FROM Fee_Payment__c WHERE Semester__c = :semesterId AND Student__c = :studentId AND Status__c = 'Fees Paid' LIMIT 1];
            
            // If there's a record with status 'Fees Paid', the student has already paid
            return !feePayments.isEmpty();
        }







    // Updated method to generate Razorpay Payment Link and store payment details
    // @AuraEnabled
    // public static String createRazorpayPaymentLink(String semesterId, String studentId) {
    //     // Fetch the Student record using studentId
    //     Student__c studentRecord = [SELECT Id, Email__c FROM Student__c WHERE Id = :studentId LIMIT 1];
        
    //     if (studentRecord == null) {
    //         throw new AuraHandledException('No student found with ID: ' + studentId);
    //     }
        
    //     // Fetch Semester Fee
    //     List<Semester__c> semesterRecords = [SELECT Semester_Fees__c FROM Semester__c WHERE Id = :semesterId LIMIT 1];
        
    //     if (semesterRecords.isEmpty()) {
    //         throw new AuraHandledException('No semester found with ID: ' + semesterId);
    //     }
        
    //     Decimal semesterFee = semesterRecords[0].Semester_Fees__c;
        
    //     // Razorpay API credentials and endpoint
    //     String razorpayKey = 'rzp_test_qrlr4GGaErK4jZ';
    //     String razorpaySecret = 'SZiUAyEq4RKCuomZZpNACcdr';
    //     String endpoint = 'https://api.razorpay.com/v1/payment_links';
        
    //     HttpRequest req = new HttpRequest();
    //     req.setEndpoint(endpoint);
    //     req.setMethod('POST');
        
    //     // Authorization Header
    //     String authHeader = 'Basic ' + EncodingUtil.base64Encode(Blob.valueOf(razorpayKey + ':' + razorpaySecret));
    //     req.setHeader('Authorization', authHeader);
    //     req.setHeader('Content-Type', 'application/json');
        
    //     // Amount in paise (100 paise = 1 INR)
    //     Integer amountInPaise = (Integer)(semesterFee * 100);
        
    //     // Request Body
    //     String body = '{"amount": ' + amountInPaise + ', "currency": "INR", "description": "Semester Payment", "accept_partial": false}';
    //     req.setBody(body);

    //     // Sending the request to Razorpay API
    //     Http http = new Http();
    //     HttpResponse res = http.send(req);

    //     if (res.getStatusCode() == 200) {
    //         // Parse response from Razorpay and get payment link
    //         Map<String, Object> result = (Map<String, Object>) JSON.deserializeUntyped(res.getBody());
    //         String paymentLink = (String) result.get('short_url');
            
    //         // Create the Fee Payment Record
    //         Fee_Payment__c paymentRecord = new Fee_Payment__c(
    //             Student__c = studentId,  // Associate the fee payment with the student
    //             Semester__c = semesterId,
    //             Fee_Payment_Date__c = System.today(),
    //             Amount__c = semesterFee,
    //             Status__c = 'Fees Paid' // Set default status as 'Unpaid'
    //         );
    //         insert paymentRecord;
            
    //         // Optionally, send an email with the payment link
    //         sendPaymentLinkEmail(paymentLink, studentRecord.Email__c);
            
    //         return paymentLink;
    //     } else {
    //         throw new AuraHandledException('Failed to create Razorpay payment link: ' + res.getBody());
    //     }
    // }

    // New method to send email with payment link
    @AuraEnabled
    public static void sendPaymentLinkEmail(String paymentLink, String studentEmail) {
        try {
            Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
            email.setToAddresses(new String[] {studentEmail});
            email.setSubject('Complete Your Semester Payment');
            email.setPlainTextBody('Dear Student,\n\nPlease complete your payment for the semester by clicking the following link: ' + paymentLink);
            Messaging.sendEmail(new Messaging.SingleEmailMessage[] { email });
        } catch (Exception e) {
            throw new AuraHandledException('Error sending email: ' + e.getMessage());
        }
    }
}

