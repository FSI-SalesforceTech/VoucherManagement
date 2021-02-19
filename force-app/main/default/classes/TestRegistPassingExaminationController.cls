/* @Contents バウチャー管理
 * @Author matsuzaki
 * @Since 2020/10/12
 * @LastUpdate 2021/02/19
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
    // 2021/02/19 ADD S
    @isTest static void TestMethod1(){
        String recordNameAdmin = '資格保有者登録用';
        TestCreateVoucherDataUtil CreateVoucherDataUtil = new TestCreateVoucherDataUtil();
        // ユーザ作成
        User adminUser    = CreateVoucherDataUtil.createdUser('CreateExamRecordadmin','admin');
        User standardUser = CreateVoucherDataUtil.createdUser('CreateExamRecord', '');
        // 決裁作成
        List<FinalDecision__c> FinalDecisionList = CreateVoucherDataUtil.createFinalDecisionRecord(recordNameAdmin);
        // バウチャー作成
        List<Voucher__c> VoucherList = CreateVoucherDataUtil.createVoucherRecord(FinalDecisionList);

        //テスト開始
        Test.starttest();
        System.runAs(adminUser){
            RegistPassingExaminationController.insertVoucher(
                String.valueOf(standardUser.Id),
                String.valueOf(FinalDecisionList[0].id),
                recordNameAdmin);
            RegistPassingExaminationController.insertExaminationInfo(
                'アドミニストレーター',
                Date.valueOf('2020-02-10'), 
                '合格',
                VoucherList[0].id
            );
        }
        Test.stoptest();
    }
    // 2021/02/19 ADD E
}