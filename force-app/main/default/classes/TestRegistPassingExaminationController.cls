/* @Contents バウチャー管理
 * @Author matsuzaki
 * @Since 2020/10/12
 * @LastUpdate 2020/10/12
 */
@isTest
public with sharing class TestRegistPassingExaminationController {
    @isTest static void TestRegistPassingExaminationController() {
        TestCreateDataUtil CreateDataUtil = new TestCreateDataUtil();

        //テスト開始
        Test.starttest();
        User adminUser = CreateDataUtil.createdUser('CreateExamRecordadmin','admin');
        User standardUser = CreateDataUtil.createdUser('CreateExamRecord', '');
        
        System.runAs(adminUser){
            String recordNameAdmin = '資格保有者登録用';
            List<FinalDecision__c> FinalDecisionList = CreateDataUtil.createFinalDecisionRecord(recordNameAdmin);
            List<Voucher__c> VoucherList = CreateDataUtil.createVoucherRecord(FinalDecisionList[1].id);
            List<ExaminationInfo__c> ExaminationInfoList = CreateDataUtil.createExaminationInfoRecord(VoucherList , standardUser.Id);
        
            RegistPassingExaminationController.selectChatterUser('test@xxx.com');
            RegistPassingExaminationController.getRegistVoucherId(standardUser.Id);
            RegistPassingExaminationController.getFinalDecisionId();

        }
        Test.stoptest();
    }
}
