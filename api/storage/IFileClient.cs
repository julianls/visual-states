using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace VisState.Storage
{
    public interface IFileClient
    {
        Task DeleteFile(string storeName, string filePath);
        Task<bool> FileExists(string storeName, string filePath);
        Task<Stream> GetFile(string storeName, string filePath);
        Task<List<Uri>> GetChildUris(string storeName);
        Task<string> GetFileUrl(string storeName, string filePath);
        Task SaveFile(string storeName, string filePath, Stream fileStream);
    }
}
