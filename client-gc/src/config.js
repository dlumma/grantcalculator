export default {
  MAX_ATTACHMENT_SIZE: 5000000,
  s3: {
    BUCKET: 'grant-calculator-app-api-serverlessdeploymentbuck-xkjv2lza4iqu'
  },
  apiGateway: {
    URL: 'https://619xqfm9k8.execute-api.us-west-2.amazonaws.com/prod',
    REGION: 'us-west-2',
  },
  cognito: {
    USER_POOL_ID : 'us-west-2_5OIxITcpf',
    APP_CLIENT_ID : '11oog2qkjogkfvm7b448isk3cq',
    REGION: 'us-west-2',
    IDENTITY_POOL_ID: 'us-west-2:20282523-dd6b-4ef7-b130-3efea25d1c3e',
  }
};