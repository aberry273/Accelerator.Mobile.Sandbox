import * as FileSystem from 'expo-file-system';

const rootDir = FileSystem.cacheDirectory + 'scansave_files/';
const GetLocalFileUri = (fileId: string) => rootDir + `${fileId}.jpg`;

export default class FileSystemCacheService {

  _rootDirectory = '';  
  static _instance = null;

  constructor(folderName) {
    this._rootDirectory = `${FileSystem.cacheDirectory}${folderName}/`;
  }

  async CreateDirectory() {
    const dirInfo = await FileSystem.getInfoAsync(rootDir);
    if (dirInfo.exists) return;
    await FileSystem.makeDirectoryAsync(rootDir, { intermediates: true });
  }

  GetFilePath(id: string) {
    return GetLocalFileUri(id);
  }

  async AddFiles(fileNames: string[]) {
    await this.CreateDirectory();
    await Promise.all(fileNames.map(file => FileSystem.downloadAsync(file, GetLocalFileUri(file))));
  }

  async AddFiletoCache(filePath: string, id: string) {
    await this.CreateDirectory();
    await FileSystem.copyAsync({ "from": filePath, "to": GetLocalFileUri(id) });
  }

  async GetSingleFile(id: string) {
    await this.CreateDirectory();
    const fileInfo = await FileSystem.getInfoAsync(id);
    if (fileInfo.exists) return id;
    await FileSystem.downloadAsync(id, id);
  }

  async GetFileContentUri(id: string) {
    return FileSystem.getContentUriAsync(await this.GetSingleFile(id));
  }

  async DeleteFile(id: string) {
    const path = this.GetFilePath(id);
    await FileSystem.deleteAsync(path);
  }

}
 