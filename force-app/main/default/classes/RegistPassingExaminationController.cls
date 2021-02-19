public without sharing class RegistPassingExaminationController {
    @AuraEnabled(cacheable=true)
    public static List<Object> selectChatterUser(String param){
        String key = '%' + param + '%';
        return [SELECT Id, Name, Email, SmallPhotoUrl FROM User WHERE (Email like :key) AND (IsActive = true)];
    }

    @AuraEnabled(cacheable=true)
    public static List<Object> getRegistVoucherId(String UserId){
        return [SELECT Id FROM Voucher__c WHERE (Name = '資格保有者登録用') AND (AssignUser__c = :UserId) LIMIT 1];
    }

    @AuraEnabled(cacheable=true)
    public static List<Object> getFinalDecisionId(){
        return [SELECT Id FROM FinalDecision__c WHERE Name = '資格保有者登録用' LIMIT 1];
    }
    
    // 2021/02/18 ADD S
    @AuraEnabled
    // バウチャーレコード登録(LWCより呼び出しされる)
    public static String insertVoucher(string AssignUserId, string FinalDecision, string Name){
        system.debug('■■■■■ Log:insertVoucher Start');
        Voucher__c VoucherA = new Voucher__c(
                                    AssignUser__c    = AssignUserId,
                                    FinalDecision__c = FinalDecision,
                                    Name             = Name
                                    );
        insert VoucherA;
        system.debug('■■■■■ Log:insertVoucher End');
        return String.valueOf(VoucherA.Id);
    }
    // 受験情報レコード登録(LWCより呼び出しされる)
    @AuraEnabled
    public static void insertExaminationInfo(string exam, date willExam, string passOrFail, string voucher){
        system.debug('■■■■■ Log:inserttExaminationInfo Start');
        ExaminationInfo__c ExaminationInfoA = new ExaminationInfo__c(
                                    Exam__c = exam,
                                    WillExam__c = willExam,
                                    PassOrFail__c = passOrFail,
                                    voucher__c = voucher
                                    );
        insert ExaminationInfoA;
        system.debug('■■■■■ Log:insertExaminationInfo End');
        return;
    }
    // 2021/02/18 ADD E
}