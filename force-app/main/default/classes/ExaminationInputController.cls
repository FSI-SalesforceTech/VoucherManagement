public without sharing class ExaminationInputController {
    // with sharing からwithout sharing に変更 2020/02/16
    @AuraEnabled(cacheable=true)
    public static List<Object> getVoucherList(){
        return [SELECT Id, WillExam__c, PassOrFail__c, Exam__c, VoucherNumber__c, LimitDate__c, AssignUser__c, FinalDecisionDate__c, FinalDecisionNumber__c FROM ExaminationInfo__c WHERE Voucher__r.AssignUser__c != null AND PassOrFail__c = null ORDER BY WillExam__c ASC];
    }
    // 受験情報レコード更新(LWCより呼び出しされる)
    @AuraEnabled
    public static void updatetExaminationInfo(string examid, string exam, date willExam, string passOrFail){
        system.debug('■■■■■ Log:updatetExaminationInfo Start');
        ExaminationInfo__c ExaminationInfoA = new ExaminationInfo__c(
                                id = examid,
                                Exam__c = Exam,
                                WillExam__c = WillExam,
                                PassOrFail__c = PassOrFail
                                );
        update ExaminationInfoA;
        system.debug('■■■■■ Log:updatetExaminationInfo End');
        return;
    }
}
