public with sharing class ExaminationInputController {
    @AuraEnabled(cacheable=true)
    public static List<Object> getVoucherList(){
        return [SELECT Id, WillExam__c, PassOrFail__c, Exam__c, VoucherNumber__c, LimitDate__c, AssignUser__c, FinalDecisionDate__c, FinalDecisionNumber__c FROM ExaminationInfo__c WHERE Voucher__r.AssignUser__c != null AND PassOrFail__c = null];
    }
}
