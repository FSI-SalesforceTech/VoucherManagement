public with sharing class ExamTestFormatController {
    @AuraEnabled(cacheable=true)
    public static List<Object> getExistExam() {
        return [SELECT ExamType__c FROM eqQuestion__c GROUP BY ExamType__c];
    }

    @AuraEnabled(cacheable=true)
    public static List<Object> geteqQuestions(String examname) {
        return [SELECT Id, Detail__c, ExamType__c FROM eqQuestion__c WHERE ExamType__c = :examname];
    }

    @AuraEnabled(cacheable=true)
    public static List<Object> geteqAnswers(String Id) {
        return [SELECT Id, Answer__c, isAnswer__c, eqQuestion__c FROM eqAnswer__c WHERE eqQuestion__c = :Id];
    }
}
