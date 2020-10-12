/* @Contents バウチャー管理
 * @Author matsuzaki
 * @Since 2020/10/12
 * @LastUpdate 2020/10/12
 */
@isTest
public with sharing class TestExamTestFormatController {
    @isTest public static void TestExamTestFormatController(){
        TestCreateDataUtil CreateDataUtil = new TestCreateDataUtil();

        //テスト開始
        Test.starttest();
        User adminUser = CreateDataUtil.createdUser('TestExamTestFormatController','admin');
        
        System.runAs(adminUser){
            List<eqQuestion__c> eqQuestionList = CreateDataUtil.createeqQuestionRecord();

            ExamTestFormatController.getExistExam();
            ExamTestFormatController.geteqQuestions('アドミニストレーター');
            ExamTestFormatController.geteqAnswers(eqQuestionList[1].id);
            ExamTestFormatController.countExistExam('アドミニストレーター');
        }
        
        Test.stoptest();
    }
}
