/**
 * @Contents   : ケースコントローラー
 * @Author     : kakimura
 * @Since      : 2021/01/27
 * @LastUpdate : 2021/02/04
 */
public without sharing class CaseController {
    // Caseレコード登録(LWCより呼び出しされる)
    @AuraEnabled
    public static void insertCaseVoucher(string AssignUserId, string Exam, date WillExam, Boolean useOfReferenceProblems, string Note, string Subject, string Origin){
        system.debug('■■■■■ Log:insertCaseVouche Start');
        case CaseA = new case(  AssignUserId__c = AssignUserId,
                                AssignUser__c = AssignUserId,
                                Exam__c = Exam,
                                WillExam__c = WillExam,
                                useOfReferenceProblems__c = useOfReferenceProblems,
                                Note__c= Note,
                                Subject = Subject,
                                Origin = Origin
                                );
        insert CaseA;
        system.debug('■■■■■ Log:insertCaseVouche End');
        return;
    }
}