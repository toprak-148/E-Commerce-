export default{
  oidc:{
    // istemci uygulaması genel adı : clientId
    //issuer:belirteçleri verendir kullanılan url bu okta yetkilendirmesi sunucusuyla teki verir.
    //redirectUri:temel yönlendirme kullanıcı oturum açtıktan sonra belirtilen yere gönderilir.
    // scopes: kullanici hakkinda bilgi almak icin
    clientId:'0oanocrbv5tkctgvk5d7',
    issuer:'https://dev-16920228.okta.com/oauth2/default',
    redirectUri:'http://localhost:4200/login/callback',
    scopes:['openid','profile','email']
  }







}
