/* @Contents テストデータ作成共通クラス
 * @Author matsuzaki
 * @Since 2020/10/08
 * @LastUpdate 2020/10/12
 */
public with sharing class TestCreateDataUtil {

    /*
     *@決裁のデータ作成
     *@String name : 決裁番号
     */
    @TestVisible List<FinalDecision__c> createFinalDecisionRecord(String recordName){

        FinalDecision__c FinalDecision = new FinalDecision__c(Name = recordName,
                                                            Title__c = 'テスト',
                                                            Amount__c = 1000000,
                                                            Headcount__c = 20);

        try{
            System.debug('Attempting to insert positions');
            insert FinalDecision;
            System.debug('Insert complete');
        }catch(System.DmlException e){
            System.debug('DML exception:' + e.getDmlMessage(0));
        }

        List<FinalDecision__c> newFinalDecisionList = [select Id, Name, Title__c, Amount__c, Headcount__c from FinalDecision__c];
        return newFinalDecisionList;
    }
    /*
     *@バウチャーのデータ作成
     *@String id : 決裁レコードid
     */
    @TestVisible List<Voucher__c> createVoucherRecord(List<FinalDecision__c> FinalDecisionList){
        List<String> VoucherName = new List<String>();
        VoucherName.add('AAA111111');
        VoucherName.add('BBB222222');
        VoucherName.add('CCC333333');
        VoucherName.add('DDD444444');
        VoucherName.add('資格保有者登録用');

        List<Voucher__c> VoucherList = new List<Voucher__c>();

        for(Integer i = 0 ; i < VoucherName.size() ; i++){
            Voucher__c Voucher = new Voucher__c(Name = VoucherList.get(i),
                                                FinalDecision__c = FinalDecisionList[1].id);
            VoucherList.add(Voucher);
        }

        try{
            System.debug('Attempting to insert positions');
            insert VoucherList;
            System.debug('Insert complete');
        }catch(System.DmlException e){
            System.debug('DML exception:' + e.getDmlMessage(0));
        }

        List<Voucher__c> newVoucherList = [select id, Name from Voucher__c];
        return newVoucherList;

    }

    /*
     *@受験情報のデータ作成
     *@List<Voucher__c> VoucherList : バウチャーレコードのリスト
     *@String UserId : ユーザId
     */
    @TestVisible List<ExaminationInfo__c> createExaminationInfoRecord(List<Voucher__c> VoucherList , String UserId){

        List<ExaminationInfo__c> ExaminationInfoList = new List<ExaminationInfo__c>();

        for(Integer i = 0 ; i < VoucherList.size() ; i++){
            ExaminationInfo__c ExaminationInfo = new ExaminationInfo__c(Exam__c = 'アドミニストレーター',
                                                                        Voucher__c = VoucherList[i].id);
            ExaminationInfoList.add(ExaminationInfo);
        }

        try{
            System.debug('Attempting to insert positions');
            insert ExaminationInfoList;
            System.debug('Insert complete');
        }catch(System.DmlException e){
            System.debug('DML exception:' + e.getDmlMessage(0));
        }

        List<ExaminationInfo__c> newExaminationInfoList = [select id, Name, PassOrFail__c from ExaminationInfo__c];
        return newExaminationInfoList;

    }

    /*
     * @資格試験問題と回答のデータ作成
     */ 
    @TestVisible List<eqQuestion__c> createeqQuestionRecord(){
        List<Integer> PfdNo = new List<Integer>();
        PfdNo.add(1);
        PfdNo.add(2);
        PfdNo.add(3);
        PfdNo.add(4);
        PfdNo.add(5);

        List<String> Detail = new List<String>();
        Detail.add('aaaaaaaaaaaaa');
        Detail.add('bbbbbbbbbbbbb');
        Detail.add('ccccccccccccc');
        Detail.add('ddddddddddddd');
        Detail.add('eeeeeeeeeeeee');

        List<eqQuestion__c> eqQuestionList = new List<eqQuestion__c>();

        for(Integer i = 0 ; i < PfdNo.size() ; i++){
            eqQuestion__c eqQuestion = new eqQuestion__c(PDF_No__c = PfdNo.get(i),
                                                        Detail__c = Detail.get(i),
                                                        ExamType__c = 'アドミニストレーター');
            eqQuestionList.add(eqQuestion);
        }

        try{
            System.debug('Attempting to insert positions');
            insert eqQuestionList;
            System.debug('Insert complete');
        }catch(System.DmlException e){
            System.debug('DML exception:' + e.getDmlMessage(0));
        }

        List<eqQuestion__c> neweqQuestionList = [select id, Name from eqQuestion__c];
        List<eqAnswer__c> eqAnswerList = new List<eqAnswer__c>();

        for(Integer i = 0 ; i < neweqQuestionList.size() ; i++){
            eqAnswer__c eqAnswer = new eqAnswer__c(eqQuestion__c = neweqQuestionList[i].id,
                                                    Answer__c = '正解Death!!',
                                                    isAnswer__c = True);
            eqAnswerList.add(eqAnswer);
        }

        try{
            System.debug('Attempting to insert positions');
            insert eqAnswerList;
            System.debug('Insert complete');
        }catch(System.DmlException e){
            System.debug('DML exception:' + e.getDmlMessage(0));
        }

        return neweqQuestionList;

    }

    /*
     * @テスト用ユーザ作成
     * @String name : ユーザ名
     * @String pName : プロファイル名
     */ 
    @TestVisible User createdUser(String name, String pName){
        Profile profile;
        if(pName == 'admin'){
            profile = getAdminProfile();
        }else{
            profile = getStandardProfile();
        }
        String profileId =profile.id;

        User user = new User();
        user.Email = name + 'test@xxx.com';
        user.UserName = name + 'test@xxx.com';
        user.FirstName = name;
        User.LastName = 'abc';
        user.Alias = user.UserName.split('@')[0].left(8);
        user.profileId = profileId;
        user.EmailEncodingKey = 'ISO-2022-JP';
        user.LanguageLocaleKey = 'ja';
        user.LocaleSidKey = 'ja_JP';
        user.TimeZoneSidKey = 'Asia/Tokyo';

        insert user;

        user = [select Name, UserName, FirstName, LastName, Alias, UserRoleId, ProfileId, CreatedDate from user where UserName = :user.Username limit 1];
        
        return user;
    }

    /*
     * @標準プロファイルのId取得
     */ 
    private static Profile getStandardProfile(){
        List<Profile> profiles = [select Id from Profile where Name = '標準ユーザ' limit 1];
        if (profiles.isEmpty()){
            profiles = [select Id from Profile where Name = 'Standard User' limit 1];
        }
        return profiles[0];
    }

    /*
     *@システム管理者プロファイルのId取得
     */
    private static Profile getAdminProfile(){
        List<Profile> profiles = [select Id from Profile where Name = 'システム管理者' limit 1];
        if (profiles.isEmpty()){
            profiles = [select Id from Profile where Name = 'System Admin' limit 1];
        }
        return profiles[0];
    }

    /*
     *@権限セットをユーザに付与
     */
    @TestVisible void getPermissionSet(User user, String PerSetName){
        PermissionSet PerSet = [select Id from PermissionSet where Name =:PerSetName];
        PermissionSetAssignment PerSetAss = new PermissionSetAssignment(
            AssigneeId = user.Id,
            PermissionSetId = PerSet.Id
        );
        insert PerSetAss;
    }
}
