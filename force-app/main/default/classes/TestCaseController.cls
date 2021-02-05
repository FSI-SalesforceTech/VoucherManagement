/**
 * @Contents   : テストクラス:ケースコントローラー
 * @Author     : kakimura
 * @Since      : 2021/01/27
 * @LastUpdate : 2021/02/04
 */
@isTest
public with sharing class TestCaseController {
    @isTest static void TestMethod1(){
        // insertCaseVoucherのテスト
        TestCreateVoucherDataUtil CreateVoucherDataUtil = new TestCreateVoucherDataUtil();
        // テスト開始
        Test.starttest();
            // ユーザ作成
            User adminUser    = CreateVoucherDataUtil.createdUser('CreateExamRecordadmin','admin');
            User standardUser = CreateVoucherDataUtil.createdUser('CreateExamRecord', '');
            System.runAs(adminUser){
                CaseController.insertCaseVoucher(String.valueOf(standardUser.Id), 
                                                 'アドミニストレーター',
                                                 Date.valueOf('2020-02-10'), 
                                                 true, 
                                                 '備考テスト', 
                                                 'Salesforceポータルからのバウチャー利用申請',
                                                 'ポータル');
            }
        Test.stoptest();
    }
}