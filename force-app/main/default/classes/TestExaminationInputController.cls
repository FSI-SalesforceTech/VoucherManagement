/* @Contents バウチャー管理
 * @Author matsuzaki
 * @Since 2020/10/12
 * @LastUpdate 2021/02/16
 */
@isTest
public with sharing class TestExaminationInputController {
    @isTest public static void TestgetVoucherList(){
        ExaminationInputController.getVoucherList();
    }
    @isTest static void TestMethod1(){
        // updatetExaminationInfoのテスト
        String recordNameAdmin = '資格保有者登録用';
        TestCreateVoucherDataUtil CreateVoucherDataUtil = new TestCreateVoucherDataUtil();
        // ユーザ作成
        User adminUser    = CreateVoucherDataUtil.createdUser('CreateExamRecordadmin','admin');
        User standardUser = CreateVoucherDataUtil.createdUser('CreateExamRecord', '');
        // 決裁作成
        List<FinalDecision__c> FinalDecisionList = CreateVoucherDataUtil.createFinalDecisionRecord(recordNameAdmin);
        // バウチャー作成
        List<Voucher__c> VoucherList = CreateVoucherDataUtil.createVoucherRecord(FinalDecisionList);
        // 受験情報作成
        List<ExaminationInfo__c> ExaminationInfoList = CreateVoucherDataUtil.createExaminationInfoRecord(VoucherList , standardUser.Id);
        // テスト開始
        Test.starttest();
            System.runAs(adminUser){
                ExaminationInputController.updatetExaminationInfo(
                    String.valueOf(ExaminationInfoList[0].id),
                    'アドミニストレーター',
                    Date.valueOf('2020-02-10'), 
                    '合格');
            }
        Test.stoptest();
    }
}
