public with sharing class NavAuraController {
    @AuraEnabled(cacheable=true)
    public static Boolean checkLoginStatus() {
        return UserInfo.getUserId() != null;
    }
}
