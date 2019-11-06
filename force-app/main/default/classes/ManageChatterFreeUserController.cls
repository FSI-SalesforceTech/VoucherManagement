public with sharing class ManageChatterFreeUserController {
    @AuraEnabled(cacheable=true)
    public static List<Object> getActiveChatterUser(){
        return [SELECT Id, Name, Email, Username, SmallPhotoUrl, LastLoginDate, IsActive FROM User WHERE IsActive = true AND Profile.Name = 'Chatterユーザ' ORDER BY LastLoginDate ASC];
    }
}
