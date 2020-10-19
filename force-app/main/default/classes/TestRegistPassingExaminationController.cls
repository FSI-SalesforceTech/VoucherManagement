/* @Contents バウチャー管理
 * @Author matsuzaki
 * @Since 2020/10/12
 * @LastUpdate 2020/10/12
 */
@isTest
public with sharing class TestRegistPassingExaminationController {
    @isTest static void TestRegistPassingExaminationController() {
        TestCreateVoucherDataUtil CreateVoucherDataUtil = new TestCreateVoucherDataUtil();

        //テスト開始
        Test.starttest();
        User adminUser = CreateVoucherDataUtil.createdUser('CreateExamRecordadmin','admin');
        User standardUser = CreateVoucherDataUtil.createdUser('CreateExamRecord', '');
        
        System.runAs(adminUser){
            String recordNameAdmin = '資格保有者登録用';
            List<FinalDecision__c> FinalDecisionList = CreateVoucherDataUtil.createFinalDecisionRecord(recordNameAdmin);
            List<Voucher__c> VoucherList = CreateVoucherDataUtil.createVoucherRecord(FinalDecisionList);
            List<ExaminationInfo__c> ExaminationInfoList = CreateVoucherDataUtil.createExaminationInfoRecord(VoucherList , standardUser.Id);
        
            RegistPassingExaminationController.selectChatterUser('test@xxx.com');
            RegistPassingExaminationController.getRegistVoucherId(standardUser.Id);
            RegistPassingExaminationController.getFinalDecisionId();

        }
        Test.stoptest();
    }
}
