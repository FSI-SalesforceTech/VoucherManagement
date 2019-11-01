public with sharing class RegistPassingExaminationController {
    @AuraEnabled(cacheable=true)
    public static List<Object> selectChatterUser(String param){
        String key = '%' + param + '%';
        return [SELECT Id, Name, Email, SmallPhotoUrl FROM User WHERE (Email like :key) AND (IsActive = true) AND (Profile.Name = 'Chatterユーザ' OR Profile.Name = 'salesforceTech室')];
    }

    @AuraEnabled(cacheable=true)
    public static List<Object> getRegistVoucherId(String UserId){
        return [SELECT Id FROM Voucher__c WHERE (Name = '資格保有者登録用') AND (AssignUser__c = :UserId) LIMIT 1];
    }

    @AuraEnabled(cacheable=true)
    public static List<Object> getFinalDecisionId(){
        return [SELECT Id FROM FinalDecision__c WHERE Name = '資格保有者登録用' LIMIT 1];
    }
}
