/* @Contents バウチャー管理
 * @Author matsuzaki
 * @Since 2020/10/12
 * @LastUpdate 2020/10/12
 */
@isTest
public with sharing class TestExamTestFormatController {
    @isTest public static void TestExamTestFormatController(){
        TestCreateVoucherDataUtil CreateVoucherDataUtil = new TestCreateVoucherDataUtil();

        //テスト開始
        Test.starttest();
        User adminUser = CreateVoucherDataUtil.createdUser('TestExamTestFormatController','admin');
        
        System.runAs(adminUser){
            List<eqQuestion__c> eqQuestionList = CreateVoucherDataUtil.createeqQuestionRecord();

            ExamTestFormatController.getExistExam();
            ExamTestFormatController.geteqQuestions('アドミニストレーター');
            ExamTestFormatController.geteqAnswers(eqQuestionList[1].id);
            ExamTestFormatController.countExistExam('アドミニストレーター');
        }
        
        Test.stoptest();
    }
}
