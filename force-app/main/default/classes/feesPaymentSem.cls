public without sharing class feesPaymentSem {


        // @AuraEnabled(cacheable=true)
        // public static List<Semester__c> getSemestersForCourse(Id studentId) {
        //     // Query the Student record to get the related Course
        //     Student__c studentRecord = [SELECT Id, Course__c FROM Student__c WHERE Id = :studentId LIMIT 1];
        //     System.debug('StudentId-=-==-==---=-=-==-=-=-'+studentRecord);
    
        //     // Get the Course ID from the Student record
        //     Id courseId = studentRecord.Course__c;
    
        //     // Query the related Semester records for the selected Course
        //     List<Semester__c> semesterList = [SELECT Name, Start_Date__c, End_Date__c 
        //                                       FROM Semester__c 
        //                                       WHERE Course__c = :courseId];
    
        //     return semesterList;
        // }


    @AuraEnabled public Student__c student;
    @AuraEnabled public List<Semester__c> semesters;

    public feesPaymentSem(Student__c student, List<Semester__c> semesters) {
        this.student = student;
        this.semesters = semesters;
    }
        @AuraEnabled(cacheable=true)
        public static feesPaymentSem getStudentProfileWithSemesters(String studentId) {
            System.debug('📢 Received Student ID: ' + studentId);
        
            if (String.isEmpty(studentId)) {
                throw new AuraHandledException('❌ Student ID is required.');
            }
        
            String trimmedStudentId = studentId.trim();
            System.debug('✂️ Trimmed Student ID: ' + trimmedStudentId);
        
            // ✅ Fetch Student Data
            List<Student__c> students = [SELECT Id, 
                Name__c,
                Last_Name__c,  
                Middle_Name__c,
                Phone_Number__c,
                Email__c,
                Gender__c,
                Course__c
            FROM Student__c 
            WHERE Name = :trimmedStudentId LIMIT 1];
        
            if (students.isEmpty()) {
                System.debug('❌ No student found with ID: ' + trimmedStudentId);
                throw new AuraHandledException('No student found with ID: ' + trimmedStudentId);
            }
            Student__c studentRecord = students[0];
        
            // ✅ Fetch Semesters for the Student's Course
            List<Semester__c> semesters = new List<Semester__c>();
            if (studentRecord.Course__c != null) {
                semesters = [SELECT Id, Name, Start_Date__c, End_Date__c 
                             FROM Semester__c 
                             WHERE Course__c = :studentRecord.Course__c];
            }
            
            System.debug('✅ Semesters Found: ' + semesters);
        
            // ✅ Return Student & Semesters in Wrapper Class
            return new feesPaymentSem(studentRecord, semesters);
        }
    }
