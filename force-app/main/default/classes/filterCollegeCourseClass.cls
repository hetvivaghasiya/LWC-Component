public without sharing class filterCollegeCourseClass {
    @AuraEnabled(cacheable=true)
    public static List<Map<String, Object>> getColleges(String nameFilter, String cityFilter, String sortBy, String sortOrder) {
        List<Map<String, Object>> result = new List<Map<String, Object>>();
        
        // Start the query
        String query = 'SELECT Id, Name, Course_Fees__c, College__r.Name FROM Course__c';

        // Apply filters if provided
        if (String.isNotBlank(nameFilter)) {
            query += ' WHERE Name LIKE \'%' + nameFilter + '%\'';
        }

        // Apply sorting
        if (String.isNotBlank(sortBy)) {
            query += ' ORDER BY ' + sortBy;
            if (sortOrder != null) {
                query += ' ' + sortOrder;
            }
        }

        // Execute the query
        List<Course__c> courses = Database.query(query);

        // Process results to flatten related data
        for (Course__c course : courses) {
            Map<String, Object> courseMap = new Map<String, Object>();
            courseMap.put('Id', course.Id);
            courseMap.put('Name', course.Name);
            courseMap.put('Course_Fees__c', course.Course_Fees__c);
            courseMap.put('CollegeName', course.College__r != null ? course.College__r.Name : 'N/A');
            result.add(courseMap);
        }
        
        return result;
    }
}
