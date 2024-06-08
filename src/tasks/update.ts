import Client from 'ssh2-sftp-client';
import * as path from 'path';

const sftp = new Client();

type SftpConfig = {
  host: string;
  port: number;
  username: string;
  password: string;
  localFilePath: string;
  remoteFilePath: string;
};

export async function uploadFile(config: SftpConfig) {
  try {
    await sftp.connect({
      host: config.host,
      port: config.port,
      username: config.username,
      password: config.password,
    });

    const localPath = path.resolve(config.localFilePath);
    await sftp.put(localPath, config.remoteFilePath);
    console.log(`File ${localPath} uploaded to ${config.remoteFilePath}`);
  } catch (err) {
    console.error('SFTP upload error:', err);
  } finally {
    sftp.end();
  }
}