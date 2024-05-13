// Depends on tencentcloud-sdk-nodejs version 4.0.3 or higher
import { tmt } from 'tencentcloud-sdk-nodejs-tmt';

const TmtClient = tmt.v20180321.Client;

// 实例化一个认证对象，入参需要传入腾讯云账户 SecretId 和 SecretKey，此处还需注意密钥对的保密
// 代码泄露可能会导致 SecretId 和 SecretKey 泄露，并威胁账号下所有资源的安全性。以下代码示例仅供参考，建议采用更安全的方式来使用密钥，请参见：https://cloud.tencent.com/document/product/1278/85305
// 密钥可前往官网控制台 https://console.cloud.tencent.com/cam/capi 进行获取
const clientConfig = {
  credential: {
    secretId: process.env.TENCENT_SECRET_ID,
    secretKey: process.env.TENCENT_SECRET_KEY,
  },
  region: process.env.TENCENT_REGION || 'ap-beijing',
  profile: {
    httpProfile: {
      endpoint: 'tmt.tencentcloudapi.com',
    },
  },
};

// 实例化要请求产品的client对象,clientProfile是可选的
const client = new TmtClient(clientConfig);

type TranslateRes = {
  id?: string;
  RequestId?: string | undefined;
  Source?: string | undefined;
  Target?: string | undefined;
  TargetText?: string | undefined;
};

export async function translate(
  sourceList: { text: string; id?: string }[] = []
): Promise<TranslateRes[]> {
  try {
    const data: TranslateRes[] = await Promise.all(
      sourceList.map(async (item: any) => {
        return new Promise((resolve, reject) => {
          const params = {
            SourceText: item.text,
            Source: 'en',
            Target: 'zh',
            ProjectId: Number(process.env.TENCENT_PROJECT_ID) || 0,
          };

          client.TextTranslate(params).then(
            (data) => {
              resolve({
                id: item.id,
                ...data,
              });
            },
            (err) => {
              console.error('error 22', err);
              reject(err);
            }
          );
        });
      })
    );

    return data;
  } catch (err: any) {
    throw err;
  }
}
